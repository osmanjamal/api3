// src/services/api/binance.ts
import { WebSocketService } from '@/services/core/websocket';
import { CacheService } from '@/services/core/cache';
import { ErrorService } from '@/services/core/error';
import EventEmitter from 'events';
import type {
  AccountData,
  MarketData,
  Position,
  BinanceCredentials,
  WebSocketMessage,
  WebSocketConfig,
  CacheConfig
} from '@/types';

class BinanceService extends EventEmitter {
  private ws: WebSocketService;
  private cache: CacheService;
  private error: ErrorService;
  private credentials: BinanceCredentials | null = null;

  constructor() {
    super();
    
    const wsConfig: WebSocketConfig = {
      reconnectAttempts: 5,
      reconnectDelay: 1000,
      pingInterval: 30000
    };

    const cacheConfig: CacheConfig = {
      defaultTTL: 60000,
      maxEntries: 1000,
      persistentStorage: true
    };

    this.ws = new WebSocketService(wsConfig);
    this.cache = new CacheService(cacheConfig);
    this.error = new ErrorService();

    this.setupEventHandlers();
    this.restoreSession();
  }

  private setupEventHandlers(): void {
    this.ws.on('connected', () => this.emit('connected'));
    this.ws.on('disconnected', () => this.emit('disconnected'));
    this.ws.on('error', (error) => {
      this.error.handleError(error, 'WEBSOCKET');
      this.emit('error', error);
    });
  }

  private async restoreSession(): Promise<void> {
    const savedCredentials = localStorage.getItem('binance_credentials');
    if (savedCredentials) {
      try {
        this.credentials = JSON.parse(savedCredentials);
        if (this.isSessionValid()) {
          await this.initializeConnection();
        } else {
          this.clearSession();
        }
      } catch (error) {
        this.error.handleError(error, 'SESSION_RESTORE');
        this.clearSession();
      }
    }
  }

  private isSessionValid(): boolean {
    return Boolean(this.credentials && Date.now() < this.credentials.expires);
  }

  public async connect(authWindow: Window): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const messageHandler = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        try {
          const { token, expires } = event.data;
          if (!token || !expires) return;

          this.credentials = { token, expires };
          localStorage.setItem('binance_credentials', JSON.stringify(this.credentials));
          
          await this.initializeConnection();
          window.removeEventListener('message', messageHandler);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      };

      window.addEventListener('message', messageHandler);
    });
  }

  private async initializeConnection(): Promise<void> {
    if (!this.credentials) {
      throw new Error('No credentials available');
    }

    try {
      await this.ws.connect(`wss://stream.binance.com:9443/ws/${this.credentials.token}`);
      this.subscribeToStreams();
    } catch (error) {
      this.error.handleError(error, 'CONNECTION');
      throw error;
    }
  }

  private handleWebSocketMessage = (message: WebSocketMessage): void => {
    try {
      switch (message.type) {
        case 'account':
          this.handleAccountUpdate(message.data);
          break;
        case 'market':
          this.handleMarketUpdate(message.data);
          break;
        case 'position':
          this.handlePositionUpdate(message.data);
          break;
        case 'error':
          this.error.handleError(message.data, 'WEBSOCKET');
          break;
      }
    } catch (error) {
      this.error.handleError(error, 'MESSAGE_PROCESSING');
    }
  };

  private handleAccountUpdate = (data: AccountData): void => {
    this.cache.set('account', data, 5000);
    this.emit('accountUpdate', data);
  };

  private handleMarketUpdate = (data: MarketData): void => {
    this.cache.set(`market_${data.symbol}`, data, 1000);
    this.emit('marketUpdate', data);
  };

  private handlePositionUpdate = (data: Position): void => {
    const positions = this.cache.get<Position[]>('positions') || [];
    const updatedPositions = positions.map(p => 
      p.symbol === data.symbol ? data : p
    );
    this.cache.set('positions', updatedPositions, 2000);
    this.emit('positionUpdate', data);
  };

  private subscribeToStreams(): void {
    this.ws.send({
      method: 'SUBSCRIBE',
      params: ['account', 'market', 'position'],
      id: Date.now()
    });
  }

  public getAccountData(): AccountData | null {
    return this.cache.get('account');
  }

  public getMarketData(symbol: string): MarketData | null {
    return this.cache.get(`market_${symbol}`);
  }

  public getPositions(): Position[] {
    return this.cache.get('positions') || [];
  }

  public disconnect(): void {
    this.ws.disconnect();
    this.clearSession();
    this.emit('disconnected');
  }

  private clearSession(): void {
    this.credentials = null;
    localStorage.removeItem('binance_credentials');
    this.cache.clear();
  }

  public isConnected(): boolean {
    return this.ws.getStatus() && this.isSessionValid();
  }
}

export const binanceService = new BinanceService();