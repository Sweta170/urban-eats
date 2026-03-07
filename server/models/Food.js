const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
    default: '',
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
