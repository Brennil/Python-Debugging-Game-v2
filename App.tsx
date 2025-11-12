import React, { useState, useCallback, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import FinalScoreModal from './components/FinalScoreModal';
import { onAuthStateChanged, signOutUser } from './services/firebase';
import type { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser ? { uid: firebaseUser.uid, displayName: firebaseUser.displayName } : null);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleGameEnd = useCallback((score: number) => {
    setFinalScore(score);
    setIsGameFinished(true);
  }, []);
  
  const handleRestart = useCallback(() => {
    setFinalScore(0);
    setIsGameFinished(false);
  }, []);
  
  const handleSignOut = useCallback(async () => {
    try {
        await signOutUser();
        // onAuthStateChanged will handle setting user to null
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
                key={isGameFinished.toString()} // Force re-mount on restart
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

export default App;
