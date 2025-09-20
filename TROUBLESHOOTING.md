# 🔧 Troubleshooting: Users Not Appearing in Supabase Dashboard

## 🚨 Most Common Issues & Solutions

### 1. **Email Confirmation Required** (Most Likely Issue)
**Problem**: Supabase requires email confirmation by default, so users appear as "unconfirmed"

**Solution**: 
- Go to your Supabase dashboard: [Authentication Settings](https://supabase.com/dashboard/project/azmnwvvyhantiefqeayp/auth/users)
- Look for users with status "Waiting for verification"
- **OR** disable email confirmation temporarily:

```sql
-- Run this in your Supabase SQL Editor
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
```

**Alternative**: Disable email confirmation in settings:
1. Go to Authentication > Settings
2. Turn OFF "Enable email confirmations"

### 2. **Check Authentication Settings**
Go to: `Authentication > Settings` in your Supabase dashboard

Verify these settings:
- ✅ **Enable email confirmations**: OFF (for testing)
- ✅ **Enable phone confirmations**: OFF (for testing)
- ✅ **Enable sign ups**: ON

### 3. **Rate Limiting**
Supabase has rate limits for sign ups:
- **Solution**: Wait 60 seconds between attempts
- **Check**: Look for "Too many requests" errors

### 4. **Password Requirements**
Supabase might have password requirements:
- **Minimum**: 6 characters
- **Updated passwords**: baby123, intermediate123, master123

### 5. **Check Different Dashboard Sections**
Users might appear in different places:
- `Authentication > Users` - All users
- `Authentication > Users` - Filter by "Unconfirmed"

## 🧪 **Testing Steps**

### Step 1: Use the HTML Test File
1. Open `test-users.html` in your browser
2. Click "Test Connection"
3. Click "Create Users"
4. Watch the console output

### Step 2: Check Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/azmnwvvyhantiefqeayp/auth/users
2. Look for users (they might be unconfirmed)
3. Check the "All" and "Unconfirmed" tabs

### Step 3: Manual Test in Dashboard
1. Go to Authentication > Users
2. Click "Add user" manually
3. Try creating one user manually to test

### Step 4: Check SQL Editor
Run this query to see all users:
```sql
SELECT * FROM auth.users ORDER BY created_at DESC;
```

## 🔍 **Debug Checklist**

- [ ] Supabase URL is correct: `https://azmnwvvyhantiefqeayp.supabase.co`
- [ ] API key is valid (check for typos)
- [ ] Email confirmation is disabled (or users are confirmed)
- [ ] Sign ups are enabled
- [ ] No rate limiting errors
- [ ] Passwords meet requirements (6+ characters)
- [ ] Users checked in "Unconfirmed" tab

## 🚀 **Quick Fix Commands**

### Confirm All Unconfirmed Users
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    phone_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;
```

### Check User Count
```sql
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed,
  COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as unconfirmed
FROM auth.users;
```

## 📋 **Next Steps**

1. **Open the HTML test file** (`test-users.html`) in your browser
2. **Run the tests** and check console output
3. **Check dashboard** for unconfirmed users
4. **Run SQL queries** to confirm users exist
5. **Disable email confirmation** if needed

The most likely issue is that users are created but require email confirmation!