
import { Message, ProjectInfo, UserPreferences } from "./types";
import { getAllProjects, findProjects, exportProjectsAsCSV as exportCSV } from "./database";

// Function to fetch projects (now from IndexedDB)
export const fetchProjects = async (): Promise<ProjectInfo[]> => {
  return await getAllProjects();
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
export const findProject = async (searchTerm: string): Promise<ProjectInfo | undefined> => {
  const projects = await findProjects(searchTerm);
  return projects.length > 0 ? projects[0] : undefined;
};

// Generate system prompt with context about BUDESHI and available data
const generateSystemPrompt = async (): Promise<string> => {
  // Create a condensed version of the projects data to include in the prompt
  const projects = await fetchProjects();
  const projectsData = projects.map(project => ({
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
    const systemPrompt = await generateSystemPrompt();
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
export const exportProjectsAsCSV = async (): Promise<string> => {
  return await exportCSV();
};
