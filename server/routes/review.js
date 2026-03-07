const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.post('/', auth, reviewController.addReview);
router.get('/:foodId', reviewController.getReviews);

module.exports = router;
