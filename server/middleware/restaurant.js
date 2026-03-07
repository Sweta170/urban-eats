const Restaurant = require('../models/Restaurant');

const isRestaurant = async (req, res, next) => {
    try {
        if (req.user.role !== 'restaurant') {
            return res.status(403).json({ success: false, message: 'Access denied. Restaurant role required.' });
        }

        // Check if restaurant profile exists
        const restaurant = await Restaurant.findOne({ owner: req.user.userId });
        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant profile not found.' });
        }

        req.restaurant = restaurant;
        next();
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

module.exports = isRestaurant;
