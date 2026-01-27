
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { UserProfile } from '@/lib/types';
import Loading from '@/app/loading';
import { createUserProfile } from '@/firebase/user';

// Pages a logged-in user should be redirected AWAY from.
const AUTH_ROUTES = ['/login', '/about']; 
// Pages that require a user to be logged in.
const PROTECTED_ROUTES = ['/dashboard', '/video-vault']; // Added video-vault

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);
  
  const isLoading = isUserLoading || (user && isProfileLoading);

  useEffect(() => {
    if (isLoading) {
      return; // Wait until all data is loaded.
    }

    // SCENARIO 1: No authenticated user.
    if (!user) {
      // If user tries to access a protected page, send them to login.
      if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
        router.replace('/login');
      }
      return; // Otherwise, allow access to public pages.
    }

    // --- From this point, we know there IS an authenticated user ---

    // SCENARIO 2: New user whose profile doesn't exist yet.
    if (!userProfile) {
      // Create their profile. The useDoc hook will cause a re-render once done.
      createUserProfile(firestore, user).catch(err => {
        console.error("OnboardingGuard: Failed to create user profile.", err);
      });
      // We return here and wait for the profile to be created before deciding on redirects.
      return; 
    }

    // SCENARIO 3: Logged-in user is on an auth page (e.g., /login).
    // Redirect them to the video vault.
    if (AUTH_ROUTES.includes(pathname)) {
      router.replace('/video-vault');
    }

  }, [isLoading, user, userProfile, pathname, router, firestore]);

  // While loading, show a spinner if on a page that depends on auth state.
  if (isLoading && (PROTECTED_ROUTES.some(r => pathname.startsWith(r)) || AUTH_ROUTES.includes(pathname))) {
    return <Loading />;
  }

  // If a logged-in user lands on an auth page, show a spinner during the redirect.
  if (!isLoading && user && AUTH_ROUTES.includes(pathname)) {
    return <Loading />;
  }

  return <>{children}</>;
}
