const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    enum: ['bike', 'scooter', 'car'],
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  totalDeliveries: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 1,
    max: 5,
  },
  documentsVerified: {
    type: Boolean,
    default: false,
  },
  bankDetails: {
    accountNo: { type: String },
    ifsc: { type: String },
  },
  fcmToken: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
