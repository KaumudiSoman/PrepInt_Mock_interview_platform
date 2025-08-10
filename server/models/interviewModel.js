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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Interview userId is required']
  },
  upvoteCount: {
    type: Number,
    default: 0
  },
  downvoteCount: {
    type: Number,
    default: 0
  },
  finalized: Boolean,
  coverImage: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Interview', interviewSchema);
