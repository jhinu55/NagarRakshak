import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/useAuth';
import Dashboard from './Dashboard';
import CaseManagement from './CaseManagement';
import Analytics from './Analytics';
import OfficerPortal from './OfficerPortal';
import CitizenPortal from './CitizenPortal';
import AIAssistant from './AIAssistant';
import { officerProfileService, OfficerProfile, RolePermissions } from '../lib/officerProfileService';
import { menuConfigService, MenuItem } from '../lib/menuConfigService';
import { Loader2, AlertTriangle, Bell } from 'lucide-react';
import PoliceImage from './PoliceImage';

export type ActiveView = 'dashboard' | 'citizen' | 'officer' | 'cases' | 'analytics' | 'ai';

const OfficerDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [officerProfile, setOfficerProfile] = useState<OfficerProfile | null>(null);
  const [permissions, setPermissions] = useState<RolePermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [notifications, setNotifications] = useState<Record<string, number>>({});

  // Load officer profile and permissions
  useEffect(() => {
    const loadOfficerData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Load or create officer profile
        let profile = await officerProfileService.getOfficerProfile(user.id);
        
        if (!profile) {
          // Create new profile if doesn't exist
          profile = await officerProfileService.createOrUpdateOfficerProfile(user, {
            role: 'officer'
          });
        } else {
          // Update last login
          await officerProfileService.updateOnlineStatus(user.id, true);
        }
        
        setOfficerProfile(profile);
        
        // Get permissions for the officer's role
        const rolePermissions = officerProfileService.getRolePermissions(profile.role);
        setPermissions(rolePermissions);
        
        // Generate dynamic menu items based on profile and permissions
        const dynamicMenuItems = menuConfigService.getOfficerMenuItems(profile, rolePermissions);
        setMenuItems(dynamicMenuItems);
        
        // Get notification counts
        const menuNotifications = menuConfigService.getMenuNotifications(profile);
        setNotifications(menuNotifications);
        
        console.log('✅ Officer profile loaded:', profile);
        console.log('🔐 Officer permissions:', rolePermissions);
        console.log('📋 Dynamic menu items:', dynamicMenuItems);
        
      } catch (err) {
        console.error('❌ Error loading officer data:', err);
        setError('Failed to load officer profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadOfficerData();
  }, [user]);

  // Update online status when component unmounts
  useEffect(() => {
    return () => {
      if (user) {
        officerProfileService.updateOnlineStatus(user.id, false);
      }
    };
  }, [user]);

  // Dynamic officer menu items based on permissions
  const getOfficerMenuItems = () => {
    // Use dynamic menu items if available, otherwise show basic dashboard
    if (menuItems.length > 0) {
      return menuItems;
    }
    
    // Fallback to basic menu if dynamic loading fails
    return [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' }
    ];
  };

  const officerMenuItems = getOfficerMenuItems();

  // Show loading state while loading officer data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading officer dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Dashboard Error</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    activeView === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title={item.description}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                  {notifications[item.id] && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications[item.id] > 9 ? '9+' : notifications[item.id]}
                    </span>
                  )}
                  {item.isNew && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
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
                  {officerProfile?.fullName || user?.fullName || user?.email?.split('@')[0] || 'Officer'}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {officerProfile?.rank || officerProfile?.role || user?.role || 'Officer'}
                  {officerProfile?.department && ` • ${officerProfile.department}`}
                </p>
              </div>
              
              <div className="relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  officerProfile?.status === 'active' ? 'bg-green-600' : 
                  officerProfile?.status === 'off-duty' ? 'bg-gray-600' : 
                  officerProfile?.status === 'on-leave' ? 'bg-yellow-600' : 'bg-green-600'
                }`}>
                  <span className="text-white font-medium text-sm">
                    {(officerProfile?.fullName || user?.fullName || user?.email || 'O')[0].toUpperCase()}
                  </span>
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                  officerProfile?.isOnline ? 'bg-green-400' : 'bg-gray-400'
                }`}></div>
              </div>                {/* Sign Out Button */}
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
                  className={`relative flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 ${
                    activeView === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title={item.description}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                  {notifications[item.id] && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications[item.id] > 9 ? '9+' : notifications[item.id]}
                    </span>
                  )}
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
                  Welcome back, {officerProfile?.fullName || user?.fullName || user?.email?.split('@')[0] || 'Officer'}! 
                  {officerProfile?.rank && ` (${officerProfile.rank})`} 👮‍♂️
                </h2>
                <p className="text-blue-100 text-sm">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  {officerProfile?.department && ` • ${officerProfile.department} Department`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">
                  Status: {officerProfile?.status ? 
                    officerProfile.status.charAt(0).toUpperCase() + officerProfile.status.slice(1).replace('-', ' ') : 
                    'Active'
                  }
                </p>
                <p className="text-xs text-blue-100">
                  Badge: {officerProfile?.badge || 'NR' + user?.id?.slice(-4) || 'N/A'}
                </p>
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
      
      {/* Police Image - Bottom Right */}
      <PoliceImage />
    </div>
  );
};

export default OfficerDashboard;