const express = require('express');
const { body, validationResult } = require('express-validator');
const { verifyToken, authorize } = require('../middleware/auth.middleware');
const TestSession = require('../models/TestSession.model');
const Question = require('../models/Question.model');
const Result = require('../models/Result.model');
const Child = require('../models/Child.model');
const router = express.Router();

// GET /api/tests - List available tests (grouped questions by age)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { ageGroup } = req.query;
    const filter = {};
    if (ageGroup) filter.ageGroup = ageGroup;

    const counts = await Question.aggregate([
      { $match: filter },
      { $group: { _id: { ageGroup: '$ageGroup', skillType: '$skillType' }, count: { $sum: 1 } } }
    ]);

    res.json({ success: true, availableTests: counts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/tests/:childId/start - Start a test for a child
router.post('/:childId/start', verifyToken, async (req, res) => {
  try {
    const child = await Child.findById(req.params.childId);
    if (!child) return res.status(404).json({ success: false, message: 'Child not found' });

    const ageGroup = child.ageGroup;
    const questions = await Question.aggregate([
      { $match: { ageGroup } },
      { $sample: { size: 15 } }
    ]);

    const session = new TestSession({
      child: child._id,
      questions: questions.map(q => ({ questionId: q._id })),
      maxScore: questions.reduce((sum, q) => sum + (q.points || 1), 0)
    });

    await session.save();
    await Child.findByIdAndUpdate(child._id, { $push: { testHistory: session._id } });

    res.status(201).json({
      success: true,
      sessionId: session._id,
      questions: questions.map(q => ({ _id: q._id, text: q.text, type: q.type, options: q.options, ageGroup: q.ageGroup, skillType: q.skillType, difficulty: q.difficulty, points: q.points, timeLimit: q.timeLimit, imageUrl: q.imageUrl }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/tests/:sessionId/submit - Submit & auto-score
router.post('/:sessionId/submit', verifyToken, async (req, res) => {
  try {
    const { answers } = req.body; // [{questionId, selectedAnswer, timeSpent}]
    const session = await TestSession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    if (session.status === 'completed') return res.status(400).json({ success: false, message: 'Test already submitted' });

    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    let totalScore = 0;
    const skillBreakdown = { logical: { score: 0, total: 0 }, math: { score: 0, total: 0 }, language: { score: 0, total: 0 }, spatial: { score: 0, total: 0 } };

    const gradedAnswers = answers.map(answer => {
      const question = questions.find(q => q._id.equals(answer.questionId));
      if (!question) return null;
      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      const points = question.points || 1;
      if (isCorrect) totalScore += points;

      if (skillBreakdown[question.skillType]) {
        skillBreakdown[question.skillType].total += points;
        if (isCorrect) skillBreakdown[question.skillType].score += points;
      }

      return { questionId: answer.questionId, selectedAnswer: answer.selectedAnswer, isCorrect, timeSpent: answer.timeSpent || 0 };
    }).filter(Boolean);

    session.questions = gradedAnswers;
    session.score = totalScore;
    session.status = 'completed';
    session.completedAt = new Date();
    await session.save();

    const maxScore = session.maxScore || gradedAnswers.length;
    const result = new Result({
      child: session.child,
      testSession: session._id,
      totalScore,
      maxScore,
      percentage: maxScore > 0 ? ((totalScore / maxScore) * 100).toFixed(1) : 0,
      skillBreakdown
    });
    await result.save();

    res.json({ success: true, score: totalScore, maxScore, percentage: result.percentage, skillBreakdown, resultId: result._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
