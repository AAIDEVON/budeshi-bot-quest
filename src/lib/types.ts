
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

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  detailedResponses: boolean;
  includeCharts: boolean;
}

export interface ProjectFilterOptions {
  status?: string;
  ministry?: string;
  minBudget?: number;
  maxBudget?: number;
  location?: string;
  contractor?: string;
}

export interface BudgetStats {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  completionPercentage: number;
}
