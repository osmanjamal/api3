import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import cacheService from '../../services/cacheService';
import binanceService from '../../services/binance';

const MarketOverview = ({ symbols }) => {
    const [marketData, setMarketData] = useState(new Map());

    useEffect(() => {
        // Load initial data from cache
        symbols.forEach(symbol => {
            const cachedData = cacheService.getMarketData(symbol);
            if (cachedData) {
                setMarketData(prev => new Map(prev).set(symbol, cachedData));
            }
        });

        // Subscribe to real-time updates
        const unsubscribe = binanceService.addEventListener('price', (data) => {
            const { symbol, price, volume, change } = data;
            if (symbols.includes(symbol)) {
                const updatedData = { price, volume, change, timestamp: Date.now() };
                
                // Update cache
                cacheService.cacheMarketData(symbol, updatedData);
                
                // Update state
                setMarketData(prev => new Map(prev).set(symbol, updatedData));
            }
        });

        return () => unsubscribe();
    }, [symbols]);

    const getPriceChangeClass = (change) => {
        if (!change) return 'text-gray-600';
        return change >= 0 ? 'text-green-600' : 'text-red-600';
    };

    return (
        <Card>
            <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Market Overview</h2>
                <div className="space-y-4">
                    {symbols.map(symbol => {
                        const data = marketData.get(symbol);
                        
                        return (
                            <div key={symbol} className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium">{symbol}</h3>
                                    {data && (
                                        <p className="text-sm text-gray-500">
                                            Vol: {Number(data.volume).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                                {data ? (
                                    <div className="text-right">
                                        <p className="font-medium">
                                            ${Number(data.price).toFixed(2)}
                                        </p>
                                        <p className={`text-sm ${getPriceChangeClass(data.change)}`}>
                                            {data.change >= 0 ? '+' : ''}
                                            {Number(data.change).toFixed(2)}%
                                        </p>
                                    </div>
                                ) : (
                                    <div className="animate-pulse">
                                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
};

export default MarketOverview;