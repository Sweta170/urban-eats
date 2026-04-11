const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public
router.get('/', foodController.getAllFood);
router.get('/popular', foodController.getPopularFoods);
router.get('/recommended', auth, foodController.getRecommendedFoods);
router.get('/:id/pairings', foodController.getPairings);
router.get('/:id', foodController.getFoodById);

// Admin only
router.post('/', auth, admin, foodController.createFood);
router.put('/:id', auth, admin, foodController.updateFood);
router.delete('/:id', auth, admin, foodController.deleteFood);

module.exports = router;
