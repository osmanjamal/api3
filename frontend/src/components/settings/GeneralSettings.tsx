// src/components/settings/GeneralSettings.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { TRADING_PAIRS, LEVERAGE_OPTIONS } from '@/constants';
import type { GeneralSettings as GeneralSettingsType } from '@/types';

interface Props {
  onSave?: (settings: GeneralSettingsType) => Promise<void>;
}

const GeneralSettings: React.FC<Props> = ({ onSave }) => {
  const [settings, setSettings] = useState<GeneralSettingsType>({
    defaultLeverage: 10,
    maxPositionSize: 30,
    stopLossPercentage: 2,
    takeProfitPercentage: 4,
    enableNotifications: true,
    tradingPairs: ['BTCUSDT', 'ETHUSDT']
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onSave?.(settings);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">{error}</Alert>
          )}

          {success && (
            <Alert variant="success">Settings saved successfully</Alert>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Default Leverage</label>
            <Select
              value={settings.defaultLeverage.toString()}
              onValueChange={(value) => 
                setSettings(prev => ({ ...prev, defaultLeverage: parseInt(value) }))
              }
            >
              {LEVERAGE_OPTIONS.map((value) => (
                <Select.Option key={value} value={value.toString()}>
                  {value}x
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Max Position Size (%)</label>
            <Input
              type="number"
              value={settings.maxPositionSize}
              onChange={(e) => 
                setSettings(prev => ({ ...prev, maxPositionSize: parseInt(e.target.value) }))
              }
              min={1}
              max={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stop Loss (%)</label>
            <Input
              type="number"
              value={settings.stopLossPercentage}
              onChange={(e) => 
                setSettings(prev => ({ ...prev, stopLossPercentage: parseFloat(e.target.value) }))
              }
              step={0.1}
              min={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Take Profit (%)</label>
            <Input
              type="number"
              value={settings.takeProfitPercentage}
              onChange={(e) => 
                setSettings(prev => ({ ...prev, takeProfitPercentage: parseFloat(e.target.value) }))
              }
              step={0.1}
              min={0.1}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Enable Notifications</label>
              <Switch
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, enableNotifications: checked }))
                }
              />
            </div>
          </div>

          <Button type="submit" className="w-full" loading={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;