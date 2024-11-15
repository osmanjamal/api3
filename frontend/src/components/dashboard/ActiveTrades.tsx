import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const ActiveTrades = ({ trades = [], onCloseTrade }) => {
    const getStatusColor = (pnl) => {
        if (pnl > 0) return 'text-green-500';
        if (pnl < 0) return 'text-red-500';
        return 'text-gray-500';
    };

    const formatPnL = (pnl) => {
        const formatted = Math.abs(pnl).toFixed(2);
        return pnl >= 0 ? `+$${formatted}` : `-$${formatted}`;
    };

    return (
        <Card title="Active Trades">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Symbol
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Side
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Entry Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Current Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                PnL
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {trades.map((trade) => (
                            <tr key={trade.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {trade.symbol}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`flex items-center ${trade.side === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                                        {trade.side === 'BUY' ? (
                                            <ArrowUp className="h-4 w-4 mr-1" />
                                        ) : (
                                            <ArrowDown className="h-4 w-4 mr-1" />
                                        )}
                                        {trade.side}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${trade.entryPrice}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${trade.currentPrice}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={getStatusColor(trade.pnl)}>
                                        {formatPnL(trade.pnl)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <Button
                                        variant="danger"
                                        size="small"
                                        onClick={() => onCloseTrade(trade.id)}
                                    >
                                        Close
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {trades.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No active trades
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default ActiveTrades;