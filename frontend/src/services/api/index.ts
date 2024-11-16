export * from './binance';
export * from './types';
export * from './websocket';
export { binanceService } from './binance';



// يمكن أيضاً عمل تصدير لثوابت أو أنواع إضافية إذا احتجنا
export const API_VERSION = 'v1';
export const BASE_URL = 'https://api.binance.com';

// إذا كنت تريد تصدير أنواع محددة
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// يمكنك أيضاً تصدير الثوابت المتعلقة بالـ API
export const API_ENDPOINTS = {
  SPOT: '/api/v3',
  FUTURES: '/fapi/v1',
  USER_DATA: '/api/v3/userDataStream'
} as const;