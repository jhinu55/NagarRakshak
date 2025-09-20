
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './Home';
import ChatbotAvatarDemo from './components/ChatbotAvatarDemo';
import SimpleAvatarTest from './components/SimpleAvatarTest';
import BasicTest from './components/BasicTest';
import UserSetupRunner from './components/UserSetupRunner';
import RoleDemo from './components/RoleDemo';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/role-demo" element={
          <ProtectedRoute>
            <RoleDemo />
          </ProtectedRoute>
        } />
        <Route path="/chatbot-demo" element={<ChatbotAvatarDemo />} />
        <Route path="/avatar-test" element={<SimpleAvatarTest />} />
        <Route path="/basic-test" element={<BasicTest />} />
        <Route path="/setup-users" element={<UserSetupRunner />} />
      </Routes>
    </Router>
  );
}

export default App;
