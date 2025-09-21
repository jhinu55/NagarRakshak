// Simple test users creation - run in browser console
// This creates some test users including an admin
console.log('Creating test admin user...');

const testAdmin = {
  email: 'admin@test.com',
  password: 'admin123',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin'
};

// You can copy this code and run it in the browser console
// when you're on the signup page
console.log('Test admin credentials:', testAdmin);
console.log('Use these credentials to sign up as admin:', testAdmin.email, testAdmin.password);