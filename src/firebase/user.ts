
'use client';

import { doc, getDoc, setDoc, updateDoc, Firestore } from 'firebase/firestore';
import { User } from 'firebase/auth';
import type { UserProfile } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Creates a new user profile document in Firestore if one doesn't already exist.
 * This is an async operation that ensures the document is created before resolving.
 * @param firestore - The Firestore instance.
 * @param user - The Firebase Auth user object.
 */
export async function createUserProfile(firestore: Firestore, user: User): Promise<void> {
  const userDocRef = doc(firestore, 'users', user.uid);
  
  try {
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      const newUserProfile: UserProfile = {
        id: user.uid,
        name: user.displayName || 'New User',
        email: user.email || '',
        photoURL: user.photoURL || '',
        onboardingStatus: 'active',
      };
      
      // Await the write to ensure it completes before other logic proceeds.
      await setDoc(userDocRef, newUserProfile);
    }
  } catch (serverError: any) {
    console.error("Failed to create or get user profile:", serverError);
    // We can't be sure if it was a read or write that failed, so we create a generic error.
    const permissionError = new FirestorePermissionError({
      path: userDocRef.path,
      operation: 'write', // We assume 'write' was the ultimate goal.
    });
    errorEmitter.emit('permission-error', permissionError);
    // Rethrow so the caller knows it failed.
    throw permissionError;
  }
}

/**
 * Updates a user's profile document in Firestore. This is a non-blocking "fire-and-forget" operation.
 * @param firestore - The Firestore instance.
 * @param uid - The user's unique ID.
 * @param data - The data to update.
 */
export function updateUserProfile(firestore: Firestore, uid: string, data: Partial<UserProfile>): void {
  const userDocRef = doc(firestore, 'users', uid);
  
  updateDoc(userDocRef, data)
    .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update',
          requestResourceData: data,
        });
        // Emit the error for the global handler to catch
        errorEmitter.emit('permission-error', permissionError);
    });
}
