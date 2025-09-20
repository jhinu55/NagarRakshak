import React, { useState } from 'react'
import { runUserSetup, createTestUsers, testUserLogins, testUsers } from '../scripts/createTestUsers'

const UserSetupRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [isTestingLogins, setIsTestingLogins] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleCreateUsers = async () => {
    setIsRunning(true)
    setShowResults(true)
    console.clear() // Clear console for better readability
    
    try {
      await createTestUsers()
    } catch (error) {
      console.error('Error in user creation:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const handleTestLogins = async () => {
    setIsTestingLogins(true)
    
    try {
      await testUserLogins()
    } catch (error) {
      console.error('Error testing logins:', error)
    } finally {
      setIsTestingLogins(false)
    }
  }

  const handleRunFullSetup = async () => {
    setIsRunning(true)
    setShowResults(true)
    console.clear()
    
    try {
      await runUserSetup()
    } catch (error) {
      console.error('Error in full setup:', error)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            🎯 NagarRakshak User Setup
          </h1>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>📝 This will create 3 test citizen users:</strong>
                </p>
                <ul className="mt-2 text-sm text-blue-600 space-y-1">
                  {testUsers.map(user => (
                    <li key={user.email}>
                      • <strong>{user.name}</strong> - {user.email} (password: {user.password})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <button
              onClick={handleCreateUsers}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-4 px-6 rounded-lg transition-colors"
            >
              {isRunning ? '⏳ Creating Users...' : '👥 Create Users Only'}
            </button>

            <button
              onClick={handleTestLogins}
              disabled={isTestingLogins}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-bold py-4 px-6 rounded-lg transition-colors"
            >
              {isTestingLogins ? '⏳ Testing...' : '🧪 Test Logins Only'}
            </button>

            <button
              onClick={handleRunFullSetup}
              disabled={isRunning}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold py-4 px-6 rounded-lg transition-colors"
            >
              {isRunning ? '⏳ Running...' : '🚀 Run Full Setup'}
            </button>
          </div>

          {showResults && (
            <div className="mt-8 bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm overflow-auto max-h-96">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">📊 Console Output:</h3>
                <p className="text-gray-400 text-xs">Check browser console for detailed logs</p>
              </div>
              <div className="text-gray-300">
                Open your browser's Developer Tools (F12) and check the Console tab for detailed output.
              </div>
            </div>
          )}

          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>📋 Instructions:</strong>
                </p>
                <ol className="mt-2 text-sm text-yellow-600 space-y-1 list-decimal list-inside">
                  <li>Click "Run Full Setup" to create users and test logins</li>
                  <li>Open Developer Tools (F12) to see detailed console output</li>
                  <li>Check your Supabase dashboard to verify user creation</li>
                  <li>Use the created credentials to test your login form</li>
                  <li>Remove this component when done testing</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href="https://supabase.com/dashboard/project/azmnwvvyhantiefqeayp/auth/users"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              🔗 Open Supabase Users Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserSetupRunner