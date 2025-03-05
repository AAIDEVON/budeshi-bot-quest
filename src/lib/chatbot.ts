
import { Message, ProjectInfo, UserPreferences } from "./types";

// Mock data for projects
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
  },
  {
    id: "4",
    name: "Second Niger Bridge Construction",
    description: "Construction of a second bridge over the River Niger between Asaba and Onitsha",
    status: "Completed",
    budget: 206870000000,
    spent: 210000000000,
    location: "Delta/Anambra States",
    startDate: "2017-08-15",
    endDate: "2022-10-25",
    ministry: "Ministry of Works and Housing",
    contractor: "Julius Berger Nigeria PLC"
  },
  {
    id: "5",
    name: "Mambilla Hydroelectric Power Project",
    description: "Construction of a 3,050 MW hydroelectric power plant on the Mambilla Plateau",
    status: "Planning Phase",
    budget: 5800000000000,
    spent: 200000000000,
    location: "Taraba State",
    startDate: "2021-06-01",
    endDate: "2030-12-31",
    ministry: "Ministry of Power",
    contractor: "China Civil Engineering Construction Corporation"
  },
  {
    id: "6",
    name: "Lekki Deep Sea Port Development",
    description: "Development of a deep sea port in the Lagos Free Trade Zone",
    status: "In Progress",
    budget: 398000000000,
    spent: 290000000000,
    location: "Lagos State",
    startDate: "2019-03-29",
    endDate: "2024-09-30",
    ministry: "Ministry of Transportation",
    contractor: "China Harbour Engineering Company"
  }
];

// Function to fetch projects (now simply returns mock data)
export const fetchProjects = (): ProjectInfo[] => {
  return mockProjects;
};

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

// Load user preferences from localStorage
export const loadUserPreferences = (): UserPreferences => {
  const savedPrefs = localStorage.getItem('budeshi_user_preferences');
  if (savedPrefs) {
    try {
      return JSON.parse(savedPrefs);
    } catch (e) {
      console.error('Error parsing saved preferences:', e);
    }
  }
  
  // Default preferences
  return {
    theme: 'system',
    fontSize: 'medium',
    detailedResponses: true,
    includeCharts: true
  };
};

// Save user preferences to localStorage
export const saveUserPreferences = (preferences: UserPreferences): void => {
  localStorage.setItem('budeshi_user_preferences', JSON.stringify(preferences));
};

// Find project by name or ID
export const findProject = (searchTerm: string): ProjectInfo | undefined => {
  const normalizedTerm = searchTerm.toLowerCase().trim();
  
  return mockProjects.find(
    project => 
      project.id === normalizedTerm ||
      project.name.toLowerCase().includes(normalizedTerm)
  );
};

// Generate system prompt with context about BUDESHI and available data
const generateSystemPrompt = (): string => {
  // Create a condensed version of the projects data to include in the prompt
  const projectsData = mockProjects.map(project => ({
    name: project.name,
    status: project.status,
    budget: formatCurrency(project.budget),
    spent: formatCurrency(project.spent),
    location: project.location,
    ministry: project.ministry,
    contractor: project.contractor
  }));

  return `You are BUDESHI assistant, an AI dedicated to providing information about government procurement projects in Nigeria.
Your goal is to make government procurement transparent and accessible to all citizens.

You have access to the following project information:
${JSON.stringify(projectsData, null, 2)}

When providing monetary values, format them as Nigerian Naira.
Always be helpful, concise, and accurate. If you don't know the answer, say so rather than making up information.
Remember that you are helping citizens understand how government funds are being spent on procurement projects.

You can also help users by:
- Explaining procurement terms and processes
- Comparing projects based on budget, location, or status
- Suggesting ways citizens can monitor or get involved in procurement oversight
- Providing information on transparency in governance

FORMATTING INSTRUCTIONS:
- Format your responses using Markdown to make them highly readable and well-structured
- Use **bold** for emphasis on important information like project names, budget amounts, etc.
- Use headings (## and ###) to organize information when providing details about multiple projects
- Use bullet points or numbered lists when presenting multiple items or facts
- Use tables when comparing data across multiple projects
- For monetary values, always format as ₦XXX,XXX,XXX
- Highlight key metrics by formatting them separately on their own lines
`;
};

// Call LLM API to get response
const callLLMAPI = async (userMessage: string, conversationHistory: { role: string, content: string }[]): Promise<string> => {
  try {
    const apiKey = localStorage.getItem('openai_api_key');
    
    // If no API key is set, use a fallback response
    if (!apiKey) {
      console.warn("No OpenAI API key found in localStorage. Using fallback response.");
      return "I'm unable to connect to the AI service at the moment. Please set your API key by clicking the settings button.";
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using a cheaper, fast model
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('LLM API error:', errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling LLM API:', error);
    throw error;
  }
};

// Process a new message and get a response
export const processMessage = async (content: string, previousMessages: Message[] = []): Promise<Message> => {
  try {
    // Convert previous messages to the format expected by the LLM API
    const systemPrompt = generateSystemPrompt();
    const conversationHistory = [
      { role: 'system', content: systemPrompt },
      ...previousMessages.map(msg => ({
        role: msg.role === 'bot' ? 'assistant' : msg.role,
        content: msg.content
      })),
      { role: 'user', content }
    ];

    // Call the LLM API
    const response = await callLLMAPI(content, conversationHistory);
    
    // Return the bot message
    return {
      id: generateId(),
      content: response,
      role: 'bot',
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error processing message:', error);
    throw error;
  }
};

// Export projects as CSV
export const exportProjectsAsCSV = (projects: ProjectInfo[] = mockProjects): string => {
  const headers = [
    'Name',
    'Description',
    'Status',
    'Budget',
    'Spent',
    'Location',
    'Ministry',
    'Contractor',
    'Start Date',
    'End Date'
  ].join(',');

  const rows = projects.map(project => [
    `"${project.name}"`,
    `"${project.description}"`,
    `"${project.status}"`,
    project.budget,
    project.spent,
    `"${project.location}"`,
    `"${project.ministry}"`,
    `"${project.contractor}"`,
    project.startDate,
    project.endDate
  ].join(','));

  return [headers, ...rows].join('\n');
};
