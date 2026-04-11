const express = require('express');
const DeliveryPartner = require('../models/DeliveryPartner');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

// All routes below require admin role
router.use(auth);
router.use(role('admin'));

// GET /api/admin/riders
// List all riders with status filters
router.get('/riders', async (req, res) => {
  try {
    const { status, isOnline } = req.query;
    let query = {};
    
    if (status === 'verified') query.documentsVerified = true;
    if (status === 'pending') query.documentsVerified = false;
    if (isOnline !== undefined) query.isOnline = isOnline === 'true';

    const riders = await DeliveryPartner.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
      
    res.json({ success: true, count: riders.length, data: riders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/admin/riders/:id/verify
// Approve or reject rider documents
router.patch('/riders/:id/verify', async (req, res) => {
  try {
    const { verify } = req.body; // true or false
    const rider = await DeliveryPartner.findByIdAndUpdate(
      req.params.id,
      { documentsVerified: verify },
      { new: true }
    );
    
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });
    
    res.json({ success: true, message: `Rider ${verify ? 'verified' : 'unverified'}`, data: rider });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/riders/:id
// Remove a rider account
router.delete('/riders/:id', async (req, res) => {
  try {
    const rider = await DeliveryPartner.findByIdAndDelete(req.params.id);
    if (!rider) return res.status(404).json({ success: false, message: 'Rider not found' });
    res.json({ success: true, message: 'Rider removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
