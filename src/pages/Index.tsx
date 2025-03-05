
import React, { useEffect } from 'react';
import Header from '../components/Header';
import ChatInterface from '../components/ChatInterface';

const Index: React.FC = () => {
  useEffect(() => {
    // Apply font size from localStorage
    const fontSize = localStorage.getItem('budeshi_font_size') || 'medium';
    document.documentElement.style.setProperty(
      '--font-size-multiplier', 
      fontSize === 'small' ? '0.9' : fontSize === 'large' ? '1.1' : '1'
    );
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      <main className="flex-1">
        <ChatInterface />
      </main>
    </div>
  );
};

export default Index;
