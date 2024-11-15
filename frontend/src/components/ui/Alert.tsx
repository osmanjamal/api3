import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

export interface AlertProps {
    type?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    message?: string;
    children?: React.ReactNode;
    className?: string;
    onClose?: () => void;
}

const variants = {
    info: {
        containerClass: 'bg-blue-50 border-blue-200 text-blue-800',
        iconClass: 'text-blue-500',
        Icon: Info
    },
    success: {
        containerClass: 'bg-green-50 border-green-200 text-green-800',
        iconClass: 'text-green-500',
        Icon: CheckCircle
    },
    warning: {
        containerClass: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        iconClass: 'text-yellow-500',
        Icon: AlertCircle
    },
    error: {
        containerClass: 'bg-red-50 border-red-200 text-red-800',
        iconClass: 'text-red-500',
        Icon: XCircle
    }
};

export const Alert: React.FC<AlertProps> = ({
    type = 'info',
    title,
    message,
    children,
    className = '',
    onClose
}) => {
    const { containerClass, iconClass, Icon } = variants[type];

    return (
        <div className={`flex p-4 rounded-lg border ${containerClass} ${className}`}>
            <div className="flex-shrink-0">
                <Icon className={`h-5 w-5 ${iconClass}`} />
            </div>
            <div className="ml-3 flex-grow">
                {title && (
                    <h3 className="text-sm font-medium">
                        {title}
                    </h3>
                )}
                {message && (
                    <div className="text-sm mt-1">
                        {message}
                    </div>
                )}
                {children}
            </div>
            {onClose && (
                <button
                    type="button"
                    className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-offset-2 p-1.5 inline-flex h-8 w-8 items-center justify-center"
                    onClick={onClose}
                >
                    <span className="sr-only">Close</span>
                    <XCircle className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};