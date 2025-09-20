import React, { useState, useEffect } from 'react';
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
  Trash2,
  Loader2,
  UserCheck
} from 'lucide-react';
import { loadFIRData, filterCases, deleteCase, transferCase, CaseData } from '../lib/firData';
import { useAuth } from '../lib/useAuth';
import CaseDetailView from './CaseDetailView';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import TransferCaseModal from './TransferCaseModal';
import CaseVerification from './CaseVerification';

const CaseManagement: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [verificationCase, setVerificationCase] = useState<CaseData | null>(null);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<CaseData | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Transfer modal state
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [caseToTransfer, setCaseToTransfer] = useState<CaseData | null>(null);

  // Load cases on component mount
  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true);
        
        // Get current officer name from auth context
        const currentOfficer = user?.fullName || user?.email?.split('@')[0];
        console.log('👮 Current officer from auth:', currentOfficer);
        console.log('📧 User email:', user?.email);
        console.log('👤 User fullName:', user?.fullName);
        
        // Load cases assigned to current officer only
        const firCases = await loadFIRData(currentOfficer);
        setCases(firCases);
        setError(null);
        
        console.log(`📊 Loaded ${firCases.length} cases for officer: ${currentOfficer}`);
        // Log the assigned officers of loaded cases for debugging
        if (firCases.length > 0) {
          console.log('👮‍♂️ Assigned officers in loaded cases:', firCases.map(c => c.assignedTo));
        }
      } catch (err) {
        setError('Failed to load cases. Please try again later.');
        console.error('Error loading cases:', err);
      } finally {
        setLoading(false);
      }
    };

    // Only load cases if user is available
    if (user) {
      loadCases();
    }
  }, [user]);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const filteredCases = filterCases(cases, searchTerm, filterStatus, filterPriority);

  const handleViewCase = (caseData: CaseData) => {
    setSelectedCase(caseData);
  };

  const handleBackToList = () => {
    setSelectedCase(null);
    setVerificationCase(null);
  };

  const handleVerifyCase = (caseData: CaseData) => {
    setVerificationCase(caseData);
    setSelectedCase(null);
  };

  const handleDeleteClick = (caseData: CaseData) => {
    setCaseToDelete(caseData);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (reason: string) => {
    if (!caseToDelete) return;

    try {
      // Call the delete function
      await deleteCase(caseToDelete.id, reason);
      
      // Remove the case from the local state
      setCases(prevCases => prevCases.filter(c => c.id !== caseToDelete.id));
      
      // Show success message
      setSuccessMessage(`Case ${caseToDelete.id} has been successfully deleted.`);
      
      // Close modal and reset state
      setDeleteModalOpen(false);
      setCaseToDelete(null);
      
    } catch (err) {
      console.error('Error deleting case:', err);
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setCaseToDelete(null);
  };

  const handleTransferClick = (caseData: CaseData) => {
    setCaseToTransfer(caseData);
    setTransferModalOpen(true);
  };

  const handleTransferConfirm = async (newOfficer: string, reason: string) => {
    if (!caseToTransfer) return;

    try {
      // Get current officer name for transfer logging
      const currentOfficer = user?.fullName || user?.email?.split('@')[0] || 'Unknown Officer';
      
      // Call the transfer function
      await transferCase(caseToTransfer.id, newOfficer, reason, currentOfficer);
      
      // Remove the case from the local state since it's no longer assigned to current officer
      setCases(prevCases => prevCases.filter(c => c.id !== caseToTransfer.id));
      
      // Show success message
      setSuccessMessage(`Case ${caseToTransfer.id} has been successfully transferred to ${newOfficer}.`);
      
      // Close modal and reset state
      setTransferModalOpen(false);
      setCaseToTransfer(null);
      
    } catch (err) {
      console.error('Error transferring case:', err);
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const handleTransferCancel = () => {
    setTransferModalOpen(false);
    setCaseToTransfer(null);
  };

  // Show verification view if a case is being verified
  if (verificationCase) {
    return <CaseVerification caseData={verificationCase} onBack={handleBackToList} />;
  }

  // Show detailed view if a case is selected
  if (selectedCase) {
    return <CaseDetailView caseData={selectedCase} onBack={handleBackToList} onVerify={handleVerifyCase} />;
  }

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
              <button 
                onClick={() => handleViewCase(case_)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleTransferClick(case_)}
                className="px-3 py-2 border border-blue-300 text-blue-700 text-sm rounded-lg hover:bg-blue-50 transition-colors duration-200"
                title="Transfer Case"
              >
                <UserCheck className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDeleteClick(case_)}
                className="px-3 py-2 border border-red-300 text-red-700 text-sm rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
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
                    <button 
                      onClick={() => handleViewCase(case_)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Case"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900" title="Edit Case">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleTransferClick(case_)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Transfer Case"
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>
                    {/* Fixed delete button */}
                    <button 
                      onClick={() => handleDeleteClick(case_)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Case"
                    >
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
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Cases assigned to: <span className="font-semibold text-blue-600">
              {user?.fullName || user?.email?.split('@')[0] || 'Current Officer'}
            </span>
          </p>
          {!loading && !error && (
            <div className="text-sm text-gray-500">
              Showing {filteredCases.length} of {cases.length} assigned cases
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading cases...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 font-medium">Error</span>
          </div>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium">Success</span>
          </div>
          <p className="text-green-600 mt-1">{successMessage}</p>
        </div>
      )}

      {/* Main Content - Only show when not loading and no error */}
      {!loading && !error && (
        <>
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

      {/* Cases Display */}
      {viewMode === 'grid' ? renderGridView() : renderListView()}

      {/* Empty State */}
      {filteredCases.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {cases.length === 0 ? 'No cases assigned' : 'No cases found'}
          </h3>
          <p className="text-gray-600">
            {cases.length === 0 
              ? 'You currently have no cases assigned to you.'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
        </div>
      )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        caseId={caseToDelete?.id || ''}
        caseType={caseToDelete?.type || ''}
        complainantName={caseToDelete?.complainant || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* Transfer Case Modal */}
      <TransferCaseModal
        isOpen={transferModalOpen}
        caseId={caseToTransfer?.id || ''}
        caseType={caseToTransfer?.type || ''}
        currentOfficer={caseToTransfer?.assignedTo || ''}
        onConfirm={handleTransferConfirm}
        onCancel={handleTransferCancel}
      />
    </div>
  );
};

export default CaseManagement;