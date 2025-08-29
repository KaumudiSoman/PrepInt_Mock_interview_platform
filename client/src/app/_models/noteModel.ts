export interface StudyPoint {
  topic: string;
  explanation: string;
  example?: string;
}

export interface StudyGuide {
  basic: StudyPoint[];
  intermediate: StudyPoint[];
  advanced: StudyPoint[];
}

export type QuestionLevel = "basic" | "intermediate" | "advanced";

export interface PracticeQuestion {
  level: QuestionLevel;
  question: string;
  answer: string;
  interviewerFocus?: string;
  avoid?: string;
}

export interface Note {
  _id: string;
  userId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  companyType?: string;
  description?: string;
  studyGuide: StudyGuide;
  practiceQuestions: PracticeQuestion[];
  upvoteCount: number;
  downvoteCount: number;
  isThumbsUp: boolean;
  isThumbsDown: boolean;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}
