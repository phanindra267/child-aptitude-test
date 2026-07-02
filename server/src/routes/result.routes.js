const express = require('express');
const { verifyToken } = require('../middleware/auth.middleware');
const Result = require('../models/Result.model');
const router = express.Router();

// GET /api/results?childId=...
router.get('/', verifyToken, async (req, res) => {
  try {
    const { childId } = req.query;
    const filter = {};
    if (childId) filter.child = childId;

    const results = await Result.find(filter)
      .populate('testSession')
      .sort({ completedAt: -1 });

    res.json({ success: true, count: results.length, results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/results/:id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('testSession')
      .populate('child');

    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });

    res.json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
