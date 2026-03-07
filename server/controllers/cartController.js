const Cart = require('../models/Cart');
const Food = require('../models/Food');

const response = (success, message, data = null) => ({ success, message, data });

// Add or update item in cart
exports.addToCart = async (req, res) => {
  const userId = req.user.userId;
  const { foodId, quantity } = req.body;
  if (!foodId || !quantity || quantity < 1) {
    return res.status(400).json(response(false, 'foodId and valid quantity are required'));
  }
  try {
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json(response(false, 'Food item not found'));
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    const itemIndex = cart.items.findIndex(item => item.food.toString() === foodId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      cart.items.push({ food: foodId, quantity });
    }
    await cart.save();
    return res.status(200).json(response(true, 'Cart updated', cart));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const userId = req.user.userId;
  const { foodId } = req.body;
  if (!foodId) {
    return res.status(400).json(response(false, 'foodId is required'));
  }
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json(response(false, 'Cart not found'));
    }
    cart.items = cart.items.filter(item => item.food.toString() !== foodId);
    await cart.save();
    return res.status(200).json(response(true, 'Item removed from cart', cart));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};

// Get current cart
exports.getCart = async (req, res) => {
  const userId = req.user.userId;
  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.food', 'name price category');
    if (!cart || cart.items.length === 0) {
      return res.status(200).json(response(true, 'Cart is empty', []));
    }
    return res.status(200).json(response(true, 'Cart fetched', cart.items));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};
