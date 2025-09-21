import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Car, 
  Shield, 
  FileText, 
  X, 
  Send, 
  Moon, 
  Sun,
  Users,
  TrendingUp,
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react';
import { firestoreService } from '../lib/firestoreService';
import { officerStatsService } from '../lib/officerStatsService';
import PoliceImage from './PoliceImage';

interface Incident {
  id: string;
  referenceNumber: string;
  citizenName: string;
  emergencyType: string;
  location: string;
  coordinates: { lat: number; lng: number };
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  timestamp: string;
  description: string;
  evidence?: string[];
  assignedOfficer?: string;
}

interface Officer {
  id: string;
  name: string;
  badge: string;
  status: 'Available' | 'On Duty' | 'Off Duty';
  currentLocation: string;
  assignedIncident?: string;
}

interface PatrolCar {
  id: string;
  callSign: string;
  status: 'Available' | 'Dispatched' | 'Maintenance';
  location: string;
  officers: string[];
}

const EmergencyDashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [patrolCars, setPatrolCars] = useState<PatrolCar[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Colors as specified
  const colors = {
    navy: '#1A2233',
    highPriority: '#FF3B30',
    mediumPriority: '#FFC107',
    lowPriority: '#00B894',
    glass: 'rgba(255, 255, 255, 0.1)'
  };

  useEffect(() => {
    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    loadDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load cases and convert to incidents
      const cases = await firestoreService.loadAllCases();
      const incidentsData = cases.map(caseData => ({
        id: caseData.id,
        referenceNumber: caseData.id,
        citizenName: caseData.complainant,
        emergencyType: caseData.type,
        location: caseData.location,
        coordinates: generateRandomCoordinates(),
        priority: caseData.priority as 'High' | 'Medium' | 'Low',
        status: mapStatus(caseData.status),
        timestamp: caseData.lastUpdate,
        description: caseData.description,
        assignedOfficer: caseData.assignedTo
      }));
      
      setIncidents(incidentsData);
      
      // Load analytics
      const globalStats = await officerStatsService.getGlobalStats();
      setAnalytics(globalStats);
      
      // Generate mock officers and patrol cars
      const officerNames = await firestoreService.getAllOfficerNames();
      const officersData = officerNames.map((name, index) => ({
        id: `officer-${index}`,
        name: name,
        badge: `NR${1000 + index}`,
        status: ['Available', 'On Duty', 'Off Duty'][Math.floor(Math.random() * 3)] as 'Available' | 'On Duty' | 'Off Duty',
        currentLocation: `Sector ${Math.floor(Math.random() * 10) + 1}`,
        assignedIncident: Math.random() > 0.7 ? `INC${Math.floor(Math.random() * 1000)}` : undefined
      }));
      
      setOfficers(officersData);
      
      // Generate patrol cars
      const carsData = Array.from({ length: 8 }, (_, index) => ({
        id: `car-${index}`,
        callSign: `PC-${String(index + 1).padStart(3, '0')}`,
        status: ['Available', 'Dispatched', 'Maintenance'][Math.floor(Math.random() * 3)] as 'Available' | 'Dispatched' | 'Maintenance',
        location: `Zone ${String.fromCharCode(65 + Math.floor(index / 2))}`,
        officers: officersData.slice(index * 2, (index + 1) * 2).map(o => o.name)
      }));
      
      setPatrolCars(carsData);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomCoordinates = () => ({
    lat: 15.2993 + (Math.random() - 0.5) * 0.1, // Goa coordinates
    lng: 74.1240 + (Math.random() - 0.5) * 0.1
  });

  const mapStatus = (status: string): 'Open' | 'In Progress' | 'Resolved' => {
    switch (status) {
      case 'Resolved': return 'Resolved';
      case 'Under Investigation': return 'In Progress';
      default: return 'Open';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return colors.highPriority;
      case 'Medium': return colors.mediumPriority;
      case 'Low': return colors.lowPriority;
      default: return colors.lowPriority;
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.emergencyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || incident.emergencyType === filterType;
    const matchesPriority = filterPriority === 'all' || incident.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  const urgentIncidents = incidents.filter(incident => 
    incident.priority === 'High' && incident.status === 'Open'
  );

  const handleIncidentClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setDrawerOpen(true);
  };

  const handleDispatchUnit = (incidentId: string, carId: string) => {
    // Update incident and patrol car status
    setIncidents(prev => prev.map(inc => 
      inc.id === incidentId ? { ...inc, status: 'In Progress' } : inc
    ));
    setPatrolCars(prev => prev.map(car => 
      car.id === carId ? { ...car, status: 'Dispatched' } : car
    ));
  };

  const handleMarkResolved = (incidentId: string) => {
    setIncidents(prev => prev.map(inc => 
      inc.id === incidentId ? { ...inc, status: 'Resolved' } : inc
    ));
    setDrawerOpen(false);
  };

  const SparklineChart = ({ data }: { data: number[] }) => (
    <svg width="100" height="30" className="inline-block">
      <polyline
        points={data.map((value, index) => 
          `${(index / (data.length - 1)) * 100},${30 - (value / Math.max(...data)) * 30}`
        ).join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-blue-500"
      />
    </svg>
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: colors.navy }}>
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading Emergency Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`h-screen flex flex-col ${darkMode ? 'dark' : ''}`}
      style={{ backgroundColor: colors.navy }}
    >
      {/* Sticky Alert Bar */}
      {urgentIncidents.length > 0 && (
        <div 
          className="sticky top-0 z-50 backdrop-blur-md border-b border-white/10 p-3"
          style={{ backgroundColor: 'rgba(255, 59, 48, 0.1)' }}
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
              <span className="font-semibold">
                {urgentIncidents.length} High Priority Incident{urgentIncidents.length > 1 ? 's' : ''} Requiring Immediate Attention
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-green-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-400" />
              )}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Incident Feed */}
        <div className="w-80 border-r border-white/10 backdrop-blur-md bg-white/5 flex flex-col">
          {/* Search and Filters */}
          <div className="p-4 border-b border-white/10">
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="Theft">Theft</option>
                <option value="Accident">Accident</option>
                <option value="Violence">Violence</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none"
              >
                <option value="all">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Incidents List */}
          <div className="flex-1 overflow-y-auto">
            {filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                onClick={() => handleIncidentClick(incident)}
                className="p-4 border-b border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-200 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getPriorityColor(incident.priority) }}
                    ></div>
                    <span className="text-white font-semibold text-sm">{incident.referenceNumber}</span>
                  </div>
                  <span className="text-xs text-gray-400">{incident.timestamp}</span>
                </div>
                <h4 className="text-white font-medium mb-1">{incident.citizenName}</h4>
                <p className="text-gray-300 text-sm mb-1">{incident.emergencyType}</p>
                <div className="flex items-center text-gray-400 text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  {incident.location}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span 
                    className="px-2 py-1 rounded-lg text-xs font-medium"
                    style={{ 
                      backgroundColor: `${getPriorityColor(incident.priority)}20`,
                      color: getPriorityColor(incident.priority)
                    }}
                  >
                    {incident.priority}
                  </span>
                  <span className="text-xs text-gray-400">{incident.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Central Map Area */}
        <div className="flex-1 relative">
          {/* Map Container */}
          <div className="h-full bg-gray-800 relative overflow-hidden">
            {/* Glass overlay for map controls */}
            <div className="absolute top-4 left-4 backdrop-blur-md bg-white/10 rounded-xl p-3 border border-white/20">
              <h3 className="text-white font-semibold mb-2">Live Incident Map</h3>
              <div className="text-sm text-gray-300">
                {incidents.length} Active Incidents
              </div>
            </div>

            {/* Simulated Map with Incident Pins */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <p className="text-lg mb-2">Goa Police Coverage Area</p>
                <p className="text-sm text-gray-400">Interactive map would display here</p>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {incidents.slice(0, 9).map((incident, index) => (
                    <div
                      key={incident.id}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: getPriorityColor(incident.priority) }}
                      onClick={() => handleIncidentClick(incident)}
                    >
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Analytics Cards */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Open Cases</p>
                      <p className="text-white text-2xl font-bold">{analytics?.activeCases || 0}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">High Priority</p>
                      <p className="text-white text-2xl font-bold">{analytics?.urgentCases || 0}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </div>
                </div>
                <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Avg Response</p>
                      <p className="text-white text-2xl font-bold">{analytics?.averageResolutionTime || 0}h</p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-400" />
                  </div>
                </div>
                <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">24h Trend</p>
                      <SparklineChart data={[12, 19, 15, 27, 23, 18, 25]} />
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Resources */}
        <div className="w-80 border-l border-white/10 backdrop-blur-md bg-white/5 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white font-semibold mb-4">Resources & Personnel</h3>
            
            {/* Available Officers */}
            <div className="mb-6">
              <h4 className="text-gray-400 text-sm mb-2">Available Officers ({officers.filter(o => o.status === 'Available').length})</h4>
              <div className="space-y-2">
                {officers.filter(o => o.status === 'Available').slice(0, 3).map((officer) => (
                  <div key={officer.id} className="flex items-center justify-between p-2 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white text-sm">{officer.name}</span>
                    </div>
                    <span className="text-gray-400 text-xs">{officer.currentLocation}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Patrol Cars */}
            <div>
              <h4 className="text-gray-400 text-sm mb-2">Patrol Units ({patrolCars.filter(c => c.status === 'Available').length} Available)</h4>
              <div className="space-y-2">
                {patrolCars.filter(c => c.status === 'Available').slice(0, 3).map((car) => (
                  <div key={car.id} className="flex items-center justify-between p-2 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Car className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-sm">{car.callSign}</span>
                    </div>
                    <span className="text-gray-400 text-xs">{car.location}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Detail Drawer */}
      {drawerOpen && selectedIncident && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1" onClick={() => setDrawerOpen(false)}></div>
          <div className="w-96 h-full backdrop-blur-md bg-white/10 border-l border-white/20 flex flex-col">
            <div className="p-4 border-b border-white/20 flex items-center justify-between">
              <h3 className="text-white font-semibold">Incident Details</h3>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Reference Number</p>
                  <p className="text-white font-semibold">{selectedIncident.referenceNumber}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Citizen</p>
                  <p className="text-white">{selectedIncident.citizenName}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Emergency Type</p>
                  <p className="text-white">{selectedIncident.emergencyType}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="text-white">{selectedIncident.location}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Priority</p>
                  <span 
                    className="px-2 py-1 rounded-lg text-sm font-medium"
                    style={{ 
                      backgroundColor: `${getPriorityColor(selectedIncident.priority)}20`,
                      color: getPriorityColor(selectedIncident.priority)
                    }}
                  >
                    {selectedIncident.priority}
                  </span>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Description</p>
                  <p className="text-white">{selectedIncident.description}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Assigned Officer</p>
                  <select className="w-full mt-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white">
                    <option value="">{selectedIncident.assignedOfficer || 'Assign Officer...'}</option>
                    {officers.filter(o => o.status === 'Available').map(officer => (
                      <option key={officer.id} value={officer.name}>{officer.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-white/20 space-y-2">
              <button 
                onClick={() => handleDispatchUnit(selectedIncident.id, patrolCars[0]?.id)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Dispatch Unit
              </button>
              <button className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
                Request Backup
              </button>
              <button className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                Call Citizen
              </button>
              <button 
                onClick={() => handleMarkResolved(selectedIncident.id)}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Police Assistant */}
      <PoliceImage />
    </div>
  );
};

export default EmergencyDashboard;