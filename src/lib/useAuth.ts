import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import type { User } from '@supabase/supabase-js';

export interface AuthUser extends User {
  role?: string;
  fullName?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const authUser: AuthUser = {
            ...session.user,
            role: session.user.user_metadata?.role,
            fullName: session.user.user_metadata?.full_name
          };
          setUser(authUser);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const authUser: AuthUser = {
            ...session.user,
            role: session.user.user_metadata?.role,
            fullName: session.user.user_metadata?.full_name
          };
          setUser(authUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      // Clear local storage
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const hasRole = (requiredRole: string | string[]): boolean => {
    if (!user?.role) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole;
  };

  const isAuthenticated = (): boolean => {
    return !!user;
  };

  return {
    user,
    loading,
    signOut,
    hasRole,
    isAuthenticated,
    role: user?.role
  };
};