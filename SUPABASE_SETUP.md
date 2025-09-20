# Supabase Setup Instructions

This guide will help you set up Supabase authentication for the NagarRakshak project.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - Name: `nagarrakshak` or similar
   - Database Password: Create a strong password
   - Region: Choose closest to your users
5. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-ref.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

## 3. Configure Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values:
   ```env
   REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 4. Set Up Authentication Tables (Optional)

By default, Supabase handles user authentication. If you need custom user profiles:

1. Go to **Table Editor** in your Supabase dashboard
2. Create a `profiles` table:
   ```sql
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     first_name TEXT,
     last_name TEXT,
     phone TEXT,
     role TEXT CHECK (role IN ('citizen', 'officer', 'admin')) DEFAULT 'citizen',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. Enable Row Level Security (RLS):
   ```sql
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ```

4. Create policies for the profiles table:
   ```sql
   -- Users can view their own profile
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);

   -- Users can update their own profile
   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);

   -- Users can insert their own profile
   CREATE POLICY "Users can insert own profile" ON profiles
     FOR INSERT WITH CHECK (auth.uid() = id);
   ```

## 5. Set Up Authentication Trigger (Optional)

To automatically create a profile when a user signs up:

```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'citizen')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 6. Configure Email Authentication (Optional)

1. Go to **Authentication** > **Settings** in Supabase
2. Configure email templates under **Email Templates**
3. Set up custom SMTP if needed under **SMTP Settings**

## 7. Test Your Setup

1. Start your development server: `npm run dev`
2. Navigate to the login page
3. Try creating a new account
4. Check the **Authentication** > **Users** tab in Supabase to see if users are being created

## Files Created

- `src/lib/supabaseClient.ts` - Supabase client configuration
- `src/lib/authService.ts` - Authentication service with helper methods
- `src/lib/AuthContext.tsx` - React context for authentication state
- `.env` - Environment variables (update with your credentials)
- `.env.example` - Example environment file

## Usage in Components

```tsx
import { useAuth } from '../lib/AuthContext'

function MyComponent() {
  const { user, signIn, signOut, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {user ? (
        <button onClick={signOut}>Sign Out</button>
      ) : (
        <button onClick={() => signIn('email@example.com', 'password')}>
          Sign In
        </button>
      )}
    </div>
  )
}
```

## Security Notes

- The `anon` key is safe to use in client-side code
- Always use Row Level Security (RLS) for database access
- Never expose your `service_role` key in client-side code
- The `.env` file is already in `.gitignore` to prevent credential exposure