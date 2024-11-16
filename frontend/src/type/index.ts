// Account Types
export interface AccountData {
    totalWalletBalance: number;
    availableBalance: number;
    positions: Position[];
    updateTime: number;
}

// Trading Types
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

export interface Trade {
    id: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    price: number;
    quantity: number;
    timestamp: number;
    status: 'PENDING' | 'EXECUTED' | 'CANCELLED' | 'FAILED';
}

// Bot Types
export interface Bot {
    uuid: string;
    name: string;
    pair: string;
    leverage: number;
    maxMargin: string;
    maxInvestment: number;
    status: 'ACTIVE' | 'PAUSED' | 'STOPPED';
}

// Market Types
export interface MarketData {
    symbol: string;
    price: number;
    volume: number;
    change: number;
    timestamp: number;
}

// WebSocket Types
export interface WebSocketConfig {
    reconnectAttempts: number;
    reconnectDelay: number;
    pingInterval: number;
}

export interface WebSocketMessage {
    type: string;
    data: any;
    id?: number;
}

// Authentication Types
export interface BinanceCredentials {
    token: string;
    expires: number;
}

// Component Props Types
export interface AlertProps {
    type?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    message?: string;
    className?: string;
    onClose?: () => void;
}

export interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
    children: React.ReactNode;
}

export interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    headerClassName?: string;
    bodyClassName?: string;
    footer?: React.ReactNode;
    footerClassName?: string;
}

// Error Handling Types
export interface ErrorDetails {
    message: string;
    type: 'CONNECTION' | 'AUTHENTICATION' | 'WEBSOCKET' | 'API' | 'VALIDATION' | 'UNKNOWN';
    timestamp: number;
    data?: any;
}

// Service Types
export interface CacheConfig {
    defaultTTL: number;
    maxEntries: number;
    persistentStorage: boolean;
}

export interface CacheItem<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
}