import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@components/ui/Card';
import { Alert } from '@components/ui/Alert';
import { Button } from '@components/ui/Button';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { binanceService } from '@services/api';

const BinanceConnect: React.FC = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // تحقق من وجود اتصال مسبق
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

    // تكوين نافذة المصادقة
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // فتح نافذة مصادقة Binance
    const authWindow = window.open(
      'https://accounts.binance.com/oauth/authorize',
      'BinanceAuth',
      `width=${width},height=${height},top=${top},left=${left},status=yes,scrollbars=yes`
    );

    // معالجة الرسائل من النافذة المنبثقة
    const handleAuthMessage = async (event: MessageEvent) => {
      try {
        if (event.origin === 'https://accounts.binance.com') {
          const { token } = event.data;
          
          if (token) {
            await binanceService.connect(token);
            if (authWindow) {
              authWindow.close();
            }
            navigate('/dashboard');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect');
      } finally {
        setIsConnecting(false);
        window.removeEventListener('message', handleAuthMessage);
      }
    };

    window.addEventListener('message', handleAuthMessage);
  };

  return (
    <Card className="max-w-lg mx-auto mt-10">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Connect to Binance</h2>
        
        {error && (
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
        )}

        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting ? 'Connecting...' : 'Connect with Binance'}
        </Button>

        <div className="mt-6 space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            <span>Secure OAuth Authentication</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            <span>No API Keys Required</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            <span>Direct Connection to Binance</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BinanceConnect;