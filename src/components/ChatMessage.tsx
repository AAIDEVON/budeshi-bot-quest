
import React from 'react';
import ReactMarkdown from 'react-markdown';
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
          isBot ? "glass border-border mr-auto rounded-tl-sm" : "bg-primary text-white ml-auto rounded-tr-sm"
        )}
      >
        {isBot && (
          <div className="flex items-center mb-1.5">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-white text-xs font-semibold">
              B
            </div>
            <div className="ml-1.5 text-xs font-medium">BUDESHI Assistant</div>
          </div>
        )}
        
        <div className={cn(
          "text-sm prose-sm max-w-none",
          isBot ? "prose" : "font-medium"
        )}>
          {isBot ? (
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-lg font-bold my-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-md font-bold my-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-bold my-1.5">{children}</h3>,
                ul: ({ children }) => <ul className="list-disc pl-5 my-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 my-2">{children}</ol>,
                li: ({ children }) => <li className="my-1">{children}</li>,
                p: ({ children }) => <p className="my-1.5">{children}</p>,
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                table: ({ children }) => <div className="overflow-x-auto my-2"><table className="border-collapse border border-border w-full">{children}</table></div>,
                th: ({ children }) => <th className="border border-border bg-muted px-2 py-1 text-left">{children}</th>,
                td: ({ children }) => <td className="border border-border px-2 py-1">{children}</td>,
                code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-xs">{children}</code>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-primary pl-3 my-2 italic">{children}</blockquote>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <>{message.content}</>
          )}
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
