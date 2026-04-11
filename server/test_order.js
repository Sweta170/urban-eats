const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('./models/User');
const Cart = require('./models/Cart');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const cart = await Cart.findOne({ "items.0": { $exists: true } }).populate('user');
  if (!cart) {
    console.log('No cart found');
    process.exit();
  }
  const user = cart.user;
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  try {
    const res = await fetch('http://localhost:5000/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ shippingAddress: '123 Test St', paymentMethod: 'Cash', useLoyaltyPoints: false })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Data:", data);
  } catch (err) {
    console.error("Fetch err:", err);
  }
  process.exit();
});
