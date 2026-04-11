const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'restaurant', 'rider'],
    default: 'user',
  },
  addresses: [{
    type: String, // Storing as simple strings for now, can be objects later
    trim: true,
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
  }],
  walletBalance: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
