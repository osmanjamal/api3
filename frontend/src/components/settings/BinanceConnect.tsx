// src/pages/BinanceConnect.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { binanceService } from '@/services/api';
import type { ConnectionState, AccountData } from '@/types';

const BinanceConnect: React.FC = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<AccountData | null>(null);

  useEffect(() => {
    const checkExistingConnection = async () => {
      if (binanceService.isConnected()) {
        navigate('/dashboard');
      }
    };

    checkExistingConnection();
  }, [navigate]);

  const handleConnect = () => {
    setIsConnecting(true);
    setError(null);

    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const authWindow = window.open(
      'https://accounts.binance.com/oauth/authorize',
      'BinanceAuth',
      `width=${width},height=${height},top=${top},left=${left},status=yes,scrollbars=yes`
    );

    if (!authWindow) {
      setError('Could not open authentication window');
      setIsConnecting(false);
      return;
    }

    const messageHandler = async (event: MessageEvent) => {
      try {
        if (event.origin !== window.location.origin) return;

        const { token } = event.data;
        if (token) {
          await binanceService.connect(authWindow);
          authWindow.close();
          navigate('/dashboard');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect');
      } finally {
        setIsConnecting(false);
        window.removeEventListener('message', messageHandler);
      }
    };

    window.addEventListener('message', messageHandler);
  };

  return (
    <Card className="max-w-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle>Connect to Binance</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {error}
          </Alert>
        )}

        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          loading={isConnecting}
          className="w-full mb-6"
        >
          {isConnecting ? 'Connecting...' : 'Connect with Binance'}
        </Button>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            <span>Secure OAuth Authentication</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            <span>No API Keys Required</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            <span>Direct Connection to Binance</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BinanceConnect;