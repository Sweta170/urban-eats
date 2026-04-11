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

// Create menu item
exports.createMenuItem = async (req, res) => {
    try {
        const { name, price, category, description, imageUrl } = req.body;
        const food = new Food({
            name,
            price,
            category,
            description,
            imageUrl,
            restaurant: req.restaurant._id
        });
        await food.save();
        res.status(201).json(response(true, 'Dish added to menu', food));
    } catch (err) {
        res.status(500).json(response(false, err.message));
    }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
    try {
        const food = await Food.findOneAndDelete({ _id: req.params.id, restaurant: req.restaurant._id });
        if (!food) return res.status(404).json(response(false, 'Dish not found or unauthorized'));
        res.status(200).json(response(true, 'Dish removed from menu'));
    } catch (err) {
        res.status(500).json(response(false, err.message));
    }
};

// Get restaurant orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 'items.restaurant': req.restaurant._id })
            .populate('user', 'name email')
            .populate('items.food', 'name price')
            .sort({ createdAt: -1 });

        // Filter items in each order to only show those belonging to this restaurant
        const filteredOrders = orders.map(order => {
            const orderObj = order.toObject();
            orderObj.items = orderObj.items.filter(item => item.restaurant.toString() === req.restaurant._id.toString());
            return orderObj;
        });

        res.status(200).json(response(true, 'Orders fetched', filteredOrders));
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
