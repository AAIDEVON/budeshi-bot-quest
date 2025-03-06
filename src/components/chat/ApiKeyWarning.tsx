
import React from 'react';

const ApiKeyWarning: React.FC = () => {
  return (
    <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300 rounded">
      Please set your OpenAI API key to use the LLM-powered chat assistant. Click the "Set API Key" button above.
    </div>
  );
};

export default ApiKeyWarning;
