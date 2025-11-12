export interface QuizQuestion {
  id: string;
  code: string;
  errorLine: number;
  correctLineText: string;
  explanation: string;
  errorType: string;
  validationRegex?: string;
}

export type GameState = 'start' | 'playing' | 'finished';

export interface User {
  uid: string;
  displayName: string | null;
}

export interface GameResult {
  userId: string;
  studentName: string | null;
  questionId: string;
  errorType: string;
  isCorrect: boolean;
  score: number;
  timeTakenMs: number;
}
