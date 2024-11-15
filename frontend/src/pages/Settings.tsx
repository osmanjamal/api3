import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BinanceConnect from '../components/settings/BinanceConnect';
import GeneralSettings from '../components/settings/GeneralSettings';
import { Alert } from '../components/common/Alert';
import { Card } from '../components/common/Card';
import { Settings as SettingsIcon, Link, Webhook, Bell } from 'lucide-react';

const Settings = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('general');
    const [saveSuccess, setSaveSuccess] = useState(false);

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
    ];

    const handleSave = async (settings) => {
        try {
            // In a real app, save settings to backend or local storage
            localStorage.setItem('tradingSettings', JSON.stringify(settings));
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
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

                {saveSuccess && (
                    <Alert
                        type="success"
                        title="Settings Saved"
                        message="Your settings have been successfully updated."
                        className="mb-6"
                    />
                )}

                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-3">
                        <Card>
                            <nav className="space-y-1">
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
                            <Card title="Notifications">
                                <div className="space-y-4">
                                    <div>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-4 w-4 text-blue-600"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                Email notifications for new trades
                                            </span>
                                        </label>
                                    </div>
                                    <div>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-4 w-4 text-blue-600"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                Browser notifications for trade execution
                                            </span>
                                        </label>
                                    </div>
                                    <div>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-4 w-4 text-blue-600"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                Daily performance summary
                                            </span>
                                        </label>
                                    </div>
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