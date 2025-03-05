
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Search, Filter, X, DownloadIcon } from 'lucide-react';
import { ProjectInfo } from '../lib/types';
import { Button } from './ui/button';
import { filterProjects, getUniqueFilterValues, calculateBudgetStats } from '../lib/projectUtils';
import { formatCurrency } from '../lib/chatbot';

interface ProjectViewerProps {
  projects: ProjectInfo[];
  onClose: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#EC7063'];

const ProjectViewer: React.FC<ProjectViewerProps> = ({ projects, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{
    status: string;
    ministry: string;
  }>({
    status: '',
    ministry: ''
  });
  const [activeTab, setActiveTab] = useState<'list' | 'charts'>('list');

  // Get unique values for filters
  const statuses = useMemo(() => getUniqueFilterValues(projects, 'status'), [projects]);
  const ministries = useMemo(() => getUniqueFilterValues(projects, 'ministry'), [projects]);

  // Apply filters to projects
  const filteredProjects = useMemo(() => {
    return filterProjects(projects, searchTerm, {
      status: filters.status,
      ministry: filters.ministry
    });
  }, [projects, searchTerm, filters]);

  // Calculate budget statistics
  const budgetStats = useMemo(() => {
    return calculateBudgetStats(filteredProjects);
  }, [filteredProjects]);

  // Prepare data for charts
  const budgetComparisonData = useMemo(() => {
    return filteredProjects.map(project => ({
      name: project.name.length > 20 ? `${project.name.substring(0, 20)}...` : project.name,
      budget: project.budget / 1000000000, // Convert to billions for readability
      spent: project.spent / 1000000000
    }));
  }, [filteredProjects]);

  const statusDistributionData = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    filteredProjects.forEach(project => {
      statusCounts[project.status] = (statusCounts[project.status] || 0) + 1;
    });
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count
    }));
  }, [filteredProjects]);

  // Handle filter reset
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      status: '',
      ministry: ''
    });
  };

  // Export projects data as CSV
  const exportAsCSV = () => {
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

    const rows = filteredProjects.map(project => [
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

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budeshi-projects-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
              
              <Button variant="outline" size="icon" onClick={exportAsCSV} title="Export as CSV">
                <DownloadIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
            <div className="p-3 bg-primary/10 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Budget</div>
              <div className="font-semibold text-lg">{formatCurrency(budgetStats.totalBudget)}</div>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Spent</div>
              <div className="font-semibold text-lg">{formatCurrency(budgetStats.totalSpent)}</div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <div className="text-sm text-muted-foreground">Remaining Budget</div>
              <div className="font-semibold text-lg">{formatCurrency(budgetStats.remainingBudget)}</div>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <div className="text-sm text-muted-foreground">Completion</div>
              <div className="font-semibold text-lg">{budgetStats.completionPercentage.toFixed(1)}%</div>
            </div>
          </div>
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
            <div className="space-y-4">
              {filteredProjects.length > 0 ? (
                filteredProjects.map(project => (
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
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No projects match your filters. Try adjusting your search criteria.
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {filteredProjects.length > 0 ? (
                <>
                  <div>
                    <h3 className="font-medium mb-4">Budget vs Spent (Billions ₦)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={budgetComparisonData}>
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(value: number) => [`₦${value.toFixed(2)} Billion`, undefined]}
                        />
                        <Legend />
                        <Bar dataKey="budget" name="Budget" fill="#8884d8" />
                        <Bar dataKey="spent" name="Spent" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Projects by Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusDistributionData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label={(entry) => entry.name}
                        >
                          {statusDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} projects`, undefined]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No data available for visualization. Try adjusting your filters.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectViewer;
