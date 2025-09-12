import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download,
  Calendar,
  MapPin,
  User,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const CaseManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const cases = [
    {
      id: 'FIR001',
      type: 'Theft',
      status: 'Under Investigation',
      priority: 'High',
      complainant: 'Rajesh Kumar',
      location: 'Market Street, Panaji',
      date: '2024-01-15',
      assignedTo: 'Officer Singh',
      description: 'Bicycle stolen from parking area near the market',
      progress: 65,
      lastUpdate: '2 hours ago'
    },
    {
      id: 'FIR002',
      type: 'Domestic Dispute',
      status: 'Resolved',
      priority: 'Medium',
      complainant: 'Priya Sharma',
      location: 'Residential Area, Margao',
      date: '2024-01-14',
      assignedTo: 'Officer Patel',
      description: 'Noise complaint from neighbors',
      progress: 100,
      lastUpdate: '1 day ago'
    },
    {
      id: 'FIR003',
      type: 'Cybercrime',
      status: 'Pending',
      priority: 'High',
      complainant: 'Amit Desai',
      location: 'Online',
      date: '2024-01-16',
      assignedTo: 'Officer Kumar',
      description: 'Online fraud - fake investment scheme',
      progress: 20,
      lastUpdate: '30 minutes ago'
    },
    {
      id: 'FIR004',
      type: 'Traffic Violation',
      status: 'Under Investigation',
      priority: 'Low',
      complainant: 'Maria Fernandes',
      location: 'Highway NH-66',
      date: '2024-01-17',
      assignedTo: 'Officer D\'Souza',
      description: 'Reckless driving and overspeeding',
      progress: 40,
      lastUpdate: '4 hours ago'
    },
    {
      id: 'FIR005',
      type: 'Missing Person',
      status: 'Under Investigation',
      priority: 'High',
      complainant: 'Sunita Naik',
      location: 'Vasco da Gama',
      date: '2024-01-18',
      assignedTo: 'Officer Singh',
      description: 'Teenage daughter missing since yesterday',
      progress: 30,
      lastUpdate: '1 hour ago'
    },
    {
      id: 'FIR006',
      type: 'Fraud',
      status: 'Resolved',
      priority: 'Medium',
      complainant: 'Carlos Pereira',
      location: 'Calangute',
      date: '2024-01-12',
      assignedTo: 'Officer Patel',
      description: 'Credit card fraud at local restaurant',
      progress: 100,
      lastUpdate: '3 days ago'
    }
  ];

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.complainant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || case_.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || case_.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Under Investigation': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Resolved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Under Investigation': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Pending': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCases.map((case_) => (
        <div key={case_.id} className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(case_.status)}
                <span className="font-semibold text-gray-900">{case_.id}</span>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(case_.priority)}`}>
                {case_.priority}
              </span>
            </div>

            {/* Case Type */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{case_.type}</h3>
            
            {/* Status */}
            <div className="flex items-center space-x-2 mb-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(case_.status)}`}>
                {case_.status}
              </span>
              <span className="text-xs text-gray-500">{case_.lastUpdate}</span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{case_.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${case_.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{case_.complainant}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{case_.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{case_.date}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700 mb-4 line-clamp-2">{case_.description}</p>

            {/* Actions */}
            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCases.map((case_) => (
              <tr key={case_.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(case_.status)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{case_.id}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm font-medium text-gray-700">{case_.type}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{case_.complainant}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{case_.location}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{case_.date}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(case_.status)}`}>
                    {case_.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{case_.lastUpdate}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(case_.priority)}`}>
                    {case_.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {case_.assignedTo}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${case_.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 w-8">{case_.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Case Management</h1>
        <p className="text-gray-600">Manage and track all cases in the system</p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cases by ID, type, or complainant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <Plus className="w-4 h-4" />
              <span>New Case</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Resolved">Resolved</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">View:</span>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 text-sm ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-sm ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredCases.length} of {cases.length} cases
        </p>
      </div>

      {/* Cases Display */}
      {viewMode === 'grid' ? renderGridView() : renderListView()}

      {/* Empty State */}
      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cases found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default CaseManagement;