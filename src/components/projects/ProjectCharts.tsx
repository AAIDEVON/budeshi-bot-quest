
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { ProjectInfo } from '@/lib/types';

interface ProjectChartsProps {
  projects: ProjectInfo[];
  budgetComparisonData: Array<{
    name: string;
    budget: number;
    spent: number;
  }>;
  statusDistributionData: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#EC7063'];

const ProjectCharts: React.FC<ProjectChartsProps> = ({ 
  projects, 
  budgetComparisonData, 
  statusDistributionData 
}) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No data available for visualization. Try adjusting your filters.
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
    </div>
  );
};

export default ProjectCharts;
