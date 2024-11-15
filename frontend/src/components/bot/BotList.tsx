import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { 
    Play, 
    Pause, 
    Trash2, 
    AlertCircle, 
    Settings,
    ExternalLink,
    TrendingUp 
} from 'lucide-react';
import Button from '../common/Button';
import { Alert } from '@/components/ui/alert';

const BotList = ({ bots = [] }) => {
    const [expandedBot, setExpandedBot] = useState(null);

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800';
            case 'PAUSED':
                return 'bg-yellow-100 text-yellow-800';
            case 'STOPPED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPnLColor = (pnl) => {
        if (pnl > 0) return 'text-green-600';
        if (pnl < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    const formatPnL = (pnl) => {
        const formatted = Math.abs(pnl).toFixed(2);
        return pnl >= 0 ? `+$${formatted}` : `-$${formatted}`;
    };

    const handleCopyWebhook = (webhook) => {
        navigator.clipboard.writeText(webhook);
    };

    return (
        <div className="space-y-6">
            {bots.map((bot) => (
                <Card key={bot.uuid}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-medium">{bot.name}</h3>
                                <p className="text-sm text-gray-500">{bot.pair}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bot.status)}`}>
                                    {bot.status}
                                </span>
                                <div className={`text-sm font-medium ${getPnLColor(bot.totalPnL)}`}>
                                    {formatPnL(bot.totalPnL)}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Leverage</p>
                                <p className="text-sm font-medium">{bot.leverage}x</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Max Investment</p>
                                <p className="text-sm font-medium">{bot.maxInvestment}%</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Trades</p>
                                <p className="text-sm font-medium">{bot.totalTrades}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                                {bot.status === 'ACTIVE' ? (
                                    <Button variant="secondary" size="small">
                                        <Pause className="h-4 w-4 mr-1" />
                                        Pause
                                    </Button>
                                ) : (
                                    <Button variant="secondary" size="small">
                                        <Play className="h-4 w-4 mr-1" />
                                        Start
                                    </Button>
                                )}
                                <Button variant="secondary" size="small">
                                    <Settings className="h-4 w-4 mr-1" />
                                    Settings
                                </Button>
                                <Button variant="danger" size="small">
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                </Button>
                            </div>
                            <Button 
                                variant="secondary" 
                                size="small"
                                onClick={() => setExpandedBot(expandedBot === bot.uuid ? null : bot.uuid)}
                            >
                                {expandedBot === bot.uuid ? 'Hide Details' : 'Show Details'}
                            </Button>
                        </div>

                        {expandedBot === bot.uuid && (
                            <div className="mt-6 space-y-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="text-sm font-medium mb-2">Webhook Details</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">URL:</span>
                                            <div className="flex items-center space-x-2">
                                                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                                    {bot.webhookUrl}
                                                </code>
                                                <Button 
                                                    variant="secondary" 
                                                    size="small"
                                                    onClick={() => handleCopyWebhook(bot.webhookUrl)}
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="text-sm font-medium mb-2">Performance Stats</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Win Rate</p>
                                            <p className="text-sm font-medium">{bot.winRate}%</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Average Trade</p>
                                            <p className="text-sm font-medium">${bot.averageTrade}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Best Trade</p>
                                            <p className="text-sm font-medium text-green-600">+${bot.bestTrade}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Worst Trade</p>
                                            <p className="text-sm font-medium text-red-600">-${bot.worstTrade}</p>
                                        </div>
                                    </div>
                                </div>

                                <Alert type="info">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>Last signal received: {bot.lastSignal || 'No signals yet'}</span>
                                </Alert>

                                {bot.activePositions > 0 && (
                                    <Alert type="warning">
                                        <TrendingUp className="h-4 w-4" />
                                        <span>Active positions: {bot.activePositions}</span>
                                    </Alert>
                                )}
                            </div>
                        )}
                    </div>
                </Card>
            ))}

            {bots.length === 0 && (
                <Card>
                    <div className="p-6 text-center">
                        <p className="text-gray-500">No bots created yet</p>
                        <Button variant="primary" className="mt-4">
                            Create Your First Bot
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default BotList;