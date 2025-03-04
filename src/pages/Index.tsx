
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import ChatInterface from '../components/ChatInterface';
import { connectToMongoDB } from '../lib/chatbot';

const Index: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const initializeConnection = async () => {
      const mongoUri = localStorage.getItem('mongodb_uri');
      if (mongoUri) {
        setIsConnecting(true);
        try {
          await connectToMongoDB();
          setConnectionError(null);
        } catch (error) {
          console.error("MongoDB connection error:", error);
          setConnectionError((error as Error).message);
        } finally {
          setIsConnecting(false);
        }
      }
    };

    initializeConnection();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      <main className="flex-1 relative">
        {isConnecting && (
          <div className="absolute top-0 left-0 right-0 bg-yellow-100 text-yellow-800 text-center py-2 text-sm">
            Connecting to MongoDB...
          </div>
        )}
        {connectionError && (
          <div className="absolute top-0 left-0 right-0 bg-red-100 text-red-800 text-center py-2 text-sm">
            MongoDB Connection Error: {connectionError}
          </div>
        )}
        <ChatInterface />
      </main>
    </div>
  );
};

export default Index;
