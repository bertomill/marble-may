import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Check if we already have a Firebase admin instance
if (!getApps().length) {
  // Get service account from environment variable
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
    );
  } catch (error) {
    console.error('Error parsing Firebase service account:', error);
    serviceAccount = {};
  }

  // Initialize the app with credentials
  initializeApp({
    credential: cert(serviceAccount)
  });
}

// Export the admin auth and db instances
export const adminAuth = getAuth();
export const adminDb = getFirestore(); 