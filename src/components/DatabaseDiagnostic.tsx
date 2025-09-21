import React, { useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { supabase } from '../lib/supabaseClient';
import { createSampleFIRData } from '../lib/sampleDataCreator';

const DatabaseDiagnostic: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setResults(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testFirestore = async () => {
    addResult('🔥 Starting Firestore diagnostics...', 'info');
    
    try {
      // Test 1: Check if we can connect to Firestore
      addResult('📡 Testing Firestore connection...', 'info');
      
      // Test 2: Try to list collections (this might not work in web apps)
      addResult('📂 Checking for existing collections...', 'info');
      
      // Test 3: Check the 'firs' collection specifically
      try {
        const firsRef = collection(db, 'firs');
        const firsSnapshot = await getDocs(firsRef);
        addResult(`📊 'firs' collection: ${firsSnapshot.size} documents found`, firsSnapshot.size > 0 ? 'success' : 'warning');
        
        if (firsSnapshot.size > 0) {
          firsSnapshot.forEach((doc) => {
            const data = doc.data();
            addResult(`📄 Document ID: ${doc.id}, Type: ${data.incident_type || 'Unknown'}`, 'info');
          });
        }
      } catch (error: any) {
        addResult(`❌ Error accessing 'firs' collection: ${error.message}`, 'error');
      }

      // Test 4: Check common alternative collection names
      const alternativeNames = ['cases', 'complaints', 'reports', 'incidents'];
      for (const name of alternativeNames) {
        try {
          const altRef = collection(db, name);
          const altSnapshot = await getDocs(altRef);
          addResult(`📂 '${name}' collection: ${altSnapshot.size} documents found`, altSnapshot.size > 0 ? 'success' : 'info');
        } catch (error: any) {
          addResult(`❌ Error accessing '${name}' collection: ${error.message}`, 'error');
        }
      }

      // Test 5: Try to create a test document
      try {
        addResult('✍️ Attempting to create test document...', 'info');
        const testRef = collection(db, 'test');
        await addDoc(testRef, {
          test: true,
          created_at: new Date().toISOString(),
          message: 'Admin diagnostic test'
        });
        addResult('✅ Test document created successfully - Firestore write access confirmed', 'success');
      } catch (error: any) {
        addResult(`❌ Cannot create test document: ${error.message}`, 'error');
        if (error.code === 'permission-denied') {
          addResult('🔐 This might be due to Firestore security rules', 'warning');
        }
      }

    } catch (error: any) {
      addResult(`❌ Firestore test failed: ${error.message}`, 'error');
    }
  };

  const testSupabase = async () => {
    addResult('🗄️ Starting Supabase diagnostics...', 'info');
    
    try {
      // Test 1: Check authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        addResult(`❌ Supabase auth session error: ${sessionError.message}`, 'error');
      } else {
        addResult(`👤 Current session: ${session ? 'Authenticated' : 'Not authenticated'}`, session ? 'success' : 'warning');
        if (session) {
          addResult(`📧 User: ${session.user.email}`, 'info');
          addResult(`🎭 Role: ${session.user.user_metadata?.role || 'Not set'}`, 'info');
        }
      }

      // Test 2: Check if we can list users (admin function)
      try {
        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
        if (usersError) {
          addResult(`❌ Cannot list users: ${usersError.message}`, 'error');
          addResult('🔑 This might require service role key for admin functions', 'warning');
        } else {
          addResult(`👥 Found ${users.length} users in Supabase Auth`, 'success');
          users.slice(0, 3).forEach(user => {
            addResult(`👤 User: ${user.email} (${user.user_metadata?.role || 'no role'})`, 'info');
          });
        }
      } catch (error: any) {
        addResult(`❌ Admin functions not available: ${error.message}`, 'error');
      }

      // Test 3: Try to read from a basic table
      try {
        const { data, error } = await supabase.from('profiles').select('*').limit(5);
        if (error) {
          addResult(`❌ Cannot read profiles table: ${error.message}`, 'error');
        } else {
          addResult(`📋 Profiles table: ${data?.length || 0} records found`, 'success');
        }
      } catch (error: any) {
        addResult(`❌ Error reading profiles: ${error.message}`, 'error');
      }

    } catch (error: any) {
      addResult(`❌ Supabase test failed: ${error.message}`, 'error');
    }
  };

  const runDiagnostics = async () => {
    setLoading(true);
    setResults([]);
    
    await testFirestore();
    await testSupabase();
    
    setLoading(false);
    addResult('🎯 Diagnostics completed!', 'success');
  };

  const createSampleData = async () => {
    addResult('📝 Creating comprehensive sample FIR data...', 'info');
    
    try {
      await createSampleFIRData();
      addResult('✅ Sample FIR data created successfully!', 'success');
      addResult('🔄 Now try refreshing the admin dashboard to see the data', 'info');
      
    } catch (error: any) {
      addResult(`❌ Failed to create sample data: ${error.message}`, 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🔍 Database Connection Diagnostics
        </h1>
        <p className="text-gray-600 mb-6">
          This tool helps diagnose why the admin dashboard might not be showing data.
        </p>
        
        <div className="flex space-x-4 mb-6">
          <button
            onClick={runDiagnostics}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Running...' : 'Run Diagnostics'}
          </button>
          
          <button
            onClick={createSampleData}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Create Sample Data
          </button>
        </div>

        {/* Results */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg text-sm font-mono ${
                result.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                result.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
                result.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              <span className="text-gray-500 text-xs">[{result.timestamp}]</span> {result.message}
            </div>
          ))}
        </div>

        {results.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Click "Run Diagnostics" to check your database connections
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseDiagnostic;