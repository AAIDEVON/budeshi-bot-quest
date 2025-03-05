
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ProjectViewer from './ProjectViewer';
import { Message } from '../lib/types';
import { generateId, processMessage, fetchProjects } from '../lib/chatbot';
import { Button } from './ui/button';
import { DownloadIcon, RefreshCwIcon, SettingsIcon, DatabaseIcon, SunIcon, MoonIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      content: "Hello! I'm the BUDESHI assistant. I can help you find information about government procurement projects. What would you like to know?",
      role: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('openai_api_key'));
  const [showProjectViewer, setShowProjectViewer] = useState(false);
  const [fontSize, setFontSize] = useState<string>(localStorage.getItem('budeshi_font_size') || 'medium');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    // Apply font size from localStorage
    document.documentElement.style.setProperty(
      '--font-size-multiplier', 
      fontSize === 'small' ? '0.9' : fontSize === 'large' ? '1.1' : '1'
    );
  }, [fontSize]);

  const handleSendMessage = async (content: string) => {
    if (content.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      content,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Process the message and get bot response with message history
      const botResponse = await processMessage(content, messages);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        role: 'system',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      toast.error("Error processing your request", {
        description: "Please try again or refresh the page"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: generateId(),
        content: "Hello! I'm the BUDESHI assistant. I can help you find information about government procurement projects. What would you like to know?",
        role: 'bot',
        timestamp: new Date()
      }
    ]);
    
    toast.success("Chat history cleared", {
      description: "Started a new conversation"
    });
  };

  const downloadChatHistory = () => {
    const chatText = messages.map(msg => {
      const role = msg.role === 'bot' ? 'BUDESHI Assistant' : msg.role === 'user' ? 'You' : 'System';
      const time = msg.timestamp.toLocaleString();
      return `[${time}] ${role}:\n${msg.content}\n`;
    }).join('\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budeshi-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Chat history downloaded", {
      description: "Your conversation has been saved as a text file"
    });
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

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
      size === 'small' ? '0.9' : size === 'large' ? '1.1' : '1'
    );
    
    toast.success(`Font size set to ${size}`, {
      description: "Your preference has been saved"
    });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pb-4 px-4">
        <div className="max-w-3xl mx-auto pt-4">
          <div className="flex justify-end space-x-2 mb-4">
            <div className="mr-auto flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8"
                onClick={() => setShowProjectViewer(true)}
              >
                <DatabaseIcon className="h-3.5 w-3.5 mr-1.5" />
                View Projects
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-3.5 w-3.5" />
                ) : (
                  <MoonIcon className="h-3.5 w-3.5" />
                )}
              </Button>
              
              <div className="relative group">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-8"
                >
                  <span className="sr-only">Font Size</span>
                  Aa
                </Button>
                <div className="absolute right-0 mt-1 bg-background border rounded-md shadow-md hidden group-hover:block z-10">
                  <div className="p-1">
                    <button 
                      className={`block w-full text-left px-3 py-1.5 text-xs rounded ${fontSize === 'small' ? 'bg-primary/10' : 'hover:bg-muted'}`}
                      onClick={() => changeFontSize('small')}
                    >
                      Small
                    </button>
                    <button 
                      className={`block w-full text-left px-3 py-1.5 text-xs rounded ${fontSize === 'medium' ? 'bg-primary/10' : 'hover:bg-muted'}`}
                      onClick={() => changeFontSize('medium')}
                    >
                      Medium
                    </button>
                    <button 
                      className={`block w-full text-left px-3 py-1.5 text-xs rounded ${fontSize === 'large' ? 'bg-primary/10' : 'hover:bg-muted'}`}
                      onClick={() => changeFontSize('large')}
                    >
                      Large
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8"
              onClick={setOpenAIKey}
            >
              <SettingsIcon className="h-3.5 w-3.5 mr-1.5" />
              {apiKey ? "Change API Key" : "Set API Key"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8"
              onClick={clearChat}
            >
              <RefreshCwIcon className="h-3.5 w-3.5 mr-1.5" />
              New Chat
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8" 
              onClick={downloadChatHistory}
            >
              <DownloadIcon className="h-3.5 w-3.5 mr-1.5" />
              Download
            </Button>
          </div>
          
          {!apiKey && (
            <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300 rounded">
              Please set your OpenAI API key to use the LLM-powered chat assistant. Click the "Set API Key" button above.
            </div>
          )}
          
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="glass rounded-xl rounded-tl-sm p-4 flex items-center space-x-2 max-w-[85%] md:max-w-[70%] animate-pulse-slow">
                <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-white text-xs font-semibold">
                  B
                </div>
                <div className="text-sm">Thinking...</div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="border-t border-border pt-4 glass mt-auto">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      {showProjectViewer && (
        <ProjectViewer 
          projects={fetchProjects()} 
          onClose={() => setShowProjectViewer(false)} 
        />
      )}
    </div>
  );
};

export default ChatInterface;
