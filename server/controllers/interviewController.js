const mongoose = require('mongoose');
const { google } = require("@ai-sdk/google");
const { generateText } = require("ai");
const Interview = require("../models/interviewModel");
const UserInteraction = require("../models/interviewInteractionModel");
const { getRandomInterviewCover } = require("./utilController");

const googleModel = google("gemini-2.0-flash-001", {
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

exports.getQuestions = async (req, res, next) => {
  const { type, role, level, techstack, amount, userId } = req.body;

  try {
    const { text: questions } = await generateText({
      model: googleModel,
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]`,
    });

    const interview = new Interview({
      role,
      type,
      level,
      techstack: (techstack || "").split(",").map(s => s.trim()),
      questions: JSON.parse(questions),
      userId: userId,
      finalized: true,
      coverImage: getRandomInterviewCover(),
    });

    await interview.save();

    res.status(200).json({
        status: 'success',
        interview
    });
  }
  catch (error) {
    return next(error);
  }
};

exports.getAllInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.aggregate([
      { $match: { userId: { $ne : new mongoose.Types.ObjectId(req.user.id) } } },
      { $addFields: {
        totalVotes: { $add: ["$upvoteCount", "$downvoteCount"] },
        ratio: {
          $cond: {
            if: { $eq: ["$totalVotes", 0] },
            then: 0,
            else: { $divide: ["$upvoteCount", { $add: ["$upvoteCount", "$downvoteCount"] }] }
          }
        }
      } },
      { $sort: { ratio: -1, totalVotes: -1 } }
    ]);  

    if(!interviews) {
      const error = new Error('Interviews not found');
      error.statusCode = 404;
      return next(error); 
    }

    return res.status(200).json({
        status: 'success',
        data: interviews
    });
  }
  catch (error) {
    return next(error);
  }
};

exports.getUserInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find({userId: req.user.id});

    if(!interviews) {
      const error = new Error('Interviews not found');
      error.statusCode = 404;
      return next(error); 
    }

    return res.status(200).json({
        status: 'success',
        data: interviews
    });
  }
  catch (error) {
    return next(error);
  }
};

exports.deleteInterviewById = async(req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if(!interview) {
      const error = new Error(`Interview with id ${req.params.id} not found`);
      error.statusCode = 404;
      return next(error); 
    }

    if(req.user.id !== interview.userId.toString()) {
      const error = new Error('Users can only delete their own interviews');
      error.statusCode = 403;
      return next(error); 
    }

    await Interview.findByIdAndDelete(req.params.id);

    return res.status(200).json({
        status: 'success',
        message: 'Interview deleted successfully'
    });
  }
  catch (error) {
    return next(error);
  }
};

exports.getFavoriteInterviews = async(req, res, next) => {
  try {
    const favoriteInteractions = await UserInteraction.find(
      { userId: req.user.id, isFavorite: true},
      { interviewId: 1, _id: 0 }
    );

    const favoriteIds = favoriteInteractions.map(item => item.interviewId);

    const interviews = await Interview.find({
      _id: { $in: favoriteIds }
    });

    return res.status(200).json({
      status: 'success',
      data: interviews
    });
  }
  catch (error) {
    return next(error);
  }
};

exports.getInterviewById = async(req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if(!interview) {
      const error = new Error(`Interview with Id ${req.params.id} not found`);
      error.statusCode = 404;
      return next(error); 
    }

    return res.status(200).json({
      status: 'success',
      data: interview
    });
  }
  catch (error) {
    return next(error);
  }
};