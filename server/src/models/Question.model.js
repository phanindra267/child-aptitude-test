const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required']
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'sequence', 'pattern', 'verbal', 'image-choice'],
    default: 'multiple-choice'
  },
  options: [{
    text: String,
    image: String
  }],
  correctAnswer: {
    type: Number,
    required: true
  },
  ageGroup: {
    type: String,
    enum: ['3-5', '6-8', '9-12'],
    required: true
  },
  skillType: {
    type: String,
    enum: ['logical', 'math', 'language', 'spatial'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  points: {
    type: Number,
    default: 1
  },
  explanation: String,
  imageUrl: String,
  timeLimit: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', questionSchema);
