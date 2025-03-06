
import React from 'react';

const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="glass rounded-xl rounded-tl-sm p-4 flex items-center space-x-2 max-w-[85%] md:max-w-[70%] animate-pulse-slow">
        <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-white text-xs font-semibold">
          B
        </div>
        <div className="text-sm">Thinking...</div>
      </div>
    </div>
  );
};

export default ThinkingIndicator;
