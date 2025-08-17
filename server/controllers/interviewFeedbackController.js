const { generateObject } = require('ai');
const { google } = require("@ai-sdk/google");
const { feedbackSchema } = require('../constants');
const InterviewFeedback = require('../models/interviewFeedbackModel');

exports.createFeedback = async(req, res) => {
    try {
        const {transcript, userId, interviewId, attemptId} = req.body;

        // Validate input
        if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
        return res.status(400).json({
            status: 'fail',
            error: 'Valid transcript array is required'
        });
        }

        const formattedTranscript = transcript.map((sentence) => (
        `${sentence.role}: ${sentence.content}`
        )).join('\n');

        const result = await generateObject({
        model: google("gemini-2.0-flash-001"),
        schema: feedbackSchema,
        prompt: `Analyze this interview transcript and provide structured feedback.

TRANSCRIPT:
${formattedTranscript}

INSTRUCTIONS:
1. Score the candidate from 0-100 in each category
2. Calculate total score as average of category scores
3. Provide specific comments for each category
4. List 3-5 strengths and areas for improvement
5. Write a comprehensive final assessment

CATEGORIES TO EVALUATE:
- Communication Skills: Clarity, articulation, structured responses
- Technical Knowledge: Understanding of concepts relevant to the role
- Problem Solving: Ability to analyze problems and propose solutions  
- Cultural Fit: Alignment with company values and teamwork
- Confidence and Clarity: Confidence in responses and engagement

Respond with a JSON object matching the exact schema structure.`,
    });

    // Validate the response
    const parsedFeedback = feedbackSchema.parse(result.object);

    const savedFeedback = await InterviewFeedback.create({
        userId,
        interviewId,
        attemptId,
        totalScore: parsedFeedback.totalScore,
        categoryScores: parsedFeedback.categoryScores,
        strengths: parsedFeedback.strengths,
        areasForImprovement: parsedFeedback.areasForImprovement,
        finalAssessment: parsedFeedback.finalAssessment
    });

    return res.status(201).json({
        status: 'success',
        data: savedFeedback
    });
  }
    catch (error) {
        console.error('Feedback creation error:', error);
        
        // Handle specific Zod validation errors
        if (error.name === 'ZodError') {
            return res.status(400).json({
                status: 'fail',
                error: 'AI response validation failed',
                details: error.errors
            });
        }

        return res.status(500).json({
            status: 'fail',
            error: error.message
        });
    }
};

exports.getFeedbackById = async(req, res) => {
    try {
        const feedback = await InterviewFeedback.findById(req.params.id);

        if(!feedback) {
            return res.status(404).json({
                status: 'fail',
                message: 'Feedback not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            data: feedback
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'fail',
            error: error.message
        });
    }
};

exports.getAllFeedbacks = async(req, res) => {
    try {
        const feedbacks = await InterviewFeedback.find({userId: req.user.id});

        if(!feedbacks) {
            return res.status(404).json({
                status: 'fail',
                message: 'Feedbacks not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            data: feedbacks
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'fail',
            error: error.message
        });
    }
};