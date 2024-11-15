import React, { useEffect, useState } from 'react';
import { Alert } from '../ui/Alert';
import { binanceService } from '../../services/api/binance';
import { errorService } from '../../services/core/error';
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';

interface ConnectionState {
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
    reconnectAttempt: number;
}

const ConnectionStatus: React.FC = () => {
    const [state, setState] = useState<ConnectionState>({
        isConnected: binanceService.isConnected(),
        isConnecting: false,
        error: null,
        reconnectAttempt: 0
    });

    useEffect(() => {
        const errorUnsubscribe = errorService.subscribe(error => {
            if (error.type === 'CONNECTION' || error.type === 'WEBSOCKET') {
                setState(prev => ({
                    ...prev,
                    error: error.message,
                    isConnected: false
                }));
            }
        });

        return () => {
            errorUnsubscribe();
        };
    }, []);

    const getStatusIcon = () => {
        if (state.isConnecting) {
            return <RefreshCw className="h-5 w-5 animate-spin text-yellow-500" />;
        }
        if (state.isConnected) {
            return <Wifi className="h-5 w-5 text-green-500" />;
        }
        if (state.error) {
            return <AlertTriangle className="h-5 w-5 text-red-500" />;
        }
        return <WifiOff className="h-5 w-5 text-gray-500" />;
    };

    const getStatusMessage = () => {
        if (state.isConnecting) {
            return `Connecting${state.reconnectAttempt > 0 ? ` (Attempt ${state.reconnectAttempt})` : ''}...`;
        }
        if (state.isConnected) {
            return 'Connected to Binance';
        }
        if (state.error) {
            return state.error;
        }
        return 'Disconnected from Binance';
    };

    const getAlertVariant = () => {
        if (state.isConnected) return 'success';
        if (state.isConnecting) return 'warning';
        if (state.error) return 'error';
        return 'info';
    };

    if (state.isConnected && !state.error) {
        return (
            <div className="flex items-center gap-2 text-green-600 px-4 py-2">
                <Wifi className="h-4 w-4" />
                <span className="text-sm font-medium">Connected</span>
            </div>
        );
    }

    return (
        <Alert 
            type={getAlertVariant()}
            className="m-4"
        >
            <div className="flex items-center gap-3">
                {getStatusIcon()}
                <div className="flex-1">
                    <p className="text-sm font-medium">
                        {getStatusMessage()}
                    </p>
                </div>
            </div>
        </Alert>
    );
};

export default ConnectionStatus;