// Change Password
exports.changePassword = async (req, res) => {
  const userId = req.user.userId;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json(response(false, 'Old and new password required'));
  }
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json(response(false, 'User not found'));
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json(response(false, 'Old password is incorrect'));
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json(response(true, 'Password changed successfully'));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};
const nodemailer = require('nodemailer');
const PasswordResetToken = require('../models/PasswordResetToken');
const crypto = require('crypto');
// Send email utility
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json(response(false, 'Email is required'));
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json(response(false, 'User not found'));
    // Remove existing tokens
    await PasswordResetToken.deleteMany({ user: user._id });
    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 min
    await PasswordResetToken.create({ user: user._id, token, expiresAt });
    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendEmail(user.email, 'Password Reset', `Reset your password: ${resetUrl}`);
    return res.json(response(true, 'Password reset email sent'));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json(response(false, 'Token and new password required'));
  try {
    const resetToken = await PasswordResetToken.findOne({ token });
    if (!resetToken || resetToken.expiresAt < new Date()) {
      return res.status(400).json(response(false, 'Invalid or expired token'));
    }
    const user = await User.findById(resetToken.user);
    if (!user) return res.status(404).json(response(false, 'User not found'));
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    await PasswordResetToken.deleteMany({ user: user._id });
    return res.json(response(true, 'Password reset successful'));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};

const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');

const response = (success, message, data = null) => ({ success, message, data });

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId, role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json(response(false, 'All fields are required'));
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json(response(false, 'Invalid email format'));
  }
  if (password.length < 6) {
    return res.status(400).json(response(false, 'Password must be at least 6 characters'));
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json(response(false, 'Email already registered'));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = req.body.role || 'user';
    const user = new User({ name, email, password: hashedPassword, role: userRole });
    await user.save();

    // If role is restaurant, create a default restaurant profile
    if (userRole === 'restaurant') {
      await Restaurant.create({
        owner: user._id,
        name: `${user.name}'s Kitchen`,
        address: 'Set your address',
        category: 'Indian', // Default
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);
    await RefreshToken.create({ user: user._id, token: refreshToken });
    return res.status(201).json(response(true, 'User registered successfully', {
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    }));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json(response(false, 'Email and password required'));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json(response(false, 'Invalid credentials'));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json(response(false, 'Invalid credentials'));
    }
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);
    await RefreshToken.findOneAndUpdate(
      { user: user._id },
      { token: refreshToken },
      { upsert: true, new: true }
    );
    return res.status(200).json(response(true, 'Login successful', {
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    }));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};

// Refresh token endpoint
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json(response(false, 'Refresh token required'));
  }
  try {
    const stored = await RefreshToken.findOne({ token: refreshToken });
    if (!stored) {
      return res.status(403).json(response(false, 'Invalid refresh token'));
    }
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(403).json(response(false, 'Invalid or expired refresh token'));
    }
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(payload.userId, payload.role);
    stored.token = newRefreshToken;
    await stored.save();
    return res.status(200).json(response(true, 'Token refreshed', { accessToken, refreshToken: newRefreshToken }));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json(response(false, 'User not found'));
    return res.json(response(true, 'User profile', user));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json(response(false, 'Name is required'));
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json(response(false, 'User not found'));
    user.name = name;
    await user.save();
    return res.json(response(true, 'Profile updated successfully', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};

// Add Address
exports.addAddress = async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json(response(false, 'Address is required'));
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json(response(false, 'User not found'));
    user.addresses.push(address);
    await user.save();
    return res.json(response(true, 'Address added successfully', user.addresses));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};
