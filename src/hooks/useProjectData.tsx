
import { useState, useEffect, useMemo } from 'react';
import { ProjectInfo, BudgetStats } from '../lib/types';
import { getAllProjects, exportProjectsAsCSV } from '../lib/database';
import { filterProjects, getUniqueFilterValues, calculateBudgetStats } from '../lib/projectUtils';

export const useProjectData = () => {
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{
    status: string;
    ministry: string;
  }>({
    status: '',
    ministry: ''
  });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await getAllProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const statuses = useMemo(() => getUniqueFilterValues(projects, 'status'), [projects]);
  const ministries = useMemo(() => getUniqueFilterValues(projects, 'ministry'), [projects]);

  const filteredProjects = useMemo(() => {
    return filterProjects(projects, searchTerm, {
      status: filters.status,
      ministry: filters.ministry
    });
  }, [projects, searchTerm, filters]);

  const budgetStats = useMemo((): BudgetStats => {
    return calculateBudgetStats(filteredProjects);
  }, [filteredProjects]);

  const budgetComparisonData = useMemo(() => {
    return filteredProjects.map(project => ({
      name: project.name.length > 20 ? `${project.name.substring(0, 20)}...` : project.name,
      budget: project.budget / 1000000000,
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

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      status: '',
      ministry: ''
    });
  };

  const handleExportAsCSV = async () => {
    try {
      const csv = await exportProjectsAsCSV();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `budeshi-projects-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  return {
    projects,
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
  };
};
