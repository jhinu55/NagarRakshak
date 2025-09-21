import React, { useState, useEffect } from 'react';
import { firestoreService } from '../lib/firestoreService';
import { 
  FileText, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  Calendar
} from 'lucide-react';

// Define the case data interface locally since it's not exported
interface CaseData {
  id: string;
  type: string;
  description: string;
  complainant: string;
  status: string;
  priority: string;
  assignedTo?: string;
  location?: string;
  created_at?: { seconds: number };
}

const AllCases: React.FC = () => {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadAllCases();
  }, []);

  const loadAllCases = async () => {
    try {
      console.log('🔧 [ALL CASES] Loading ALL cases from Firestore...');
      setLoading(true);
      setError(null);
      
      const allCases = await firestoreService.loadAllCases();
      console.log(`✅ [ALL CASES] Successfully loaded ${allCases.length} cases`);
      console.log('📋 [ALL CASES] Sample cases:', allCases.slice(0, 3));
      
      setCases(allCases);
    } catch (err) {
      console.error('❌ [ALL CASES] Error loading cases:', err);
      setError(err instanceof Error ? err.message : 'Failed to load cases');
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = !searchTerm || 
      case_.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || case_.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under investigation':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'High') {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    } else if (priority === 'Medium') {
      return <Clock className="w-4 h-4 text-yellow-500" />;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading all cases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Cases</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={loadAllCases}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Cases</h2>
          <p className="mt-1 text-gray-600">
            Displaying {filteredCases.length} of {cases.length} total cases
          </p>
        </div>
        <button
          onClick={loadAllCases}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cases by ID, type, complainant, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Under Investigation">Under Investigation</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cases Grid/List */}
        {filteredCases.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {cases.length === 0 ? 'No Cases Found' : 'No Cases Match Your Filters'}
            </h3>
            <p className="text-gray-500 mb-4">
              {cases.length === 0 
                ? 'There are no cases in the system yet.'
                : `Try adjusting your search or filter criteria. There are ${cases.length} total cases available.`
              }
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCases.map((case_) => (
              <div key={case_.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">{case_.id}</h3>
                    {getPriorityIcon(case_.priority)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                      {case_.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {case_.created_at && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(case_.created_at.seconds * 1000).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Case Type</h4>
                    <p className="text-gray-900">{case_.type}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Complainant</h4>
                    <p className="text-gray-900">{case_.complainant}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Assigned Officer</h4>
                    <p className="text-gray-900">{case_.assignedTo || 'Unassigned'}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                  <p className="text-gray-700 text-sm">{case_.description}</p>
                </div>

                {case_.location && (
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{case_.location}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default AllCases;