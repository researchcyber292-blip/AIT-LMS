
'use client';

import { doc, getDoc, setDoc, updateDoc, Firestore, DocumentData } from 'firebase/firestore';
import { User } from 'firebase/auth';
import type { UserProfile } from '@/lib/types';

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
    try {
      await setDoc(userDocRef, newUserProfile);
    } catch (error) {
      console.error("Error creating user profile:", error);
      // Here you might want to emit a global error
    }
  }
}

/**
 * Updates a user's profile document in Firestore.
 * @param firestore - The Firestore instance.
 * @param uid - The user's unique ID.
 * @param data - The data to update.
 */
export async function updateUserProfile(firestore: Firestore, uid: string, data: Partial<UserProfile>): Promise<void> {
  const userDocRef = doc(firestore, 'users', uid);
  try {
    await updateDoc(userDocRef, data);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error; // Re-throw to be handled by the calling component
  }
}
