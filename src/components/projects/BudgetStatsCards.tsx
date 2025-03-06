
import React from 'react';
import { formatCurrency } from '../../lib/chatbot';
import { BudgetStats } from '@/lib/types';

interface BudgetStatsCardsProps {
  budgetStats: BudgetStats;
}

const BudgetStatsCards: React.FC<BudgetStatsCardsProps> = ({ budgetStats }) => {
  return (
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
  );
};

export default BudgetStatsCards;
