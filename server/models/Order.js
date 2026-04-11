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
    enum: ['Cash', 'Card', 'Wallet'],
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
  walletAmountEarned: {
    type: Number,
    default: 0,
  },
  walletAmountRedeemed: {
    type: Number,
    default: 0,
  },
  stripeSessionId: {
    type: String,
  },
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPartner',
  },
  deliveryStatus: {
    type: String,
    enum: ['pending_assignment', 'assigned', 'rider_en_route', 'picked_up', 'delivered'],
    default: 'pending_assignment',
  },
  riderLocation: {
    lat: { type: Number },
    lng: { type: Number },
  },
  pickedUpAt: {
    type: Date,
  },
  deliveredAt: {
    type: Date,
  },
  deliveryProofUrl: {
    type: String,
  },
  deliveryFee: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
