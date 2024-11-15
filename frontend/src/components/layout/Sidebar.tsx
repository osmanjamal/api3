import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Robot,
    Settings,
    LineChart,
    Link
} from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        {
            path: '/dashboard',
            icon: <LayoutDashboard className="h-5 w-5" />,
            label: 'Dashboard'
        },
        {
            path: '/bot-creation',
            icon: <Robot className="h-5 w-5" />,
            label: 'Create Bot'
        },
        {
            path: '/binance-connect',
            icon: <Link className="h-5 w-5" />,
            label: 'Connect Exchange'
        },
        {
            path: '/settings',
            icon: <Settings className="h-5 w-5" />,
            label: 'Settings'
        }
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
            <nav className="mt-5 px-2">
                <div className="space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            {item.icon}
                            <span className="ml-3">{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;