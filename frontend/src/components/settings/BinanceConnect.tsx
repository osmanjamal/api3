import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import Button from '../common/Button';
import { CheckCircle, XCircle, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import WebSocketService from '../../services/websocket';

const BinanceConnect = () => {
    const navigate = useNavigate();
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [accountInfo, setAccountInfo] = useState(null);
    const [error, setError] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');

    // Check existing connection on component mount
    useEffect(() => {
        const checkExistingConnection = () => {
            const token = localStorage.getItem('binance_session');
            if (token) {
                try {
                    initializeConnection(token);
                } catch (err) {
                    console.error('Failed to restore connection:', err);
                    handleDisconnect();
                }
            }
        };

        checkExistingConnection();

        return () => {
            // Cleanup WebSocket connection on unmount
            WebSocketService.disconnect();
        };
    }, []);

    const initializeConnection = (token) => {
        try {
            // Initialize WebSocket connection
            WebSocketService.connect();

            // Subscribe to account updates
            WebSocketService.subscribe('account', handleAccountUpdate);
            WebSocketService.subscribe('connection', handleConnectionStatus);

            setIsConnected(true);
            setConnectionStatus('connected');

            // Store connection info
            localStorage.setItem('binance_session', token);
        } catch (error) {
            setError('Failed to initialize connection');
            setConnectionStatus('error');
        }
    };

    const handleConnect = () => {
        setIsConnecting(true);
        setError(null);

        // Configure popup window
        const width = 500;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        // Open Binance authorization window
        const authWindow = window.open(
            'https://accounts.binance.com/oauth/authorize',
            'BinanceAuth',
            `width=${width},height=${height},left=${left},top=${top},status=yes,scrollbars=yes`
        );

        // Handle message from popup
        const handleAuthMessage = async (event) => {
            // Verify origin matches expected Binance domain
            if (event.origin === "https://accounts.binance.com") {
                try {
                    const { token, error } = event.data;

                    if (error) {
                        throw new Error(error);
                    }

                    if (token) {
                        // Initialize connection with received token
                        await initializeConnection(token);
                        
                        // Close auth window
                        if (authWindow) {
                            authWindow.close();
                        }

                        setIsConnecting(false);
                        navigate('/dashboard');
                    }
                } catch (err) {
                    setError(err.message || 'Failed to connect to Binance');
                    setIsConnecting(false);
                    setConnectionStatus('error');
                }
            }
        };

        // Add message listener
        window.addEventListener('message', handleAuthMessage);

        // Cleanup function
        return () => {
            window.removeEventListener('message', handleAuthMessage);
            if (authWindow) {
                authWindow.close();
            }
        };
    };

    const handleDisconnect = () => {
        try {
            // Clear stored session
            localStorage.removeItem('binance_session');
            
            // Close WebSocket connection
            WebSocketService.disconnect();
            
            // Reset state
            setIsConnected(false);
            setAccountInfo(null);
            setConnectionStatus('disconnected');
            
            navigate('/binance-connect');
        } catch (error) {
            setError('Failed to disconnect properly');
        }
    };

    const handleAccountUpdate = (data) => {
        setAccountInfo({
            totalWalletBalance: data.totalWalletBalance,
            availableBalance: data.availableBalance,
            totalUnrealizedProfit: data.totalUnrealizedProfit,
            updateTime: new Date().toLocaleString()
        });
    };

    const handleConnectionStatus = (status) => {
        setConnectionStatus(status);
        if (status === 'error') {
            setError('WebSocket connection lost. Attempting to reconnect...');
        }
    };

    const renderConnectionStatus = () => {
        switch (connectionStatus) {
            case 'connected':
                return (
                    <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span>Connected to Binance</span>
                    </div>
                );
            case 'connecting':
                return (
                    <div className="flex items-center text-yellow-600">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        <span>Connecting to Binance...</span>
                    </div>
                );
            case 'error':
                return (
                    <div className="flex items-center text-red-600">
                        <XCircle className="w-5 h-5 mr-2" />
                        <span>Connection Error</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center text-gray-600">
                        <LinkIcon className="w-5 h-5 mr-2" />
                        <span>Not Connected</span>
                    </div>
                );
        }
    };

    return (
        <Card>
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">Exchange Connection</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Connect your Binance account to start trading
                        </p>
                    </div>
                    {isConnected ? (
                        <Button 
                            variant="danger" 
                            onClick={handleDisconnect}
                            disabled={isConnecting}
                        >
                            Disconnect
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleConnect}
                            loading={isConnecting}
                            disabled={isConnecting}
                        >
                            Connect Binance
                        </Button>
                    )}
                </div>

                {error && (
                    <Alert type="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                <div className="mb-6">
                    {renderConnectionStatus()}
                </div>

                {isConnected && accountInfo && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-medium mb-4">Account Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Total Balance</p>
                                    <p className="font-medium">
                                        ${parseFloat(accountInfo.totalWalletBalance).toFixed(2)} USDT
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Available Balance</p>
                                    <p className="font-medium">
                                        ${parseFloat(accountInfo.availableBalance).toFixed(2)} USDT
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Unrealized PNL</p>
                                    <p className={`font-medium ${
                                        parseFloat(accountInfo.totalUnrealizedProfit) >= 0 
                                        ? 'text-green-600' 
                                        : 'text-red-600'
                                    }`}>
                                        ${parseFloat(accountInfo.totalUnrealizedProfit).toFixed(2)} USDT
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Last Update</p>
                                    <p className="font-medium">
                                        {accountInfo.updateTime}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!isConnected && (
                    <div className="space-y-4 mt-6">
                        <h3 className="font-medium">Connection Requirements:</h3>
                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                <span>Active Binance Account</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                <span>Futures Trading Enabled</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                <span>Two-Factor Authentication (2FA) Enabled</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default BinanceConnect;