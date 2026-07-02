const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  child: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  gameType: {
    type: String,
    enum: ['memory_match', 'pattern_completion', 'number_racer', 'word_builder', 'shape_sorter'],
    required: true
  },
  difficulty: { type: Number, min: 1, max: 10, default: 1 },
  score: { type: Number, default: 0 },
  maxScore: { type: Number, default: 100 },
  interactions: [{
    action: String,
    timestamp: { type: Date, default: Date.now },
    correct: Boolean,
    responseTime: Number
  }],
  duration: Number,
  completedAt: Date,
  status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GameSession', gameSessionSchema);
