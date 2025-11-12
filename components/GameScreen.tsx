import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateQuizQuestion, recordAnswer } from '../services/gameService.ts';
import type { QuizQuestion, User } from '../types.ts';
import { TOTAL_QUESTIONS, QUESTION_TIME_LIMIT_MS, MAX_SCORE_PER_QUESTION, MIN_SCORE_PER_QUESTION } from '../constants.ts';
import { SnakeProgressBar } from './SnakeProgressBar.tsx';

interface GameScreenProps {
  user: User;
  onGameEnd: (score: number) => void;
  onSignOut: () => void;
  isFinished?: boolean;
}

const CodeLine: React.FC<{ line: string; lineNumber: number; onClick: () => void; isSelected: boolean; isClickable: boolean; }> = ({ line, lineNumber, onClick, isSelected, isClickable }) => {
  const lineClasses = `
    flex items-center p-1 px-2 rounded-md border-2 
    ${isClickable ? 'cursor-pointer hover:bg-gray-700' : 'cursor-default'}
    ${isSelected ? 'border-sky-400 bg-blue-900/50' : 'border-transparent'}
  `;
  return (
    <div className={lineClasses} onClick={isClickable ? onClick : undefined}>
      <span className="w-8 text-right mr-4 text-gray-500 select-none">{lineNumber}</span>
      <span className="whitespace-pre-wrap">{line || ' '}</span>
    </div>
  );
};

