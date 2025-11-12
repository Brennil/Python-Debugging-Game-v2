
import React from 'react';

interface SnakeProgressBarProps {
  progress: number;
}

export const SnakeProgressBar: React.FC<SnakeProgressBarProps> = ({ progress }) => {
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
