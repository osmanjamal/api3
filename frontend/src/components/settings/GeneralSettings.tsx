import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import Button from '../common/Button';

const GeneralSettings = () => {
    const [settings, setSettings] = useState({
        defaultLeverage: 10,
        maxPositionSize: 30,
        stopLossPercentage: 2,
        takeProfitPercentage: 4,
        enableNotifications: true,
        tradingPairs: ['BTCUSDT', 'ETHUSDT']
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Save settings to local storage for now
            localStorage.setItem('tradingSettings', JSON.stringify(settings));
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-xl font-semibold mb-6">General Settings</h2>

                {error && (
                    <Alert type="error" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </Alert>
                )}

                {success && (
                    <Alert type="success" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <span>Settings saved successfully</span>
                    </Alert>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Default Leverage
                        </label>
                        <input
                            type="number"
                            name="defaultLeverage"
                            value={settings.defaultLeverage}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            min="1"
                            max="125"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Max Position Size (% of Balance)
                        </label>
                        <input
                            type="number"
                            name="maxPositionSize"
                            value={settings.maxPositionSize}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            min="1"
                            max="100"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Stop Loss (%)
                            </label>
                            <input
                                type="number"
                                name="stopLossPercentage"
                                value={settings.stopLossPercentage}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                step="0.1"
                                min="0.1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Take Profit (%)
                            </label>
                            <input
                                type="number"
                                name="takeProfitPercentage"
                                value={settings.takeProfitPercentage}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                step="0.1"
                                min="0.1"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="enableNotifications"
                                checked={settings.enableNotifications}
                                onChange={handleChange}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                Enable Trading Notifications
                            </span>
                        </label>
                    </div>
                </div>

                <div className="mt-6">
                    <Button
                        type="submit"
                        variant="primary"
                        loading={isLoading}
                        className="w-full"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save Settings
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default GeneralSettings;