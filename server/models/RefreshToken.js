const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  token: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);