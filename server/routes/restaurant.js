const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const auth = require('../middleware/auth');
const isRestaurant = require('../middleware/restaurant');

router.use(auth, isRestaurant);

router.get('/stats', restaurantController.getDashboardStats);
router.get('/menu', restaurantController.getMenu);
router.post('/menu', restaurantController.createMenuItem);
router.delete('/menu/:id', restaurantController.deleteMenuItem);
router.get('/orders', restaurantController.getOrders);
router.put('/profile', restaurantController.updateProfile);

module.exports = router;
