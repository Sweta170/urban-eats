const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const Food = require('../models/Food');

const response = (success, message, data = null) => ({ success, message, data });

// Get restaurant dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
        const restaurantId = req.restaurant._id;

        const orders = await Order.find({ 'items.restaurant': restaurantId });

        const stats = {
            totalOrders: orders.length,
            totalRevenue: orders.reduce((acc, order) => {
                // Only sum parts of the order belonging to this restaurant
                const restaurantItems = order.items.filter(item => item.restaurant.toString() === restaurantId.toString());
                // Note: This is an approximation if discounts/tax are applied at order level
                return acc + restaurantItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
            }, 0),
            pendingOrders: orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length,
        };

        res.status(200).json(response(true, 'Stats fetched', stats));
    } catch (err) {
        res.status(500).json(response(false, err.message));
    }
};

// Get restaurant's menu
exports.getMenu = async (req, res) => {
    try {
        const foods = await Food.find({ restaurant: req.restaurant._id });
        res.status(200).json(response(true, 'Menu fetched', foods));
    } catch (err) {
        res.status(500).json(response(false, err.message));
    }
};

// Update restaurant profile
exports.updateProfile = async (req, res) => {
    try {
        const updated = await Restaurant.findByIdAndUpdate(req.restaurant._id, req.body, { new: true });
        res.status(200).json(response(true, 'Profile updated', updated));
    } catch (err) {
        res.status(500).json(response(false, err.message));
    }
};
