const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @desc    Get user wallet balance and transactions
// @route   GET /api/wallet
// @access  Private
exports.getWalletData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('walletBalance');
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      balance: user.walletBalance,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
