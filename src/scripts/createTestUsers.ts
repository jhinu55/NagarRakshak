import { supabase } from '../lib/supabaseClient'

const users = [
  {
    name: 'Atharva',
    email: 'atharva@nagarrakshak.com',
    password: 'baby123',
    role: 'citizen'
  },
  {
    name: 'Shreya',
    email: 'shreya@nagarrakshak.com', 
    password: 'intermediate123',
    role: 'citizen'
  },
  {
    name: 'Omkar',
    email: 'omkar@nagarrakshak.com',
    password: 'master123',
    role: 'citizen'
  }
]

export const createTestUsers = async () => {
  console.log('🚀 Starting user creation process...')
  console.log('📝 Creating 3 citizen users: Atharva, Shreya, Omkar')
  console.log('=' .repeat(50))
  
  const results = []
  
  for (const userData of users) {
    try {
      console.log(`👤 Creating user: ${userData.name} (${userData.email})`)
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name,
            role: userData.role,
            display_name: userData.name,
            user_type: 'citizen'
          }
        }
      })
      
      if (error) {
        console.log(`❌ Error creating ${userData.name}: ${error.message}`)
        results.push({ name: userData.name, success: false, error: error.message })
      } else if (data.user) {
        console.log(`✅ Successfully created user: ${userData.name}`)
        console.log(`   📧 Email: ${userData.email}`)
        console.log(`   🔑 Password: ${userData.password}`)
        console.log(`   👥 Role: ${userData.role}`)
        console.log(`   🆔 User ID: ${data.user.id}`)
        results.push({ name: userData.name, success: true, userId: data.user.id, email: userData.email })
      }
      
      console.log('-'.repeat(40))
      
      // Wait a bit between user creations to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1500))
      
    } catch (error: any) {
      console.error(`❌ Failed to create user ${userData.name}:`, error.message)
      results.push({ name: userData.name, success: false, error: error.message })
    }
  }
  
  console.log('=' .repeat(50))
  console.log('📊 SUMMARY:')
  
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  
  console.log(`✅ Successfully created: ${successful.length} users`)
  console.log(`❌ Failed: ${failed.length} users`)
  
  if (successful.length > 0) {
    console.log('\n🎉 Successfully created users:')
    successful.forEach(user => {
      console.log(`   • ${user.name} (${user.email})`)
    })
  }
  
  if (failed.length > 0) {
    console.log('\n⚠️  Failed to create:')
    failed.forEach(user => {
      console.log(`   • ${user.name}: ${user.error}`)
    })
  }
  
  console.log('\n📝 Test Login Credentials:')
  users.forEach(user => {
    console.log(`   ${user.name}: ${user.email} / ${user.password}`)
  })
  
  console.log('\n🔍 Check your Supabase dashboard at:')
  console.log('   https://supabase.com/dashboard/project/azmnwvvyhantiefqeayp/auth/users')
  
  return results
}

// Function to test login for created users
export const testUserLogins = async () => {
  console.log('\n🧪 Testing user logins...')
  console.log('=' .repeat(50))
  
  for (const userData of users) {
    try {
      console.log(`🔐 Testing login for: ${userData.name}`)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password
      })
      
      if (error) {
        console.log(`❌ Login failed for ${userData.name}: ${error.message}`)
      } else if (data.user) {
        console.log(`✅ Login successful for: ${userData.name}`)
        console.log(`   📧 Logged in as: ${data.user.email}`)
        console.log(`   👤 User metadata: ${JSON.stringify(data.user.user_metadata, null, 2)}`)
        
        // Sign out after test
        await supabase.auth.signOut()
        console.log(`🚪 Signed out ${userData.name}`)
      }
      
      console.log('-'.repeat(30))
      
    } catch (error: any) {
      console.error(`❌ Login error for ${userData.name}:`, error.message)
    }
  }
  
  console.log('✅ Login testing completed!')
}

// Helper function to delete test users (if needed)
export const deleteTestUsers = async () => {
  console.log('🗑️  Deleting test users...')
  console.log('⚠️  Note: This requires admin privileges and should be done from Supabase dashboard')
  console.log('🔗 Go to: https://supabase.com/dashboard/project/azmnwvvyhantiefqeayp/auth/users')
}

// Main function to run the script
export const runUserSetup = async () => {
  console.log('🎯 NagarRakshak Test Users Setup')
  console.log('=' .repeat(50))
  
  try {
    // Create users
    const results = await createTestUsers()
    
    // Test logins if any users were created successfully
    const successful = results.filter(r => r.success)
    if (successful.length > 0) {
      await testUserLogins()
    }
    
    console.log('\n🎉 Setup completed!')
    console.log('💡 You can now use these credentials to test the login functionality')
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
  }
}

// Export individual users for reference
export const testUsers = users