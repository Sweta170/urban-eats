const Coupon = require("../models/Coupon");

// @desc    Validate a coupon code
// @route   POST /api/coupon/validate
// @access  Private
exports.validateCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;

        if (!code) {
            return res.status(400).json({ success: false, message: "Coupon code is required" });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return res.status(404).json({ success: false, message: "Invalid or inactive coupon code" });
        }

        // Check expiry
        if (new Date() > new Date(coupon.expiryDate)) {
            return res.status(400).json({ success: false, message: "Coupon has expired" });
        }

        // Check usage limit
        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
        }

        // Check minimum purchase
        if (cartTotal < coupon.minPurchase) {
            return res.status(400).json({ success: false, message: `Minimum purchase of ₹${coupon.minPurchase} required for this coupon` });
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discountType === "percentage") {
            discount = (cartTotal * coupon.discountAmount) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else {
            discount = coupon.discountAmount;
        }

        // Ensure discount doesn't exceed cart total
        discount = Math.min(discount, cartTotal);

        res.status(200).json({
            success: true,
            data: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountAmount: coupon.discountAmount,
                calculatedDiscount: discount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a new coupon (Admin only)
// @route   POST /api/coupon
// @access  Private/Admin
exports.createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json({ success: true, data: coupon });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all coupons (Admin only)
// @route   GET /api/coupon
// @access  Private/Admin
exports.getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort("-createdAt");
        res.status(200).json({ success: true, data: coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
