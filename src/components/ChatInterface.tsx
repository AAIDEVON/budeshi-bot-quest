
import React, { useState, useEffect } from 'react';
import ChatInput from './ChatInput';
import ProjectViewer from './ProjectViewer';
import ChatActionButtons from './chat/ChatActionButtons';
import ApiKeyWarning from './chat/ApiKeyWarning';
import MessageContainer from './chat/MessageContainer';
import { useChatMessages } from '../hooks/useChatMessages';
import { toast } from 'sonner';

const ChatInterface: React.FC = () => {
  const { messages, isLoading, sendMessage, clearMessages, downloadChatHistory } = useChatMessages();
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('openai_api_key'));
  const [showProjectViewer, setShowProjectViewer] = useState(false);
  const [fontSize, setFontSize] = useState<string>(localStorage.getItem('budeshi_font_size') || 'medium');

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--font-size-multiplier', 
      fontSize === 'small' ? '0.9' : fontSize === 'large' ? '1.1' : '1'
    );
  }, [fontSize]);

  const setOpenAIKey = () => {
    const key = prompt("Enter your OpenAI API key:");
    if (key) {
      localStorage.setItem('openai_api_key', key);
      setApiKey(key);
      toast.success("API key saved", {
        description: "Your API key has been saved to localStorage"
      });
    }
  };

  const changeFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
    localStorage.setItem('budeshi_font_size', size);
    document.documentElement.style.setProperty(
      '--font-size-multiplier', 
      size === 'small' ? '0.9' : fontSize === 'large' ? '1.1' : '1'
    );
    
    toast.success(`Font size set to ${size}`, {
      description: "Your preference has been saved"
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="max-w-3xl mx-auto w-full px-4 pt-4">
        <ChatActionButtons 
          apiKey={apiKey}
          fontSize={fontSize}
          onOpenProjectViewer={() => setShowProjectViewer(true)}
          onClearChat={clearMessages}
          onDownloadHistory={downloadChatHistory}
          onSetApiKey={setOpenAIKey}
          onChangeFontSize={changeFontSize}
        />
        
        {!apiKey && <ApiKeyWarning />}
      </div>

      <MessageContainer messages={messages} isLoading={isLoading} />
      
      <div className="border-t border-border pt-4 glass mt-auto">
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>

      {showProjectViewer && (
        <ProjectViewer onClose={() => setShowProjectViewer(false)} />
      )}
    </div>
  );
};

export default ChatInterface;
