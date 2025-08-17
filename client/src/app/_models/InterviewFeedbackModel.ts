import { Interview } from "./InterviewModel";

export interface CategoryScore {
  _id: string;
  name: string;
  score: number;
  comment: string;
}

export interface Feedback {
  _id: string;
  userId: string;
  interviewId: string;
  attemptId: string;
  totalScore: number;
  categoryScores: CategoryScore[];
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  interview: Interview
  createdAt: string;
  updatedAt: string;
}