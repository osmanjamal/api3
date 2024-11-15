export const TRADING_PAIRS = {
    'BTCUSDT': 'Bitcoin',
    'ETHUSDT': 'Ethereum',
    'BNBUSDT': 'Binance Coin',
    'SOLUSDT': 'Solana',
    'ADAUSDT': 'Cardano',
    'DOGEUSDT': 'Dogecoin'
};

export const ORDER_SIDES = {
    BUY: 'BUY',
    SELL: 'SELL'
};

export const ORDER_TYPES = {
    MARKET: 'MARKET',
    LIMIT: 'LIMIT',
    STOP: 'STOP',
    TAKE_PROFIT: 'TAKE_PROFIT'
};

export const BOT_STATUS = {
    ACTIVE: 'ACTIVE',
    PAUSED: 'PAUSED',
    STOPPED: 'STOPPED',
    ERROR: 'ERROR'
};

export const TRADE_STATUS = {
    PENDING: 'PENDING',
    EXECUTED: 'EXECUTED',
    CLOSED: 'CLOSED',
    CANCELED: 'CANCELED',
    FAILED: 'FAILED'
};

export const LEVERAGE_OPTIONS = [
    1, 2, 3, 5, 10, 20, 25, 50, 75, 100, 125
];

export const MAX_POSITION_SIZE = 100; // Maximum position size as percentage of balance

export const WEBHOOK_TIMEOUT = 5000; // Webhook timeout in milliseconds

export const ERROR_MESSAGES = {
    BINANCE_CONNECTION: 'Failed to connect to Binance',
    INVALID_CREDENTIALS: 'Invalid API credentials',
    INSUFFICIENT_BALANCE: 'Insufficient balance',
    ORDER_FAILED: 'Failed to place order',
    WEBHOOK_TIMEOUT: 'Webhook request timed out',
    INVALID_PAYLOAD: 'Invalid webhook payload'
};

export const SUCCESS_MESSAGES = {
    BINANCE_CONNECTED: 'Successfully connected to Binance',
    ORDER_PLACED: 'Order successfully placed',
    POSITION_CLOSED: 'Position successfully closed',
    BOT_CREATED: 'Trading bot successfully created',
    SETTINGS_SAVED: 'Settings successfully saved'
};