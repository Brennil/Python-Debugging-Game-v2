import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion, GameResult } from '../types';
// Fix: Import TOTAL_QUESTIONS to resolve 'Cannot find name' error.
import { TOTAL_QUESTIONS } from "../constants";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: "A unique identifier for the question, e.g., 'syn-01'." },
    errorType: { type: Type.STRING, description: "The category of the error, e.g., 'SyntaxError', 'TypeError', 'Logical Error'." },
    code: { type: Type.STRING, description: "A 2-5 line Python code snippet with one common error." },
    errorLine: { type: Type.INTEGER, description: "The line number (1-based) where the error occurs." },
    correctLineText: { type: Type.STRING, description: "The single line of code, corrected." },
    explanation: { type: Type.STRING, description: "A brief, clear explanation of the error and the fix for a beginner." },
    validationRegex: { type: Type.STRING, description: "Optional. A regex to validate user answers that may have multiple correct variations, such as adding a missing argument to a function." },
  },
  required: ["id", "errorType", "code", "errorLine", "correctLineText", "explanation"],
};

const DIVERSE_ERROR_TYPES = [
    "SyntaxError", "IndentationError", "NameError", "TypeError", 
    "IndexError", "KeyError", "AttributeError", "ValueError", 
    "ZeroDivisionError", "Logical Error"
];

let usedQuestionIds: Set<string> = new Set();

export const generateQuizQuestion = async (): Promise<QuizQuestion> => {
  const errorType = DIVERSE_ERROR_TYPES[Math.floor(Math.random() * DIVERSE_ERROR_TYPES.length)];
  const prompt = `
    You are an expert Python programming instructor creating a quiz for beginners.
    Generate a single, unique Python debugging question.
    The question must feature a common "${errorType}".
    The code snippet should be short, between 2 and 5 lines.
    Ensure the provided 'id' is unique and has not been used before from this list: [${Array.from(usedQuestionIds).join(", ")}].
    Provide the response in JSON format according to the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
        temperature: 1.0, 
      },
    });

    const text = response.text.trim();
    const question = JSON.parse(text) as QuizQuestion;
    
    // Simple check to avoid immediate duplicates
    if (usedQuestionIds.has(question.id)) {
      console.warn("Duplicate question ID generated, fetching another...");
      return generateQuizQuestion();
    }
    
    usedQuestionIds.add(question.id);
    if(usedQuestionIds.size > TOTAL_QUESTIONS * 2) {
      usedQuestionIds.clear(); // Clear cache to prevent it from growing too large
    }

    return question;
  } catch (error) {
    console.error("Error generating quiz question:", error);
    // Fallback to a hardcoded question in case of API failure
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
