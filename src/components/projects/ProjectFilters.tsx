
import React from 'react';
import { Search, Filter, DownloadIcon } from 'lucide-react';
import { Button } from '../ui/button';

interface ProjectFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: {
    status: string;
    ministry: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    status: string;
    ministry: string;
  }>>;
  statuses: string[];
  ministries: string[];
  resetFilters: () => void;
  handleExportAsCSV: () => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  statuses,
  ministries,
  resetFilters,
  handleExportAsCSV
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search projects..."
          className="pl-9 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <select
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        
        <select
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={filters.ministry}
          onChange={(e) => setFilters({ ...filters, ministry: e.target.value })}
        >
          <option value="">All Ministries</option>
          {ministries.map(ministry => (
            <option key={ministry} value={ministry}>{ministry}</option>
          ))}
        </select>
        
        <Button variant="outline" size="icon" onClick={resetFilters} title="Reset filters">
          <Filter className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="icon" onClick={handleExportAsCSV} title="Export as CSV">
          <DownloadIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProjectFilters;
