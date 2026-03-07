const express = require("express");
const router = express.Router();
const { validateCoupon, createCoupon, getCoupons } = require("../controllers/couponController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public (authenticated) validation
router.post("/validate", protect, validateCoupon);

// Admin only routes
router.get("/", protect, admin, getCoupons);
router.post("/", protect, admin, createCoupon);

module.exports = router;
