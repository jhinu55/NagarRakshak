import { supabase } from './supabaseClient'
import type { User } from '@supabase/supabase-js'

export interface LoginCredentials {
  email: string
  password: string
  role?: 'citizen' | 'officer' | 'admin'
}

export interface SignUpData extends LoginCredentials {
  firstName: string
  lastName: string
  phone?: string
}

export class AuthService {
  // Sign up a new user
  static async signUp(userData: SignUpData) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            role: userData.role || 'citizen'
          }
        }
      })

      if (error) {
        throw error
      }

      return { user: data.user, session: data.session, error: null }
    } catch (error: any) {
      console.error('Sign up error:', error.message)
      return { user: null, session: null, error }
    }
  }

  // Sign in user with email and password
  static async signIn(credentials: LoginCredentials) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        throw error
      }

      return { user: data.user, session: data.session, error: null }
    } catch (error: any) {
      console.error('Sign in error:', error.message)
      return { user: null, session: null, error }
    }
  }

  // Sign out current user
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      return { error: null }
    } catch (error: any) {
      console.error('Sign out error:', error.message)
      return { error }
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    } catch (error: any) {
      console.error('Get current user error:', error.message)
      return null
    }
  }

  // Listen to authentication state changes
  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null)
    })
  }

  // Reset password
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        throw error
      }

      return { error: null }
    } catch (error: any) {
      console.error('Reset password error:', error.message)
      return { error }
    }
  }

  // Update user profile
  static async updateProfile(updates: { 
    first_name?: string
    last_name?: string
    phone?: string
    role?: string 
  }) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      })

      if (error) {
        throw error
      }

      return { user: data.user, error: null }
    } catch (error: any) {
      console.error('Update profile error:', error.message)
      return { user: null, error }
    }
  }
}