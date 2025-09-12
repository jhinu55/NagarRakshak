import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  FileText,
  Filter,
  Download
} from 'lucide-react';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('cases');

  const stats = [
    { 
      label: 'Total Cases', 
      value: '1,247', 
      change: '+12%', 
      trend: 'up',
      icon: FileText,
      color: 'blue'
    },
    { 
      label: 'Resolution Rate', 
      value: '87%', 
      change: '+5%', 
      trend: 'up',
      icon: CheckCircle,
      color: 'green'
    },
    { 
      label: 'Avg Response Time', 
      value: '2.4h', 
      change: '-15%', 
      trend: 'down',
      icon: Clock,
      color: 'orange'
    },
    { 
      label: 'Active Officers', 
      value: '45', 
      change: '+3%', 
      trend: 'up',
      icon: Users,
      color: 'purple'
    }
  ];

  const crimeTypes = [
    { type: 'Theft', count: 324, percentage: 26, change: '+8%' },
    { type: 'Traffic Violations', count: 298, percentage: 24, change: '+12%' },
    { type: 'Domestic Disputes', count: 187, percentage: 15, change: '-3%' },
    { type: 'Cybercrime', count: 156, percentage: 12, change: '+25%' },
    { type: 'Fraud', count: 134, percentage: 11, change: '+7%' },
    { type: 'Assault', count: 89, percentage: 7, change: '-5%' },
    { type: 'Others', count: 59, percentage: 5, change: '+2%' }
  ];

  const monthlyData = [
    { month: 'Jan', cases: 98, resolved: 85, pending: 13 },
    { month: 'Feb', cases: 112, resolved: 95, pending: 17 },
    { month: 'Mar', cases: 127, resolved: 108, pending: 19 },
    { month: 'Apr', cases: 134, resolved: 118, pending: 16 },
    { month: 'May', cases: 145, resolved: 128, pending: 17 },
    { month: 'Jun', cases: 156, resolved: 142, pending: 14 }
  ];

  const locationData = [
    { area: 'Panaji', cases: 234, hotspots: 3, risk: 'Medium' },
    { area: 'Margao', cases: 198, hotspots: 2, risk: 'Low' },
    { area: 'Vasco da Gama', cases: 167, hotspots: 4, risk: 'High' },
    { area: 'Mapusa', cases: 145, hotspots: 2, risk: 'Low' },
    { area: 'Ponda', cases: 123, hotspots: 1, risk: 'Low' },
    { area: 'Calangute', cases: 98, hotspots: 3, risk: 'Medium' }
  ];

  const timePatterns = [
    { hour: '00-02', cases: 12, percentage: 2 },
    { hour: '02-04', cases: 8, percentage: 1 },
    { hour: '04-06', cases: 15, percentage: 2 },
    { hour: '06-08', cases: 45, percentage: 7 },
    { hour: '08-10', cases: 78, percentage: 12 },
    { hour: '10-12', cases: 89, percentage: 14 },
    { hour: '12-14', cases: 95, percentage: 15 },
    { hour: '14-16', cases: 87, percentage: 14 },
    { hour: '16-18', cases: 92, percentage: 15 },
    { hour: '18-20', cases: 76, percentage: 12 },
    { hour: '20-22', cases: 54, percentage: 8 },
    { hour: '22-00', cases: 32, percentage: 5 }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Crime statistics, trends, and insights</p>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Crime Types Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Crime Types Distribution</h3>
          <div className="space-y-4">
            {crimeTypes.map((crime, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{crime.type}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{crime.count}</span>
                      <span className={`text-xs font-medium ${
                        crime.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {crime.change}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${crime.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Trends</h3>
          <div className="space-y-4">
            {monthlyData.map((month, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-gray-600">{month.month}</div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: `${(month.resolved / month.cases) * 100}%` }}
                    ></div>
                    <div
                      className="bg-orange-500 h-4 rounded-r-full absolute top-0 right-0"
                      style={{ width: `${(month.pending / month.cases) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 w-16">{month.cases} cases</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Resolved</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Pending</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Location Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Location Analysis
          </h3>
          <div className="space-y-4">
            {locationData.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{location.area}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(location.risk)}`}>
                      {location.risk} Risk
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{location.cases} cases</span>
                    <span>•</span>
                    <span>{location.hotspots} hotspots</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Patterns */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            Time Patterns
          </h3>
          <div className="space-y-3">
            {timePatterns.map((pattern, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-16 text-sm font-medium text-gray-600">{pattern.hour}</div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${pattern.percentage * 6}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 w-12">{pattern.cases}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="font-medium text-gray-900">Peak Hours</span>
            </div>
            <p className="text-sm text-gray-600">Most incidents occur between 12-16 hours (15% of total cases)</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="font-medium text-gray-900">High Risk Area</span>
            </div>
            <p className="text-sm text-gray-600">Vasco da Gama shows highest crime density with 4 active hotspots</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-gray-900">Emerging Trend</span>
            </div>
            <p className="text-sm text-gray-600">Cybercrime cases increased by 25% compared to last period</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;