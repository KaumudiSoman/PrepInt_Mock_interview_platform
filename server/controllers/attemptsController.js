const Attempts = require('../models/attemptsModel');

exports.createAttempt = async(req, res) => {
    try {
        const interviewId = req.body.interviewId;

        const attempt = new Attempts({
            interviewId: interviewId,
            userId: req.user.id,
            attemptedAt: Date.now()
        });

        return res.status(201).json({
            status: 'success',
            data: attempt
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'fail',
            error: error?.message || error || 'Unknown Error'
        });
    }
};

exports.getAttemptCount = async(req, res) => {
    try {
        const interviewId = req.params.interviewId;

        const count = await Attempts.countDocuments({
            userId: req.user.id,
            interviewId
        });

        return res.status(201).json({
            status: 'success',
            data: count
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'fail',
            error: error?.message || error || 'Unknown Error'
        });
    }
};

exports.getAttemptNumber = async (req, res) => {
  try {
    const { interviewId, attemptId } = req.params;
    const userId = req.user.id;

    const attempts = await Attempts.find({ userId, interviewId }).sort({ attemptedAt: 1 });

    const index = attempts.findIndex(a => a._id.toString() === attemptId);

    if (index === -1) {
        return res.status(404).json({
            status: "fail",
            error: "Attempt not found"
        });
    }

    const attemptNumber = index + 1;

    return res.json({
      status: "success",
      data: attemptNumber
    });

  } catch (error) {
    return res.status(500).json({
        status: "fail",
        error: error?.message || error || 'Unknown Error'
    });
  }
};
