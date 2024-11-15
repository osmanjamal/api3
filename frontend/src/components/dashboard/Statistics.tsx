import React from 'react';
import { TrendingUp, TrendingDown, Percent, DollarSign } from 'lucide-react';
import Card from '../common/Card';

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center">
            <div className="bg-blue-50 p-3 rounded-lg">
                <Icon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                    {title}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-gray-900">
                    {value}
                </h3>
            </div>
        </div>
        {trend && (
            <div className="mt-4">
                <span className={`inline-flex items-center text-sm ${
                    trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                    {trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    {trendValue}
                </span>
            </div>
        )}
    </div>
);

const Statistics = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total PnL"
                value={`$${stats.totalPnL.toFixed(2)}`}
                icon={DollarSign}
                trend={stats.totalPnL >= 0 ? 'up' : 'down'}
                trendValue={`${stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toFixed(2)}%`}
            />
            <StatCard
                title="Win Rate"
                value={`${stats.winRate.toFixed(1)}%`}
                icon={Percent}
                trend={stats.winRate >= 50 ? 'up' : 'down'}
                trendValue={`${stats.winRate >= 50 ? '+' : '-'}${Math.abs(50 - stats.winRate).toFixed(1)}%`}
            />
            <StatCard
                title="Average Win"
                value={`$${stats.averageWin.toFixed(2)}`}
                icon={TrendingUp}
            />
            <StatCard
                title="Average Loss"
                value={`$${stats.averageLoss.toFixed(2)}`}
                icon={TrendingDown}
            />
        </div>
    );
};

export default Statistics;