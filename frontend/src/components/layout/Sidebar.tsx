// src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
 LayoutDashboard,
 Bot,
 Settings,
 LineChart,
 Link as LinkIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
 {
   path: '/dashboard',
   icon: LayoutDashboard,
   label: 'Dashboard'
 },
 {
   path: '/bot-creation',
   icon: Bot,
   label: 'Create Bot'
 },
 {
   path: '/binance-connect',
   icon: LinkIcon,
   label: 'Connect Exchange'
 },
 {
   path: '/settings',
   icon: Settings,
   label: 'Settings'
 }
] as const;

const Sidebar: React.FC = () => {
 return (
   <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
     <nav className="mt-5 px-2">
       <div className="space-y-1">
         {navigationItems.map((item) => (
           <NavLink
             key={item.path}
             to={item.path}
             className={({ isActive }) =>
               cn(
                 "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                 isActive
                   ? "bg-blue-50 text-blue-700"
                   : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
               )
             }
           >
             <item.icon className="h-5 w-5 mr-3" />
             <span>{item.label}</span>
           </NavLink>
         ))}
       </div>
     </nav>
   </aside>
 );
};

export default Sidebar;