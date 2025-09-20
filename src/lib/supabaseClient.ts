import { createClient } from '@supabase/supabase-js'

// Supabase project configuration
// Handle both Node.js and browser environments
const getEnvVar = (key: string, fallback: string) => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback
  }
  return fallback
}

const supabaseUrl = getEnvVar('REACT_APP_SUPABASE_URL', 'https://azmnwvvyhantiefqeayp.supabase.co')
const supabaseAnonKey = getEnvVar('REACT_APP_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6bW53dnZ5aGFudGllZnFlYXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNDc4ODUsImV4cCI6MjA3MzkyMzg4NX0.Jt1EhhATr1GRNo7hyV_66jl3KWAwUGc6qJi1YZ4QtXY')

// Debug: Log configuration (remove in production)
console.log('🔧 Supabase Configuration:')
console.log('📍 URL:', supabaseUrl)
console.log('🔑 Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET')

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable automatic refresh of authentication tokens
    autoRefreshToken: true,
    // Persist authentication session in localStorage
    persistSession: true,
    // Detect session from URL on page load
    detectSessionInUrl: true
  }
})

// Test connection on load
supabase.auth.getSession()
  .then(({ error }) => {
    if (error) {
      console.error('❌ Supabase connection error:', error.message)
    } else {
      console.log('✅ Supabase client initialized successfully')
    }
  })
  .catch(err => {
    console.error('❌ Failed to initialize Supabase:', err)
  })

// Export types for TypeScript support
export type { User, Session } from '@supabase/supabase-js'

// Helper function to check if user is authenticated
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Helper function to sign out user
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error.message)
  }
  return { error }
}

// Helper function to get current session
export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}