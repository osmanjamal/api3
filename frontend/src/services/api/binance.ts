import { WebSocketService } from '../core/websocket';
import { CacheService } from '../core/cache';
import { ErrorService } from '../core/error';
import type { 
    AccountData, 
    MarketData, 
    Position,
    BinanceCredentials,
    WebSocketMessage 
} from './types';

class BinanceService {
    private ws: WebSocketService;
    private cache: CacheService;
    private error: ErrorService;
    private credentials: BinanceCredentials | null = null;

    constructor() {
        this.ws = new WebSocketService({
            reconnectAttempts: 5,
            reconnectDelay: 1000,
            pingInterval: 30000
        });

        this.cache = new CacheService();
        this.error = new ErrorService();

        // Restore session if exists
        this.restoreSession();
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
                this.clearSession();
            }
        }
    }

    private isSessionValid(): boolean {
        if (!this.credentials) return false;
        return Date.now() < this.credentials.expires;
    }

    public async connect(authWindow: Window): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const messageHandler = async (event: MessageEvent) => {
                try {
                    if (event.origin === window.location.origin) {
                        const { token, expires } = event.data;
                        if (token && expires) {
                            this.credentials = { token, expires };
                            localStorage.setItem('binance_credentials', 
                                JSON.stringify(this.credentials)
                            );
                            
                            await this.initializeConnection();
                            window.removeEventListener('message', messageHandler);
                            resolve(true);
                        }
                    }
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
            // Initialize WebSocket connection
            await this.ws.connect(
                `wss://stream.binance.com:9443/ws/${this.credentials.token}`
            );

            // Setup message handlers
            this.ws.onMessage(this.handleWebSocketMessage.bind(this));
            
            // Subscribe to necessary streams
            this.subscribeToStreams();

        } catch (error) {
            this.error.handleError(error, 'CONNECTION');
            throw error;
        }
    }

    private handleWebSocketMessage(message: WebSocketMessage): void {
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
    }

    private handleAccountUpdate(data: AccountData): void {
        this.cache.set('account', data, 5000); // Cache for 5 seconds
    }

    private handleMarketUpdate(data: MarketData): void {
        this.cache.set(`market_${data.symbol}`, data, 1000); // Cache for 1 second
    }

    private handlePositionUpdate(data: Position): void {
        const positions = this.cache.get<Position[]>('positions') || [];
        const updatedPositions = positions.map(p => 
            p.symbol === data.symbol ? data : p
        );
        this.cache.set('positions', updatedPositions, 2000); // Cache for 2 seconds
    }

    private subscribeToStreams(): void {
        this.ws.send({
            method: 'SUBSCRIBE',
            params: [
                'account',
                'market',
                'position'
            ],
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

    public onAccountUpdate(callback: (data: AccountData) => void): () => void {
        return this.ws.subscribe('account', callback);
    }

    public onMarketUpdate(callback: (data: MarketData) => void): () => void {
        return this.ws.subscribe('market', callback);
    }

    public onPositionUpdate(callback: (data: Position) => void): () => void {
        return this.ws.subscribe('position', callback);
    }

    public disconnect(): void {
        this.ws.disconnect();
        this.clearSession();
    }

    private clearSession(): void {
        this.credentials = null;
        localStorage.removeItem('binance_credentials');
        this.cache.clear();
    }

    public isConnected(): boolean {
        return this.ws.isConnected() && this.isSessionValid();
    }
}

export const binanceService = new BinanceService();