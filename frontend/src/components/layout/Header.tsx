import React from 'react';
import { Activity, Settings, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Activity className="h-8 w-8 text-blue-500" />
                        <h1 className="ml-2 text-xl font-bold">Trading Bot</h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/notifications')}
                            className="p-2 text-gray-500 hover:text-gray-700"
                        >
                            <Bell className="h-5 w-5" />
                        </button>
                        
                        <button 
                            onClick={() => navigate('/settings')}
                            className="p-2 text-gray-500 hover:text-gray-700"
                        >
                            <Settings className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;