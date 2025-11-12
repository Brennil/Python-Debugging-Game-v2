// All application code is consolidated into this single file to ensure
// Babel can transpile everything without complex module loading issues
// in a static hosting environment like GitHub Pages.

// --- FROM types.js ---
// Interfaces are used for type-checking during development and are
// stripped out by Babel's TypeScript preset, so they don't affect runtime.

// --- FROM constants.js ---
const TOTAL_QUESTIONS = 10;
const QUESTION_TIME_LIMIT_MS = 20000; // 20 seconds
const MAX_SCORE_PER_QUESTION = 100;
const MIN_SCORE_PER_QUESTION = 10;

// --- FROM services/questionBank.js ---
const QUESTION_BANK = [
    // Syntax Errors
    {
        id: 'syn-01',
        code: 'def my_function()\n  print("Hello")',
        errorLine: 1,
        correctLineText: 'def my_function():',
        explanation: 'Syntax Error: A function definition must end with a colon (:).',
        errorType: 'SyntaxError',
    },
    {
        id: 'syn-02',
        code: 'name = "Alice"\nif name == "Alice"\n  print("Hi Alice!")',
        errorLine: 2,
        correctLineText: 'if name == "Alice":',
        explanation: 'Syntax Error: An if statement requires a colon (:) at the end of the line.',
        errorType: 'SyntaxError',
    },
    {
        id: 'syn-03',
        code: '# Python 3 code\nprint "Hello, world!"',
        errorLine: 2,
        correctLineText: 'print("Hello, world!")',
        explanation: "SyntaxError: In Python 3, print is a function and requires parentheses.",
        errorType: 'SyntaxError'
    },
    {
        id: 'syn-04',
        code: 'message = "Hello, world\'\nprint(message)',
        errorLine: 1,
        correctLineText: 'message = "Hello, world"',
        explanation: "SyntaxError: You started the string with a double quote but ended with a single quote.",
        errorType: 'SyntaxError'
    },
    // Indentation Error
    {
        id: 'ind-01',
        code: 'def say_hello():\nprint("Welcome")',
        errorLine: 2,
        correctLineText: '  print("Welcome")',
        explanation: 'IndentationError: The code inside a function must be indented.',
        errorType: 'IndentationError',
    },
    // Name Error
    {
        id: 'nam-01',
        code: 'message = "Hello World"\nprint(mesage)',
        errorLine: 2,
        correctLineText: 'print(message)',
        explanation: 'NameError: The variable "mesage" is not defined. It\'s likely a typo for "message".',
        errorType: 'NameError',
    },
    // Type Error
    {
        id: 'typ-01',
        code: 'count = 5\nmessage = "You have " + count + " new messages."\nprint(message)',
        errorLine: 2,
        correctLineText: 'message = "You have " + str(count) + " new messages."',
        explanation: 'TypeError: You cannot concatenate a string with an integer. Use str() to convert the number to a string first.',
        errorType: 'TypeError',
    },
    // Index Error
    {
        id: 'idx-01',
        code: 'letters = ["a", "b", "c"]\nprint(letters[3])',
        errorLine: 2,
        correctLineText: 'print(letters[2])',
        explanation: 'IndexError: The list index is out of range. The last item is at index 2.',
        errorType: 'IndexError',
    },
    // Key Error
    {
        id: 'key-01',
        code: 'student = {"name": "Bob", "age": 20}\nprint(student["grade"])',
        errorLine: 2,
        correctLineText: 'print(student["age"])',
        explanation: 'KeyError: The key "grade" does not exist in the dictionary.',
        errorType: 'KeyError',
    },
    // Value Error
    {
        id: 'val-01',
        code: 'number_str = "ten"\nnumber_int = int(number_str)',
        errorLine: 2,
        correctLineText: 'number_str = "10"',
        explanation: 'ValueError: The int() function cannot convert the string "ten" to an integer.',
        errorType: 'ValueError',
    },
    // Logical Error
    {
        id: 'log-01',
        code: 'numbers = [1, 2, 3, 4, 5]\nfor num in numbers:\n  if num % 2 == 1:\n    print(f"{num} is an even number.")',
        errorLine: 3,
        correctLineText: '  if num % 2 == 0:',
        explanation: 'Logical Error: The condition for an even number is `num % 2 == 0`, not 1.',
        errorType: 'Logical Error',
    },
    {
        id: 'log-02',
        code: 'x = 10\nif x = 5:\n  print("x is 5")',
        errorLine: 2,
        correctLineText: 'if x == 5:',
        explanation: "SyntaxError: Use `==` for comparison and `=` for assignment. This line should be `if x == 5:`.",
        errorType: 'SyntaxError'
    },
    // ZeroDivisionError
    {
        id: 'zer-01',
        code: 'numerator = 10\ndenominator = 0\nresult = numerator / denominator',
        errorLine: 3,
        correctLineText: 'denominator = 1',
        explanation: 'ZeroDivisionError: You cannot divide a number by zero.',
        errorType: 'ZeroDivisionError'
    },
    // AttributeError
    {
        id: 'att-01',
        code: 'my_list = [1, 2, 3]\nmy_list.append(4)\nmy_list.sort()\nprint(my_list.length)',
        errorLine: 4,
        correctLineText: 'print(len(my_list))',
        explanation: "AttributeError: List objects don't have a 'length' attribute. Use the len() function to get the length of a list.",
        errorType: 'AttributeError'
    },
];

