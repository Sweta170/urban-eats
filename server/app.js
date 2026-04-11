const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();


const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');
const categoryRoutes = require('./routes/category');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const favoriteRoutes = require('./routes/favorite');
const promoRoutes = require('./routes/promo');
const couponRoutes = require('./routes/couponRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const restaurantRoutes = require('./routes/restaurant');
const walletRoutes = require('./routes/walletRoutes');
const riderRoutes = require('./routes/rider');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/coupon', couponRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/rider', riderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/review', require('./routes/review'));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Food Delivery API running' });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

module.exports = app;
