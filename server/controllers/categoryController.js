const Category = require('../models/Category');
const response = (success, message, data = null) => ({ success, message, data });

// Create category (admin only)
exports.createCategory = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json(response(false, 'Name is required'));
  try {
    const exists = await Category.findOne({ name });
    if (exists) return res.status(409).json(response(false, 'Category already exists'));
    const category = new Category({ name, description });
    await category.save();
    return res.status(201).json(response(true, 'Category created', category));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.json(response(true, 'Categories fetched', categories));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};

// Update category (admin only)
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const category = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!category) return res.status(404).json(response(false, 'Category not found'));
    return res.json(response(true, 'Category updated', category));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};

// Delete category (admin only)
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json(response(false, 'Category not found'));
    return res.json(response(true, 'Category deleted', category));
  } catch (err) {
    return res.status(500).json(response(false, 'Server error', err.message));
  }
};
