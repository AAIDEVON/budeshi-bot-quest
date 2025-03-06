
import Dexie, { Table } from 'dexie';
import { ProjectInfo } from './types';
import { mockProjects } from './mockData';

class BudeshiDatabase extends Dexie {
  projects!: Table<ProjectInfo, string>;

  constructor() {
    super('budeshiDB');
    this.version(1).stores({
      projects: 'id, name, status, ministry, contractor, location'
    });
  }

  async initializeWithMockData() {
    const count = await this.projects.count();
    if (count === 0) {
      console.log('Initializing database with mock data');
      await this.projects.bulkAdd(mockProjects);
    }
  }
}

const db = new BudeshiDatabase();

// Initialize database with mock data if empty
db.initializeWithMockData().catch(err => {
  console.error('Failed to initialize database:', err);
});

// Database operations for projects

// Get all projects
export const getAllProjects = async (): Promise<ProjectInfo[]> => {
  return await db.projects.toArray();
};

// Get project by id
export const getProjectById = async (id: string): Promise<ProjectInfo | undefined> => {
  return await db.projects.get(id);
};

// Find projects by search term
export const findProjects = async (searchTerm: string): Promise<ProjectInfo[]> => {
  const normalizedTerm = searchTerm.toLowerCase().trim();
  
  return await db.projects
    .filter(project => 
      project.id === normalizedTerm ||
      project.name.toLowerCase().includes(normalizedTerm) ||
      project.description.toLowerCase().includes(normalizedTerm) ||
      project.contractor.toLowerCase().includes(normalizedTerm) ||
      project.location.toLowerCase().includes(normalizedTerm)
    )
    .toArray();
};

// Add a new project
export const addProject = async (project: Omit<ProjectInfo, 'id'>): Promise<string> => {
  const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
  const newProject: ProjectInfo = { ...project, id };
  await db.projects.add(newProject);
  return id;
};

// Update a project
export const updateProject = async (id: string, project: Partial<ProjectInfo>): Promise<void> => {
  await db.projects.update(id, project);
};

// Delete a project
export const deleteProject = async (id: string): Promise<void> => {
  await db.projects.delete(id);
};

// Export projects as CSV
export const exportProjectsAsCSV = async (): Promise<string> => {
  const projects = await getAllProjects();
  
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
