import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Upload, 
  Mic, 
  MicOff, 
  Bell, 
  Globe, 
  WifiOff, 
  Eye, 
  EyeOff,
  ChevronDown,
  User,
  LogOut,
  Settings
} from 'lucide-react';
import { useAuth } from '../lib/useAuth';
import ComplaintFilingWizard from './ComplaintFilingWizard';
import ComplaintTracking from './ComplaintTracking';
import ChatInterface from './ChatInterface';
import NotificationsArea from './NotificationsArea';
import EvidenceUpload from './EvidenceUpload';

interface CitizenDashboardProps {
  onSignOut?: () => void;
}

type Language = 'en' | 'hi' | 'kok';
type ActiveView = 'dashboard' | 'file-complaint' | 'track-complaint' | 'upload-evidence' | 'chat' | 'notifications';

const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ onSignOut }) => {
  const { user, signOut } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Language content
  const content = {
    en: {
      title: "Nagar Rakshak 2.0",
      subtitle: "Citizen Services Portal",
      welcome: "Welcome",
      fileComplaint: "File Complaint",
      trackComplaint: "Track Complaint",
      uploadEvidence: "Upload ID/Evidence",
      notifications: "Notifications",
      chat: "Chat Support",
      offline: "You are currently offline",
      accessibility: "Accessibility Mode",
      voiceAssistant: "Voice Assistant"
    },
    hi: {
      title: "नगर रक्षक 2.0",
      subtitle: "नागरिक सेवा पोर्टल",
      welcome: "स्वागत",
      fileComplaint: "शिकायत दर्ज करें",
      trackComplaint: "शिकायत की स्थिति देखें",
      uploadEvidence: "आईडी/साक्ष्य अपलोड करें",
      notifications: "सूचनाएं",
      chat: "चैट सहायता",
      offline: "आप वर्तमान में ऑफलाइन हैं",
      accessibility: "पहुंच मोड",
      voiceAssistant: "आवाज सहायक"
    },
    kok: {
      title: "नगर रक्षक 2.0",
      subtitle: "नागरीक सेवा पोर्टल",
      welcome: "स्वागत",
      fileComplaint: "तक्रार नोंदोवची",
      trackComplaint: "तक्रारीची स्थिती पळोवची",
      uploadEvidence: "आयडी/पुरावो अपलोड करात",
      notifications: "सूचना",
      chat: "चॅट सहाय्य",
      offline: "तुमी सध्या ऑफलाइन आसात",
      accessibility: "पोच मोड",
      voiceAssistant: "आवाज सहायक"
    }
  };

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'hi' as Language, name: 'हिंदी', flag: '🇮🇳' },
    { code: 'kok' as Language, name: 'कोंकणी', flag: '🌴' }
  ];

  const currentContent = content[selectedLanguage];

  // Colors as per requirements
  const colors = {
    deepIndigo: '#2E3A59',
    teal: '#008080',
    amber: '#FFC107',
    whiteOpacity: 'rgba(255, 255, 255, 0.1)'
  };

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Voice assistant toggle
  const toggleVoiceListening = () => {
    setVoiceListening(!voiceListening);
    // Voice recognition logic would go here
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      if (onSignOut) onSignOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Render main dashboard view
  const renderDashboard = () => (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br opacity-90"
        style={{
          background: `linear-gradient(135deg, ${colors.deepIndigo} 0%, ${colors.teal} 100%)`
        }}
      />
      
      {/* Glass overlay pattern */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
      
      {/* Floating geometric shapes for visual interest */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-amber-400/20 rounded-xl blur-xl animate-pulse delay-500" />

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
              <span className="text-white font-bold text-lg">NR</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{currentContent.title}</h1>
              <p className="text-white/80 text-sm">{currentContent.subtitle}</p>
            </div>
          </div>

          {/* Top Right Controls */}
          <div className="flex items-center space-x-4">
            {/* Offline Indicator */}
            {isOffline && (
              <div className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 backdrop-blur-md rounded-xl border border-red-400/30">
                <WifiOff className="w-4 h-4 text-red-300" />
                <span className="text-red-300 text-sm">{currentContent.offline}</span>
              </div>
            )}

            {/* Accessibility Toggle */}
            <button
              onClick={() => setAccessibilityMode(!accessibilityMode)}
              className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 group"
              title={currentContent.accessibility}
            >
              {accessibilityMode ? (
                <EyeOff className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              ) : (
                <Eye className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              )}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Globe className="w-4 h-4 text-white" />
                <span className="text-white text-sm">
                  {languages.find(lang => lang.code === selectedLanguage)?.flag}
                  {languages.find(lang => lang.code === selectedLanguage)?.name}
                </span>
                <ChevronDown className="w-4 h-4 text-white" />
              </button>

              {/* Language Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden min-w-48 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.code);
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                  <div className="border-t border-white/20">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        // Add settings functionality
                      }}
                      className="w-full text-left px-4 py-3 text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleSignOut();
                      }}
                      className="w-full text-left px-4 py-3 text-white hover:bg-red-500/20 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pb-6">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
              <User className="w-5 h-5 text-white" />
              <span className="text-white">
                {currentContent.welcome}, {user?.fullName || user?.email?.split('@')[0] || 'Citizen'}
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Your Digital <span style={{ color: colors.amber }}>Police</span> Station
            </h2>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
              File complaints, track progress, and connect with law enforcement - all from your device
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* File Complaint */}
            <button
              onClick={() => setActiveView('file-complaint')}
              className="group relative p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: colors.amber }}
                >
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">{currentContent.fileComplaint}</h3>
                <p className="text-white/70 text-sm">Submit new complaints and incidents securely</p>
              </div>
            </button>

            {/* Track Complaint */}
            <button
              onClick={() => setActiveView('track-complaint')}
              className="group relative p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div 
                  className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300"
                >
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">{currentContent.trackComplaint}</h3>
                <p className="text-white/70 text-sm">Check status and updates on your cases</p>
              </div>
            </button>

            {/* Upload Evidence */}
            <button
              onClick={() => setActiveView('upload-evidence')}
              className="group relative p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div 
                  className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300"
                >
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">{currentContent.uploadEvidence}</h3>
                <p className="text-white/70 text-sm">Add documents and evidence to existing cases</p>
              </div>
            </button>
          </div>

          {/* Quick Access Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notifications */}
            <button
              onClick={() => setActiveView('notifications')}
              className="flex items-center space-x-4 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="relative">
                <Bell className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
              <div className="text-left">
                <h4 className="text-white font-semibold">{currentContent.notifications}</h4>
                <p className="text-white/70 text-sm">3 new updates available</p>
              </div>
            </button>

            {/* Chat Support */}
            <button
              onClick={() => setActiveView('chat')}
              className="flex items-center space-x-4 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-sm font-bold">💬</span>
              </div>
              <div className="text-left">
                <h4 className="text-white font-semibold">{currentContent.chat}</h4>
                <p className="text-white/70 text-sm">Get instant help and support</p>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Floating Voice Assistant */}
      <button
        onClick={toggleVoiceListening}
        className={`fixed bottom-8 right-8 w-16 h-16 rounded-full border-4 border-white/30 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 z-50 ${
          voiceListening 
            ? 'bg-red-500 animate-pulse' 
            : 'bg-white/10 hover:bg-white/20'
        }`}
        title={currentContent.voiceAssistant}
      >
        {voiceListening ? (
          <MicOff className="w-8 h-8 text-white mx-auto" />
        ) : (
          <Mic className="w-8 h-8 text-white mx-auto" />
        )}
      </button>
    </div>
  );

  // Main render logic
  return (
    <div className={`${accessibilityMode ? 'contrast-more' : ''}`}>
      {activeView === 'dashboard' && renderDashboard()}
      {activeView === 'file-complaint' && (
        <ComplaintFilingWizard 
          language={selectedLanguage}
          onBack={() => setActiveView('dashboard')}
          accessibilityMode={accessibilityMode}
        />
      )}
      {activeView === 'track-complaint' && (
        <ComplaintTracking 
          language={selectedLanguage}
          onBack={() => setActiveView('dashboard')}
          accessibilityMode={accessibilityMode}
        />
      )}
      {activeView === 'chat' && (
        <ChatInterface 
          language={selectedLanguage}
          onBack={() => setActiveView('dashboard')}
          accessibilityMode={accessibilityMode}
        />
      )}
      {activeView === 'notifications' && (
        <NotificationsArea 
          language={selectedLanguage}
          onBack={() => setActiveView('dashboard')}
          accessibilityMode={accessibilityMode}
        />
      )}
      {activeView === 'upload-evidence' && (
        <EvidenceUpload 
          language={selectedLanguage}
          onBack={() => setActiveView('dashboard')}
          accessibilityMode={accessibilityMode}
        />
      )}
    </div>
  );
};

export default CitizenDashboard;