import React from 'react';
import { useNavigate } from 'react-router-dom';
import BotCreationForm from '../components/bot/BotCreationForm';
import { Alert } from '../components/common/Alert';
import binanceService from '../services/binance';

const BotCreation = () => {
    const navigate = useNavigate();
    const isConnected = binanceService.checkConnection();

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-2xl mx-auto space-y-6">
                    <Alert
                        type="warning"
                        title="Connection Required"
                        message="Please connect your Binance account before creating a trading bot."
                    />
                    <button
                        onClick={() => navigate('/binance-connect')}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Connect Binance Account
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">Create New Trading Bot</h1>
                    <p className="text-gray-500 mt-2">
                        Configure your bot's settings and get your webhook credentials
                    </p>
                </div>

                <BotCreationForm 
                    onSuccess={(botConfig) => {
                        // In a real app, you might want to save this to local storage
                        // or sync with a backend
                        navigate('/dashboard');
                    }}
                />
            </div>
        </div>
    );
};

export default BotCreation;