const mongoose = require('mongoose');

const noteInteractionSchema = new mongoose.Schema({
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
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
    default: null
  }
}, { timestamps: true });

noteInteractionSchema.index({ userId: 1, noteId: 1 }, { unique: true });

module.exports = mongoose.model('NoteInteraction', noteInteractionSchema);
