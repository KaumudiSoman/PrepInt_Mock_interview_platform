const mongoose = require('mongoose');

const userInteractionSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isFavorite: {
    type: Boolean,
    required: true,
    default: false
  },
  voteType: {
    type: String,
    enum: ['UP', 'DOWN'],
    required: true,
    default: null
  }
}, { timestamps: true });

userInteractionSchema.index({ userId: 1, interviewId: 1 }, { unique: true });

module.exports = mongoose.model('UserInteraction', userInteractionSchema);
