const express = require('express');
const { verifyToken } = require('../middleware/auth.middleware');
const SyncQueue = require('../models/SyncQueue.model');
const router = express.Router();

// POST /api/sync/push - Push local changes from mobile
router.post('/push', verifyToken, async (req, res) => {
  try {
    const { deviceId, operations } = req.body;
    if (!deviceId || !operations || !Array.isArray(operations)) {
      return res.status(400).json({ success: false, message: 'deviceId and operations[] required' });
    }

    const docs = operations.map(op => ({
      deviceId,
      userId: req.userId,
      operationType: op.type,
      collection: op.collection,
      documentId: op.documentId,
      payload: op.payload
    }));

    const saved = await SyncQueue.insertMany(docs);
    res.json({ success: true, synced: saved.length, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/sync/pull - Pull remote updates
router.get('/pull', verifyToken, async (req, res) => {
  try {
    const { deviceId, lastSync } = req.query;
    const filter = { userId: req.userId, status: 'pending' };
    if (lastSync) filter.createdAt = { $gt: new Date(lastSync) };
    if (deviceId) filter.deviceId = { $ne: deviceId };

    const operations = await SyncQueue.find(filter).sort({ createdAt: 1 }).limit(100);
    res.json({ success: true, operations, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
