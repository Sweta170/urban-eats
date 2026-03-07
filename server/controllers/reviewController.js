const Review = require('../models/Review');
const Food = require('../models/Food');

const response = (success, message, data = null) => ({ success, message, data });

// Add a review
exports.addReview = async (req, res) => {
    const { foodId, rating, comment } = req.body;
    const userId = req.user.userId;

    if (!foodId || !rating) {
        return res.status(400).json(response(false, 'Food ID and rating are required'));
    }

    try {
        // Check if food exists
        const food = await Food.findById(foodId);
        if (!food) return res.status(404).json(response(false, 'Food not found'));

        // Create review
        const review = await Review.create({
            user: userId,
            food: foodId,
            rating,
            comment
        });

        // Recalculate average rating
        const stats = await Review.aggregate([
            { $match: { food: food._id } },
            {
                $group: {
                    _id: '$food',
                    avgRating: { $avg: '$rating' },
                    nRating: { $sum: 1 }
                }
            }
        ]);

        // Update food stats
        if (stats.length > 0) {
            food.averageRating = stats[0].avgRating;
            food.ratingCount = stats[0].nRating;
            await food.save();
        }

        return res.status(201).json(response(true, 'Review added successfully', review));
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json(response(false, 'You have already reviewed this item'));
        }
        return res.status(500).json(response(false, 'Server error', err.message));
    }
};

// Get reviews for a food item
exports.getReviews = async (req, res) => {
    const { foodId } = req.params;
    try {
        const reviews = await Review.find({ food: foodId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        return res.status(200).json(response(true, 'Reviews fetched', reviews));
    } catch (err) {
        return res.status(500).json(response(false, 'Server error', err.message));
    }
};
