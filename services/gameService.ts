import type { QuizQuestion, GameResult } from '../types';
import { QUESTION_BANK } from './questionBank';

let usedQuestionIds: Set<string> = new Set();

export const generateQuizQuestion = async (): Promise<QuizQuestion> => {
  try {
    let availableQuestions = QUESTION_BANK.filter(q => !usedQuestionIds.has(q.id));

    // If we've used all questions, reset the set to allow re-playing
    if (availableQuestions.length === 0) {
      console.warn("All unique questions have been used. Resetting question pool.");
      usedQuestionIds.clear();
      availableQuestions = QUESTION_BANK;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const question = availableQuestions[randomIndex];

    usedQuestionIds.add(question.id);

    // Simulate a small delay to feel like loading
    await new Promise(resolve => setTimeout(resolve, 200));

    return question;
  } catch (error) {
    console.error("Error fetching question from bank:", error);
    // Fallback to a hardcoded question in case of an unexpected error
    return {
      id: 'fallback-01',
      code: 'def greet(name)\n    print("Hello, " + name)',
      errorLine: 1,
      correctLineText: 'def greet(name):',
      explanation: 'Syntax Error: A function definition must end with a colon (:).',
      errorType: 'SyntaxError',
    };
  }
};


/**
 * Mocks recording the student's answer to a Google Sheet.
 * In a real-world application, this function would send the data
 * to a backend server. The server would then use the Google Sheets API 
 * with proper authentication (like a service account) to securely write 
 * a new row to the results sheet.
 * We are logging to the console to simulate this client-to-backend-to-sheet process.
 */
export const recordAnswer = async (result: GameResult): Promise<void> => {
  console.log('RECORDING TO GOOGLE SHEET (SIMULATED):', {
    spreadsheetId: 'YOUR_SPREADSHEET_ID',
    tabName: 'Results',
    row: [
      new Date().toISOString(),
      result.userId,
      result.studentName,
      result.questionId,
      result.errorType,
      result.isCorrect,
      result.score,
      result.timeTakenMs
    ]
  });
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
};
