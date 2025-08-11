const mongoose = require('mongoose');

const categoryScoreSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: [
      "Communication Skills",
      "Technical Knowledge",
      "Problem Solving",
      "Cultural Fit",
      "Confidence and Clarity"
    ],
    required: true
  },
  score: { type: Number, required: true },
  comment: { type: String, required: true }
});

const interviewFeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  totalScore: {
    type: Number,
    default: 0
  },
  categoryScores: {
    type: [categoryScoreSchema],
    validate: {
      validator: arr => arr.length === 5, // enforce exactly 5 categories
      message: "categoryScores must contain exactly 5 items."
    },
    required: true
  },
  strengths: {
    type: [String],
    required: true
  },
  areasForImprovement: {
    type: [String],
    required: true
  },
  finalAssessment: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('InterviewFeedback', interviewFeedbackSchema);
