const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Restaurant name is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    rating: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
