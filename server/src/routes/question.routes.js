const express = require('express');
const Question = require('../models/Question.model');
const router = express.Router();

// @route   GET /api/questions
// @desc    Get questions with filters
router.get('/', async (req, res) => {
  try {
    const { ageGroup, skillType, difficulty, limit = 10 } = req.query;
    
    const filter = {};
    if (ageGroup) filter.ageGroup = ageGroup;
    if (skillType) filter.skillType = skillType;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.find(filter)
      .limit(parseInt(limit))
      .select('-correctAnswer'); // Don't send correct answer to client

    res.json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/questions/test/:ageGroup
// @desc    Get test questions for an age group
router.get('/test/:ageGroup', async (req, res) => {
  try {
    const { ageGroup } = req.params;
    const limit = parseInt(req.query.limit) || 15;

    // Get balanced mix of questions
    const questions = await Question.aggregate([
      { $match: { ageGroup } },
      { $sample: { size: limit } },
      { $project: { correctAnswer: 0 } }
    ]);

    res.json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/questions/validate
// @desc    Validate test answers
router.post('/validate', async (req, res) => {
  try {
    const { answers } = req.body; // [{questionId, selectedAnswer}]

    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    const results = answers.map(answer => {
      const question = questions.find(q => q._id.equals(answer.questionId));
      if (!question) return null;

      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: answer.selectedAnswer === question.correctAnswer,
        explanation: question.explanation,
        points: question.points
      };
    }).filter(Boolean);

    const score = results.reduce((total, result) => 
      total + (result.isCorrect ? result.points : 0), 0);
    const maxScore = results.reduce((total, result) => total + result.points, 0);

    res.json({
      success: true,
      results,
      score,
      maxScore,
      percentage: (score / maxScore * 100).toFixed(1)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
