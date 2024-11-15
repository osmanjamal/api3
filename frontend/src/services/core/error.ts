export type ErrorType = 
    | 'CONNECTION'
    | 'WEBSOCKET'
    | 'CACHE'
    | 'API'
    | 'VALIDATION'
    | 'AUTHENTICATION'
    | 'UNKNOWN';

export interface ErrorDetails {
    message: string;
    type: ErrorType;
    timestamp: number;
    data?: any;
    stack?: string;
}

interface ErrorListener {
    (error: ErrorDetails): void;
}

export class ErrorService {
    private listeners: Set<ErrorListener> = new Set();
    private errorLog: ErrorDetails[] = [];
    private readonly maxLogSize = 100;

    public handleError(error: Error | string | any, type: ErrorType = 'UNKNOWN'): void {
        const errorDetails: ErrorDetails = {
            message: this.getErrorMessage(error),
            type,
            timestamp: Date.now(),
            data: error,
            stack: error instanceof Error ? error.stack : undefined
        };

        this.logError(errorDetails);
        this.notifyListeners(errorDetails);
    }

    private getErrorMessage(error: Error | string | any): string {
        if (error instanceof Error) {
            return error.message;
        }
        if (typeof error === 'string') {
            return error;
        }
        return 'An unknown error occurred';
    }

    private logError(error: ErrorDetails): void {
        this.errorLog.unshift(error);
        
        // Maintain log size limit
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog = this.errorLog.slice(0, this.maxLogSize);
        }

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error(`[${error.type}]`, error);
        }
    }

    private notifyListeners(error: ErrorDetails): void {
        this.listeners.forEach(listener => {
            try {
                listener(error);
            } catch (err) {
                console.error('Error in error listener:', err);
            }
        });
    }

    public subscribe(listener: ErrorListener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    public getRecentErrors(): ErrorDetails[] {
        return [...this.errorLog];
    }

    public clearLog(): void {
        this.errorLog = [];
    }
}

export const errorService = new ErrorService();