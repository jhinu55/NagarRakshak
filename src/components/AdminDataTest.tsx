import React, { useState, useEffect } from 'react';
import { firestoreService } from '../lib/firestoreService';
import AdminService from '../lib/adminService';

const AdminDataTest: React.FC = () => {
  const [firestoreData, setFirestoreData] = useState<any>(null);
  const [supabaseData, setSupabaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnections = async () => {
      console.log('🔍 Testing admin data connections...');
      
      try {
        // Test Firestore connection
        console.log('📊 Testing Firestore cases...');
        const cases = await firestoreService.loadAllCases();
        console.log('📊 Firestore cases found:', cases.length);
        setFirestoreData({
          cases: cases,
          caseCount: cases.length,
          sampleCase: cases[0] || null
        });

        // Test Supabase users
        console.log('👥 Testing Supabase users...');
        const users = await AdminService.getAllUsers();
        console.log('👥 Supabase users found:', users.length);
        setSupabaseData({
          users: users,
          userCount: users.length,
          sampleUser: users[0] || null
        });

        // Test admin stats
        console.log('📈 Testing admin stats...');
        const stats = await AdminService.getAdminStats();
        console.log('📈 Admin stats:', stats);

      } catch (err: any) {
        console.error('❌ Connection test failed:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testConnections();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Testing Admin Data Connections...</h2>
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Admin Data Connection Test</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <h3 className="font-bold text-red-900">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Firestore Data */}
      <div className="border rounded p-4">
        <h3 className="text-lg font-semibold text-green-700 mb-2">
          🔥 Firestore Connection
        </h3>
        {firestoreData ? (
          <div className="space-y-2">
            <p><strong>Cases Found:</strong> {firestoreData.caseCount}</p>
            {firestoreData.sampleCase && (
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>Sample Case:</strong></p>
                <p>ID: {firestoreData.sampleCase.id}</p>
                <p>Type: {firestoreData.sampleCase.type}</p>
                <p>Status: {firestoreData.sampleCase.status}</p>
                <p>Complainant: {firestoreData.sampleCase.complainant}</p>
              </div>
            )}
            {firestoreData.caseCount === 0 && (
              <p className="text-yellow-600">⚠️ No cases found in Firestore database</p>
            )}
          </div>
        ) : (
          <p className="text-red-600">❌ Failed to load Firestore data</p>
        )}
      </div>

      {/* Supabase Data */}
      <div className="border rounded p-4">
        <h3 className="text-lg font-semibold text-blue-700 mb-2">
          🗄️ Supabase Connection
        </h3>
        {supabaseData ? (
          <div className="space-y-2">
            <p><strong>Users Found:</strong> {supabaseData.userCount}</p>
            {supabaseData.sampleUser && (
              <div className="bg-gray-50 p-3 rounded">
                <p><strong>Sample User:</strong></p>
                <p>Email: {supabaseData.sampleUser.email}</p>
                <p>Role: {supabaseData.sampleUser.role}</p>
                <p>Name: {supabaseData.sampleUser.fullName}</p>
              </div>
            )}
            {supabaseData.userCount === 0 && (
              <p className="text-yellow-600">⚠️ No users found in Supabase auth</p>
            )}
          </div>
        ) : (
          <p className="text-red-600">❌ Failed to load Supabase data</p>
        )}
      </div>

      {/* Raw Data Display */}
      <details className="border rounded p-4">
        <summary className="cursor-pointer font-semibold">View Raw Data</summary>
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="font-semibold">Firestore Raw Data:</h4>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(firestoreData, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className="font-semibold">Supabase Raw Data:</h4>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(supabaseData, null, 2)}
            </pre>
          </div>
        </div>
      </details>
    </div>
  );
};

export default AdminDataTest;