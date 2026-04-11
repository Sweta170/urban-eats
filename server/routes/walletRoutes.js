const express = require('express');
const router = express.Router();
const { getWalletData } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWalletData);

module.exports = router;
