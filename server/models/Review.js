const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
    },
}, { timestamps: true });

// Prevent duplicate reviews from same user for same food
reviewSchema.index({ food: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
