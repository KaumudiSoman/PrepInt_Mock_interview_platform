export interface Interview {
    _id: string;
    role: string;
    type: string;
    level: string;
    techstack: string[];
    questions: string[];
    userId: string;
    finalized: boolean;
    coverImage: string;
    createdAt: Date;
    isFavorite: boolean;
    upvoteCount: number;
    downvoteCount: number;
    isThumbsUp: boolean;
    isThumbsDown: boolean;
    attempts: number;
}