const mongoose = require('mongoose');
const { google } = require("@ai-sdk/google");
const { generateText } = require("ai");
const Note = require('../models/noteModel');
const NoteInteraction = require('../models/noteInteractionModel');

const googleModel = google("gemini-2.0-flash-001", {
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

exports.createNote = async (req, res) => {
  const { type, role, level, techstack, company_type, description, userId } = req.body;

  try {
    let { text: rawnote } = await generateText({
      model: googleModel,
      prompt: `You are an expert interview trainer with 10+ years of experience helping candidates succeed at top tech
companies. Generate comprehensive preparation note for a candidate preparing for an interview.

Inputs:
    Role: ${role}
    Level: ${level} (e.g. Junior, Mid-level, Senior, Staff/Principal, Executive)
    Interview Type: ${type} (e. g. Technical Coding, System Design, Behavioral/Leadership, HR/Culture Fit, Case Study, Product/Strategy)
    Interview Stack: ${techstack} (if applicable)
    Company Type: ${company_type} (optional: startup, big tech, consulting, etc.)
    Interview Description: ${description} (optional: details about the interview)

Output requirements:
    1. Structured Study Guide
        Organize content in three progressive tiers:
        a) BASIC (Foundation):
            - Each point should include a short explanation (2-3 sentences)
            - Include simple examples where relevant
        b) INTERMEDIATE (Application):
            - Explain each concept with practical implementation details
            - Add short code snippets or real-world scenarios where relevant
        c) ADVANCED (Mastery):
            - Provide detailed explanations of advanced concepts
            - Include edge cases, optimization tips, and architectural thinking

    2. Practice Questions & Answers:
        For each difficulty level, provide:
            3-6 realistic interview questions
            Model answers with explanation
            Interviewer Focus (what they evaluate)
            Avoid (common mistakes)
        Output in structured JSON format:
        [
          {
            "question": "string",
            "answer": "string",
            "interviewerFocus": "string",
            "avoid": "string"
          }
        ]
        Return ONLY valid JSON. No explanations outside JSON.

        The JSON must have the following structure:
        {
      "studyGuide": {
        "basic": [
          {
            "topic": "string",
            "explanation": "string",
            "example": "string (optional)"
          }
        ],
        "intermediate": [
          {
            "topic": "string",
            "explanation": "string",
            "example": "string (optional)"
          }
        ],
        "advanced": [
          {
            "topic": "string",
            "explanation": "string",
            "example": "string (optional)"
          }
        ]
      },
      "practiceQuestions": [
        {
          "level": "basic | intermediate | advanced",
          "question": "string",
          "answer": "string",
          "interviewerFocus": "string",
          "avoid": "string"
        }
      ]
    }

Style Guidelines:
    - Explanations must be included (not just bullet points)
    - Keep explanations concise but actionable
    - Include relevant code snippets/examples where useful
    - Structure output clearly and logically
    - Do NOT include "success strategy" or final checklist section
`,
    });

    // 1. Remove code block markers (```json ... ```)
rawnote = rawnote.replace(/```json|```/g, "");

// 2. Trim whitespace
rawnote = rawnote.trim();

    const parsed_note = JSON.parse(rawnote);

    const note = new Note({
      userId,
      role,
      level,
      type,
      techstack,
      company_type,
      description,
      studyGuide: {
          basic: (parsed_note.studyGuide?.basic || []).map(p => ({
              topic: p.topic,
              explanation: p.explanation,
              example: p.example || ""
          })),
          intermediate: (parsed_note.studyGuide?.intermediate || []).map(p => ({
              topic: p.topic,
              explanation: p.explanation,
              example: p.example || ""
          })),
          advanced: (parsed_note.studyGuide?.advanced || []).map(p => ({
              topic: p.topic,
              explanation: p.explanation,
              example: p.example || ""
          }))
      },
      practiceQuestions: (parsed_note.practiceQuestions || []).map(q => ({
      level: q.level,
      question: q.question,
      answer: q.answer,
      interviewerFocus: q.interviewerFocus || "",
      avoid: q.avoid || ""
      }))
    });

    await note.save();

    res.status(200).json({
        status: 'success',
        data: note
    });
  }
  catch (error) {
    res.status(500).json({
        status: 'fail',
        error: error.message
    });
  }
};

exports.getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.aggregate([
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

    if(!notes) {
      const error = new Error('Notes not found');
      error.statusCode = 404;
      return next(error); 
    }

    return res.status(200).json({
        status: 'success',
        data: notes
    });
  }
  catch (error) {
    return next(error);
  }
};

exports.getUserNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({userId: req.user.id});

    if(!notes) {
      const error = new Error('Notes not found');
      error.statusCode = 404;
      return next(error); 
    }

    return res.status(200).json({
        status: 'success',
        data: notes
    });
  }
  catch (error) {
    return next(error);
  }
};

exports.deleteNoteById = async(req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if(!note) {
      const error = new Error(`Note with id ${req.params.id} not found`);
      error.statusCode = 404;
      return next(error); 
    }

    if(req.user.id !== note.userId.toString()) {
      const error = new Error('Users can only delete their own notes');
      error.statusCode = 403;
      return next(error); 
    }

    await Note.findByIdAndDelete(req.params.id);

    return res.status(200).json({
        status: 'success',
        message: 'Note deleted successfully'
    });
  }
  catch (error) {
    return next(error);
  }
};

exports.getFavoriteNotes = async(req, res, next) => {
  try {
    const favoriteInteractions = await NoteInteraction.find(
      { userId: req.user.id, isFavorite: true},
      { interviewId: 1, _id: 0 }
    );

    const favoriteIds = favoriteInteractions.map(item => item.interviewId);

    const notes = await Note.find({
      _id: { $in: favoriteIds }
    });

    return res.status(200).json({
      status: 'success',
      data: notes
    });
  }
  catch (error) {
    return next(error);
  }
};

exports.getNoteById = async(req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if(!note) {
      const error = new Error(`Note with Id ${req.params.id} not found`);
      error.statusCode = 404;
      return next(error); 
    }

    return res.status(200).json({
      status: 'success',
      data: note
    });
  }
  catch (error) {
    return next(error);
  }
};