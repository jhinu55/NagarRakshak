import React, { useState, useEffect } from 'react';
import AdminService from '../lib/adminService';
import { firestoreService } from '../lib/firestoreService';

const CaseDebugComponent: React.FC = () => {
  const [adminCases, setAdminCases] = useState<any[]>([]);
  const [firestoreCases, setFirestoreCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔧 [DEBUG] Loading cases from both sources...');
      
      // Load from admin service
      const adminData = await AdminService.getAllCases();
      console.log('📊 [DEBUG] AdminService.getAllCases() returned:', adminData.length, 'cases');
      setAdminCases(adminData);
      
      // Load directly from Firestore
      const firestoreData = await firestoreService.loadAllCases();
      console.log('📊 [DEBUG] firestoreService.loadAllCases() returned:', firestoreData.length, 'cases');
      setFirestoreCases(firestoreData);
      
      setLoading(false);
    } catch (err) {
      console.error('❌ [DEBUG] Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading debug data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Case Data Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">
            AdminService.getAllCases() 
            <span className="text-sm font-normal text-gray-600">
              ({adminCases.length} cases)
            </span>
          </h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {adminCases.length === 0 ? (
              <p className="text-gray-500">No cases from AdminService</p>
            ) : (
              adminCases.slice(0, 5).map((case_, idx) => (
                <div key={idx} className="text-sm border-b pb-2">
                  <div><strong>ID:</strong> {case_.id}</div>
                  <div><strong>Type:</strong> {case_.type}</div>
                  <div><strong>Status:</strong> {case_.status}</div>
                  <div><strong>Complainant:</strong> {case_.complainant}</div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">
            firestoreService.getAllCases() 
            <span className="text-sm font-normal text-gray-600">
              ({firestoreCases.length} cases)
            </span>
          </h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {firestoreCases.length === 0 ? (
              <p className="text-gray-500">No cases from Firestore</p>
            ) : (
              firestoreCases.slice(0, 5).map((case_, idx) => (
                <div key={idx} className="text-sm border-b pb-2">
                  <div><strong>ID:</strong> {case_.id}</div>
                  <div><strong>Type:</strong> {case_.type}</div>
                  <div><strong>Status:</strong> {case_.status}</div>
                  <div><strong>Complainant:</strong> {case_.complainant}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <button 
        onClick={loadData}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reload Data
      </button>
    </div>
  );
};

export default CaseDebugComponent;