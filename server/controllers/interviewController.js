const mongoose = require('mongoose');
const { google } = require("@ai-sdk/google");
const { generateText } = require("ai");
const Interview = require("../models/interviewModel");
const UserInteraction = require("../models/userInteractionModel");
const { getRandomInterviewCover } = require("./utilController");

const googleModel = google("gemini-2.0-flash-001", {
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

exports.getQuestions = async (req, res) => {
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
    res.status(500).json({
        status: 'fail',
        error: error.message
    });
  }
};

exports.getAllInterviews = async (req, res) => {
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
      return res.status(404).json({
        status: 'fail',
        error: 'Interviews not found'
      });
    }

    return res.status(200).json({
        status: 'success',
        data: interviews
    });
  }
  catch (error) {
    return res.status(500).json({
        status: 'fail',
        error: error.message
    });
  }
};

exports.getUserInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({userId: req.user.id});

    if(!interviews) {
      return res.status(404).json({
        status: 'fail',
        error: 'Interviews not found'
      });
    }

    return res.status(200).json({
        status: 'success',
        data: interviews
    });
  }
  catch (error) {
    return res.status(500).json({
        status: 'fail',
        error: error.message
    });
  }
};

exports.deleteInterviewById = async(req, res) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);

    if(req.user.id !== interview.userId) {
      return res.status(403).json({
        status: 'fail',
        error: 'Users can only delete their own interviews'
      });
    }

    if(!interview) {
      return res.status(404).json({
          status: 'fail',
          error: `Interview with id ${req.params.id} not found`
      });
    }

    return res.status(200).json({
        status: 'success',
        message: 'Interview deleted successfully'
    });
  }
  catch (error) {
    return res.status(500).json({
        status: 'fail',
        error: error.message
    });
  }
};

exports.getFavoriteInterviews = async(req, res) => {
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
    })
  }
  catch (error) {
    return res.status(500).json({
        status: 'fail',
        error: error.message
    });
  }
};

exports.getInterviewById = async(req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if(!interview) {
      return res.status(404).json({
        status: 'fail',
        error: `Interview with Id ${req.params.id} not found`
      });
    }

    return res.status(200).json({
      status: 'success',
      data: interview
    });
  }
  catch (error) {
    return res.status(500).json({
      status: 'fail',
      error: error.message
    });
  }
};