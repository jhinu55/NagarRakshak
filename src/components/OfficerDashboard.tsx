import React, { useState } from 'react';
import { useAuth } from '../lib/useAuth';
import Dashboard from './Dashboard';
import CaseManagement from './CaseManagement';
import Analytics from './Analytics';
import OfficerPortal from './OfficerPortal';
import CitizenPortal from './CitizenPortal';
import AIAssistant from './AIAssistant';

export type ActiveView = 'dashboard' | 'citizen' | 'officer' | 'cases' | 'analytics' | 'ai';

const OfficerDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Officer-specific menu items
  const officerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'cases', label: 'Case Management', icon: '📁' },
    { id: 'officer', label: 'Officer Portal', icon: '👮' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'citizen', label: 'Citizen Services', icon: '👥' },
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case 'cases':
        return <CaseManagement />;
      case 'officer':
        return <OfficerPortal />;
      case 'analytics':
        return <Analytics />;
      case 'citizen':
        return <CitizenPortal />;
      default:
        return <Dashboard userRole="officer" setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Officer-specific navigation */}
      <header className="bg-white shadow-lg border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">NR</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">NagarRakshak</h1>
              </div>
              <div className="hidden md:block">
                <span className="text-sm text-gray-500">Officer Dashboard</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden lg:flex items-center space-x-1">
              {officerMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as ActiveView)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    activeView === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* AI Assistant Button */}
              <button
                onClick={() => setIsAIOpen(true)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                title="AI Assistant"
              >
                🤖
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullName || user?.email?.split('@')[0] || 'Officer'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'Officer'}</p>
                </div>
                
                <div className="relative">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {(user?.fullName || user?.email || 'O')[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={signOut}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Sign Out"
                >
                  🚪
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden border-t border-gray-200 py-2">
            <div className="flex items-center space-x-1 overflow-x-auto">
              {officerMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as ActiveView)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 ${
                    activeView === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 lg:pt-16">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Welcome back, {user?.fullName || user?.email?.split('@')[0] || 'Officer'}! 👮‍♂️
                </h2>
                <p className="text-blue-100 text-sm">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Status: Active</p>
                <p className="text-xs text-blue-100">Last login: Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="container mx-auto px-4 py-6">
          {renderActiveView()}
        </div>
      </main>

      {/* AI Assistant Overlay */}
      {isAIOpen && (
        <AIAssistant 
          isOpen={isAIOpen} 
          onClose={() => setIsAIOpen(false)}
          userRole="officer"
        />
      )}
    </div>
  );
};

export default OfficerDashboard;