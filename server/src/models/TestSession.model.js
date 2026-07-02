const mongoose = require('mongoose');

const testSessionSchema = new mongoose.Schema({
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    selectedAnswer: Number,
    isCorrect: Boolean,
    timeSpent: Number // in seconds
  }],
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  score: {
    type: Number,
    default: 0
  },
  maxScore: Number,
  timeSpentTotal: Number,
  recommendations: [String],
  analyzedAt: Date
});

testSessionSchema.methods.calculateScore = function() {
  let score = 0;
  this.questions.forEach(q => {
    if (q.isCorrect) {
      const question = this.questions.find(qRef => qRef.questionId.equals(q.questionId));
      if (question) {
        score += question.points || 1;
      }
    }
  });
  this.score = score;
  return score;
};

module.exports = mongoose.model('TestSession', testSessionSchema);
