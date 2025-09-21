
import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CitizenPortal from './components/CitizenPortal';
import OfficerPortal from './components/OfficerPortal';
import CaseManagement from './components/CaseManagement';
import CitizenCaseManagement from './components/CitizenCaseManagement';
import Analytics from './components/Analytics';
import PoliceImage from './components/PoliceImage';
import { useAuth } from './lib/useAuth';

export type UserRole = 'citizen' | 'officer' | 'admin' | null;
export type ActiveView = 'dashboard' | 'citizen' | 'officer' | 'cases' | 'analytics';

function Home() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const { user } = useAuth();

  const renderActiveView = () => {
    const currentUserRole = (user?.role as UserRole) || userRole;
    
    switch (activeView) {
      case 'citizen':
        return <CitizenPortal />;
      case 'officer':
        return <OfficerPortal />;
      case 'cases':
        // Show citizen-specific case management for citizens, regular for officers/admins
        return currentUserRole === 'citizen' ? <CitizenCaseManagement /> : <CaseManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard userRole={currentUserRole} setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        userRole={userRole} 
        setUserRole={setUserRole}
        activeView={activeView}
        setActiveView={setActiveView}
      />
      
      <main className="pt-20">
        {renderActiveView()}
      </main>

      {/* Police Image - Bottom Right */}
      <PoliceImage />
    </div>
  );
}

export default Home;
