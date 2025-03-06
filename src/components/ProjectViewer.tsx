
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { useProjectData } from '../hooks/useProjectData';
import ProjectFilters from './projects/ProjectFilters';
import BudgetStatsCards from './projects/BudgetStatsCards';
import ProjectList from './projects/ProjectList';
import ProjectCharts from './projects/ProjectCharts';

interface ProjectViewerProps {
  onClose: () => void;
}

const ProjectViewer: React.FC<ProjectViewerProps> = ({ onClose }) => {
  const {
    loading,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    statuses,
    ministries,
    filteredProjects,
    budgetStats,
    budgetComparisonData,
    statusDistributionData,
    resetFilters,
    handleExportAsCSV
  } = useProjectData();
  
  const [activeTab, setActiveTab] = useState<'list' | 'charts'>('list');

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-background rounded-xl w-full max-w-5xl max-h-[90vh] p-8 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-background">
          <h2 className="text-xl font-semibold">BUDESHI Project Explorer</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 border-b">
          <ProjectFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
            statuses={statuses}
            ministries={ministries}
            resetFilters={resetFilters}
            handleExportAsCSV={handleExportAsCSV}
          />
          
          <BudgetStatsCards budgetStats={budgetStats} />
        </div>
        
        <div className="border-b flex">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'list' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('list')}
          >
            Project List
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'charts' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('charts')}
          >
            Visualizations
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'list' ? (
            <ProjectList projects={filteredProjects} />
          ) : (
            <ProjectCharts 
              projects={filteredProjects}
              budgetComparisonData={budgetComparisonData}
              statusDistributionData={statusDistributionData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectViewer;
