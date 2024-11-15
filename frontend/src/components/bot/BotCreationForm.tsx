import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Copy, AlertCircle } from 'lucide-react';
import Button from '../common/Button';

const BotCreationForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [botConfig, setBotConfig] = useState({
        pair: 'BTCUSDT',
        leverage: 10,
        maxMargin: '1000',
        maxInvestment: 30,
        botName: '',
        uuid: '',
        secret: '',
        webhookUrl: ''
    });

    useEffect(() => {
        const uuid = generateUUID();
        const secret = generateSecret();
        setBotConfig(prev => ({
            ...prev,
            uuid,
            secret,
            webhookUrl: `${window.location.origin}/webhook/${uuid}`
        }));
    }, []);

    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const generateSecret = () => {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const renderStepOne = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Webhook URL
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={botConfig.webhookUrl}
                        readOnly
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button 
                        variant="secondary"
                        onClick={() => copyToClipboard(botConfig.webhookUrl)}
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secret Key (Keep this safe!)
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={botConfig.secret}
                        readOnly
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button 
                        variant="secondary"
                        onClick={() => copyToClipboard(botConfig.secret)}
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Alert type="info">
                <AlertCircle className="h-4 w-4" />
                <span>Save these credentials. You'll need them to configure your trading signals.</span>
            </Alert>
        </div>
    );

    const renderStepTwo = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bot Name
                </label>
                <input
                    type="text"
                    value={botConfig.botName}
                    onChange={(e) => setBotConfig({ ...botConfig, botName: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="My Trading Bot"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trading Pair
                </label>
                <select
                    value={botConfig.pair}
                    onChange={(e) => setBotConfig({ ...botConfig, pair: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="BTCUSDT">BTC/USDT</option>
                    <option value="ETHUSDT">ETH/USDT</option>
                    <option value="BNBUSDT">BNB/USDT</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leverage (1-125x)
                </label>
                <input
                    type="number"
                    value={botConfig.leverage}
                    onChange={(e) => setBotConfig({ ...botConfig, leverage: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="1"
                    max="125"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Investment (% of Balance)
                </label>
                <input
                    type="number"
                    value={botConfig.maxInvestment}
                    onChange={(e) => setBotConfig({ ...botConfig, maxInvestment: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="1"
                    max="100"
                />
            </div>
        </div>
    );

    const renderStepThree = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Signal Configuration
                </h3>
                <pre className="bg-gray-50 rounded-md p-4 overflow-auto">
                    {JSON.stringify({
                        secret: botConfig.secret,
                        timestamp: "{{timenow}}",
                        trigger_price: "{{strategy.order.price}}",
                        position_size: "{{strategy.position_size}}",
                        action: "{{strategy.order.action}}",
                        bot_uuid: botConfig.uuid
                    }, null, 2)}
                </pre>
            </div>

            <Alert type="info">
                <AlertCircle className="h-4 w-4" />
                <span>Use this configuration in your TradingView alerts.</span>
            </Alert>
        </div>
    );

    return (
        <Card>
            <div className="p-6">
                <div className="mb-8 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Create Trading Bot</h2>
                    <div className="text-sm text-gray-500">
                        Step {currentStep} of 3
                    </div>
                </div>

                {currentStep === 1 && renderStepOne()}
                {currentStep === 2 && renderStepTwo()}
                {currentStep === 3 && renderStepThree()}

                <div className="mt-8 flex justify-between">
                    {currentStep > 1 && (
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentStep(currentStep - 1)}
                        >
                            Previous
                        </Button>
                    )}
                    
                    <div className="ml-auto">
                        {currentStep < 3 ? (
                            <Button
                                onClick={() => setCurrentStep(currentStep + 1)}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button>
                                Create Bot
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default BotCreationForm;