import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import ActiveTrades from '../components/dashboard/ActiveTrades';
import Statistics from '../components/dashboard/Statistics';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import binanceService from '../services/binance';
import { CircleDollarSign, ArrowUpDown, TrendingUp, AlertCircle } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
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
        // Check if connected to Binance
        if (!binanceService.checkConnection()) {
            navigate('/binance-connect');
            return;
        }

        // Initialize with cached data if available
        const cachedAccount = binanceService.getCachedAccountInfo();
        if (cachedAccount) {
            updateDashboardData(cachedAccount);
        }

        // Set up WebSocket listeners
        const listeners = setupWebSocketListeners();

        // Cleanup listeners on unmount
        return () => {
            listeners.forEach(unsubscribe => unsubscribe());
        };
    }, [navigate]);

    const setupWebSocketListeners = () => {
        const listeners = [];

        // Listen for account updates
        listeners.push(
            binanceService.addEventListener('account', handleAccountUpdate),
            binanceService.addEventListener('price', handlePriceUpdate),
            binanceService.addEventListener('markPrice', handleMarkPriceUpdate),
            binanceService.addEventListener('error', handleError),
            binanceService.addEventListener('connection', handleConnectionStatus)
        );

        return listeners;
    };

    const handleAccountUpdate = (accountData) => {
        setLoading(false);
        updateDashboardData(accountData);
    };

    const handlePriceUpdate = (priceData) => {
        setDashboardData(prev => ({
            ...prev,
            prices: new Map(prev.prices).set(priceData.symbol, {
                bid: priceData.bid,
                ask: priceData.ask,
                time: priceData.time
            })
        }));
    };

    const handleMarkPriceUpdate = (markPriceData) => {
        // Update positions with new mark prices
        setDashboardData(prev => {
            const updatedPositions = prev.positions.map(position => {
                if (position.symbol === markPriceData.symbol) {
                    const newPnl = calculatePositionPnl(
                        position,
                        markPriceData.markPrice
                    );
                    return {
                        ...position,
                        markPrice: markPriceData.markPrice,
                        fundingRate: markPriceData.fundingRate,
                        unrealizedPnl: newPnl
                    };
                }
                return position;
            });

            return {
                ...prev,
                positions: updatedPositions,
                pnl: calculateTotalPnl(updatedPositions)
            };
        });
    };

    const handleError = (error) => {
        setError(error.message || 'An error occurred');
        setLoading(false);
    };

    const handleConnectionStatus = (status) => {
        if (status.status === 'disconnected') {
            setError('Connection to Binance lost. Reconnecting...');
        } else if (status.status === 'connected') {
            setError(null);
        }
    };

    const updateDashboardData = (accountData) => {
        setDashboardData(prev => ({
            ...prev,
            balance: {
                total: parseFloat(accountData.totalWalletBalance),
                available: parseFloat(accountData.availableBalance),
                inTrade: calculateInTrade(accountData.positions)
            },
            positions: accountData.positions.map(enrichPosition)
        }));
    };

    const calculateInTrade = (positions) => {
        return positions.reduce((total, pos) => total + (pos.initialMargin || 0), 0);
    };

    const enrichPosition = (position) => {
        const price = dashboardData.prices.get(position.symbol);
        return {
            ...position,
            currentPrice: price ? price.bid : 0,
            unrealizedPnl: calculatePositionPnl(position, price?.bid)
        };
    };

    const calculatePositionPnl = (position, currentPrice) => {
        if (!currentPrice || !position.entryPrice) return 0;
        const multiplier = position.side === 'BUY' ? 1 : -1;
        return (currentPrice - position.entryPrice) * position.quantity * multiplier;
    };

    const calculateTotalPnl = (positions) => {
        const total = positions.reduce((sum, pos) => sum + (pos.unrealizedPnl || 0), 0);
        return {
            total,
            daily: calculatePeriodPnl(positions, '24h'),
            weekly: calculatePeriodPnl(positions, '7d')
        };
    };

    const calculatePeriodPnl = (positions, period) => {
        // Implementation for calculating period-specific PnL
        return 0; // Placeholder
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
                <Alert type="error">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {error}
                </Alert>
            </div>
        );
    }

    const stats = [
        {
            title: "Total Balance",
            value: `$${dashboardData.balance.total.toFixed(2)}`,
            icon: CircleDollarSign,
            change: calculateBalanceChange(dashboardData.balance.total),
        },
        {
            title: "Active Positions",
            value: dashboardData.positions.length,
            icon: ArrowUpDown,
            change: `${dashboardData.positions.length} positions`,
        },
        {
            title: "Total PnL",
            value: `$${dashboardData.pnl.total.toFixed(2)}`,
            icon: TrendingUp,
            change: `${dashboardData.pnl.daily >= 0 ? '+' : ''}${dashboardData.pnl.daily.toFixed(2)}% today`,
            trending: dashboardData.pnl.total >= 0
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index}>
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="bg-blue-50 rounded-lg p-3">
                                        <stat.icon className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-500">{stat.title}</p>
                                        <h3 className="text-xl font-semibold">{stat.value}</h3>
                                        <p className={`text-sm ${
                                            stat.trending ? 'text-green-600' : 'text-gray-500'
                                        }`}>
                                            {stat.change}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Performance Chart */}
                <Card className="h-[400px]">
                    <PerformanceChart data={dashboardData.pnl} />
                </Card>

                {/* Active Trades */}
                <ActiveTrades 
                    trades={dashboardData.positions}
                    onCloseTrade={handleCloseTrade}
                />

                {/* Statistics */}
                <Statistics stats={{
                    totalPnL: dashboardData.pnl.total,
                    winRate: calculateWinRate(dashboardData.positions),
                    averageWin: calculateAverageWin(dashboardData.positions),
                    averageLoss: calculateAverageLoss(dashboardData.positions)
                }} />
            </div>
        </div>
    );
};

export default Dashboard;