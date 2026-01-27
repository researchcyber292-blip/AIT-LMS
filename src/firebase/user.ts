
'use client';

import { doc, getDoc, setDoc, updateDoc, Firestore } from 'firebase/firestore';
import { User } from 'firebase/auth';
import type { UserProfile } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Creates a new user profile document in Firestore if one doesn't already exist.
 * This is typically called after a user signs in for the first time.
 * @param firestore - The Firestore instance.
 * @param user - The Firebase Auth user object.
 */
export async function createUserProfile(firestore: Firestore, user: User): Promise<void> {
  const userDocRef = doc(firestore, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    const newUserProfile: UserProfile = {
      id: user.uid,
      name: user.displayName || 'New User',
      email: user.email || '',
      photoURL: user.photoURL || '',
      onboardingStatus: 'new',
    };
    
    // Non-blocking write with proper error handling
    setDoc(userDocRef, newUserProfile)
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'create',
          requestResourceData: newUserProfile,
        });
        // Emit the error for the global handler to catch
        errorEmitter.emit('permission-error', permissionError);
      });
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
