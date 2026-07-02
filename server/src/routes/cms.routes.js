const express = require('express');
const { body, validationResult } = require('express-validator');
const { verifyToken, authorize } = require('../middleware/auth.middleware');
const Question = require('../models/Question.model');
const router = express.Router();

// GET /api/cms/questions
router.get('/questions', verifyToken, authorize('admin', 'content_creator'), async (req, res) => {
  try {
    const { ageGroup, skillType, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (ageGroup) filter.ageGroup = ageGroup;
    if (skillType) filter.skillType = skillType;

    const questions = await Question.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Question.countDocuments(filter);
    res.json({ success: true, questions, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/cms/questions
router.post('/questions', [
  verifyToken, authorize('admin', 'content_creator'),
  body('text').notEmpty().withMessage('Question text required'),
  body('correctAnswer').isNumeric().withMessage('Correct answer index required'),
  body('ageGroup').isIn(['3-5', '6-8', '9-12']).withMessage('Valid age group required'),
  body('skillType').isIn(['logical', 'math', 'language', 'spatial']).withMessage('Valid skill type required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const question = new Question(req.body);
    await question.save();
    res.status(201).json({ success: true, question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/cms/questions/:id
router.put('/questions/:id', verifyToken, authorize('admin', 'content_creator'), async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    res.json({ success: true, question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/cms/questions/:id
router.delete('/questions/:id', verifyToken, authorize('admin', 'content_creator'), async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    res.json({ success: true, message: 'Question deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
