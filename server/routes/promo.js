const express = require('express');
const router = express.Router();
const promoController = require('../controllers/promoController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/validate', auth, promoController.validatePromoCode);
router.post('/create', auth, admin, promoController.createPromoCode);

module.exports = router;
