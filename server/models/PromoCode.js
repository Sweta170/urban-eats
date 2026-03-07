const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Promo code is required'],
        unique: true,
        uppercase: true,
        trim: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: [true, 'Discount type is required'],
    },
    discountAmount: {
        type: Number,
        required: [true, 'Discount amount is required'],
        min: [0, 'Discount must be positive'],
    },
    minOrderAmount: {
        type: Number,
        default: 0,
    },
    expiryDate: {
        type: Date,
        required: [true, 'Expiry date is required'],
    },
    maxUses: {
        type: Number,
        default: null, // null means unlimited
    },
    usedCount: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('PromoCode', promoCodeSchema);
