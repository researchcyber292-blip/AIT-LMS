
'use client';

import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';
import type { UserProfile, Instructor } from '@/lib/types';
import Loading from '@/app/loading';
import { useEffect } from 'react';

const AUTH_PAGES = ['/login', '/register', '/signup', '/instructor-login', '/instructor-signup'];

const INSTRUCTOR_ONBOARDING_PAGES = [
  '/instructor-avatar-selection',
  '/instructor-pending-verification',
  '/instructor-access-denied',
];

const PUBLIC_PAGES = [
    '/', 
    '/about', 
    '/courses', 
    '/explore',
    '/programs', 
    '/certifications', 
    '/contact', 
    '/admin', 
    '/team',
    '/careers',
    '/press-kit',
    '/brand-guidelines',
    '/restricted-access',
    '/upload'
];

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);
  
  const instructorDocRef = useMemoFirebase(() => user ? doc(firestore, 'instructors', user.uid) : null, [firestore, user]);
  const { data: instructorProfile, isLoading: isInstructorProfileLoading } = useDoc<Instructor>(instructorDocRef);

  const isLoading = isUserLoading || (user && (isProfileLoading || isInstructorProfileLoading));

  useEffect(() => {
    if (isLoading) {
      return;
    }
    
    // --- User is NOT Logged In ---
    if (!user) {
      const isAllowedGuestPage = 
        PUBLIC_PAGES.includes(pathname) ||
        AUTH_PAGES.includes(pathname) ||
        pathname.startsWith('/courses/') || 
        pathname.startsWith('/instructors/') ||
        pathname.startsWith('/admin/login') ||
        pathname.startsWith('/admin/console/') ||
        INSTRUCTOR_ONBOARDING_PAGES.includes(pathname);

      if (!isAllowedGuestPage) {
        router.replace('/login');
      }
      return;
    }

    // --- User IS Logged In ---

    // Handle Admin
    if (user.isAnonymous) {
      return; 
    }

    // Handle Instructor Flow
    if (instructorProfile) {
        const { accountStatus, photoURL } = instructorProfile;

        if (accountStatus === 'pending') {
            if (pathname !== '/instructor-pending-verification') router.replace('/instructor-pending-verification');
            return;
        }
        if (accountStatus === 'rejected' || accountStatus === 'banned') {
            const targetPath = `/instructor-access-denied?status=${accountStatus}`;
            if (!pathname.startsWith('/instructor-access-denied')) {
                router.replace(targetPath);
            }
            return;
        }
        if (accountStatus === 'active') {
            if (!photoURL) {
                if (pathname !== '/instructor-avatar-selection') {
                    router.replace('/instructor-avatar-selection');
                }
            } else if (INSTRUCTOR_ONBOARDING_PAGES.includes(pathname) || AUTH_PAGES.includes(pathname)) {
                router.replace('/dashboard');
            }
        }
        return;
    }

    // Handle Student Flow
    if (userProfile) {
        // Since the new flow sets status to 'active' immediately, all students with a profile are considered active.
        // If they are on any auth or old onboarding pages, redirect to dashboard.
        if (AUTH_PAGES.includes(pathname)) {
            router.replace('/dashboard');
        }
        return;
    }

  }, [isLoading, user, userProfile, instructorProfile, pathname, router]);

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
}
