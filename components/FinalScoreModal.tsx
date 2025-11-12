
import React, { useEffect } from 'react';

declare global {
    interface Window {
        confetti: any;
    }
}

interface FinalScoreModalProps {
  score: number;
  onRestart: () => void;
}

const FinalScoreModal: React.FC<FinalScoreModalProps> = ({ score, onRestart }) => {
  useEffect(() => {
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

export default FinalScoreModal;
