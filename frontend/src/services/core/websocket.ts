// src/services/core/websocket.ts
import EventEmitter from 'events';
import type { WebSocketConfig, WebSocketMessage } from '@/types';

export class WebSocketService extends EventEmitter {
  private ws: WebSocket | null = null;
  private url: string = '';
  private config: WebSocketConfig;
  private isConnected: boolean = false;
  private reconnectAttempt: number = 0;
  private pingInterval: NodeJS.Timeout | null = null;
  private messageQueue: Map<string, Function[]> = new Map();

  constructor(config: WebSocketConfig) {
    super();
    this.config = config;
  }

  public async connect(url: string): Promise<void> {
    this.url = url;
    return this.createConnection();
  }

  private async createConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);
        
        this.ws.onopen = () => {
          this.isConnected = true;
          this.reconnectAttempt = 0;
          this.setupPing();
          this.emit('connected');
          resolve();
        };

        this.ws.onclose = this.handleClose.bind(this);
        this.ws.onerror = (error) => {
          this.emit('error', error);
          reject(error);
        };
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
      if (this.isConnected && this.ws) {
        this.send({ type: 'ping' });
      }
    }, this.config.pingInterval);
  }

  private async handleMessage(event: MessageEvent): Promise<void> {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      this.emit(message.type, message.data);
      
      const handlers = this.messageQueue.get(message.type);
      if (handlers) {
        handlers.forEach(handler => handler(message.data));
      }
    } catch (error) {
      this.emit('error', error);
    }
  }

  private handleClose(): void {
    this.isConnected = false;
    this.emit('disconnected');
    
    if (this.shouldReconnect()) {
      this.attemptReconnect();
    }
  }

  private shouldReconnect(): boolean {
    return this.reconnectAttempt < this.config.reconnectAttempts;
  }

  private async attemptReconnect(): Promise<void> {
    this.reconnectAttempt++;
    const delay = this.config.reconnectDelay * Math.pow(2, this.reconnectAttempt - 1);

    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      await this.createConnection();
    } catch (error) {
      this.emit('error', error);
    }
  }

  public send(data: any): void {
    if (!this.ws || !this.isConnected) {
      throw new Error('WebSocket is not connected');
    }

    try {
      this.ws.send(JSON.stringify(data));
    } catch (error) {
      this.emit('error', error);
    }
  }

  public subscribe<T>(type: string, callback: (data: T) => void): () => void {
    if (!this.messageQueue.has(type)) {
      this.messageQueue.set(type, []);
    }
    
    this.messageQueue.get(type)?.push(callback);

    return () => {
      const handlers = this.messageQueue.get(type);
      if (handlers) {
        const index = handlers.indexOf(callback);
        if (index !== -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  public getStatus(): boolean {
    return this.isConnected;
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

    this.messageQueue.clear();
  }
}