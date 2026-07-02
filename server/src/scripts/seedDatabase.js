const mongoose = require('mongoose');
const Question = require('../models/Question.model');
require('dotenv').config();

const sampleQuestions = [
  // For age group 3-5
  {
    text: "Which shape is different?",
    type: "image-choice",
    options: [
      { text: "Circle", image: "circle.png" },
      { text: "Square", image: "square.png" },
      { text: "Triangle", image: "triangle.png" },
      { text: "Heart", image: "heart.png" }
    ],
    correctAnswer: 3,
    ageGroup: "3-5",
    skillType: "spatial",
    difficulty: "easy",
    explanation: "Heart is not a geometric shape"
  },
  {
    text: "What comes next? 🍎, 🍌, 🍎, 🍌, ?",
    type: "sequence",
    options: ["🍎", "🍌", "🍒", "🍇"],
    correctAnswer: 0,
    ageGroup: "3-5",
    skillType: "logical",
    difficulty: "easy",
    explanation: "Pattern is apple, banana repeating"
  },
  // For age group 6-8
  {
    text: "What is 7 + 5?",
    type: "multiple-choice",
    options: ["10", "11", "12", "13"],
    correctAnswer: 2,
    ageGroup: "6-8",
    skillType: "math",
    difficulty: "easy",
    points: 2
  },
  {
    text: "Cat is to Kitten as Dog is to?",
    type: "verbal",
    options: ["Puppy", "Cub", "Calf", "Foal"],
    correctAnswer: 0,
    ageGroup: "6-8",
    skillType: "language",
    difficulty: "medium",
    explanation: "Baby cat is kitten, baby dog is puppy"
  },
  // For age group 9-12
  {
    text: "If all Zips are Zaps and some Zaps are Zops, then:",
    type: "multiple-choice",
    options: [
      "All Zips are Zops",
      "Some Zips are Zops",
      "No Zips are Zops",
      "Cannot be determined"
    ],
    correctAnswer: 3,
    ageGroup: "9-12",
    skillType: "logical",
    difficulty: "hard",
    points: 3
  },
  {
    text: "Complete the sequence: 2, 4, 8, 16, ?",
    type: "sequence",
    options: ["24", "32", "28", "20"],
    correctAnswer: 1,
    ageGroup: "9-12",
    skillType: "math",
    difficulty: "medium",
    explanation: "Each number is multiplied by 2"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('🗑️  Cleared existing questions');

    // Insert sample questions
    await Question.insertMany(sampleQuestions);
    console.log(`✅ Inserted ${sampleQuestions.length} questions`);

    console.log('🎉 Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
