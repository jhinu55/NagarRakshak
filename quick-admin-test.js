// Quick test to check admin user and Firestore data
import { createClient } from '@supabase/supabase-js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCf0gp5HKSrV5h2x8j5UtdCjIGLmbUW4sE",
  authDomain: "nagarrakshak-d7088.firebaseapp.com",
  projectId: "nagarrakshak-d7088",
  storageBucket: "nagarrakshak-d7088.firebasestorage.app",
  messagingSenderId: "891986905846",
  appId: "1:891986905846:web:ac2f066bb4ae6aa5b89aa9",
  measurementId: "G-QLVM6S1CXN"
};

const supabaseUrl = 'https://pwqgtfgikzkbsgcatvnn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3cWd0Zmdpa3prYnNnY2F0dm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwMTg5NDQsImV4cCI6MjA0NjU5NDk0NH0.BVzFwU3XnGBZOCaVQB0BdwF6uaI8TgS5D-hgOCqNZQU';

async function quickTest() {
  try {
    console.log('🔧 Testing Supabase and Firestore connections...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Initialize Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check Firestore cases
    const firsRef = collection(db, 'firs');
    const snapshot = await getDocs(firsRef);
    console.log(`📊 Firestore has ${snapshot.size} documents in 'firs' collection`);
    
    if (snapshot.size > 0) {
      const firstDoc = snapshot.docs[0];
      console.log('📝 Sample document:', firstDoc.id, firstDoc.data());
    }
    
    // Check Supabase users
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'admin');
    
    if (error) {
      console.log('❌ Error fetching admin users:', error);
    } else {
      console.log(`👑 Found ${profiles?.length || 0} admin users in Supabase`);
      if (profiles && profiles.length > 0) {
        console.log('👤 Admin users:', profiles.map(p => p.email));
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

quickTest();