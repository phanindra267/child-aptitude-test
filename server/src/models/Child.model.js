const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Child name is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: 3,
    max: 12
  },
  dateOfBirth: Date,
  grade: {
    type: String,
    enum: ['Preschool', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade']
  },
  avatar: String,
  aptitudes: {
    logical: { type: Number, default: 0 },
    mathematical: { type: Number, default: 0 },
    linguistic: { type: Number, default: 0 },
    spatial: { type: Number, default: 0 },
    lastUpdated: Date
  },
  testHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestSession'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

childSchema.virtual('ageGroup').get(function() {
  if (this.age >= 3 && this.age <= 5) return '3-5';
  if (this.age >= 6 && this.age <= 8) return '6-8';
  return '9-12';
});

module.exports = mongoose.model('Child', childSchema);
