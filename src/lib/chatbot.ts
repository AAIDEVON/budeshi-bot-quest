
import { Message, ProjectInfo } from "./types";

// Mock data for demonstration - this would be replaced with actual API calls
const mockProjects: ProjectInfo[] = [
  {
    id: "1",
    name: "Lagos-Ibadan Expressway Rehabilitation",
    description: "Complete rehabilitation of the Lagos-Ibadan expressway to improve transportation infrastructure",
    status: "In Progress",
    budget: 167000000000,
    spent: 89000000000,
    location: "Lagos/Oyo States",
    startDate: "2018-03-15",
    endDate: "2023-12-31",
    ministry: "Ministry of Works and Housing",
    contractor: "Julius Berger & RCC Nigeria Limited"
  },
  {
    id: "2",
    name: "Abuja Light Rail Project",
    description: "Construction of a light rail system to improve public transportation in the FCT",
    status: "Completed",
    budget: 45000000000,
    spent: 52000000000,
    location: "Federal Capital Territory",
    startDate: "2015-07-12",
    endDate: "2022-05-20",
    ministry: "FCT Administration",
    contractor: "CCECC Nigeria Limited"
  },
  {
    id: "3",
    name: "Primary Healthcare Centers Renovation",
    description: "Renovation and equipping of 10,000 primary healthcare centers across Nigeria",
    status: "Delayed",
    budget: 55000000000,
    spent: 23000000000,
    location: "Nationwide",
    startDate: "2020-01-10",
    endDate: "2023-01-10",
    ministry: "Ministry of Health",
    contractor: "Multiple Contractors"
  }
];

// Function to generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Format currency in Naira
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Basic intent recognition
const recognizeIntent = (message: string): string => {
  message = message.toLowerCase();
  
  if (message.includes('hello') || message.includes('hi') || message.includes('start')) {
    return 'greeting';
  }
  
  if (message.includes('help') || message.includes('what can you do')) {
    return 'help';
  }
  
  if (message.includes('project') || message.includes('projects')) {
    return 'projects';
  }
  
  if (message.includes('budget') || message.includes('cost') || message.includes('amount') || message.includes('money') || message.includes('spent')) {
    return 'budget';
  }
  
  if (message.includes('status') || message.includes('progress') || message.includes('complete')) {
    return 'status';
  }

  if (message.includes('ministry') || message.includes('ministries') || message.includes('department') || message.includes('agency')) {
    return 'ministry';
  }

  if (message.includes('location') || message.includes('where')) {
    return 'location';
  }

  if (message.includes('contractor') || message.includes('company')) {
    return 'contractor';
  }
  
  if (message.includes('thank')) {
    return 'thanks';
  }
  
  if (message.includes('bye') || message.includes('goodbye')) {
    return 'goodbye';
  }
  
  return 'unknown';
};

// Function to handle projects queries
const handleProjectsQuery = (query: string): string => {
  query = query.toLowerCase();
  
  // Check if query is about a specific project
  for (const project of mockProjects) {
    if (query.includes(project.name.toLowerCase())) {
      return `Project: ${project.name}\nStatus: ${project.status}\nBudget: ${formatCurrency(project.budget)}\nSpent: ${formatCurrency(project.spent)}\nLocation: ${project.location}\nContractor: ${project.contractor}`;
    }
  }
  
  // List all projects
  return "Here are some government projects I have information about:\n\n" + 
    mockProjects.map(p => `- ${p.name} (${p.status})`).join("\n") + 
    "\n\nYou can ask me about any of these projects for more details.";
};

// Function to handle budget queries
const handleBudgetQuery = (query: string): string => {
  query = query.toLowerCase();
  
  // Check if query is about a specific project
  for (const project of mockProjects) {
    if (query.includes(project.name.toLowerCase())) {
      const percentSpent = (project.spent / project.budget * 100).toFixed(1);
      return `Budget information for ${project.name}:\nAllocated Budget: ${formatCurrency(project.budget)}\nAmount Spent: ${formatCurrency(project.spent)} (${percentSpent}% of budget)\n${project.spent > project.budget ? "⚠️ This project has exceeded its budget." : ""}`;
    }
  }
  
  // General budget information
  const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = mockProjects.reduce((sum, p) => sum + p.spent, 0);
  
  return `Total budget across all tracked projects: ${formatCurrency(totalBudget)}\nTotal spent: ${formatCurrency(totalSpent)}\n\nFor details on a specific project, please mention its name.`;
};

// Function to handle status queries
const handleStatusQuery = (query: string): string => {
  query = query.toLowerCase();
  
  // Check if query is about a specific project
  for (const project of mockProjects) {
    if (query.includes(project.name.toLowerCase())) {
      const statusEmoji = 
        project.status === "Completed" ? "✅" : 
        project.status === "In Progress" ? "🏗️" : 
        project.status === "Delayed" ? "⚠️" : "❓";
      
      return `${statusEmoji} Status of ${project.name}: ${project.status}\nStart Date: ${project.startDate}\nExpected Completion: ${project.endDate}`;
    }
  }
  
  // Status summary
  const completed = mockProjects.filter(p => p.status === "Completed").length;
  const inProgress = mockProjects.filter(p => p.status === "In Progress").length;
  const delayed = mockProjects.filter(p => p.status === "Delayed").length;
  
  return `Project Status Summary:\n✅ Completed: ${completed}\n🏗️ In Progress: ${inProgress}\n⚠️ Delayed: ${delayed}\n\nFor details on a specific project, please mention its name.`;
};

// Generate response based on intent and query
export const generateResponse = async (message: string): Promise<string> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const intent = recognizeIntent(message);
  
  switch (intent) {
    case 'greeting':
      return "Hello! I'm the BUDESHI assistant here to help you access information about government procurement projects in Nigeria. What would you like to know?";
    
    case 'help':
      return "I can provide information about government projects including their budgets, status, locations, and contractors. You can ask me things like:\n\n- What projects are currently ongoing?\n- What's the budget for the Lagos-Ibadan Expressway project?\n- Which ministry handles the Primary Healthcare Centers Renovation?\n- What's the status of the Abuja Light Rail Project?\n\nHow can I assist you today?";
    
    case 'projects':
      return handleProjectsQuery(message);
    
    case 'budget':
      return handleBudgetQuery(message);
    
    case 'status':
      return handleStatusQuery(message);
    
    case 'ministry':
      for (const project of mockProjects) {
        if (message.toLowerCase().includes(project.name.toLowerCase())) {
          return `The ${project.name} is managed by the ${project.ministry}.`;
        }
      }
      return "I can provide information about which ministries or agencies are responsible for specific projects. Please specify a project name.";
    
    case 'location':
      for (const project of mockProjects) {
        if (message.toLowerCase().includes(project.name.toLowerCase())) {
          return `The ${project.name} is located in ${project.location}.`;
        }
      }
      return "I can tell you where specific projects are located. Please specify a project name.";
    
    case 'contractor':
      for (const project of mockProjects) {
        if (message.toLowerCase().includes(project.name.toLowerCase())) {
          return `The contractor for the ${project.name} is ${project.contractor}.`;
        }
      }
      return "I can provide information about contractors working on government projects. Please specify a project name.";
    
    case 'thanks':
      return "You're welcome! I'm here to help make government procurement information accessible. Is there anything else you'd like to know?";
    
    case 'goodbye':
      return "Thank you for using BUDESHI. We're committed to making government more transparent for all Nigerians. Have a great day!";
    
    case 'unknown':
    default:
      return "I'm not sure I understand your question. I can provide information about government projects, their budgets, status, and implementing agencies. Could you rephrase your question?";
  }
};

// Process a new message and get a response
export const processMessage = async (content: string): Promise<Message> => {
  const response = await generateResponse(content);
  
  return {
    id: generateId(),
    content: response,
    role: 'bot',
    timestamp: new Date()
  };
};
