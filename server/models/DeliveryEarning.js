const mongoose = require('mongoose');

const deliveryEarningSchema = new mongoose.Schema({
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPartner',
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  baseAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  distanceAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  tip: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
  paidAt: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('DeliveryEarning', deliveryEarningSchema);
