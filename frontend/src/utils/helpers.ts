export const formatCurrency = (value, currency = 'USD', decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
};

export const formatPercentage = (value, decimals = 2) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const calculatePnL = (entryPrice, currentPrice, quantity, side) => {
    const difference = currentPrice - entryPrice;
    const pnl = side === 'BUY' ? difference * quantity : -difference * quantity;
    return pnl;
};

export const calculatePercentageChange = (oldValue, newValue) => {
    return ((newValue - oldValue) / oldValue) * 100;
};

export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const validateWebhookPayload = (payload) => {
    const requiredFields = [
        'secret',
        'timestamp',
        'trigger_price',
        'action',
        'bot_uuid'
    ];

    return requiredFields.every(field => payload.hasOwnProperty(field));
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const retryOperation = async (operation, maxRetries = 3, delayMs = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await sleep(delayMs * Math.pow(2, i));
        }
    }
};