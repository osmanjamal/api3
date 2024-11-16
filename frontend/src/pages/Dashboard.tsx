// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import ActiveTrades from '@/components/dashboard/ActiveTrades';
import Statistics from '@/components/dashboard/Statistics';
import MarketOverview from '@/components/dashboard/MarketOverview';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { binanceService } from '@/services/api';
import { TRADING_PAIRS } from '@/constants';
import type { DashboardData } from '@/types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    balance: {
      total: 0,
      available: 0,
      inTrade: 0
    },
    positions: [],
    prices: new Map(),
    pnl: {
      total: 0,
      daily: 0,
      weekly: 0
    }
  });

  useEffect(() => {
    if (!binanceService.isConnected()) {
      navigate('/binance-connect');
      return;
    }

    const unsubscribes = [
      binanceService.onAccountUpdate(handleAccountUpdate),
      binanceService.onMarketUpdate(handleMarketUpdate),
      binanceService.onPositionUpdate(handlePositionUpdate)
    ];

    const initialData = binanceService.getAccountData();
    if (initialData) {
      handleAccountUpdate(initialData);
    }

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [navigate]);

  const handleAccountUpdate = (data: any) => {
    setDashboardData(prev => ({
      ...prev,
      balance: {
        total: data.totalWalletBalance,
        available: data.availableBalance,
        inTrade: data.totalInitialMargin
      }
    }));
    setLoading(false);
  };

  const handleMarketUpdate = (data: any) => {
    setDashboardData(prev => ({
      ...prev,
      prices: new Map(prev.prices).set(data.symbol, data)
    }));
  };

  const handlePositionUpdate = (data: any) => {
    setDashboardData(prev => ({
      ...prev,
      positions: prev.positions.map(pos => 
        pos.symbol === data.symbol ? data : pos
      )
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Alert variant="destructive">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Statistics 
          stats={{
            totalPnL: dashboardData.pnl.total,
            winRate: 65, // Example value
            averageWin: 120,
            averageLoss: -80
          }}
        />

        <Card className="h-[400px]">
          <PerformanceChart data={[]} /> {/* TODO: Add performance data */}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActiveTrades trades={dashboardData.positions} />
          </div>
          <div>
            <MarketOverview symbols={Object.keys(TRADING_PAIRS)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;