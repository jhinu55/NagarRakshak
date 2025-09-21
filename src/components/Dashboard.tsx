import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Shield,
  Bot,
  ArrowRight,
  Users,
  Calendar,
  MapPin,
  BarChart3,
  Activity,
  PlusCircle,
  Search,
  Filter,
  Bell,
  Star,
  Loader2
} from 'lucide-react';
import { UserRole, ActiveView } from '../Home';
import { officerStatsService, OfficerStats, SystemStatus } from '../lib/officerStatsService';
import { useAuth } from '../lib/useAuth';

interface DashboardProps {
  userRole: UserRole;
  setActiveView: (view: ActiveView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole: _userRole, setActiveView }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // State for dynamic data
  const [stats, setStats] = useState<OfficerStats | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load dynamic data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const officerName = user?.fullName || user?.email?.split('@')[0];
        console.log('📊 Loading dashboard data for:', officerName);
        
        // Load officer stats and system status in parallel
        const [officerStats, systemStatusData] = await Promise.all([
          officerName ? officerStatsService.getOfficerStats(officerName) : officerStatsService.getGlobalStats(),
          officerStatsService.getSystemStatus()
        ]);
        
        setStats(officerStats);
        setSystemStatus(systemStatusData);
        
        console.log('✅ Dashboard data loaded successfully');
      } catch (err) {
        console.error('❌ Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
            <span className="text-gray-600 text-lg">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Dashboard Error</h3>
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Prepare dynamic stats for display
  const dynamicStats = [
    { 
      label: t('stats.totalCases'), 
      value: stats?.totalCases.toString() || '0', 
      icon: FileText, 
      color: 'blue', 
      change: '+' + Math.round((stats?.thisWeekProgress || 0) / 10) + '%' 
    },
    { 
      label: t('stats.activeCases'), 
      value: stats?.activeCases.toString() || '0', 
      icon: Clock, 
      color: 'orange', 
      change: '+' + (stats?.todaysNewCases || 0).toString() + '%'
    },
    { 
      label: t('stats.resolvedCases'), 
      value: stats?.resolvedCases.toString() || '0', 
      icon: CheckCircle, 
      color: 'green', 
      change: '+' + (stats?.completionRate || 0) + '%' 
    },
    { 
      label: t('stats.urgentCases'), 
      value: stats?.urgentCases.toString() || '0', 
      icon: AlertTriangle, 
      color: 'red', 
      change: stats?.urgentCases && stats.urgentCases > 0 ? '+' + stats.urgentCases + '%' : '0%'
    },
  ];

  const quickActions = [
    { 
      title: t('actions.fileComplaint'), 
      description: t('actions.fileComplaintDesc'),
      icon: FileText, 
      action: () => setActiveView('citizen'),
      color: 'blue'
    },
    { 
      title: t('actions.officerDashboard'), 
      description: t('actions.officerDashboardDesc'),
      icon: Shield, 
      action: () => setActiveView('officer'),
      color: 'green'
    },
    { 
      title: t('actions.viewAnalytics'), 
      description: t('actions.viewAnalyticsDesc'),
      icon: TrendingUp, 
      action: () => setActiveView('analytics'),
      color: 'purple'
    },
    { 
      title: t('actions.aiAssistant'), 
      description: t('actions.aiAssistantDesc'),
      icon: Bot, 
      action: () => {},
      color: 'cyan'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {t('dashboard.title')}
              </h1>
              <p className="text-gray-600 text-lg">
                Welcome back! Here's what's happening today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Modern Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dynamicStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg"></div>
                <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br from-${stat.color}-400 to-${stat.color}-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      stat.change.startsWith('+') 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-gray-100/20 rounded-full transform translate-x-8 -translate-y-8"></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Quick Actions */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('dashboard.quickActions')}</h2>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                <PlusCircle className="w-5 h-5" />
                <span>Add New</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg"></div>
                    <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br from-${action.color}-400 to-${action.color}-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{action.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-gray-100/20 rounded-full transform translate-x-8 -translate-y-8"></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modern Recent Cases */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('dashboard.recentCases')}</h2>
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <Filter className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg"></div>
              <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50">
                <div className="p-6">
                  <div className="space-y-4">
                    {stats?.recentCases && stats.recentCases.length > 0 ? (
                      stats.recentCases.map((case_, index) => (
                        <div key={index} className="group p-4 bg-white/60 rounded-xl border border-gray-100 hover:shadow-md hover:bg-white/80 transition-all duration-200 cursor-pointer">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <span className="font-bold text-gray-900">{case_.id}</span>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    case_.priority === 'High' 
                                      ? 'bg-red-100 text-red-700'
                                      : case_.priority === 'Medium'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-green-100 text-green-700'
                                  }`}>
                                    {case_.priority}
                                  </span>
                                  <Star className="w-3 h-3 text-yellow-400" />
                                </div>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">{case_.lastUpdate}</span>
                          </div>
                          
                          <p className="text-sm font-medium text-gray-700 mb-2">{case_.type}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                              case_.status === 'Resolved'
                                ? 'bg-green-100 text-green-700'
                                : case_.status === 'Under Investigation'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {case_.status}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <MapPin className="w-3 h-3 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Cases</h3>
                        <p className="text-gray-600">No cases have been assigned recently.</p>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => setActiveView('cases')}
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {t('dashboard.viewAllCases')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern System Status */}
        <div className="mt-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl"></div>
          <div className="relative bg-gradient-to-r from-green-400/90 to-blue-500/90 backdrop-blur-sm rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t('dashboard.systemStatus')}</h3>
                  <p className="text-white/80 mt-1">
                    {systemStatus ? 'All systems operational and running smoothly' : 'Loading system status...'}
                  </p>
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-white/60" />
            </div>
            
            <div className="flex items-center space-x-8 mt-6">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full animate-pulse shadow-lg ${
                  systemStatus?.database === 'online' ? 'bg-green-300' : 
                  systemStatus?.database === 'offline' ? 'bg-red-300' : 'bg-yellow-300'
                }`}></div>
                <span className="text-white/90 font-medium">{t('dashboard.database')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full animate-pulse shadow-lg ${
                  systemStatus?.aiServices === 'online' ? 'bg-green-300' : 
                  systemStatus?.aiServices === 'offline' ? 'bg-red-300' : 'bg-yellow-300'
                }`}></div>
                <span className="text-white/90 font-medium">{t('dashboard.aiServices')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full animate-pulse shadow-lg ${
                  systemStatus?.voiceRecognition === 'online' ? 'bg-green-300' : 
                  systemStatus?.voiceRecognition === 'offline' ? 'bg-red-300' : 'bg-yellow-300'
                }`}></div>
                <span className="text-white/90 font-medium">{t('dashboard.voiceRecognition')}</span>
              </div>
              {systemStatus?.uptime && (
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-white/70" />
                  <span className="text-white/90 font-medium">Uptime: {systemStatus.uptime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;