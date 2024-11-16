import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { binanceService } from '@/services/api';
import { formatCurrency, formatPercentage } from '@/utils/helpers';
import type { MarketData } from '@/types';

interface MarketOverviewProps {
  symbols: string[];
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ symbols }) => {
  const [marketData, setMarketData] = useState<Map<string, MarketData>>(new Map());

  useEffect(() => {
    // Load initial data
    symbols.forEach(symbol => {
        const cachedData = binanceService.getMarketData(symbol);
if (cachedData) {
  setMarketData(prev => new Map(prev).set(symbol, cachedData));
}
});

// Subscribe to price updates
const unsubscribes = symbols.map(symbol => 
binanceService.onMarketUpdate(data => {
  if (symbols.includes(data.symbol)) {
    setMarketData(prev => new Map(prev).set(data.symbol, {
      ...data,
      timestamp: Date.now()
    }));
  }
})
);

return () => {
unsubscribes.forEach(unsubscribe => unsubscribe());
};
}, [symbols]);

const getPriceChangeClass = (change: number): string => {
if (!change) return 'text-gray-600';
return change >= 0 ? 'text-green-600' : 'text-red-600';
};

return (
<Card>
<CardHeader>
  <CardTitle>Market Overview</CardTitle>
</CardHeader>
<CardContent>
  <div className="space-y-4">
    {symbols.map(symbol => {
      const data = marketData.get(symbol);
      
      return (
        <div key={symbol} className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{symbol}</h3>
            {data && (
              <p className="text-sm text-gray-500">
                Vol: {formatCurrency(data.volume, { decimals: 0 })}
              </p>
            )}
          </div>
          {data ? (
            <div className="text-right">
              <p className="font-medium">
                {formatCurrency(data.price)}
              </p>
              <p className={`text-sm ${getPriceChangeClass(data.change)}`}>
                {formatPercentage(data.change)}
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
</CardContent>
</Card>
);
};

export default MarketOverview;