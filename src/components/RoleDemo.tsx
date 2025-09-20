import React from 'react';
import { useAuth } from '../lib/useAuth';
import { User, Shield, Settings, LogOut } from 'lucide-react';

const RoleDemo: React.FC = () => {
  const { user, signOut, role } = useAuth();

  const getRoleIcon = () => {
    switch (role) {
      case 'citizen':
        return <User className="w-8 h-8 text-blue-600" />;
      case 'officer':
        return <Shield className="w-8 h-8 text-green-600" />;
      case 'admin':
        return <Settings className="w-8 h-8 text-purple-600" />;
      default:
        return <User className="w-8 h-8 text-gray-600" />;
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case 'citizen':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'officer':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center">
              {getRoleIcon()}
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-800">Welcome!</h1>
                <p className="text-gray-600">Role-based dashboard</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">User Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <p className="font-medium">{user?.fullName || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Role:</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor()}`}>
                    {role?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">User ID:</span>
                  <p className="font-mono text-xs break-all">{user?.id}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Role Permissions</h3>
              <div className="space-y-2">
                {role === 'citizen' && (
                  <>
                    <div className="flex items-center text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                      File complaints
                    </div>
                    <div className="flex items-center text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                      Track case status
                    </div>
                    <div className="flex items-center text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                      Access public services
                    </div>
                  </>
                )}
                
                {role === 'officer' && (
                  <>
                    <div className="flex items-center text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                      Manage cases
                    </div>
                    <div className="flex items-center text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                      Update investigations
                    </div>
                    <div className="flex items-center text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                      Access officer tools
                    </div>
                    <div className="flex items-center text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                      View citizen complaints
                    </div>
                  </>
                )}
                
                {role === 'admin' && (
                  <>
                    <div className="flex items-center text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                      System administration
                    </div>
                    <div className="flex items-center text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                      User management
                    </div>
                    <div className="flex items-center text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                      Analytics and reports
                    </div>
                    <div className="flex items-center text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                      All system access
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">🔒 Security Notice</h3>
            <p className="text-yellow-700">
              Role-based authentication is now active. Users can only access features and pages 
              that match their assigned role. Any attempt to access unauthorized content will be blocked.
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              This is a demo of role-based authentication. In a real application, 
              different features would be available based on your role.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleDemo;