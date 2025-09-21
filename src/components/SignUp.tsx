import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Shield, Settings, ArrowLeft, Eye, EyeOff, Mail, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import policeLogoPng from './police_logo.png';
import backJpeg from './back.jpeg';
import PoliceImage from './PoliceImage';

interface SignUpFormProps {
  role: string;
  onSubmit: (data: SignUpData) => Promise<void>;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const SignUpForm = ({ role, onSubmit }: SignUpFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<SignUpData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof SignUpData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.email.includes('@')) return 'Please enter a valid email';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
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
          Sign Up as {t(`userRoles.${role}`)}
        </h2>
        <p className="text-white/80">
          Create your account to access the system
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              placeholder="Enter first name"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              placeholder="Enter last name"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Email Address *
          </label>
          <div className="relative">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              placeholder="Enter email address"
              required
              disabled={isLoading}
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            placeholder="Enter phone number (optional)"
            disabled={isLoading}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent pr-12"
              placeholder="Enter password (min 6 characters)"
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

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent pr-12"
              placeholder="Confirm your password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
              Creating Account...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Create Account
            </span>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-white/80 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:text-white/80 font-semibold transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

const SignUp = () => {
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
      description: 'Access citizen services and file complaints'
    },
    {
      id: 'officer',
      name: t('userRoles.officer'),
      icon: Shield,
      color: 'from-green-600 to-green-700',
      hoverColor: 'hover:from-green-700 hover:to-green-800',
      description: 'Manage cases and access officer tools'
    },
    {
      id: 'admin',
      name: t('userRoles.admin'),
      icon: Settings,
      color: 'from-purple-600 to-purple-700',
      hoverColor: 'hover:from-purple-700 hover:to-purple-800',
      description: 'System administration and user management'
    }
  ];

  const handleSignUp = async (formData: SignUpData) => {
    try {
      console.log(`🚀 Creating ${selectedRole} account:`, { email: formData.email, name: `${formData.firstName} ${formData.lastName}` });
      
      // Use Supabase authentication
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            role: selectedRole || 'citizen',
            display_name: `${formData.firstName} ${formData.lastName}`
          }
        }
      });

      if (error) {
        console.error('❌ Sign up error:', error.message);
        throw new Error(error.message);
      }

      if (data.user) {
        console.log('✅ Account created successfully:', data.user.email);
        console.log('👤 User metadata:', data.user.user_metadata);
        
        // Show success message and redirect
        alert(`✅ Account created successfully!\n\n📧 Email: ${formData.email}\n👤 Role: ${selectedRole}\n\nYou can now sign in with your credentials.`);
        
        // Redirect to login page
        navigate('/login');
      } else {
        throw new Error('Account creation failed - no user returned');
      }
      
    } catch (error: any) {
      console.error('❌ Sign up failed:', error.message);
      throw error; // Re-throw to be caught by SignUpForm
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
            {/* Back to Login */}
            <div className="mb-8">
              <Link 
                to="/login"
                className="inline-flex items-center text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 max-w-4xl w-full">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Choose Your Role</h2>
                <p className="text-white/80 text-lg">Select the type of account you want to create</p>
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
          // Sign Up Form View
          <>
            {/* Back to Role Selection */}
            <div className="mb-8">
              <button 
                onClick={handleBackToRoles}
                className="inline-flex items-center text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Role Selection
              </button>
            </div>

            <SignUpForm 
              role={selectedRole} 
              onSubmit={handleSignUp}
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
      
      {/* Police Image - Bottom Right */}
      <PoliceImage />
    </div>
  );
};

export default SignUp;