import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './Home';
import OfficerDashboard from './components/OfficerDashboard';
import EmergencyDashboard from './components/EmergencyDashboard';
import CitizenDashboard from './components/CitizenDashboard';
import BasicTest from './components/BasicTest';
import UserSetupRunner from './components/UserSetupRunner';
import RoleDemo from './components/RoleDemo';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/officer-dashboard" element={
            <ProtectedRoute requiredRole="officer">
              <OfficerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/emergency-dashboard" element={
            <ProtectedRoute requiredRole="officer">
              <EmergencyDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/citizen-dashboard" element={
            <ProtectedRoute requiredRole="citizen">
              <CitizenDashboard />
            </ProtectedRoute>
          } />
          <Route path="/role-demo" element={
            <ProtectedRoute>
              <RoleDemo />
            </ProtectedRoute>
          } />
          <Route path="/setup-users" element={<UserSetupRunner />} />
          <Route path="/basic-test" element={<BasicTest />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
