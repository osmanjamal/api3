import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Copy, AlertCircle } from 'lucide-react';
import { TRADING_PAIRS, LEVERAGE_OPTIONS } from '@/constants';
import type { BotConfig } from '@/types';
import { generateUUID } from '@/utils/helpers';

interface BotCreationFormProps {
  onSuccess?: (config: BotConfig) => void;
}

const BotCreationForm: React.FC<BotCreationFormProps> = ({ onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [botConfig, setBotConfig] = useState<BotConfig>({
    uuid: generateUUID(),
    name: '',
    pair: 'BTCUSDT',
    leverage: 10,
    maxMargin: '1000',
    maxInvestment: 30,
    status: 'STOPPED',
    webhookUrl: `${window.location.origin}/webhook/`,
    secret: generateUUID()
  });

  useEffect(() => {
    setBotConfig(prev => ({
      ...prev,
      webhookUrl: `${window.location.origin}/webhook/${prev.uuid}`
    }));
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess?.(botConfig);
  };

  const renderStepOne = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Webhook URL</label>
        <div className="flex gap-2">
          <Input
            value={botConfig.webhookUrl}
            readOnly
            className="flex-1"
          />
          <Button 
            variant="outline"
            onClick={() => copyToClipboard(botConfig.webhookUrl)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Secret Key</label>
        <div className="flex gap-2">
          <Input
            value={botConfig.secret}
            readOnly
            className="flex-1"
          />
          <Button 
            variant="outline"
            onClick={() => copyToClipboard(botConfig.secret)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Alert variant="info">
        <AlertCircle className="h-4 w-4" />
        <p>Save these credentials. You'll need them to configure your trading signals.</p>
      </Alert>
    </div>
  );

  const renderStepTwo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Bot Name</label>
        <Input
          value={botConfig.name}
          onChange={(e) => setBotConfig({ ...botConfig, name: e.target.value })}
          placeholder="My Trading Bot"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Trading Pair</label>
        <Select
          value={botConfig.pair}
          onValueChange={(value) => setBotConfig({ ...botConfig, pair: value })}
        >
          {Object.entries(TRADING_PAIRS).map(([value, label]) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Leverage</label>
        <Select
          value={botConfig.leverage.toString()}
          onValueChange={(value) => setBotConfig({ ...botConfig, leverage: parseInt(value, 10) })}
        >
          {LEVERAGE_OPTIONS.map((value) => (
            <Select.Option key={value} value={value.toString()}>
              {value}x
            </Select.Option>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Max Investment (%)</label>
        <Input
          type="number"
          value={botConfig.maxInvestment}
          onChange={(e) => setBotConfig({ ...botConfig, maxInvestment: Number(e.target.value) })}
          min={1}
          max={100}
        />
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Trading Bot</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && renderStepOne()}
          {currentStep === 2 && renderStepTwo()}

          <div className="mt-6 flex justify-between">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Previous
              </Button>
            )}
            
            <div className="ml-auto">
              {currentStep < 2 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit">
                  Create Bot
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BotCreationForm;