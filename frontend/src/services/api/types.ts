export interface MarketData {
    symbol: string;
    price: number;
    volume: number;
    change: number;
    timestamp: number;
}

export interface AccountData {
    totalBalance: number;
    availableBalance: number;
    positions: Position[];
    updateTime: number;
}

export interface Position {
    symbol: string;
    entryPrice: number;
    markPrice: number;
    quantity: number;
    side: 'LONG' | 'SHORT';
    unrealizedPnl: number;
    liquidationPrice: number;
    leverage: number;
    marginType: 'ISOLATED' | 'CROSS';
}

export interface TradeHistory {
    id: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    price: number;
    quantity: number;
    realized: number;
    timestamp: number;
}

export interface WebSocketMessage {
    type: string;
    data: any;
}

export interface BinanceCredentials {
    token: string;
    expires: number;
}

export interface WebSocketConfig {
    reconnectAttempts: number;
    reconnectDelay: number;
    pingInterval: number;
}