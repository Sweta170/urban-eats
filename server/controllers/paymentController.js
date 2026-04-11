if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables.');
}
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Create Stripe Checkout Session
// @route   POST /api/payment/create-checkout-session
// @access  Private
exports.createCheckoutSession = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId).populate('items.food');

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const lineItems = order.items.map(item => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.food.name,
                },
                unit_amount: Math.round(item.food.price * 100), // Stripe expects amount in paise
            },
            quantity: item.quantity,
        }));

        // Add discount as a negative line item if needed, 
        // but Stripe Checkout Handles discounts via 'discounts' parameter better.
        // For simplicity, we'll just adjust the total or add a discount line item.
        if (order.discount > 0) {
            lineItems.push({
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'Discount Applied',
                    },
                    unit_amount: -Math.round(order.discount * 100),
                },
                quantity: 1,
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/order-tracking/${order._id}`,
            metadata: {
                orderId: order._id.toString(),
            },
        });

        order.stripeSessionId = session.id;
        await order.save();

        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        console.error("Stripe Session Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Verify Stripe Payment Status
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
    try {
        const { sessionId, orderId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const order = await Order.findById(orderId);
            if (order && order.paymentStatus !== 'Paid') {
                order.paymentStatus = 'Paid';
                await order.save();

                // Credit Cashback for Card Payment
                const user = await User.findById(order.user);
                if (user && order.walletAmountEarned > 0) {
                    user.walletBalance += order.walletAmountEarned;
                    await user.save();

                    await Transaction.create({
                        user: user._id,
                        order: order._id,
                        amount: order.walletAmountEarned,
                        type: 'credit',
                        description: `5% Cashback for order #${order._id.toString().slice(-6)}`
                    });
                }

                return res.status(200).json({ success: true, message: "Payment verified successfully" });
            }
        }

        res.status(400).json({ success: false, message: "Payment not verified" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
