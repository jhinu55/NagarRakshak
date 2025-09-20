import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Shield, Settings, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import policeLogoPng from './police_logo.png';
import backJpeg from './back.jpeg';

interface LoginFormProps {
  role: string;
  onSubmit: (credentials: { username: string; password: string }) => Promise<void>;
}

const LoginForm = ({ role, onSubmit }: LoginFormProps) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await onSubmit({ username, password });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'citizen':
        return <User className="w-6 h-6" />;
      case 'officer':
        return <Shield className="w-6 h-6" />;
      case 'admin':
        return <Settings className="w-6 h-6" />;
      default:
        return <User className="w-6 h-6" />;
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case 'citizen':
        return 'from-blue-600 to-blue-700';
      case 'officer':
        return 'from-green-600 to-green-700';
      case 'admin':
        return 'from-purple-600 to-purple-700';
      default:
        return 'from-blue-600 to-blue-700';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 w-full max-w-md">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getRoleColor()} text-white mb-4`}>
          {getRoleIcon()}
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {t(`userRoles.loginAs`, { role: t(`userRoles.${role}`) })}
        </h2>
        <p className="text-white/80">
          {role === 'citizen' && t('login.citizenDesc')}
          {role === 'officer' && t('login.officerDesc')}
          {role === 'admin' && t('login.adminDesc')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
            ❌ {error}
          </div>
        )}
        
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
            {t('login.username')}
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            placeholder={role === 'officer' ? t('login.enterBadgeId') : t('login.enterUsername')}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
            {t('login.password')}
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent pr-12"
              placeholder={t('login.enterPassword')}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 bg-gradient-to-r ${getRoleColor()} text-white font-semibold rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            t('login.signIn', { role: t(`userRoles.${role}`) })
          )}
        </button>
      </form>

      <div className="mt-6 text-center space-y-3">
        <a href="#" className="text-white/80 hover:text-white text-sm transition-colors block">
          {t('login.forgotPassword')}
        </a>
        <p className="text-white/80 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-white hover:text-white/80 font-semibold transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: 'citizen',
      name: t('userRoles.citizen'),
      icon: User,
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'hover:from-blue-700 hover:to-blue-800',
      description: t('login.citizenDesc')
    },
    {
      id: 'officer',
      name: t('userRoles.officer'),
      icon: Shield,
      color: 'from-green-600 to-green-700',
      hoverColor: 'hover:from-green-700 hover:to-green-800',
      description: t('login.officerDesc')
    },
    {
      id: 'admin',
      name: t('userRoles.admin'),
      icon: Settings,
      color: 'from-purple-600 to-purple-700',
      hoverColor: 'hover:from-purple-700 hover:to-purple-800',
      description: t('login.adminDesc')
    }
  ];

  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      console.log(`🔐 Attempting login for ${selectedRole}:`, { email: credentials.username });
      
      // Use Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.username, // Expecting email as username
        password: credentials.password
      });

      if (error) {
        console.error('❌ Login error:', error.message);
        throw new Error(error.message);
      }

      if (data.user) {
        console.log('✅ Login successful:', data.user.email);
        console.log('👤 User metadata:', data.user.user_metadata);
        
        // Get the user's actual role from their metadata
        const userRole = data.user.user_metadata?.role;
        
        // Validate that user's role matches selected role
        if (!userRole) {
          throw new Error('User role not found. Please contact administrator.');
        }
        
        if (userRole !== selectedRole) {
          // Sign out the user since they're trying to access wrong role
          await supabase.auth.signOut();
          throw new Error(`Access denied. This account is registered as "${userRole}", but you're trying to login as "${selectedRole}". Please select the correct role.`);
        }
        
        console.log(`✅ Role validation passed: User is ${userRole}, logging in as ${selectedRole}`);
        
        // Store user role and info
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userEmail', data.user.email || '');
        localStorage.setItem('userName', data.user.user_metadata?.full_name || '');
        
        // Redirect to role demo to show role-based authentication working
        navigate('/role-demo');
      } else {
        throw new Error('Login failed - no user returned');
      }
      
    } catch (error: any) {
      console.error('❌ Login failed:', error.message);
      throw error; // Re-throw to be caught by LoginForm
    }
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
  };

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{ 
        backgroundImage: `url(${backJpeg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Translucent overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img 
              src={policeLogoPng} 
              alt="Goa Police Logo" 
              className="w-16 h-16 mr-3 drop-shadow-lg"
            />
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                {t('common.goaPolice')}
              </h1>
              <p className="text-lg md:text-xl text-orange-200 font-semibold">
                {t('common.nagarRakshak')}
              </p>
            </div>
          </div>
        </div>

        {!selectedRole ? (
          // Role Selection View
          <>
            {/* Back to Language Selection */}
            <div className="mb-8">
              <Link 
                to="/"
                className="inline-flex items-center text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('login.backToLanguage')}
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 max-w-4xl w-full">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">{t('login.selectRole')}</h2>
                <p className="text-white/80 text-lg">{t('login.selectRoleDesc')}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roles.map((role) => {
                  const IconComponent = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className={`group bg-gradient-to-r ${role.color} ${role.hoverColor} rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg text-white text-left`}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold">{role.name}</h3>
                      </div>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {role.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          // Login Form View
          <>
            {/* Back to Role Selection */}
            <div className="mb-8">
              <button 
                onClick={handleBackToRoles}
                className="inline-flex items-center text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('login.backToRoles')}
              </button>
            </div>

            <LoginForm 
              role={selectedRole} 
              onSubmit={handleLogin}
            />
          </>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/60 text-sm">
            {t('common.poweredBy')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;