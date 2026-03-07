const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const auth = require('../middleware/auth');
const isRestaurant = require('../middleware/restaurant');

router.use(auth, isRestaurant);

router.get('/stats', restaurantController.getDashboardStats);
router.get('/menu', restaurantController.getMenu);
router.put('/profile', restaurantController.updateProfile);

module.exports = router;
