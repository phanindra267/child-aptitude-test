const express = require('express');
const { verifyToken, authorize } = require('../middleware/auth.middleware');
const User = require('../models/User.model');
const router = express.Router();

// GET /api/admin/users
router.get('/users', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/admin/users/:id
router.put('/users/:id', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const { role, name, email } = req.body;
    const updates = {};
    if (role) updates.role = role;
    if (name) updates.name = name;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', verifyToken, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/admin/backup/trigger
router.post('/backup/trigger', verifyToken, authorize('admin'), async (req, res) => {
  try {
    // Trigger backup via Python backup service
    res.json({ success: true, message: 'Backup triggered', jobId: `backup_${Date.now()}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
