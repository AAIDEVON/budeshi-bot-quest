
import { useState } from 'react';
import { Message } from '../lib/types';
import { generateId, processMessage } from '../lib/chatbot';
import { toast } from 'sonner';

export const useChatMessages = () => {
  const initialMessage: Message = {
    id: generateId(),
    content: "Hello! I'm the BUDESHI assistant. I can help you find information about government procurement projects. What would you like to know?",
    role: 'bot',
    timestamp: new Date()
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    if (content.trim() === '') return;
    
    const userMessage: Message = {
      id: generateId(),
      content,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const botResponse = await processMessage(content, messages);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error processing message:', error);
      
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

  const clearMessages = () => {
    setMessages([initialMessage]);
    
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

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    downloadChatHistory
  };
};
