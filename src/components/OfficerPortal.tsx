import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  MapPin,
  Calendar,
  FileText,
  Bell,
  Settings
} from 'lucide-react';

const OfficerPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
      evidence: ['photo1.jpg', 'witness_statement.pdf'],
      updates: [
        { date: '2024-01-15', action: 'Case registered', officer: 'Officer Singh' },
        { date: '2024-01-16', action: 'Evidence collected', officer: 'Officer Singh' },
        { date: '2024-01-17', action: 'Witness interviewed', officer: 'Officer Patel' }
      ]
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
      evidence: ['audio_recording.mp3'],
      updates: [
        { date: '2024-01-14', action: 'Case registered', officer: 'Officer Patel' },
        { date: '2024-01-15', action: 'Mediation conducted', officer: 'Officer Patel' },
        { date: '2024-01-16', action: 'Case resolved', officer: 'Officer Patel' }
      ]
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
      evidence: ['screenshots.zip', 'bank_statements.pdf'],
      updates: [
        { date: '2024-01-16', action: 'Case registered', officer: 'Officer Kumar' }
      ]
    }
  ];

  const filteredCases = cases.filter(case_ =>
    case_.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    case_.complainant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Cases</p>
              <p className="text-2xl font-bold text-blue-900">24</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-orange-900">8</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Resolved</p>
              <p className="text-2xl font-bold text-green-900">14</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Urgent</p>
              <p className="text-2xl font-bold text-red-900">2</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-orange-500" />
          Recent Alerts
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <p className="font-medium text-red-900">High Priority Case: FIR003</p>
              <p className="text-sm text-red-700">Cybercrime case requires immediate attention</p>
            </div>
            <span className="text-xs text-red-600">2 min ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="font-medium text-blue-900">New Evidence: FIR001</p>
              <p className="text-sm text-blue-700">CCTV footage uploaded for theft case</p>
            </div>
            <span className="text-xs text-blue-600">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCaseList = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          <span>New Case</span>
        </button>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Complainant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCases.map((case_) => (
                <tr key={case_.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {case_.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {case_.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      case_.status === 'Resolved'
                        ? 'bg-green-100 text-green-800'
                        : case_.status === 'Under Investigation'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {case_.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      case_.priority === 'High'
                        ? 'bg-red-100 text-red-800'
                        : case_.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {case_.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {case_.complainant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {case_.assignedTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedCase(case_)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCaseDetails = () => {
    if (!selectedCase) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Case Details: {selectedCase.id}</h2>
          <button
            onClick={() => setSelectedCase(null)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            ← Back to Cases
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Case Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Case Type</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCase.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    selectedCase.status === 'Resolved'
                      ? 'bg-green-100 text-green-800'
                      : selectedCase.status === 'Under Investigation'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedCase.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    selectedCase.priority === 'High'
                      ? 'bg-red-100 text-red-800'
                      : selectedCase.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedCase.priority}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned Officer</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCase.assignedTo}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Complainant</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCase.complainant}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCase.date}</p>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="mt-1 text-sm text-gray-900 flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {selectedCase.location}
                </p>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 text-sm text-gray-900">{selectedCase.description}</p>
              </div>
            </div>

            {/* Evidence */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Evidence</h3>
              <div className="space-y-2">
                {selectedCase.evidence.map((item: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">{item}</span>
                    <button className="ml-auto text-blue-600 hover:text-blue-800 text-sm">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Case Timeline */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Timeline</h3>
              <div className="space-y-4">
                {selectedCase.updates.map((update: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{update.action}</p>
                      <p className="text-xs text-gray-500">{update.officer}</p>
                      <p className="text-xs text-gray-400">{update.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                Add Update
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Update Status
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  Assign Officer
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  Generate Report
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  Contact Complainant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Officer Portal</h1>
        <p className="text-gray-600">Manage cases, track investigations, and coordinate with team</p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setSelectedCase(null);
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard' && !selectedCase
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              setActiveTab('cases');
              setSelectedCase(null);
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'cases' && !selectedCase
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Cases
          </button>
          {selectedCase && (
            <button
              className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm"
            >
              Case Details
            </button>
          )}
        </nav>
      </div>

      {/* Content */}
      {selectedCase ? renderCaseDetails() : activeTab === 'dashboard' ? renderDashboard() : renderCaseList()}
    </div>
  );
};

export default OfficerPortal;