const GameScreen: React.FC<GameScreenProps> = ({ user, onGameEnd, onSignOut, isFinished = false }) => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(QUESTION_TIME_LIMIT_MS);

  const timerRef = useRef<number | null>(null);
  const questionStartTimeRef = useRef<number>(0);

  const loadNextQuestion = useCallback(async () => {
    if (questionIndex >= TOTAL_QUESTIONS) {
      onGameEnd(score);
      return;
    }
    setLoading(true);
    setCurrentQuestion(null);
    setSelectedLine(null);
    setUserAnswer('');
    setIsAnswered(false);
    setFeedback(null);
    
    const question = await generateQuizQuestion();
    setCurrentQuestion(question);
    setLoading(false);
    setTimeRemaining(QUESTION_TIME_LIMIT_MS);
    questionStartTimeRef.current = Date.now();
  }, [questionIndex, onGameEnd, score]);

  useEffect(() => {
    if(!isFinished) {
      loadNextQuestion();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex, isFinished]);
  
  useEffect(() => {
    if (loading || isAnswered || isFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 100) {
          clearInterval(timerRef.current as number);
          handleTimeUp();
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isAnswered, isFinished]);


  const handleLineSelect = (lineNumber: number) => {
    if (isAnswered) return;
    setSelectedLine(lineNumber);
    const lineText = currentQuestion?.code.split('\n')[lineNumber - 1] || '';
    setUserAnswer(lineText);
  };

  const handleSubmit = async () => {
    if (!currentQuestion || isAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);
    
    setIsAnswered(true);
    const timeTaken = Date.now() - questionStartTimeRef.current;
    
    const isLineCorrect = selectedLine === currentQuestion.errorLine;
    const normalizedUserAnswer = userAnswer.trim().replace(/\s+/g, ' ');
    const normalizedCorrectAnswer = currentQuestion.correctLineText.trim().replace(/\s+/g, ' ');
    const isTextCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

    const isCorrect = isLineCorrect && isTextCorrect;
    let points = 0;

    if (isCorrect) {
      const timeBonus = Math.max(0, (QUESTION_TIME_LIMIT_MS - timeTaken) / QUESTION_TIME_LIMIT_MS);
      points = Math.floor(MIN_SCORE_PER_QUESTION + (MAX_SCORE_PER_QUESTION - MIN_SCORE_PER_QUESTION) * timeBonus);
      setScore(s => s + points);
      setFeedback({ correct: true, message: `+${points} points! ${currentQuestion.explanation}` });
    } else {
        let feedbackMessage = `That's not quite right. ${currentQuestion.explanation}`;
        if(isLineCorrect && !isTextCorrect) {
            feedbackMessage = `You found the right line, but the correction is incorrect.\nThe correct line is: \`${currentQuestion.correctLineText.trim()}\``;
        } else if(!isLineCorrect && selectedLine !== null) {
            feedbackMessage = `The error is on line ${currentQuestion.errorLine}, not line ${selectedLine}. ${currentQuestion.explanation}`;
        }
        setFeedback({ correct: false, message: feedbackMessage });
    }
    
    await recordAnswer({
      userId: user.uid,
      studentName: user.displayName,
      questionId: currentQuestion.id,
      errorType: currentQuestion.errorType,
      isCorrect,
      score: points,
      timeTakenMs: timeTaken,
    });
  };

  const handleTimeUp = () => {
    if (!currentQuestion) return;
    setIsAnswered(true);
    setFeedback({ correct: false, message: `Time's up! ${currentQuestion.explanation}`});
    recordAnswer({
      userId: user.uid,
      studentName: user.displayName,
      questionId: currentQuestion.id,
      errorType: currentQuestion.errorType,
      isCorrect: false,
      score: 0,
      timeTakenMs: QUESTION_TIME_LIMIT_MS,
    });
  };


  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8">
      <div className="flex justify-between items-start mb-6 border-b border-gray-700 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-cyan-400">Python Debugger</h1>
          <p className="text-sm text-gray-400">Student: {user.displayName || 'Anonymous'}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-sm text-gray-400">Score</div>
          <div className="text-2xl font-bold mb-2">{score}</div>
          <button onClick={onSignOut} className="text-xs bg-gray-600 hover:bg-gray-500 text-white font-semibold py-1 px-3 rounded-md transition-colors">Sign Out</button>
        </div>
      </div>
      
      <div className="text-center text-gray-400 mb-2 font-medium">Question {Math.min(questionIndex + 1, TOTAL_QUESTIONS)} of {TOTAL_QUESTIONS}</div>
      <SnakeProgressBar progress={(questionIndex / TOTAL_QUESTIONS) * 100} />
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6"><div className="bg-yellow-400 h-2.5 rounded-full transition-all duration-100" style={{ width: `${(timeRemaining / QUESTION_TIME_LIMIT_MS) * 100}%` }}></div></div>

      {loading && <div className="text-center p-8">Loading question...</div>}

      {currentQuestion && (
        <>
          <p className="text-center text-gray-300 mb-6">
            {selectedLine === null ? '1. Click the line of code with the error.' : '2. Now, type the corrected line of code.'}
          </p>
          <div className="bg-gray-900 rounded-lg p-4 mb-4 code-font text-sm md:text-base leading-relaxed">
            {currentQuestion.code.split('\n').map((line, i) => (
              <CodeLine 
                key={i} 
                line={line} 
                lineNumber={i + 1} 
                onClick={() => handleLineSelect(i + 1)}
                isSelected={selectedLine === i + 1}
                isClickable={!isAnswered && selectedLine === null}
              />
            ))}
          </div>

          {selectedLine !== null && (
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isAnswered && handleSubmit()}
                className="code-font w-full bg-gray-700 text-white border-2 border-gray-600 rounded-lg py-3 px-4 focus:border-cyan-400 focus:outline-none"
                placeholder="Type the corrected line..."
                disabled={isAnswered}
              />
              <button onClick={handleSubmit} disabled={isAnswered} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed">Submit</button>
            </div>
          )}

          {feedback && (
            <div className={`min-h-[80px] mt-4 p-4 rounded-lg flex flex-col justify-center items-center text-center ${feedback.correct ? 'bg-emerald-900' : 'bg-red-900'}`}>
              <p className="text-lg font-semibold">{feedback.correct ? 'Correct!' : 'Not Quite!'}</p>
              <p className="mt-2 text-gray-300 whitespace-pre-wrap">{feedback.message}</p>
            </div>
          )}

          {isAnswered && questionIndex < TOTAL_QUESTIONS -1 && (
            <div className="mt-6 text-center">
              <button onClick={() => setQuestionIndex(i => i + 1)} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">Next Question</button>
            </div>
          )}
           {isAnswered && questionIndex === TOTAL_QUESTIONS -1 && !isFinished && (
            <div className="mt-6 text-center">
              <button onClick={() => onGameEnd(score)} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">Finish Game</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GameScreen;
