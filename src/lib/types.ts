
export type MessageRole = 'user' | 'bot' | 'system';

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
}

export interface ProjectInfo {
  id: string;
  name: string;
  description: string;
  status: string;
  budget: number;
  spent: number;
  location: string;
  startDate: string;
  endDate: string;
  ministry: string;
  contractor: string;
}

export interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}
