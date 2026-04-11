const Restaurant = require('../models/Restaurant');

exports.createFood = async (req, res) => {
  const { name, price, category, imageUrl, description } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json(response(false, 'Name, price, and category are required'));
  }
  try {
    let restaurantId = req.body.restaurant;

    // If a restaurant partner is creating food, override with their own ID
    if (req.user.role === 'restaurant') {
      const restaurant = await Restaurant.findOne({ owner: req.user.userId });
      if (!restaurant) return res.status(404).json(response(false, 'Restaurant profile not found'));
      restaurantId = restaurant._id;
    }

    if (!restaurantId) {
      return res.status(400).json(response(false, 'Restaurant association is required'));
    }

    const food = new Food({ name, price, category, imageUrl, description, restaurant: restaurantId });
    await food.save();
    return res.status(201).json(response(true, 'Food item created', food));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};

exports.updateFood = async (req, res) => {
  const { id } = req.params;
  const { name, price, category, imageUrl, description } = req.body;
  try {
    const food = await Food.findByIdAndUpdate(
      id,
      { name, price, category, imageUrl, description },
      { new: true }
    );
    if (!food) return res.status(404).json(response(false, 'Food item not found'));
    return res.json(response(true, 'Food updated successfully', food));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};

exports.deleteFood = async (req, res) => {
  const { id } = req.params;
  try {
    const food = await Food.findByIdAndDelete(id);
    if (!food) return res.status(404).json(response(false, 'Food item not found'));
    return res.json(response(true, 'Food deleted successfully'));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};
const Food = require('../models/Food');
const Order = require('../models/Order');

const response = (success, message, data = null) => ({ success, message, data });

exports.getPopularFoods = async (req, res) => {
  try {
    const popularData = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.food", count: { $sum: "$items.quantity" } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    const foodIds = popularData.map(item => item._id);
    const foods = await Food.find({ _id: { $in: foodIds } });

    // Maintain order by popularity
    const sortedFoods = foodIds.map(id => foods.find(f => f._id.toString() === id.toString())).filter(f => f);

    res.status(200).json(response(true, "Popular items fetched", sortedFoods));
  } catch (err) {
    res.status(500).json(response(false, err.message));
  }
};

exports.getRecommendedFoods = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1. Find user's favorite categories from past orders
    const pastOrders = await Order.find({ user: userId }).populate('items.food');
    if (pastOrders.length === 0) {
      // Fallback to top rated if no history
      const topRated = await Food.find().sort({ averageRating: -1 }).limit(6);
      return res.status(200).json(response(true, "Recommended (Top Rated)", topRated));
    }

    const categories = {};
    pastOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.food) {
          categories[item.food.category] = (categories[item.food.category] || 0) + 1;
        }
      });
    });

    const favoriteCategory = Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b);

    // 2. Suggest items from the favorite category (exclude items already ordered if possible)
    const recommendations = await Food.find({
      category: favoriteCategory
    }).limit(6);

    res.status(200).json(response(true, "Personalized recommendations fetched", recommendations));
  } catch (err) {
    res.status(500).json(response(false, err.message));
  }
};

exports.getPairings = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);
    if (!food) return res.status(404).json(response(false, "Food not found"));

    const pairingMap = {
      'Main Course': ['Beverage', 'Dessert', 'Starter'],
      'Snacks': ['Beverage'],
      'Starter': ['Main Course', 'Beverage'],
      'South Indian': ['Beverage'],
      'North Indian': ['Beverage', 'Rice'],
      'Chinese': ['Starter', 'Beverage'],
      'Dessert': ['Beverage'],
      'Beverage': ['Snacks', 'Dessert']
    };

    const targetCategories = pairingMap[food.category] || ['Main Course'];
    const pairings = await Food.find({
      category: { $in: targetCategories },
      _id: { $ne: id }
    }).limit(4);

    res.status(200).json(response(true, "Pairings fetched", pairings));
  } catch (err) {
    res.status(500).json(response(false, err.message));
  }
};

exports.getAllFood = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, minRating, sort } = req.query;
    let query = {};

    // Search by name (case-insensitive)
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }

    // Filter by category (Multi-select support)
    if (category) {
      const categories = category.split(',').filter(c => c !== 'All' && c !== '');
      if (categories.length > 0) {
        query.category = { $in: categories };
      }
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by minimum rating
    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
    }

    // Sorting logic
    let sortOptions = {};
    if (sort) {
      switch (sort) {
        case 'price_asc':
          sortOptions.price = 1;
          break;
        case 'price_desc':
          sortOptions.price = -1;
          break;
        case 'rating_desc':
          sortOptions.averageRating = -1;
          break;
        default:
          sortOptions.createdAt = -1;
      }
    } else {
      sortOptions.createdAt = -1; // Default: newest first
    }

    const foodList = await Food.find(query).sort(sortOptions);

    if (foodList.length === 0) {
      return res.status(200).json(response(true, 'No food items found', []));
    }
    return res.status(200).json(response(true, 'Food items fetched', foodList));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};

exports.getFoodById = async (req, res) => {
  const { id } = req.params;
  try {
    const food = await Food.findById(id).populate('restaurant', 'name cuisines rating');
    if (!food) return res.status(404).json(response(false, 'Food item not found'));
    return res.json(response(true, 'Food item fetched', food));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};
