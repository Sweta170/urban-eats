const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

const admin = require('../middleware/admin');

router.post('/', auth, orderController.placeOrder);
router.get('/', auth, orderController.getOrders);
router.get('/:id', auth, orderController.getOrderById);

// Admin only
router.get('/all', auth, admin, orderController.getAllOrders);
router.put('/:id/status', auth, admin, orderController.updateOrderStatus);

module.exports = router;
