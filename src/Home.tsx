
import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CitizenPortal from './components/CitizenPortal';
import OfficerPortal from './components/OfficerPortal';
import AIAssistant from './components/AIAssistant';
import CaseManagement from './components/CaseManagement';
import Analytics from './components/Analytics';
import PoliceImage from './components/PoliceImage';

export type UserRole = 'citizen' | 'officer' | 'admin' | null;
export type ActiveView = 'dashboard' | 'citizen' | 'officer' | 'cases' | 'analytics' | 'ai';

function Home() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isAIOpen, setIsAIOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'citizen':
        return <CitizenPortal />;
      case 'officer':
        return <OfficerPortal />;
      case 'cases':
        return <CaseManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard userRole={userRole} setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header 
        userRole={userRole} 
        setUserRole={setUserRole}
        activeView={activeView}
        setActiveView={setActiveView}
        setIsAIOpen={setIsAIOpen}
      />
      
      <main className="pt-20">
        {renderActiveView()}
      </main>

      {/* AI Assistant Overlay */}
      {isAIOpen && (
        <AIAssistant 
          isOpen={isAIOpen} 
          onClose={() => setIsAIOpen(false)}
          userRole={userRole}
        />
      )}
      
      {/* Police Image - Bottom Right */}
      <PoliceImage />
    </div>
  );
}

export default Home;
