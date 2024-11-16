export interface FormatOptions {
    currency?: string;
    decimals?: number;
  }
  
  export const formatCurrency = (
    value: number,
    { currency = 'USD', decimals = 2 }: FormatOptions = {}
  ): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };
  
  export const formatPercentage = (value: number, decimals: number = 2): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
  };
  
  export const formatDate = (date: Date | string | number): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  export interface PnLParams {
    entryPrice: number;
    currentPrice: number;
    quantity: number;
    side: 'BUY' | 'SELL';
  }
  
  export const calculatePnL = ({
    entryPrice,
    currentPrice,
    quantity,
    side
  }: PnLParams): number => {
    const difference = currentPrice - entryPrice;
    return side === 'BUY' ? difference * quantity : -difference * quantity;
  };
  
  export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
    return ((newValue - oldValue) / oldValue) * 100;
  };
  
  export const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
  
  export interface WebhookPayload {
    secret: string;
    timestamp: number;
    trigger_price: number;
    action: string;
    bot_uuid: string;
  }
  
  export const validateWebhookPayload = (payload: Partial<WebhookPayload>): boolean => {
    const requiredFields: (keyof WebhookPayload)[] = [
      'secret',
      'timestamp',
      'trigger_price',
      'action',
      'bot_uuid'
    ];
  
    return requiredFields.every(field => payload.hasOwnProperty(field));
  };
  
  export const sleep = (ms: number): Promise<void> => 
    new Promise(resolve => setTimeout(resolve, ms));
  
  export type Operation<T> = () => Promise<T>;
  
  export const retryOperation = async <T>(
    operation: Operation<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await sleep(delayMs * Math.pow(2, i));
      }
    }
    throw new Error('Max retries reached');
  };