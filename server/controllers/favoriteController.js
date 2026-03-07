const User = require('../models/User');
const Food = require('../models/Food');

const response = (success, message, data = null) => ({ success, message, data });

// Toggle favorite status
exports.toggleFavorite = async (req, res) => {
    const { foodId } = req.body;
    const userId = req.user.userId;

    if (!foodId) {
        return res.status(400).json(response(false, 'Food ID is required'));
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json(response(false, 'User not found'));

        const isFavorite = user.favorites.includes(foodId);

        if (isFavorite) {
            // Remove from favorites
            user.favorites = user.favorites.filter(id => id.toString() !== foodId);
            await user.save();
            return res.status(200).json(response(true, 'Removed from favorites', { isFavorite: false }));
        } else {
            // Check if food exists
            const food = await Food.findById(foodId);
            if (!food) return res.status(404).json(response(false, 'Food not found'));

            // Add to favorites
            user.favorites.push(foodId);
            await user.save();
            return res.status(200).json(response(true, 'Added to favorites', { isFavorite: true }));
        }
    } catch (err) {
        return res.status(500).json(response(false, 'Server error', err.message));
    }
};

// Get user's favorite foods
exports.getFavorites = async (req, res) => {
    const userId = req.user.userId;
    try {
        const user = await User.findById(userId).populate('favorites');
        if (!user) return res.status(404).json(response(false, 'User not found'));

        return res.status(200).json(response(true, 'Favorites fetched', user.favorites));
    } catch (err) {
        return res.status(500).json(response(false, 'Server error', err.message));
    }
};
