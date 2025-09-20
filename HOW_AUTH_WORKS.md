# 🔐 How Supabase Authentication Works

## 📊 **Database Structure**

Supabase automatically creates and manages authentication through multiple tables:

### **1. `auth.users` Table (Hidden/Managed by Supabase)**
```sql
-- This table is automatically created and managed by Supabase
-- You don't directly interact with it, but it stores:

auth.users {
  id: UUID (Primary Key)
  email: TEXT
  encrypted_password: TEXT  -- ✅ PASSWORDS ARE STORED HERE (HASHED)
  email_confirmed_at: TIMESTAMP
  phone_confirmed_at: TIMESTAMP
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
  user_metadata: JSONB     -- Custom data like name, role, etc.
  app_metadata: JSONB      -- System data
  ...other auth fields
}
```

### **2. Your Custom Tables (Optional)**
```sql
-- You can create a profiles table that links to auth.users
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('citizen', 'officer', 'admin')),
  badge_number TEXT,  -- For officers
  department TEXT,    -- For officers
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔒 **Why You Don't See Passwords**

1. **Security**: Passwords are hashed using bcrypt/scrypt before storage
2. **Separation**: Auth data is in `auth.users`, your data is in your tables
3. **Access Control**: Only Supabase's auth system can access `auth.users`
4. **Best Practice**: Never store plain text passwords

## 🚀 **How Authentication Flow Works**

### **Sign Up Process:**
1. User fills sign-up form
2. `supabase.auth.signUp()` is called
3. Supabase creates entry in `auth.users` with hashed password
4. User metadata (name, role) is stored in `user_metadata` field
5. Optional: Trigger creates entry in your `profiles` table

### **Login Process:**
1. User enters email/password
2. `supabase.auth.signInWithPassword()` is called
3. Supabase checks `auth.users` table
4. If credentials match, returns JWT token and user object
5. Your app stores session and redirects user

### **Session Management:**
1. JWT token contains user ID and metadata
2. Token is automatically refreshed
3. You can access current user with `supabase.auth.getUser()`

## 🗄️ **Viewing Your Users**

### **In Supabase Dashboard:**
1. Go to **Authentication** > **Users**
2. You'll see all registered users
3. Passwords are never shown (security)
4. You can see user metadata (name, role, etc.)

### **User Data Structure:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "user_metadata": {
    "first_name": "John",
    "last_name": "Doe",
    "role": "citizen",
    "full_name": "John Doe"
  },
  "created_at": "2023-01-01T00:00:00Z"
}
```

## 🔧 **Optional: Create Profiles Table**

If you want more detailed user profiles, create this table:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('citizen', 'officer', 'admin')) DEFAULT 'citizen',
  badge_number TEXT,
  department TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Function to auto-create profile on user creation
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

-- Trigger to call function on new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 🎯 **Summary**

- ✅ **Passwords ARE stored** - in `auth.users` table (hashed)
- ✅ **Supabase manages security** - you don't handle passwords directly
- ✅ **User data goes in metadata** - or separate profiles table
- ✅ **Authentication is secure** - industry-standard practices
- ✅ **You focus on features** - not security implementation

The sign-up page will now create real users in your Supabase database! 🚀