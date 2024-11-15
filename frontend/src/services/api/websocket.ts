import { ErrorService } from './error';
import type { WebSocketConfig } from '../api/types';

export class WebSocketService {
    private ws: WebSocket | null = null;
    private config: WebSocketConfig;
    private error: ErrorService;
    private isConnected: boolean = false;
    private reconnectAttempt: number = 0;
    private listeners: Map<string, Set<Function>> = new Map();
    private pingInterval: NodeJS.Timeout | null = null;

    constructor(config: WebSocketConfig) {
        this.config = config;
        this.error = new ErrorService();
    }

    public async connect(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(url);

                this.ws.onopen = () => {
                    this.isConnected = true;
                    this.reconnectAttempt = 0;
                    this.setupPing();
                    resolve();
                };

                this.ws.onclose = this.handleClose.bind(this);
                this.ws.onerror = this.handleError.bind(this);
                this.ws.onmessage = this.handleMessage.bind(this);

            } catch (error) {
                reject(error);
            }
        });
    }

    private setupPing(): void {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }

        this.pingInterval = setInterval(() => {
            if (this.isConnected) {
                this.send({ type: 'ping' });
            }
        }, this.config.pingInterval);
    }

    public disconnect(): void {
        if (this.ws) {
            this.isConnected = false;
            this.ws.close();
            this.ws = null;
        }

        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    public send(data: any): void {
        if (!this.ws || !this.isConnected) {
            throw new Error('WebSocket is not connected');
        }

        try {
            this.ws.send(JSON.stringify(data));
        } catch (error) {
            this.error.handleError(error, 'WEBSOCKET_SEND');
        }
    }

    private handleMessage(event: MessageEvent): void {
        try {
            const message = JSON.parse(event.data);
            const listeners = this.listeners.get(message.type);
            
            if (listeners) {
                listeners.forEach(listener => listener(message.data));
            }
        } catch (error) {
            this.error.handleError(error, 'WEBSOCKET_MESSAGE');
        }
    }

    private handleError(event: Event): void {
        this.error.handleError(event, 'WEBSOCKET_ERROR');
    }

    private handleClose(event: CloseEvent): void {
        this.isConnected = false;
        
        if (this.shouldReconnect()) {
            this.attemptReconnect();
        }
    }

    private shouldReconnect(): boolean {
        return this.reconnectAttempt < this.config.reconnectAttempts;
    }

    private attemptReconnect(): void {
        this.reconnectAttempt++;
        const delay = this.config.reconnectDelay * Math.pow(2, this.reconnectAttempt - 1);

        setTimeout(() => {
            if (this.ws?.url) {
                this.connect(this.ws.url)
                    .catch(error => this.error.handleError(error, 'WEBSOCKET_RECONNECT'));
            }
        }, delay);
    }

    public subscribe(type: string, callback: Function): () => void {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }

        this.listeners.get(type)!.add(callback);

        return () => {
            const listeners = this.listeners.get(type);
            if (listeners) {
                listeners.delete(callback);
            }
        };
    }

    public getStatus(): boolean {
        return this.isConnected;
    }
}