
import React from 'react';
import { Message } from '../lib/types';
import { cn } from '../lib/utils';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === 'bot';
  const isSystem = message.role === 'system';
  
  if (isSystem) {
    return (
      <div className="px-4 py-2 mx-auto my-2 max-w-xs text-xs text-center text-muted-foreground">
        {message.content}
      </div>
    );
  }
  
  const formattedContent = message.content.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < message.content.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <div 
      className={cn(
        "flex w-full mb-4 animate-slide-in",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div 
        className={cn(
          "rounded-xl p-4 max-w-[85%] md:max-w-[70%]",
          isBot ? "glass border-border mr-auto rounded-tl-sm" : "bg-budeshi text-white ml-auto rounded-tr-sm"
        )}
      >
        {isBot && (
          <div className="flex items-center mb-1.5">
            <div className="w-5 h-5 rounded bg-budeshi flex items-center justify-center text-white text-xs font-semibold">
              B
            </div>
            <div className="ml-1.5 text-xs font-medium">BUDESHI Assistant</div>
          </div>
        )}
        <div className={cn(
          "text-sm",
          isBot ? "" : "font-medium"
        )}>
          {formattedContent}
        </div>
        <div className={cn(
          "text-xs mt-1.5",
          isBot ? "text-muted-foreground" : "text-primary-foreground/70"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
