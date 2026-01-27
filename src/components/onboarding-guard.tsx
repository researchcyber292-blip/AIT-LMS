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
const PROTECTED_ROUTES = ['/dashboard', '/video-vault'];

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

  useEffect(() => {
    // If we are still checking if the user object exists, do nothing.
    if (isUserLoading) {
      return;
    }

    // 1. IF NOT LOGGED IN:
    // If the user is not authenticated, and they are trying to access a protected page,
    // redirect them to the login page.
    if (!user) {
      if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
        router.replace('/login');
      }
      return;
    }

    // 2. THE FIX: IF LOGGED IN BUT ON AN AUTH PAGE (e.g., /login)
    // The moment the `user` object is available from Firebase Auth, and the user is on
    // an auth page, we immediately redirect them to the video vault. We do NOT wait
    // for the Firestore profile to load, as this fixes the race condition.
    if (AUTH_ROUTES.includes(pathname)) {
      router.replace('/video-vault');
      return;
    }

    // 3. PROFILE CREATION (Runs in the background)
    // If the profile is not loading and we've confirmed it doesn't exist,
    // create it in the background. This does not block the UI.
    if (!isProfileLoading && !userProfile) {
      createUserProfile(firestore, user).catch(console.error);
    }
  }, [isUserLoading, user, userProfile, isProfileLoading, pathname, router, firestore]);


  const isLoading = isUserLoading || (user && isProfileLoading);
  
  // While loading auth state or profile, show a spinner if on a sensitive route.
  if (isLoading && (PROTECTED_ROUTES.some(r => pathname.startsWith(r)) || AUTH_ROUTES.includes(pathname))) {
    return <Loading />;
  }

  // Also show a spinner during the brief moment of redirection.
  if (!isUserLoading && user && AUTH_ROUTES.includes(pathname)) {
    return <Loading />;
  }

  return <>{children}</>;
}
