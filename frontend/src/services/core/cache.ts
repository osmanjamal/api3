// src/services/api/websocket.ts
import type { WebSocketMessage } from '@/types';
import EventEmitter from 'events';

export class BaseWebSocketService extends EventEmitter {
 protected ws: WebSocket | null = null;
 protected url: string = '';
 protected isConnected: boolean = false;
 protected shouldReconnect: boolean = true;
 protected reconnectAttempts: number = 0;
 protected maxReconnectAttempts: number = 5;
 protected reconnectDelay: number = 1000;

 constructor() {
   super();
 }

 public async connect(url: string): Promise<void> {
   this.url = url;
   this.shouldReconnect = true;
   await this.createConnection();
 }

 protected async createConnection(): Promise<void> {
   try {
     return new Promise((resolve, reject) => {
       this.ws = new WebSocket(this.url);
       
       this.ws.onopen = () => {
         this.isConnected = true;
         this.reconnectAttempts = 0;
         this.emit('connected');
         resolve();
       };

       this.ws.onclose = this.handleClose.bind(this);
       this.ws.onerror = (error: Event) => {
         this.emit('error', error);
         reject(error);
       };
       this.ws.onmessage = this.handleMessage.bind(this);
     });
   } catch (error) {
     this.emit('error', error);
     throw error;
   }
 }

 protected handleClose(): void {
   this.isConnected = false;
   this.emit('disconnected');
   
   if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
     this.reconnectAttempts++;
     setTimeout(() => {
       this.createConnection();
     }, this.reconnectDelay * this.reconnectAttempts);
   }
 }

 protected handleMessage(event: MessageEvent): void {
   try {
     const message: WebSocketMessage = JSON.parse(event.data);
     this.emit(message.type, message.data);
   } catch (error) {
     this.emit('error', error);
   }
 }

 public send(data: any): void {
   if (!this.ws || !this.isConnected) {
     throw new Error('WebSocket is not connected');
   }
   this.ws.send(JSON.stringify(data));
 }

 public disconnect(): void {
   this.shouldReconnect = false;
   if (this.ws) {
     this.ws.close();
     this.ws = null;
   }
   this.isConnected = false;
 }

 public getStatus(): boolean {
   return this.isConnected;
 }
}