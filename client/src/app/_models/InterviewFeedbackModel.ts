export interface CategoryScore {
  _id: string;
  name: string;
  score: number;
  comment: string;
}

export interface Feedback {
  _id: string;
  totalScore: number;
  categoryScores: CategoryScore[];
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
  updatedAt: string;
}