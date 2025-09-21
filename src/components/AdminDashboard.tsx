import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/useAuth';
import { firestoreService } from '../lib/firestoreService';
import { 
  CheckCircle, 
  History, 
  RefreshCw,
  LogOut,
  AlertTriangle,
  Clock,
  FileText
} from 'lucide-react';

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

interface AuditLog {
  id: string;
  action: string;
  caseId: string;
  performedBy: string;
  fromOfficer?: string;
  toOfficer?: string;
  timestamp: Date;
  reason: string;
}

const AdminCases: React.FC = () => {
  const { user, signOut } = useAuth();
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [availableOfficers, setAvailableOfficers] = useState<string[]>([]);
  const [officersLoading, setOfficersLoading] = useState(true);

  useEffect(() => {
    loadAllCases();
    loadOfficers();
  }, []);

  const loadOfficers = async () => {
    try {
      setOfficersLoading(true);
      console.log('📋 Loading officers from Firestore...');
      const officers = await firestoreService.getAllOfficerNames();
      
      if (officers && officers.length > 0) {
        setAvailableOfficers(officers);
        console.log(`✅ Loaded ${officers.length} officers from Firestore:`, officers);
      } else {
        console.warn('⚠️ No officers found in Firestore, using fallback');
        setAvailableOfficers(['Officer Smith', 'Officer Johnson', 'Officer Wilson', 'Officer Brown']);
      }
    } catch (error) {
      console.error('❌ Error loading officers from Firestore:', error);
      console.log('🔄 Using fallback officer list');
      // Fallback to default officers
      setAvailableOfficers(['Officer Smith', 'Officer Johnson', 'Officer Wilson', 'Officer Brown']);
    } finally {
      setOfficersLoading(false);
    }
  };

  const loadAllCases = async () => {
    try {
      console.log('Loading ALL cases for admin...');
      const allCases = await firestoreService.loadAllCases();
      console.log('Loaded cases:', allCases.length);
      setCases(allCases);
    } catch (err) {
      console.error('Error loading cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const transferCase = async (caseId: string, fromOfficer: string, toOfficer: string) => {
    try {
      const reason = prompt('Please provide a reason for the transfer:');
      if (!reason) return;

      // Use the existing transferCase method
      await firestoreService.transferCase(caseId, toOfficer, reason, fromOfficer);
      
      // Log the transfer action
      const auditEntry: AuditLog = {
        id: `audit_${Date.now()}`,
        action: 'case_transferred',
        caseId,
        performedBy: user?.email || 'Unknown Admin',
        fromOfficer,
        toOfficer,
        timestamp: new Date(),
        reason
      };
      
      setAuditLogs(prev => [auditEntry, ...prev]);
      console.log('🔄 Case transferred:', auditEntry);
      
      // Refresh cases
      await loadAllCases();
      alert(`Case ${caseId} transferred from ${fromOfficer} to ${toOfficer}`);
    } catch (error) {
      console.error('Error transferring case:', error);
      alert('Failed to transfer case');
    }
  };

  const markCaseResolved = async (caseId: string) => {
    try {
      await firestoreService.updateCaseStatus(caseId, 'Resolved');
      
      // Log the resolution action
      const auditEntry: AuditLog = {
        id: `audit_${Date.now()}`,
        action: 'case_resolved',
        caseId,
        performedBy: user?.email || 'Unknown Admin',
        timestamp: new Date(),
        reason: 'Case marked as resolved by admin'
      };
      
      setAuditLogs(prev => [auditEntry, ...prev]);
      console.log('✅ Case resolved:', auditEntry);
      
      // Refresh cases
      await loadAllCases();
      alert(`Case ${caseId} marked as resolved`);
    } catch (error) {
      console.error('Error resolving case:', error);
      alert('Failed to resolve case');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'under investigation': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-8">Loading case management...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Case Management</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowAuditLogs(!showAuditLogs)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2 shadow-sm"
          >
            <History className="w-4 h-4" />
            <span>{showAuditLogs ? 'Hide' : 'Show'} Audit Logs</span>
          </button>
          <button 
            onClick={signOut} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">All Cases ({cases.length})</h2>
            <p className="text-sm text-gray-600 mt-1">
              {officersLoading ? (
                <span className="inline-flex items-center">
                  <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                  Loading officers from Firestore...
                </span>
              ) : (
                <span>
                  {availableOfficers.length} officers loaded from database: {availableOfficers.slice(0, 3).join(', ')}
                  {availableOfficers.length > 3 && ` (+${availableOfficers.length - 3} more)`}
                </span>
              )}
            </p>
          </div>
          <button 
            onClick={loadAllCases}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Cases</span>
          </button>
        </div>
      </div>

      {/* Audit Logs Section */}
      {showAuditLogs && (
        <div className="mb-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <History className="w-5 h-5" />
            <span>Recent Audit Logs ({auditLogs.length})</span>
          </h3>
          {auditLogs.length === 0 ? (
            <p className="text-gray-500">No audit logs yet</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="bg-white p-3 rounded border-l-4 border-purple-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">
                        {log.action === 'case_transferred' && (
                          <span>📄 Case {log.caseId} transferred from {log.fromOfficer} to {log.toOfficer}</span>
                        )}
                        {log.action === 'case_resolved' && (
                          <span>✅ Case {log.caseId} marked as resolved</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-600">By: {log.performedBy}</p>
                      <p className="text-xs text-gray-500">Reason: {log.reason}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {log.timestamp.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cases List */}
      <div className="space-y-4">
        {cases.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No cases found</p>
          </div>
        ) : (
          cases.map((case_) => (
            <div key={case_.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{case_.id}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(case_.status)}`}>
                      {case_.status}
                    </span>
                    {case_.priority && (
                      <span className={`text-sm font-medium ${getPriorityColor(case_.priority)}`}>
                        {case_.priority === 'High' && <AlertTriangle className="w-4 h-4 inline mr-1" />}
                        {case_.priority === 'Medium' && <Clock className="w-4 h-4 inline mr-1" />}
                        {case_.priority}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1"><strong>Type:</strong> {case_.type}</p>
                  <p className="text-sm text-gray-600 mb-1"><strong>Complainant:</strong> {case_.complainant}</p>
                  <p className="text-sm text-gray-600 mb-1"><strong>Assigned To:</strong> {case_.assignedTo || 'Unassigned'}</p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col space-y-2">
                  {case_.status !== 'Resolved' && (
                    <button
                      onClick={() => markCaseResolved(case_.id)}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200 flex items-center space-x-1 shadow-sm"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>Mark Resolved</span>
                    </button>
                  )}
                  
                  {case_.assignedTo && (
                    <div className="relative">
                      <select
                        onChange={(e) => {
                          if (e.target.value && e.target.value !== case_.assignedTo) {
                            transferCase(case_.id, case_.assignedTo!, e.target.value);
                            e.target.value = ''; // Reset select
                          }
                        }}
                        disabled={officersLoading}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm min-w-[120px]"
                      >
                        <option value="">{officersLoading ? 'Loading...' : 'Transfer Case'}</option>
                        {!officersLoading && availableOfficers.filter(officer => officer !== case_.assignedTo).map(officer => (
                          <option key={officer} value={officer} className="text-gray-900">{officer}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {!case_.assignedTo && (
                    <div className="relative">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            transferCase(case_.id, 'Unassigned', e.target.value);
                            e.target.value = ''; // Reset select
                          }
                        }}
                        disabled={officersLoading}
                        className="px-3 py-2 bg-amber-600 text-white rounded-md text-sm hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm min-w-[120px]"
                      >
                        <option value="">{officersLoading ? 'Loading...' : 'Assign Officer'}</option>
                        {!officersLoading && availableOfficers.map(officer => (
                          <option key={officer} value={officer} className="text-gray-900">{officer}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded p-3 mb-3">
                <p className="text-sm text-gray-700"><strong>Description:</strong> {case_.description}</p>
                {case_.location && (
                  <p className="text-sm text-gray-600 mt-1"><strong>Location:</strong> {case_.location}</p>
                )}
              </div>
              
              {case_.created_at && (
                <p className="text-xs text-gray-500">
                  Created: {new Date(case_.created_at.seconds * 1000).toLocaleString()}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCases;
