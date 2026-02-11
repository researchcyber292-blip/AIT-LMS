
import admin from 'firebase-admin';

// This is a server-only module.

// Ensure you have set the GOOGLE_APPLICATION_CREDENTIALS environment
// variable in your deployment environment. In local development, you can
// point this to the path of your service account key file.
// DO NOT hardcode service account credentials in your code.

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      // The SDK automatically discovers credentials via GOOGLE_APPLICATION_CREDENTIALS
      // and gets the project ID from there.
      storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`
    });
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error', error.stack);
  }
}

export default admin;
