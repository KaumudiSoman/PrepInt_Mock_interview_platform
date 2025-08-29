const mongoose = require("mongoose");

const studyPointSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  explanation: { type: String, required: true },
  example: { type: String }
});

const practiceQuestionSchema = new mongoose.Schema({
  level: { 
    type: String, 
    enum: ["basic", "intermediate", "advanced"], 
    required: true 
  },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  interviewerFocus: { type: String },
  avoid: { type: String }
});

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  techstack: {
    type: [String],
    required: true
  },
  companyType: {
    type: String
  },
  description: {
    type: String
  },
  studyGuide: {
    basic: {
      type: [studyPointSchema],
      required: true
    },
    intermediate: {
      type: [studyPointSchema],
      required: true
    },
    advanced: {
      type: [studyPointSchema],
      required: true
    }
  },
  practiceQuestions: [practiceQuestionSchema],
  upvoteCount: {
    type: Number,
    default: 0
  },
  downvoteCount: {
    type: Number,
    default: 0
  },
}, { timestamps: true });

module.exports = mongoose.model("Note", noteSchema);