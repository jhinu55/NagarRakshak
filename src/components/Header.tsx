import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Shield, 
  User, 
  Settings, 
  LogOut,
  Home,
  FileText,
  BarChart3
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserRole, ActiveView } from '../Home';
import { useAuth } from '../lib/useAuth';
import policeLogoPng from './police_logo.png';

interface HeaderProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  userRole, 
  setUserRole, 
  activeView, 
  setActiveView 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { t } = useTranslation();
  const { user } = useAuth();

  // Get role-appropriate navigation items
  const getNavigationItems = () => {
    const userRole = user?.role || 'citizen';
    
    const allItems = [
      { id: 'dashboard', label: t('navigation.dashboard'), icon: Home, roles: ['citizen', 'officer', 'admin'] },
      { id: 'citizen', label: t('navigation.citizenPortal'), icon: User, roles: ['citizen'] },
      { id: 'officer', label: t('navigation.officerPortal'), icon: Shield, roles: ['officer', 'admin'] },
      { id: 'cases', label: userRole === 'citizen' ? 'My Complaints' : t('navigation.caseManagement'), icon: FileText, roles: ['citizen', 'officer', 'admin'] },
      { id: 'analytics', label: t('navigation.analytics'), icon: BarChart3, roles: ['officer', 'admin'] },
    ];
    
    return allItems.filter(item => item.roles.includes(userRole));
  };

  const navigationItems = getNavigationItems();

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    setShowUserMenu(false);
    if (role === 'citizen') {
      setActiveView('citizen');
    } else if (role === 'officer' || role === 'admin') {
      setActiveView('officer');
    }
  };

  return (
    <header className="backdrop-blur-md shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-white/10" style={{background:'linear-gradient(135deg, rgba(0,119,182,0.85), rgba(0,180,216,0.85))'}}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 backdrop-blur-sm">
              <img 
                src={policeLogoPng} 
                alt="Goa Police Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{t('common.goaPolice')} — {t('common.nagarRakshak')}</h1>
              <p className="text-xs text-white/80">{t('common.aiPoweredAssistant')}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as ActiveView)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    activeView === item.id
                      ? 'bg-white/15 text-white'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  userRole 
                    ? 'bg-white/15 text-white' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {userRole ? t(`userRoles.${userRole}`) : t('common.login')}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                  {!userRole ? (
                    <>
                      <button
                        onClick={() => handleRoleSelect('citizen')}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      >
                        {t('userRoles.loginAs', { role: t('userRoles.citizen') })}
                      </button>
                      <button
                        onClick={() => handleRoleSelect('officer')}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      >
                        {t('userRoles.loginAs', { role: t('userRoles.officer') })}
                      </button>
                      <button
                        onClick={() => handleRoleSelect('admin')}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      >
                        {t('userRoles.loginAs', { role: t('userRoles.admin') })}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {t('userRoles.loginAs', { role: t(`userRoles.${userRole}`) })}
                        </p>
                      </div>
                      <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>{t('common.settings')}</span>
                      </button>
                      <button
                        onClick={() => handleRoleSelect(null)}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('common.logout')}</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id as ActiveView);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                      activeView === item.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
