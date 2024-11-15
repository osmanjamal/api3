import React from 'react';

export interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
    headerClassName?: string;
    bodyClassName?: string;
    footer?: React.ReactNode;
    footerClassName?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    title,
    children,
    className = '',
    headerClassName = '',
    bodyClassName = '',
    footer,
    footerClassName = '',
    onClick
}) => {
    const cardClasses = `
        bg-white rounded-lg border border-gray-200 shadow-sm 
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
        ${className}
    `;

    return (
        <div className={cardClasses} onClick={onClick}>
            {title && (
                <div className={`px-4 py-3 border-b border-gray-200 ${headerClassName}`}>
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                </div>
            )}
            <div className={`p-4 ${bodyClassName}`}>
                {children}
            </div>
            {footer && (
                <div className={`px-4 py-3 border-t border-gray-200 ${footerClassName}`}>
                    {footer}
                </div>
            )}
        </div>
    );
};

export const CardHeader: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = '' }) => (
    <div className={`px-4 py-3 border-b border-gray-200 ${className}`}>
        {children}
    </div>
);

export const CardBody: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = '' }) => (
    <div className={`p-4 ${className}`}>
        {children}
    </div>
);

export const CardFooter: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = '' }) => (
    <div className={`px-4 py-3 border-t border-gray-200 ${className}`}>
        {children}
    </div>
);