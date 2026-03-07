const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: true,
    min: [0, 'Total must be positive'],
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },
  status: {
    type: String,
    enum: ['Order Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Order Placed',
  },
  promoCode: {
    type: String,
    uppercase: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  loyaltyPointsEarned: {
    type: Number,
    default: 0,
  },
  loyaltyPointsRedeemed: {
    type: Number,
    default: 0,
  },
  stripeSessionId: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
