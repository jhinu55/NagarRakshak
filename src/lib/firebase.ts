// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase config object
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYkIMeF19E2hOCt3rNSq15WgEXSfVIeq4",
  authDomain: "big-quanta-444505-t9.firebaseapp.com",
  projectId: "big-quanta-444505-t9",
  storageBucket: "big-quanta-444505-t9.firebasestorage.app",
  messagingSenderId: "238017691266",
  appId: "1:238017691266:web:5a7e85384421ed530d3e9b",
  measurementId: "G-KS800LPGGH"
};

// Console verification of Firebase configuration
console.log('🔥 Firebase Configuration Status:');
console.log('📍 Project ID:', firebaseConfig.projectId);
console.log('🌐 Auth Domain:', firebaseConfig.authDomain);
console.log('🔑 API Key:', firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 20) + '...' : 'Not set');

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');
} catch (error) {
  console.error('❌ Firebase app initialization failed:', error);
  throw error;
}

// Initialize Firestore
let db;
try {
  db = getFirestore(app);
  console.log('✅ Firestore initialized successfully');
  console.log('📊 Firestore Database ID:', db.app.options.projectId);
} catch (error) {
  console.error('❌ Firestore initialization failed:', error);
  throw error;
}

// Test Firestore connection
const testFirestoreConnection = async () => {
  try {
    console.log('🔍 Testing Firestore connection...');
    
    // Simple test to verify connection
    const { doc, getDoc } = await import('firebase/firestore');
    const testDoc = doc(db, 'test', 'connection');
    
    // This will either succeed or fail with a permission error (both indicate connection works)
    await getDoc(testDoc);
    console.log('✅ Firestore connection test successful');
    
  } catch (error: any) {
    if (error.code === 'permission-denied' || error.code === 'unauthenticated') {
      console.log('⚠️ Firestore connected but permission denied (expected for test collection)');
      console.log('🔐 This indicates Firebase is connected but needs proper security rules');
    } else if (error.code === 'unavailable') {
      console.error('❌ Firestore unavailable - check network connection');
    } else {
      console.error('❌ Firestore connection test failed:', error.code, error.message);
    }
  }
};

// Run connection test after a short delay to ensure everything is initialized
setTimeout(testFirestoreConnection, 1000);

// Initialize Auth (for future use)
export const auth = getAuth(app);

// Export the Firestore instance
export { db };

export default app;
