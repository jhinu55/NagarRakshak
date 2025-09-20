// Debug Supabase Connection and User Creation
// Copy and paste this into your browser console when your app is running

const debugSupabase = async () => {
  console.log('🔍 Debugging Supabase Connection...')
  console.log('=' .repeat(50))
  
  // Check if supabase client is available
  try {
    // Import the supabase client
    const { supabase } = await import('/src/lib/supabaseClient.ts')
    console.log('✅ Supabase client loaded successfully')
    
    // Test connection by getting current session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.log('❌ Session error:', sessionError.message)
    } else {
      console.log('✅ Supabase connection working')
      console.log('📝 Current session:', sessionData.session ? 'Logged in' : 'Not logged in')
    }
    
    // Test user creation
    console.log('\n👤 Testing user creation...')
    
    const testUser = {
      email: 'test@nagarrakshak.com',
      password: 'testpass123'
    }
    
    const { data, error } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          full_name: 'Test User',
          role: 'citizen'
        }
      }
    })
    
    if (error) {
      console.log('❌ User creation error:', error.message)
      console.log('Error details:', error)
    } else {
      console.log('✅ Test user created successfully!')
      console.log('📧 Email:', testUser.email)
      console.log('🔑 Password:', testUser.password)
      console.log('🆔 User ID:', data.user?.id)
      console.log('📝 User data:', data.user)
    }
    
  } catch (importError) {
    console.error('❌ Failed to load Supabase client:', importError)
  }
}

// Also create the production users
const createProductionUsers = async () => {
  console.log('\n👥 Creating production users...')
  
  const users = [
    { name: 'Atharva', email: 'atharva@nagarrakshak.com', password: 'baby123' },
    { name: 'Shreya', email: 'shreya@nagarrakshak.com', password: 'intermediate123' },
    { name: 'Omkar', email: 'omkar@nagarrakshak.com', password: 'master123' }
  ]
  
  try {
    const { supabase } = await import('/src/lib/supabaseClient.ts')
    
    for (const userData of users) {
      console.log(`\n👤 Creating: ${userData.name}`)
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name,
            role: 'citizen',
            display_name: userData.name
          }
        }
      })
      
      if (error) {
        console.log(`❌ ${userData.name}: ${error.message}`)
      } else {
        console.log(`✅ ${userData.name} created successfully!`)
        console.log(`   📧 ${userData.email}`)
        console.log(`   🆔 ${data.user?.id}`)
      }
      
      // Wait between requests
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    console.log('\n🎉 All users processed!')
    console.log('🔗 Check dashboard: https://supabase.com/dashboard/project/azmnwvvyhantiefqeayp/auth/users')
    
  } catch (error) {
    console.error('❌ Error creating users:', error)
  }
}

console.log('🚀 Supabase Debug Script Loaded!')
console.log('📝 Run: debugSupabase() - to test connection')
console.log('👥 Run: createProductionUsers() - to create users')
console.log('🔗 Dashboard: https://supabase.com/dashboard/project/azmnwvvyhantiefqeayp/auth/users')