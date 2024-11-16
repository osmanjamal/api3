import React from 'react';
import { Navigate, Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Dashboard from '@/pages/Dashboard';
import BotCreation from '@/pages/BotCreation';
import Settings from '@/pages/Settings';
import BinanceConnect from '@/pages/BinanceConnect';
import { binanceService } from '@/services/api';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const App: React.FC = () => {
  const { isConnected } = useConnectionStatus();

  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    if (!isConnected) {
      return <Navigate to="/binance-connect" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Routes>
              <Route 
                path="/" 
                element={
                  <Navigate 
                    to={isConnected ? "/dashboard" : "/binance-connect"} 
                    replace 
                  />
                } 
              />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/bot-creation" 
                element={
                  <ProtectedRoute>
                    <BotCreation />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/binance-connect" 
                element={<BinanceConnect />} 
              />

              <Route 
                path="*" 
                element={<Navigate to="/" replace />} 
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;