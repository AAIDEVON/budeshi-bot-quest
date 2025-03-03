
import React from 'react';
import Header from '../components/Header';
import ChatInterface from '../components/ChatInterface';

const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      <main className="flex-1 pt-[72px] relative">
        <ChatInterface />
      </main>
    </div>
  );
};

export default Index;
