
import React from 'react';
import { ProjectInfo } from '@/lib/types';
import { formatCurrency } from '../../lib/chatbot';

interface ProjectListProps {
  projects: ProjectInfo[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No projects match your filters. Try adjusting your search criteria.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map(project => (
        <div key={project.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              project.status === 'Completed' ? 'bg-green-100 text-green-800' :
              project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {project.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Budget:</span>{' '}
              {formatCurrency(project.budget)}
            </div>
            <div>
              <span className="text-muted-foreground">Spent:</span>{' '}
              {formatCurrency(project.spent)}
            </div>
            <div>
              <span className="text-muted-foreground">Location:</span>{' '}
              {project.location}
            </div>
            <div>
              <span className="text-muted-foreground">Ministry:</span>{' '}
              {project.ministry}
            </div>
            <div>
              <span className="text-muted-foreground">Start Date:</span>{' '}
              {new Date(project.startDate).toLocaleDateString()}
            </div>
            <div>
              <span className="text-muted-foreground">End Date:</span>{' '}
              {new Date(project.endDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
