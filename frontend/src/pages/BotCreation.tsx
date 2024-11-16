// src/pages/BotCreation.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BotCreationForm from '@/components/bot/BotCreationForm';
import { Alert } from '@/components/ui/alert';
import { binanceService } from '@/services/api';
import type { BotConfig } from '@/types';

const BotCreation: React.FC = () => {
 const navigate = useNavigate();
 const isConnected = binanceService.isConnected();

 const handleSuccess = (config: BotConfig) => {
   // TODO: Save bot config
   navigate('/dashboard');
 };

 if (!isConnected) {
   return (
     <div className="min-h-screen bg-gray-50 p-6">
       <div className="max-w-2xl mx-auto space-y-6">
         <Alert variant="warning">
           Please connect your Binance account before creating a trading bot.
         </Alert>
         <button
           onClick={() => navigate('/binance-connect')}
           className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
         >
           Connect Binance Account
         </button>
       </div>
     </div>
   );
 }

 return (
   <div className="min-h-screen bg-gray-50 p-6">
     <div className="max-w-2xl mx-auto">
       <div className="mb-8">
         <h1 className="text-2xl font-bold">Create New Trading Bot</h1>
         <p className="text-gray-500 mt-2">
           Configure your bot's settings and get your webhook credentials
         </p>
       </div>
       <BotCreationForm onSuccess={handleSuccess} />
     </div>
   </div>
 );
};

export default BotCreation;