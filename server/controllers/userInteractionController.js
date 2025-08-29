const InterviewInteraction = require('../models/interviewInteractionModel');
const Interview = require('../models/interviewModel');
const NoteInteraction = require('../models/noteInteractionModel');
const Note = require('../models/noteModel');

exports.getInterviewInteraction = async(req, res, next) => {
    try {
        const interaction = await InterviewInteraction.findOne({
            userId: req.user.id,
            interviewId: req.params.interviewId
        });

        return res.status(200).json({
            status: 'success',
            data: interaction
        });
    }
    catch (error) {
        return next(error);
    }
};

exports.updateInterviewInteraction = async (req, res, next) => {
  try {
    const { isFavorite, voteType } = req.body;
    const interviewId = req.params.interviewId;
    const userId = req.user.id;

    const updateData = {};
    if (typeof isFavorite !== 'undefined') updateData.isFavorite = isFavorite;
    if (typeof voteType !== 'undefined') updateData.voteType = voteType;

    const existingInteraction = await InterviewInteraction.findOne({ interviewId, userId });

    const interaction = await InterviewInteraction.findOneAndUpdate(
        { interviewId, userId },
        updateData,
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const interview = await Interview.findById(interviewId);
    if (!interview) {
        const error = new Error('Interview not found');
        error.statusCode = 404;
        return next(error); 
    }

    if(updateData.voteType && existingInteraction && existingInteraction?.voteType !== updateData.voteType) {
        if (existingInteraction?.voteType === 'upvote') {
            interview.upvoteCount = Math.max(0, interview.upvoteCount - 1);
        }
        else if (existingInteraction?.voteType === 'downvote') {
            interview.downvoteCount = Math.max(0, interview.downvoteCount - 1);
        }

        if (updateData.voteType === 'upvote') {
            interview.upvoteCount += 1;
        }
        else if (updateData.voteType === 'downvote') {
            interview.downvoteCount += 1;
        }
    }

    await interview.save();

    res.status(200).json({
      status: 'success',
      data: interaction
    });
  }
  catch (error) {
    return next(error);
  }
};

exports.getNoteInteraction = async(req, res, next) => {
    try {
        const interaction = await NoteInteraction.findOne({
            userId: req.user.id,
            noteId: req.params.noteId
        });

        return res.status(200).json({
            status: 'success',
            data: interaction
        });
    }
    catch (error) {
        return next(error);
    }
};

exports.updateNoteInteraction = async (req, res, next) => {
  try {
    const { isFavorite, voteType } = req.body;
    const noteId = req.params.noteId;
    const userId = req.user.id;

    const updateData = {};
    if (typeof isFavorite !== 'undefined') updateData.isFavorite = isFavorite;
    if (typeof voteType !== 'undefined') updateData.voteType = voteType;

    const existingInteraction = await NoteInteraction.findOne({ noteId, userId });

    const interaction = await NoteInteraction.findOneAndUpdate(
        { noteId, userId },
        updateData,
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const note = await Note.findById(noteId);
    if (!note) {
        const error = new Error('Note not found');
        error.statusCode = 404;
        return next(error); 
    }

    if(updateData.voteType && existingInteraction && existingInteraction?.voteType !== updateData.voteType) {
        if (existingInteraction?.voteType === 'upvote') {
            note.upvoteCount = Math.max(0, note.upvoteCount - 1);
        }
        else if (existingInteraction?.voteType === 'downvote') {
            note.downvoteCount = Math.max(0, note.downvoteCount - 1);
        }

        if (updateData.voteType === 'upvote') {
            note.upvoteCount += 1;
        }
        else if (updateData.voteType === 'downvote') {
            note.downvoteCount += 1;
        }
    }

    await note.save();

    res.status(200).json({
      status: 'success',
      data: interaction
    });
  }
  catch (error) {
    return next(error);
  }
};