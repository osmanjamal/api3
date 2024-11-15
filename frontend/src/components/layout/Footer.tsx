import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-4">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        © {new Date().getFullYear()} Trading Bot. All rights reserved.
                    </div>
                    <div className="flex items-center space-x-4">
                        <a 
                            href="https://www.binance.com/en/futures" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Binance Futures
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;