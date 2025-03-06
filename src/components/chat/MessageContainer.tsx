
import React, { useRef, useEffect } from 'react';
import ChatMessage from '../ChatMessage';
import ThinkingIndicator from './ThinkingIndicator';
import { Message } from '../../lib/types';

interface MessageContainerProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageContainer: React.FC<MessageContainerProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto pb-4 px-4">
      <div className="max-w-3xl mx-auto pt-4">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && <ThinkingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageContainer;
