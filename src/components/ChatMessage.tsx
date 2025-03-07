
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
      <div className="px-4 py-2 mx-auto my-2 max-w-xs text-xs text-center text-muted-foreground bg-muted/50 rounded-lg animate-fade-in">
        {message.content}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex w-full mb-6 animate-slide-in",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div 
        className={cn(
          "rounded-xl p-4 max-w-[85%] md:max-w-[70%] shadow-sm",
          isBot ? "glass border-border mr-auto rounded-tl-sm" : "bg-primary text-white ml-auto rounded-tr-sm"
        )}
      >
        {isBot && (
          <div className="flex items-center mb-2.5">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">
              B
            </div>
            <div className="ml-2 text-sm font-medium">BUDESHI Assistant</div>
          </div>
        )}
        
        <div className={cn(
          "text-sm",
          isBot ? "prose prose-headings:mt-4 prose-headings:mb-2" : "font-medium"
        )}>
          {isBot ? (
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2 pb-1 border-b border-border">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold mt-4 mb-2 pb-1 border-b border-border/70">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-bold mt-3 mb-1.5">{children}</h3>,
                ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="my-1">{children}</li>,
                p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
                strong: ({ children }) => <strong className="font-bold text-primary/90">{children}</strong>,
                em: ({ children }) => <em className="italic text-muted-foreground">{children}</em>,
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3 rounded-md">
                    <table className="border-collapse border border-border w-full bg-background/50">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => <th className="border border-border bg-muted px-3 py-1.5 text-left font-semibold">{children}</th>,
                td: ({ children }) => <td className="border border-border px-3 py-1.5">{children}</td>,
                code: ({ children }) => <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary/60 pl-4 my-3 italic bg-muted/30 py-2 rounded-r-md">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
                    {children}
                  </a>
                ),
                hr: () => <hr className="my-4 border-t border-border" />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <p className="leading-relaxed">{message.content}</p>
          )}
        </div>
        
        <div className={cn(
          "text-xs mt-2",
          isBot ? "text-muted-foreground" : "text-primary-foreground/70"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