// --- FROM services/gameService.js ---
let usedQuestionIds = new Set();
const generateQuizQuestion = async () => {
  try {
    let availableQuestions = QUESTION_BANK.filter(q => !usedQuestionIds.has(q.id));
    if (availableQuestions.length === 0) {
      console.warn("All unique questions have been used. Resetting question pool.");
      usedQuestionIds.clear();
      availableQuestions = QUESTION_BANK;
    }
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const question = availableQuestions[randomIndex];
    usedQuestionIds.add(question.id);
    await new Promise(resolve => setTimeout(resolve, 200));
    return question;
  } catch (error) {
    console.error("Error fetching question from bank:", error);
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

const recordAnswer = async (result) => {
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
  await new Promise(resolve => setTimeout(resolve, 300));
};

// --- FROM services/firebase.js ---
const firebaseAppModule = await import('firebase/app');
const firebaseAuthModule = await import('firebase/auth');

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE",
};

if (firebaseConfig.apiKey === "YOUR_API_KEY_HERE" || !firebaseConfig.projectId) {
    const message = "Firebase configuration is missing. Please edit `index.js` and replace the placeholder values with your actual Firebase project configuration.";
    console.error(message);
    const root = document.getElementById('root');
    if (root) {
        root.innerHTML = `<div style="color: white; padding: 2rem; text-align: center; font-family: sans-serif; background-color: #5a2d2d; border: 1px solid #ff4d4d; border-radius: 8px; margin: 1rem;"><strong>Configuration Error</strong><p style="margin-top: 0.5rem;">${message}</p></div>`;
    }
}

const app = firebaseAppModule.initializeApp(firebaseConfig);
const auth = firebaseAuthModule.getAuth(app);
const provider = new firebaseAuthModule.GoogleAuthProvider();

const signInWithGoogle = () => firebaseAuthModule.signInWithPopup(auth, provider);
const signOutUser = () => firebaseAuthModule.signOut(auth);
const onAuthStateChanged = (callback) => {
    return firebaseAuthModule.onAuthStateChanged(auth, callback);
};

// --- FROM components/icons/GoogleIcon.js ---
const GoogleIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.904,36.338,44,30.65,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
);

// --- FROM components/icons/PythonIcon.js ---
const PythonIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <g fillRule="evenodd">
      <path d="M128 256A128 128 0 100 128a128 128 0 00128 128z" fill="#306998" />
      <path
        d="M121.2 78.2v-36a8 8 0 0116 0v36a8 8 0 01-16 0zM121.2 213.8v-36a8 8 0 0116 0v36a8 8 0 01-16 0z"
        fill="#FFD43B"
      />
      <path
        d="M171.6 85.5c-15.6 0-22.3-12.8-22.3-22.6V41.7h-42.6v21c0 15.3-11.4 22-22.4 22H39.7v42.6h22.4c11.4 0 22.4 6.7 22.4 22v47.2h42.6v-22.6c0-11.3 11.7-22 22.3-22h44.6V85.5h-45z"
        fill="#306998"
      />
      <path
        d="M84.4 128.1a22.4 22.4 0 00-22.4-22.4H39.7v42.6h22.4c11.3 0 22.3-5.2 22.3-20.2zM171.6 128.1a22.4 22.4 0 0122.3 22.3h44.6V105.8h-44.6a22.4 22.4 0 01-22.3 22.3z"
        fill="#FFD43B"
      />
      <path
        d="M129.2 62.9a8 8 0 100-16 8 8 0 000 16zM129.2 209.1a8 8 0 100-16 8 8 0 000 16z"
        fill="#fff"
      />
    </g>
  </svg>
);

// --- FROM components/SnakeProgressBar.js ---
const SnakeProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-700 rounded-full h-4 mb-2 border-2 border-gray-600 overflow-hidden">
      <div 
        className="bg-gradient-to-r from-emerald-400 to-cyan-500 h-full rounded-l-full transition-all duration-500 ease-out relative" 
        style={{ width: `${progress}%` }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center gap-px border-2 border-emerald-700 z-10">
          <div className="w-1 h-1 bg-black rounded-full"></div>
          <div className="w-1 h-1 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

// --- FROM components/FinalScoreModal.js ---
const FinalScoreModal = ({ score, onRestart }) => {
  React.useEffect(() => {
    if (typeof window.confetti === 'function') {
      window.confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        zIndex: 1000
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 text-center transform scale-100 transition-transform animate-scale-in">
        <h2 className="text-3xl font-bold mb-2 text-cyan-400">Game Over!</h2>
        <p className="text-gray-300 mb-4">Your final score is:</p>
        <p className="text-6xl font-bold mb-8">{score}</p>
        <button onClick={onRestart} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">Play Again</button>
      </div>
    </div>
  );
};

// --- FROM components/StartScreen.js ---
const StartScreen = () => {
    const [isSigningIn, setIsSigningIn] = React.useState(false);
    const [error, setError] = React.useState(null);

    const handleSignIn = async () => {
        setIsSigningIn(true);
        setError(null);
        try {
            await signInWithGoogle();
        } catch (err) {
            console.error("Google Sign-In Error:", err);
            setError("Failed to sign in. Please try again.");
            setIsSigningIn(false);
        }
    };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-8 text-center animate-fade-in">
      <div className="flex justify-center mb-4">
        <PythonIcon className="w-20 h-20" />
      </div>
      <h1 className="text-4xl font-bold text-cyan-400 mb-4">Python Debugger</h1>
      <p className="text-gray-300 mb-8 max-w-md mx-auto">
        Find and fix bugs in Python code snippets. The faster you are, the higher your score! Test your debugging skills on a curated set of challenges.
      </p>
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleSignIn}
          className="bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center mx-auto transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-wait"
          disabled={isSigningIn}
        >
          <GoogleIcon className="w-6 h-6 mr-3" />
          {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
        </button>
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </div>
    </div>
  );
};

// --- FROM components/GameScreen.js ---
const CodeLine = ({ line, lineNumber, onClick, isSelected, isClickable }) => {
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

const GameScreen = ({ user, onGameEnd, onSignOut, isFinished = false }) => {
  const [currentQuestion, setCurrentQuestion] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [selectedLine, setSelectedLine] = React.useState(null);
  const [userAnswer, setUserAnswer] = React.useState('');
  const [isAnswered, setIsAnswered] = React.useState(false);
  const [feedback, setFeedback] = React.useState(null);
  const [timeRemaining, setTimeRemaining] = React.useState(QUESTION_TIME_LIMIT_MS);

  const timerRef = React.useRef(null);
  const questionStartTimeRef = React.useRef(0);

  const loadNextQuestion = React.useCallback(async () => {
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

  React.useEffect(() => {
    if(!isFinished) {
      loadNextQuestion();
    }
  }, [questionIndex, isFinished]);
  
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

  React.useEffect(() => {
    if (loading || isAnswered || isFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 100) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, isAnswered, isFinished]);

  const handleLineSelect = (lineNumber) => {
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

// --- FROM App.js ---
const App = () => {
  const [user, setUser] = React.useState(null);
  const [authLoading, setAuthLoading] = React.useState(true);
  const [isGameFinished, setIsGameFinished] = React.useState(false);
  const [finalScore, setFinalScore] = React.useState(0);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser ? { uid: firebaseUser.uid, displayName: firebaseUser.displayName } : null);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleGameEnd = React.useCallback((score) => {
    setFinalScore(score);
    setIsGameFinished(true);
  }, []);
  
  const handleRestart = React.useCallback(() => {
    setFinalScore(0);
    setIsGameFinished(false);
  }, []);
  
  const handleSignOut = React.useCallback(async () => {
    try {
        await signOutUser();
        setIsGameFinished(false);
        setFinalScore(0);
    } catch (error) {
        console.error("Error signing out:", error);
    }
  }, []);

  const renderContent = () => {
    if (authLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
        </div>
      );
    }
    
    if (!user) {
        return <StartScreen />;
    }

    return (
        <>
            <GameScreen 
                key={isGameFinished.toString()}
                user={user} 
                onGameEnd={handleGameEnd} 
                onSignOut={handleSignOut}
                isFinished={isGameFinished} 
            />
            {isGameFinished && (
                <FinalScoreModal score={finalScore} onRestart={handleRestart} />
            )}
        </>
    );
  };

  return (
    <div className="text-white flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

// --- FROM original index.js ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Use ReactDOM from the global scope, provided by the CDN import
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
