import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  Trash2, 
  AlertCircle, 
  Settings,
  ExternalLink,
  TrendingUp 
} from 'lucide-react';
import type { Bot } from '@/types';
import { formatCurrency } from '@/utils/helpers';

interface BotListProps {
  bots: Bot[];
  onStart?: (uuid: string) => void;
  onPause?: (uuid: string) => void;
  onDelete?: (uuid: string) => void;
  onSettings?: (uuid: string) => void;
}

const BotList: React.FC<BotListProps> = ({
  bots = [],
  onStart,
  onPause,
  onDelete,
  onSettings
}) => {
  const [expandedBot, setExpandedBot] = useState<string | null>(null);

  const getStatusColor = (status: string): string => {
    const colors = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'PAUSED': 'bg-yellow-100 text-yellow-800',
      'STOPPED': 'bg-red-100 text-red-800',
      'ERROR': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleCopyWebhook = (webhook: string) => {
    navigator.clipboard.writeText(webhook);
  };

  if (bots.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No bots created yet</p>
          <Button className="mt-4">
            Create Your First Bot
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {bots.map((bot) => (
        <Card key={bot.uuid}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">{bot.name}</h3>
                <p className="text-sm text-gray-500">{bot.pair}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bot.status)}`}>
                  {bot.status}
                </span>
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
                <p className="text-sm font-medium">{bot.totalTrades || 0}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {bot.status === 'ACTIVE' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPause?.(bot.uuid)}
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStart?.(bot.uuid)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSettings?.(bot.uuid)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete?.(bot.uuid)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpandedBot(expandedBot === bot.uuid ? null : bot.uuid)}
              >
                {expandedBot === bot.uuid ? 'Hide Details' : 'Show Details'}
              </Button>
            </div>

            {expandedBot === bot.uuid && (
              <div className="mt-6 space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium mb-2">Webhook Details</h4>
                    <div className="flex items-center justify-between">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {bot.webhookUrl}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyWebhook(bot.webhookUrl)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {bot.activePositions > 0 && (
                  <Alert variant="warning">
                    <TrendingUp className="h-4 w-4" />
                    <p>Active positions: {bot.activePositions}</p>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BotList;