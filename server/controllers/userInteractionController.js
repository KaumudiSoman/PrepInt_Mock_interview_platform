const UserInteraction = require('../models/userInteractionModel');
const Interview = require('../models/interviewModel');

exports.getUserInteraction = async(req, res) => {
    try {
        const interaction = await UserInteraction.findOne({
            userId: req.user.id,
            interviewId: req.params.interviewId
        });

        return res.status(200).json({
            status: 'success',
            data: interaction
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'fail',
            error: error.message
        });
    }
};

exports.updateUserInteraction = async (req, res) => {
  try {
    const { isFavorite, voteType } = req.body;
    const interviewId = req.params.interviewId;
    const userId = req.user.id;

    const updateData = {};
    if (typeof isFavorite !== 'undefined') updateData.isFavorite = isFavorite;
    if (typeof voteType !== 'undefined') updateData.voteType = voteType;

    const existingInteraction = await UserInteraction.findOne({ interviewId, userId });

    const interaction = await UserInteraction.findOneAndUpdate(
        { interviewId, userId },
        updateData,
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const interview = await Interview.findById(interviewId);
    if (!interview) {
        return res.status(404).json({
            status: 'fail',
            error: 'Interview not found'
        });
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
    res.status(500).json({
      status: 'fail',
      error: error.message
    });
  }
};
