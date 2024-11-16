// src/components/dashboard/Statistics.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Percent, DollarSign } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/helpers';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  trendValue?: string;
}

interface StatisticsProps {
  stats: {
    totalPnL: number;
    winRate: number;
    averageWin: number;
    averageLoss: number;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendValue }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center">
        <div className="bg-blue-50 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="mt-1 text-xl font-semibold">{value}</h3>
          {trendValue && (
            <p className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trendValue}
            </p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const Statistics: React.FC<StatisticsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total PnL"
        value={formatCurrency(stats.totalPnL)}
        icon={DollarSign}
        trend={stats.totalPnL >= 0 ? 'up' : 'down'}
        trendValue={formatPercentage(stats.totalPnL)}
      />
      <StatCard
        title="Win Rate"
        value={`${stats.winRate.toFixed(1)}%`}
        icon={Percent}
        trend={stats.winRate >= 50 ? 'up' : 'down'}
        trendValue={`${Math.abs(50 - stats.winRate).toFixed(1)}% from average`}
      />
      <StatCard
        title="Average Win"
        value={formatCurrency(stats.averageWin)}
        icon={TrendingUp}
      />
      <StatCard
        title="Average Loss"
        value={formatCurrency(Math.abs(stats.averageLoss))}
        icon={TrendingDown}
      />
    </div>
  );
};

export default Statistics;