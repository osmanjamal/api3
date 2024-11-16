// src/components/layout/ConnectionStatus.tsx
import React, { useEffect } from 'react';
import { Alert } from '@/components/ui/alert';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';

const ConnectionStatus: React.FC = () => {
  const { isConnected, isConnecting, error, reconnectAttempt } = useConnectionStatus();

  const getStatusIcon = () => {
    if (isConnecting) {
      return <RefreshCw className="h-5 w-5 animate-spin text-yellow-500" />;
    }
    if (isConnected) {
      return <Wifi className="h-5 w-5 text-green-500" />;
    }
    if (error) {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
    return <WifiOff className="h-5 w-5 text-gray-500" />;
  };

  const getStatusMessage = () => {
    if (isConnecting) {
      return `Connecting${reconnectAttempt > 0 ? ` (Attempt ${reconnectAttempt})` : ''}...`;
    }
    if (isConnected) {
      return 'Connected to Binance';
    }
    if (error) {
      return error;
    }
    return 'Disconnected from Binance';
  };

  const getAlertVariant = () => {
    if (isConnected) return 'success';
    if (isConnecting) return 'warning';
    if (error) return 'destructive';
    return 'default';
  };

  if (isConnected && !error) {
    return (
      <div className="flex items-center gap-2 text-green-600 px-4 py-2">
        <Wifi className="h-4 w-4" />
        <span className="text-sm font-medium">Connected</span>
      </div>
    );
  }

  return (
    <Alert variant={getAlertVariant()} className="m-4">
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