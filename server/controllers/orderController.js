const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Food = require('../models/Food');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Transaction = require('../models/Transaction');

const response = (success, message, data = null) => ({ success, message, data });

// Place order from cart
exports.placeOrder = async (req, res) => {
  const userId = req.user.userId;
  const { shippingAddress, paymentMethod, promoCode, useWallet } = req.body;

  if (!shippingAddress || !paymentMethod) {
    return res.status(400).json(response(false, 'Shipping address and payment method are required'));
  }

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.food', 'name price category');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json(response(false, 'Cart is empty'));
    }

    let subtotal = 0;
    const fallbackRestaurant = await Restaurant.findOne();
    const orderItems = await Promise.all(cart.items.map(async item => {
      subtotal += item.food.price * item.quantity;
      const foodDoc = await Food.findById(item.food._id);
      const resId = (foodDoc && foodDoc.restaurant) ? foodDoc.restaurant : (fallbackRestaurant ? fallbackRestaurant._id : item.food._id);
      return {
        food: item.food._id,
        quantity: item.quantity,
        price: item.food.price, // Store price at time of purchase
        restaurant: resId
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

    // Wallet Redemption Logic
    const user = await User.findById(userId);
    let walletRedeemed = 0;

    if (useWallet && user.walletBalance > 0) {
      // Use as much balance as possible to cover the total
      walletRedeemed = Math.min(user.walletBalance, subtotal - discount);
    }

    const total = subtotal - discount - walletRedeemed;
    const cashbackEarned = Math.floor(total * 0.05); // 5% Cashback

    const order = new Order({
      user: userId,
      items: orderItems,
      total,
      shippingAddress,
      paymentMethod,
      promoCode: appliedCoupon ? appliedCoupon.code : null,
      discount: discount + walletRedeemed,
      walletAmountEarned: cashbackEarned,
      walletAmountRedeemed: walletRedeemed,
      paymentStatus: (paymentMethod === 'Wallet') ? 'Paid' : ((paymentMethod === 'Card') ? 'Pending' : 'Pending')
    });

    await order.save();

    // Update User Wallet Balance & Create Transactions
    if (walletRedeemed > 0) {
      user.walletBalance -= walletRedeemed;
      
      await Transaction.create({
        user: userId,
        order: order._id,
        amount: walletRedeemed,
        type: 'debit',
        description: `Paid for order #${order._id.toString().slice(-6)}`
      });
    }

    // Earn Cashback immediately if paid by wallet, or after payment for Card
    if (paymentMethod === 'Wallet' || paymentMethod === 'Cash') {
      user.walletBalance += cashbackEarned;
      await Transaction.create({
        user: userId,
        order: order._id,
        amount: cashbackEarned,
        type: 'credit',
        description: `5% Cashback for order #${order._id.toString().slice(-6)}`
      });
    }

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
    console.error('PLACE ORDER CRASH HTTP 500:', err);
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
