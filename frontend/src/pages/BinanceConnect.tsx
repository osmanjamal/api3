import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BinanceConnectComponent from '../components/settings/BinanceConnect';
import binanceService from '../services/binance';
import { Alert } from '../components/common/Alert';

const BinanceConnect = () => {
    const navigate = useNavigate();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const connection = binanceService.checkConnection();
        if (connection) {
            setIsConnected(true);
            navigate('/dashboard');
        }
    }, [navigate]);

    if (isConnected) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-xl w-full space-y-6">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Connect to Binance</h1>
                    <p className="text-gray-500 mt-2">
                        Connect your Binance account to start automated trading
                    </p>
                </div>

                {!isConnected && (
                    <Alert
                        type="info"
                        title="Connection Required"
                        message="Please connect your Binance account to continue using the trading bot."
                    />
                )}

                <BinanceConnectComponent 
                    onConnected={() => {
                        setIsConnected(true);
                        navigate('/dashboard');
                    }}
                />
            </div>
        </div>
    );
};

export default BinanceConnect;