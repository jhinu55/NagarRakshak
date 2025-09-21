// Admin Dashboard Debug Script - to be run in browser console
// Copy this into the browser console when viewing the admin dashboard

console.log('🔧 [DEBUG] Starting admin dashboard debug...');

// Check if AdminService is available
if (typeof AdminService !== 'undefined') {
  console.log('✅ AdminService is available');
  
  // Test getAllCases
  AdminService.getAllCases().then(cases => {
    console.log(`📊 AdminService.getAllCases() returned ${cases.length} cases`);
    console.log('Cases:', cases);
  }).catch(error => {
    console.error('❌ AdminService.getAllCases() failed:', error);
  });
} else {
  console.log('❌ AdminService not available in global scope');
}

// Check React state (if accessible)
const dashboardElement = document.querySelector('[data-testid="admin-dashboard"]');
if (dashboardElement) {
  console.log('✅ Found admin dashboard element');
} else {
  console.log('❌ Admin dashboard element not found');
}

// Check for any error messages in the UI
const errorElements = document.querySelectorAll('.text-red-500, .text-red-600, .bg-red-100');
if (errorElements.length > 0) {
  console.log(`⚠️ Found ${errorElements.length} error elements in UI`);
  errorElements.forEach((el, idx) => {
    console.log(`Error ${idx + 1}:`, el.textContent);
  });
} else {
  console.log('✅ No error elements found in UI');
}

// Check network requests
console.log('🌐 Check the Network tab for failed requests to Firestore or Supabase');
console.log('🔍 Also check the Console tab for any error messages');