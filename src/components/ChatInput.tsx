
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { SendIcon, Loader2, MicIcon, StopCircleIcon } from 'lucide-react';
import { toast } from 'sonner';

// Import the speech recognition types
import '../lib/speech-recognition.d.ts';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize speech recognition when component mounts
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-NG';
      
      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setMessage(transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast.error('Speech recognition error', { 
          description: event.error === 'not-allowed' 
            ? 'Microphone access denied' 
            : `Error: ${event.error}` 
        });
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      toast.error('Speech recognition not supported', { 
        description: 'Your browser does not support speech recognition' 
      });
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast.info('Listening...', { 
        description: 'Speak clearly into your microphone' 
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      if (isListening && recognition) {
        recognition.stop();
        setIsListening(false);
      }
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Suggested questions
  const suggestions = [
    "What projects are currently ongoing?",
    "What's the budget for the Lagos-Ibadan Expressway?",
    "Which contractor is working on the Abuja Light Rail?",
    "What's the status of healthcare center renovations?",
    "Compare budgets of all transportation projects",
    "Which project has the highest budget?"
  ];

  return (
    <div className="px-4 pb-4 w-full max-w-3xl mx-auto">
      {message.length === 0 && (
        <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="text-xs text-left px-3 py-2 rounded-lg glass hover:bg-secondary/80 transition-colors duration-200 overflow-hidden text-ellipsis whitespace-nowrap"
              onClick={() => setMessage(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="relative">
        <div className={cn(
          "glass relative flex items-end rounded-xl border border-border transition-all duration-300 focus-within:border-primary",
          isLoading ? "opacity-80" : ""
        )}>
          <textarea
            ref={textareaRef}
            className="w-full resize-none bg-transparent px-4 py-3.5 outline-none placeholder:text-muted-foreground/60 disabled:cursor-not-allowed disabled:opacity-50 text-sm min-h-[54px] max-h-[120px]"
            placeholder="Ask about government projects..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
          />
          
          {recognition && (
            <Button 
              type="button" 
              size="icon" 
              variant="ghost"
              className={cn(
                "h-9 w-9 rounded-md mr-1 mb-2", 
                isListening ? "text-red-500" : ""
              )}
              onClick={toggleListening}
              disabled={isLoading}
            >
              {isListening ? (
                <StopCircleIcon className="h-4 w-4" />
              ) : (
                <MicIcon className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <Button 
            type="submit" 
            size="icon" 
            className={cn(
              "h-9 w-9 rounded-md mr-2 mb-2 transition-opacity", 
              message.trim() === '' && !isLoading ? "opacity-70" : ""
            )}
            disabled={message.trim() === '' || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="mt-2 text-center text-xs text-muted-foreground">
          BUDESHI is committed to transparency in government procurement
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
