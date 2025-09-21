import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calendar, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Phone,
  User,
  Search,
  Plus,
  Eye,
  Download,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../lib/useAuth';
import { firestoreService } from '../lib/firestoreService';

interface CitizenCase {
  id: string;
  type: string;
  description: string;
  location: string;
  status: string;
  priority: string;
  dateCreated: string;
  lastUpdate: string;
  assignedTo?: string;
  evidence?: string[];
  updates?: string[];
  referenceNumber: string;
}

const CitizenCaseManagement: React.FC = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<CitizenCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<CitizenCase | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewComplaintModal, setShowNewComplaintModal] = useState(false);

  // Load citizen's cases
  useEffect(() => {
    const loadCitizenCases = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get all cases filed by this citizen
        const allCases = await firestoreService.loadAllCases();
        const citizenCases = allCases.filter(caseData => 
          caseData.complainant === user.fullName || 
          caseData.complainant === user.email?.split('@')[0] ||
          caseData.fullRecord?.contact_email === user.email
        );
        
        const formattedCases: CitizenCase[] = citizenCases.map(caseData => ({
          id: caseData.id,
          type: caseData.type,
          description: caseData.description,
          location: caseData.location,
          status: caseData.status,
          priority: caseData.priority,
          dateCreated: caseData.date || caseData.lastUpdate,
          lastUpdate: caseData.lastUpdate,
          assignedTo: caseData.assignedTo,
          evidence: [],
          referenceNumber: `FIR-${caseData.id.slice(0, 8)}`
        }));
        
        setCases(formattedCases);
        console.log('✅ Loaded citizen cases:', formattedCases.length);
        
      } catch (err) {
        console.error('Error loading citizen cases:', err);
        setError('Failed to load your complaints');
      } finally {
        setLoading(false);
      }
    };

    loadCitizenCases();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'under investigation': return 'bg-blue-100 text-blue-800';
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return FileText;
    }
  };

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || case_.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-600 text-lg">Loading your complaints...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Complaints</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Complaints</h1>
            <p className="text-gray-600">Track and manage your filed complaints</p>
          </div>
          <button 
            onClick={() => setShowNewComplaintModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>File New Complaint</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search complaints by type, description, location, or reference number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="under investigation">Under Investigation</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{cases.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Open Cases</p>
              <p className="text-2xl font-bold text-orange-600">
                {cases.filter(c => c.status.toLowerCase() === 'open').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Under Investigation</p>
              <p className="text-2xl font-bold text-blue-600">
                {cases.filter(c => c.status.toLowerCase() === 'under investigation').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {cases.filter(c => c.status.toLowerCase() === 'resolved').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Cases List */}
      {filteredCases.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Complaints Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'No complaints match your search criteria.' 
              : 'You haven\'t filed any complaints yet.'}
          </p>
          {(!searchTerm && statusFilter === 'all') && (
            <button 
              onClick={() => setShowNewComplaintModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              File Your First Complaint
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCases.map((case_) => {
            const PriorityIcon = getPriorityIcon(case_.priority);
            return (
              <div key={case_.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <PriorityIcon className={`w-5 h-5 ${getPriorityColor(case_.priority)}`} />
                    <span className="text-sm font-medium text-gray-900">{case_.referenceNumber}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(case_.status)}`}>
                    {case_.status}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{case_.type}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{case_.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    {case_.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    Filed: {case_.dateCreated}
                  </div>
                  {case_.assignedTo && (
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-2" />
                      Assigned to: {case_.assignedTo}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setSelectedCase(case_)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors duration-200">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Case Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Complaint Details</h2>
                <button 
                  onClick={() => setSelectedCase(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                    <p className="text-gray-900 font-semibold">{selectedCase.referenceNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedCase.status)}`}>
                      {selectedCase.status}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Type</label>
                  <p className="text-gray-900">{selectedCase.type}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedCase.description}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <p className="text-gray-900">{selectedCase.location}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Filed</label>
                    <p className="text-gray-900">{selectedCase.dateCreated}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                    <p className="text-gray-900">{selectedCase.lastUpdate}</p>
                  </div>
                </div>
                
                {selectedCase.assignedTo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Officer</label>
                    <p className="text-gray-900">{selectedCase.assignedTo}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Contact Officer</span>
              </button>
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Add Update</span>
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Complaint Modal Placeholder */}
      {showNewComplaintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">File New Complaint</h3>
            <p className="text-gray-600 mb-4">This feature will redirect you to the citizen portal to file a new complaint.</p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowNewComplaintModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-200">
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenCaseManagement;