const PromoCode = require('../models/PromoCode');

const response = (success, message, data = null) => ({ success, message, data });

exports.validatePromoCode = async (req, res) => {
    const { code, orderAmount } = req.body;

    if (!code) {
        return res.status(400).json(response(false, 'Promo code is required'));
    }

    try {
        const promo = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true });

        if (!promo) {
            return res.status(404).json(response(false, 'Invalid promo code'));
        }

        // Check expiry
        if (new Date() > promo.expiryDate) {
            return res.status(400).json(response(false, 'Promo code has expired'));
        }

        // Check minimum order amount
        if (orderAmount < promo.minOrderAmount) {
            return res.status(400).json(response(false, `Minimum order amount of ₹${promo.minOrderAmount} required`));
        }

        // Check usage limit
        if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
            return res.status(400).json(response(false, 'Promo code usage limit reached'));
        }

        return res.status(200).json(response(true, 'Promo code applied successfully', {
            code: promo.code,
            discountType: promo.discountType,
            discountAmount: promo.discountAmount,
        }));
    } catch (err) {
        return res.status(500).json(response(false, 'Server error', err.message));
    }
};

// Admin helper to create a promo code (for testing/setup)
exports.createPromoCode = async (req, res) => {
    try {
        const promo = new PromoCode(req.body);
        await promo.save();
        return res.status(201).json(response(true, 'Promo code created', promo));
    } catch (err) {
        return res.status(500).json(response(false, 'Server error', err.message));
    }
};
