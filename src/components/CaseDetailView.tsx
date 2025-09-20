import React from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Users,
  Shield,
  Edit,
  Download,
  Share2,
  CheckSquare
} from 'lucide-react';
import { CaseData } from '../lib/firData';

interface CaseDetailViewProps {
  caseData: CaseData;
  onBack: () => void;
  onVerify?: (caseData: CaseData) => void;
}

const CaseDetailView: React.FC<CaseDetailViewProps> = ({ caseData, onBack, onVerify }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Under Investigation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Resolved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Under Investigation': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'Pending': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCreatedAt = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cases</span>
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Case Details: {caseData.id}
            </h1>
            <p className="text-gray-600">Complete information about this case</p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button 
              onClick={() => onVerify && onVerify(caseData)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Verify Case</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Edit className="w-4 h-4" />
              <span>Edit Case</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status and Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <div className="flex items-center space-x-3 mb-4">
            {getStatusIcon(caseData.status)}
            <h3 className="text-lg font-semibold text-gray-900">Case Status</h3>
          </div>
          <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(caseData.status)}`}>
            {caseData.status}
          </span>
          <p className="text-sm text-gray-500 mt-2">Last updated: {caseData.lastUpdate}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Priority</h3>
          </div>
          <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(caseData.priority)}`}>
            {caseData.priority} Priority
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${caseData.progress}%` }}
              ></div>
            </div>
            <span className="text-lg font-semibold text-gray-900">{caseData.progress}%</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Basic Information</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">FIR Number</label>
              <p className="text-lg font-semibold text-gray-900">{caseData.fullRecord.fir_number}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Incident Type</label>
              <p className="text-lg text-gray-900">{caseData.fullRecord.incident_type}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Assigned Officer</label>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <p className="text-lg text-gray-900">{caseData.assignedTo}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Case Registered</label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-lg text-gray-900">{formatCreatedAt(caseData.fullRecord.created_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Complainant Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Complainant Information</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              <p className="text-lg text-gray-900">{caseData.fullRecord.victim_full_name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Contact Phone</label>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="text-lg text-gray-900">{caseData.fullRecord.contact_phone}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="text-lg text-gray-900">{caseData.fullRecord.contact_email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Incident Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 border lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Incident Details</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Date & Time</label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-lg text-gray-900">{formatDateTime(caseData.fullRecord.incident_datetime)}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <p className="text-lg text-gray-900">{caseData.fullRecord.incident_location_address}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-500 mb-3">Description</label>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <p className="text-gray-900 leading-relaxed">{caseData.fullRecord.incident_description}</p>
            </div>
          </div>
        </div>

        {/* Suspects and Witnesses */}
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Suspects</span>
          </h2>
          
          {caseData.fullRecord.suspect_names && caseData.fullRecord.suspect_names.length > 0 ? (
            <div className="space-y-2">
              {caseData.fullRecord.suspect_names.map((suspect, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-gray-900">{suspect}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No suspects identified</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Witnesses</span>
          </h2>
          
          {caseData.fullRecord.witness_names_contacts ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-gray-900">{caseData.fullRecord.witness_names_contacts}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No witnesses recorded</p>
          )}
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 border lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Property Details</span>
          </h2>
          
          <div className="bg-gray-50 rounded-lg p-4 border">
            <p className="text-gray-900 leading-relaxed">{caseData.fullRecord.property_details}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailView;