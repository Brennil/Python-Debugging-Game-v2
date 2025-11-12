import React, { useState } from 'react';
import { PythonIcon } from './icons/PythonIcon.tsx';
import { GoogleIcon } from './icons/GoogleIcon.tsx';
import { signInWithGoogle } from '../services/firebase.ts';

const StartScreen: React.FC = () => {
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignIn = async () => {
        setIsSigningIn(true);
        setError(null);
        try {
            await signInWithGoogle();
            // The App component's onAuthStateChanged listener will handle navigation
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

export default StartScreen;
