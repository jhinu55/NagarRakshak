import React, { useState, useEffect } from 'react';
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
  Download,
  Loader2
} from 'lucide-react';
import { officerStatsService } from '../lib/officerStatsService';
import { firestoreService } from '../lib/firestoreService';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState('cases');
  const [stats, setStats] = useState<any[]>([]);
  const [crimeTypes, setCrimeTypes] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<any[]>([]);
  const [timePatterns, setTimePatterns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load analytics data from Firestore
  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get global statistics
        const globalStats = await officerStatsService.getGlobalStats();

        // Calculate response time (mock for now, can be enhanced)
        const avgResponseTime = globalStats.averageResolutionTime > 0 
          ? `${globalStats.averageResolutionTime}d` 
          : '2.4h';

        // Get officer count
        const allOfficers = await firestoreService.getAllOfficerNames();

        // Load all cases for analytics
        const allCases = await firestoreService.loadAllCases();

        const dynamicStats = [
          { 
            label: 'Total Cases', 
            value: globalStats.totalCases.toString(), 
            change: `+${globalStats.thisWeekProgress}%`, 
            trend: 'up',
            icon: FileText,
            color: 'blue'
          },
          { 
            label: 'Resolution Rate', 
            value: `${globalStats.completionRate}%`, 
            change: globalStats.completionRate > 70 ? '+5%' : '-2%', 
            trend: globalStats.completionRate > 70 ? 'up' : 'down',
            icon: CheckCircle,
            color: 'green'
          },
          { 
            label: 'Avg Response Time', 
            value: avgResponseTime, 
            change: '-15%', 
            trend: 'down',
            icon: Clock,
            color: 'orange'
          },
          { 
            label: 'Active Officers', 
            value: allOfficers.length.toString(), 
            change: '+3%', 
            trend: 'up',
            icon: Users,
            color: 'purple'
          },
        ];

        // Generate dynamic crime types from actual case data
        const crimeTypeCounts = allCases.reduce((acc: any, caseItem: any) => {
          const type = caseItem.type || 'Others';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        const totalCases = allCases.length;
        const dynamicCrimeTypes = Object.entries(crimeTypeCounts)
          .map(([type, count]) => ({
            type,
            count: count as number,
            percentage: Math.round(((count as number) / totalCases) * 100),
            change: `+${Math.floor(Math.random() * 20)}%` // Simulated change
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 7);

        // Generate dynamic location data
        const locationCounts = allCases.reduce((acc: any, caseItem: any) => {
          const location = caseItem.location?.split(',')[0] || 'Unknown';
          acc[location] = (acc[location] || 0) + 1;
          return acc;
        }, {});

        const dynamicLocationData = Object.entries(locationCounts)
          .map(([area, cases]) => ({
            area,
            cases: cases as number,
            hotspots: Math.floor(Math.random() * 5) + 1,
            risk: (cases as number) > 5 ? 'High' : (cases as number) > 2 ? 'Medium' : 'Low'
          }))
          .sort((a, b) => b.cases - a.cases)
          .slice(0, 6);

        // Generate monthly trends from case dates
        const monthlyTrends = [
          { month: 'Jan', cases: 0, resolved: 0, pending: 0 },
          { month: 'Feb', cases: 0, resolved: 0, pending: 0 },
          { month: 'Mar', cases: 0, resolved: 0, pending: 0 },
          { month: 'Apr', cases: 0, resolved: 0, pending: 0 },
          { month: 'May', cases: 0, resolved: 0, pending: 0 },
          { month: 'Jun', cases: 0, resolved: 0, pending: 0 }
        ];

        allCases.forEach((caseItem: any) => {
          const date = new Date(caseItem.lastUpdate);
          const monthIndex = date.getMonth();
          if (monthIndex < 6) {
            monthlyTrends[monthIndex].cases++;
            if (caseItem.status === 'Resolved') {
              monthlyTrends[monthIndex].resolved++;
            } else {
              monthlyTrends[monthIndex].pending++;
            }
          }
        });

        // Generate time patterns (simplified)
        const dynamicTimePatterns = [
          { hour: '00-02', cases: Math.floor(Math.random() * 20), percentage: 2 },
          { hour: '02-04', cases: Math.floor(Math.random() * 15), percentage: 1 },
          { hour: '04-06', cases: Math.floor(Math.random() * 25), percentage: 2 },
          { hour: '06-08', cases: Math.floor(Math.random() * 60), percentage: 7 },
          { hour: '08-10', cases: Math.floor(Math.random() * 100), percentage: 12 },
          { hour: '10-12', cases: Math.floor(Math.random() * 120), percentage: 14 },
          { hour: '12-14', cases: Math.floor(Math.random() * 130), percentage: 15 },
          { hour: '14-16', cases: Math.floor(Math.random() * 110), percentage: 14 },
          { hour: '16-18', cases: Math.floor(Math.random() * 120), percentage: 15 },
          { hour: '18-20', cases: Math.floor(Math.random() * 100), percentage: 12 },
          { hour: '20-22', cases: Math.floor(Math.random() * 80), percentage: 8 },
          { hour: '22-00', cases: Math.floor(Math.random() * 50), percentage: 5 }
        ];

        setStats(dynamicStats);
        setCrimeTypes(dynamicCrimeTypes);
        setLocationData(dynamicLocationData);
        setMonthlyData(monthlyTrends);
        setTimePatterns(dynamicTimePatterns);

      } catch (err) {
        console.error('Error loading analytics data:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, [timeRange]);

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-600 text-lg">Loading analytics...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Analytics Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

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