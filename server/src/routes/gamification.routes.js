const express = require('express');
const { verifyToken } = require('../middleware/auth.middleware');
const router = express.Router();

const GAMIFICATION_SERVICE = process.env.GAMIFICATION_SERVICE_URL || 'http://localhost:8003';

// GET /api/gamification/game - Proxy to Python gamification service
router.get('/game', verifyToken, async (req, res) => {
  try {
    const { age, type } = req.query;
    const url = `${GAMIFICATION_SERVICE}/api/gamification/game?age=${age || 6}&type=${type || 'memory_match'}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json({ success: true, ...data });
  } catch (error) {
    console.error('Gamification service error:', error.message);
    res.status(503).json({ success: false, message: 'Gamification service unavailable' });
  }
});

module.exports = router;
