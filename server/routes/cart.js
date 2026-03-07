const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

router.post('/', auth, cartController.addToCart);
router.delete('/', auth, cartController.removeFromCart);
router.get('/', auth, cartController.getCart);

module.exports = router;
