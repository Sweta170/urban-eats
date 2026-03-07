const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const auth = require('../middleware/auth');



router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);


// Change password (protected)
router.post('/change-password', auth, authController.changePassword);

// Profile
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.post('/address', auth, authController.addAddress);

module.exports = router;

module.exports = router;

module.exports = router;
