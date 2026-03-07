const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Food = require('../models/Food');
const User = require('../models/User');

const response = (success, message, data = null) => ({ success, message, data });

// Place order from cart
exports.placeOrder = async (req, res) => {
  const userId = req.user.userId;
  const { shippingAddress, paymentMethod, promoCode, useLoyaltyPoints } = req.body;

  if (!shippingAddress || !paymentMethod) {
    return res.status(400).json(response(false, 'Shipping address and payment method are required'));
  }

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.food', 'name price category');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json(response(false, 'Cart is empty'));
    }

    let subtotal = 0;
    const orderItems = await Promise.all(cart.items.map(async item => {
      subtotal += item.food.price * item.quantity;
      const foodDoc = await Food.findById(item.food._id);
      return {
        food: item.food._id,
        quantity: item.quantity,
        price: item.food.price, // Store price at time of purchase
        restaurant: foodDoc.restaurant
      };
    }));

    let discount = 0;
    let appliedCoupon = null;

    if (promoCode) {
      appliedCoupon = await Coupon.findOne({ code: promoCode.toUpperCase(), isActive: true });
      if (appliedCoupon) {
        // Validate coupon again at placement
        const isExpired = new Date() > new Date(appliedCoupon.expiryDate);
        const limitReached = appliedCoupon.usageLimit !== null && appliedCoupon.usedCount >= appliedCoupon.usageLimit;

        if (!isExpired && !limitReached && subtotal >= appliedCoupon.minPurchase) {
          if (appliedCoupon.discountType === 'percentage') {
            discount = (subtotal * appliedCoupon.discountAmount) / 100;
            if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
              discount = appliedCoupon.maxDiscount;
            }
          } else {
            discount = appliedCoupon.discountAmount;
          }
          discount = Math.min(discount, subtotal);
        }
      }
    }

    // Loyalty Points Logic
    const user = await User.findById(userId);
    let pointsRedeemed = 0;
    let loyaltyDiscount = 0;

    if (useLoyaltyPoints && user.loyaltyPoints >= 100) {
      pointsRedeemed = user.loyaltyPoints;
      loyaltyDiscount = Math.floor(pointsRedeemed / 10);
      // Ensure loyalty discount doesn't make total negative after promo
      loyaltyDiscount = Math.min(loyaltyDiscount, subtotal - discount);
      // Since we redeem all points, calculate how many points that actually covered
      pointsRedeemed = loyaltyDiscount * 10;
    }

    const total = subtotal - discount - loyaltyDiscount;
    const pointsEarned = Math.floor(total / 10);

    const order = new Order({
      user: userId,
      items: orderItems,
      total,
      shippingAddress,
      paymentMethod,
      promoCode: appliedCoupon ? appliedCoupon.code : null,
      discount: discount + loyaltyDiscount,
      loyaltyPointsEarned: pointsEarned,
      loyaltyPointsRedeemed: pointsRedeemed,
      paymentStatus: (paymentMethod === 'Card' || paymentMethod === 'Online') ? 'Paid' : 'Pending'
    });

    await order.save();

    // Update User Loyalty Balance
    user.loyaltyPoints = (user.loyaltyPoints - pointsRedeemed) + pointsEarned;
    await user.save();

    // Increment coupon usage
    if (appliedCoupon) {
      appliedCoupon.usedCount += 1;
      await appliedCoupon.save();
    }

    // Reset cart
    cart.items = [];
    await cart.save();
    return res.status(201).json(response(true, 'Order placed successfully', order));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};

// Get order history for user
exports.getOrders = async (req, res) => {
  const userId = req.user.userId;
  try {
    const orders = await Order.find({ user: userId }).populate('items.food', 'name price category').sort({ createdAt: -1 });
    if (orders.length === 0) {
      return res.status(200).json(response(true, 'No orders found', []));
    }
    return res.status(200).json(response(true, 'Orders fetched', orders));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};

// Get single order by ID (for tracking)
exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const order = await Order.findOne({ _id: id, user: userId })
      .populate('items.food', 'name price category imageUrl')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json(response(false, 'Order not found'));
    }

    return res.status(200).json(response(true, 'Order fetched', order));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('items.food', 'name price category')
      .sort({ createdAt: -1 });
    return res.status(200).json(response(true, 'All orders fetched', orders));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log(`Update Order Status Request: ID=${id}, Status=${status}`);

  if (!status) {
    return res.status(400).json(response(false, 'Status is required'));
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json(response(false, 'Order not found'));
    }

    order.status = status;
    await order.save();

    // Emit real-time update
    const io = req.app.get('socketio');
    if (io) {
      io.to(id).emit('orderStatusUpdate', {
        orderId: id,
        status: status,
        timestamp: new Date()
      });
      console.log(`Socket emitted orderStatusUpdate for ${id} to ${status}`);
    }

    return res.status(200).json(response(true, 'Order status updated', order));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};
