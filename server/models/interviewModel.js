// models/Interview.js
const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  role: {
    type: String,
    required: [true, 'Interview role is required']
  },
  type: {
    type: String,
    required: [true, 'Interview type is required']
  },
  level: {
    type: String,
    required: [true, 'Interview level is required']
  },
  techstack: {
    type: [String],
    required: [true, 'Interview techstacks are required']
  },
  questions: {
    type: [String],
    required: [true, 'Interview questions are required']
  },
  userId: {
    type: String,
    required: [true, 'Interview userId is required']
  },
  finalized: Boolean,
  coverImage: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Interview', interviewSchema);
