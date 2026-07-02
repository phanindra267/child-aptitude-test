const express = require('express');
const { verifyToken } = require('../middleware/auth.middleware');
const router = express.Router();

const PDF_SERVICE = process.env.PDF_SERVICE_URL || 'http://localhost:8010';

// GET /api/reports/:attemptId/pdf
router.get('/:attemptId/pdf', verifyToken, async (req, res) => {
  try {
    const url = `${PDF_SERVICE}/api/reports/${req.params.attemptId}/pdf`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ success: false, message: 'PDF generation failed' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report_${req.params.attemptId}.pdf`);
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('PDF service error:', error.message);
    res.status(503).json({ success: false, message: 'PDF service unavailable' });
  }
});

module.exports = router;
