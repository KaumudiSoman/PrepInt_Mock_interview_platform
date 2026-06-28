const { z } = require('zod');

const feedbackSchema = z.object({
  totalScore: z.number().min(0).max(100),
  categoryScores: z.array(z.object({
    name: z.string(),
    score: z.number().min(0).max(100),
    comment: z.string()
  })),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string()
});

module.exports = { feedbackSchema };