const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  testSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestSession',
    required: true
  },
  totalScore: { type: Number, default: 0 },
  maxScore: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  skillBreakdown: {
    logical: { score: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
    math: { score: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
    language: { score: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
    spatial: { score: { type: Number, default: 0 }, total: { type: Number, default: 0 } }
  },
  recommendations: [String],
  completedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);
