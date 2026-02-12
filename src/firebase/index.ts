'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// This helper function checks for environment variables provided by Firebase App Hosting.
function isRunningInAppHosting() {
  // The GAE_instance env var is a reliable indicator of a Google-managed environment.
  return !!process.env.GAE_INSTANCE;
}

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (getApps().length) {
    // If an app is already initialized, return its SDKs
    return getSdks(getApp());
  }

  let firebaseApp;
  // Use App Hosting's automatic configuration if available (in production).
  if (isRunningInAppHosting()) {
    firebaseApp = initializeApp();
  } else {
    // Otherwise, use the local firebaseConfig object.
    // This is the expected path for local development.
    if (!firebaseConfig.apiKey) {
      // Log a more descriptive error if the config is missing.
      // The app will still throw an error, but this makes debugging easier.
      console.error(
        'Firebase configuration is missing. Ensure your `NEXT_PUBLIC_FIREBASE_*` environment variables are set correctly in your .env file.'
      );
    }
    firebaseApp = initializeApp(firebaseConfig);
  }

  // Initialize App Check only in the browser
  if (typeof window !== 'undefined') {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (siteKey && siteKey !== 'YOUR_RECAPTCHA_V3_SITE_KEY_HERE') {
      try {
        initializeAppCheck(firebaseApp, {
          provider: new ReCaptchaV3Provider(siteKey),
          isTokenAutoRefreshEnabled: true,
        });
      } catch (error) {
        console.error('Error initializing Firebase App Check:', error);
      }
    } else {
      console.warn(
        'Firebase App Check is not enabled. Add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to your .env file.'
      );
    }
  }

  return getSdks(firebaseApp);
}


export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
export * from './user';
