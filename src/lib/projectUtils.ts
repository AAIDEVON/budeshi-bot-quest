
import { ProjectInfo } from "./types";

// Filter projects based on search term and filters
export const filterProjects = (
  projects: ProjectInfo[],
  searchTerm: string = "",
  filters: {
    status?: string;
    ministry?: string;
    minBudget?: number;
    maxBudget?: number;
  } = {}
): ProjectInfo[] => {
  return projects.filter((project) => {
    // Search term filtering
    const matchesSearch =
      searchTerm === "" ||
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.contractor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filtering
    const matchesStatus =
      !filters.status || project.status === filters.status;

    // Ministry filtering
    const matchesMinistry =
      !filters.ministry || project.ministry === filters.ministry;

    // Budget range filtering
    const matchesBudgetMin =
      !filters.minBudget || project.budget >= filters.minBudget;
    const matchesBudgetMax =
      !filters.maxBudget || project.budget <= filters.maxBudget;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesMinistry &&
      matchesBudgetMin &&
      matchesBudgetMax
    );
  });
};

// Get unique values for filter options
export const getUniqueFilterValues = (
  projects: ProjectInfo[],
  field: keyof ProjectInfo
): string[] => {
  const values = projects.map((project) => project[field] as string);
  return [...new Set(values)].sort();
};

// Calculate budget summary statistics
export const calculateBudgetStats = (projects: ProjectInfo[]) => {
  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
  const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const completionPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return {
    totalBudget,
    totalSpent,
    remainingBudget,
    completionPercentage: Math.min(completionPercentage, 100)
  };
};
