'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { Analytics, getAnalytics } from 'firebase/analytics';

// Log environment variables (redacted for security)
console.log('Firebase environment variables check:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ (set)' : '✗ (missing)',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓ (set)' : '✗ (missing)',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓ (set)' : '✗ (missing)',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✓ (set)' : '✗ (missing)',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✓ (set)' : '✗ (missing)',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓ (set)' : '✗ (missing)',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? '✓ (set)' : '✗ (missing)',
});

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Display sanitized config (without actual keys) for debugging
console.log('Firebase config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? '[REDACTED]' : undefined,
});

// Initialize Firebase app
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | undefined;

try {
  console.log('Initializing Firebase app...');
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');

  // Initialize services
  auth = getAuth(app);
  console.log('Firebase auth initialized');
  db = getFirestore(app);
  console.log('Firebase Firestore initialized');
  storage = getStorage(app);
  console.log('Firebase Storage initialized');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

// Initialize Analytics - only client side
const initAnalytics = () => {
  if (typeof window !== 'undefined' && app) {
    try {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized');
    } catch (error) {
      console.error('Error initializing Firebase Analytics:', error);
    }
  }
  return analytics;
};

export { auth, db, storage, initAnalytics };
export default app; 