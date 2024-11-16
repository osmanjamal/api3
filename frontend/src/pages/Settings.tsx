// src/pages/Settings.tsx
import React, { useState } from 'react';
import BinanceConnect from '@/components/settings/BinanceConnect';
import GeneralSettings from '@/components/settings/GeneralSettings';
import { Card } from '@/components/ui/card';
import { Settings as SettingsIcon, Link, Bell } from 'lucide-react';

const tabs = [
  { 
    id: 'general', 
    label: 'General Settings', 
    icon: SettingsIcon 
  },
  { 
    id: 'connection', 
    label: 'Exchange Connection', 
    icon: Link 
  },
  { 
    id: 'notifications', 
    label: 'Notifications', 
    icon: Bell 
  }
] as const;

type TabId = typeof tabs[number]['id'];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('general');

  const handleSave = async (settings: any) => {
    // TODO: Implement settings save
    localStorage.setItem('tradingSettings', JSON.stringify(settings));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500 mt-2">
            Manage your trading bot configuration and preferences
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <Card>
              <nav className="space-y-1 p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center px-4 py-2 text-sm font-medium rounded-md
                      ${activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <tab.icon 
                      className={`
                        mr-3 h-4 w-4
                        ${activeTab === tab.id
                          ? 'text-blue-500'
                          : 'text-gray-400'
                        }
                      `}
                    />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          <div className="col-span-9">
            {activeTab === 'general' && (
              <GeneralSettings onSave={handleSave} />
            )}
            {activeTab === 'connection' && (
              <BinanceConnect />
            )}
            {activeTab === 'notifications' && (
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
                  {/* TODO: Add notification settings */}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;