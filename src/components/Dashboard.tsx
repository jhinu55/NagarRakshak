import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Shield,
  Bot,
  ArrowRight
} from 'lucide-react';
import { UserRole, ActiveView } from '../Home';

interface DashboardProps {
  userRole: UserRole;
  setActiveView: (view: ActiveView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole: _userRole, setActiveView }) => {
  const { t } = useTranslation();
  
  const stats = [
    { label: t('stats.totalCases'), value: '1,247', icon: FileText, color: 'blue', change: '+12%' },
    { label: t('stats.activeCases'), value: '89', icon: Clock, color: 'orange', change: '+5%' },
    { label: t('stats.resolvedCases'), value: '1,158', icon: CheckCircle, color: 'green', change: '+8%' },
    { label: t('stats.urgentCases'), value: '12', icon: AlertTriangle, color: 'red', change: '-3%' },
  ];

  const recentCases = [
    { id: 'FIR001', type: t('cases.theft'), status: t('cases.underInvestigation'), priority: t('cases.high'), time: '2 hours ago' },
    { id: 'FIR002', type: t('cases.domesticDispute'), status: t('cases.resolved'), priority: t('cases.medium'), time: '4 hours ago' },
    { id: 'FIR003', type: t('cases.trafficViolation'), status: t('cases.pending'), priority: t('cases.low'), time: '6 hours ago' },
    { id: 'FIR004', type: t('cases.cybercrime'), status: t('cases.underInvestigation'), priority: t('cases.high'), time: '8 hours ago' },
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
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('dashboard.title')}
        </h1>
        <p className="text-gray-600">
          {t('dashboard.welcome')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.change.startsWith('+') 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t('dashboard.quickActions')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-6 h-6 text-${action.color}-600`} />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Cases */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t('dashboard.recentCases')}</h2>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6">
              <div className="space-y-4">
                {recentCases.map((case_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900">{case_.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          case_.priority === t('cases.high') 
                            ? 'bg-red-100 text-red-600'
                            : case_.priority === t('cases.medium')
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {case_.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{case_.type}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          case_.status === t('cases.resolved')
                            ? 'bg-green-100 text-green-600'
                            : case_.status === t('cases.underInvestigation')
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {case_.status}
                        </span>
                        <span className="text-xs text-gray-500">{case_.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setActiveView('cases')}
                className="w-full mt-4 text-center text-blue-600 hover:text-blue-700 font-medium text-sm py-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                {t('dashboard.viewAllCases')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.systemStatus')}</h3>
        </div>
        <p className="text-gray-600 mt-2">
          {t('dashboard.systemDesc')}
        </p>
        <div className="flex items-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">{t('dashboard.database')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">{t('dashboard.aiServices')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">{t('dashboard.voiceRecognition')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;