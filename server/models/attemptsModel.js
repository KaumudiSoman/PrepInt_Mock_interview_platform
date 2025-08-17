const mongoose = require('mongoose');

const attemptsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    interviewId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Interview',
        required: true
    },
    attemptedAt: {
        type: Date,
        required: true
    }
});

attemptsSchema.index({ userId: 1, interviewId: 1, attemptedAt: 1 }, { unique: true });

module.exports = mongoose.model('Attempts', attemptsSchema);