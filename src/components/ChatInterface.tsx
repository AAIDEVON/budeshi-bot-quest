
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Message } from '../lib/types';
import { generateId, processMessage } from '../lib/chatbot';
import { Button } from './ui/button';
import { DownloadIcon, RefreshCwIcon, SettingsIcon, Database } from 'lucide-react';
import { toast } from 'sonner';

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
  const [mongoDBUri, setMongoDBUri] = useState<string | null>(localStorage.getItem('mongodb_uri'));
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const setMongoDBConnection = () => {
    const uri = prompt("Enter your MongoDB connection string:");
    if (uri) {
      localStorage.setItem('mongodb_uri', uri);
      setMongoDBUri(uri);
      toast.success("MongoDB URI saved", {
        description: "Your MongoDB URI has been saved to localStorage. Refreshing the page to connect to the database."
      });
      
      // Optional: Force a refresh to reconnect with the new URI
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
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
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8"
              onClick={setMongoDBConnection}
            >
              <Database className="h-3.5 w-3.5 mr-1.5" />
              {mongoDBUri ? "Change MongoDB" : "Set MongoDB"}
            </Button>
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
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
              Please set your OpenAI API key to use the LLM-powered chat assistant. Click the "Set API Key" button above.
            </div>
          )}
          
          {!mongoDBUri && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
              Please set your MongoDB connection string to fetch real project data. Click the "Set MongoDB" button above.
            </div>
          )}
          
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="glass rounded-xl rounded-tl-sm p-4 flex items-center space-x-2 max-w-[85%] md:max-w-[70%] animate-pulse-slow">
                <div className="w-5 h-5 rounded bg-budeshi flex items-center justify-center text-white text-xs font-semibold">
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
    </div>
  );
};

export default ChatInterface;
