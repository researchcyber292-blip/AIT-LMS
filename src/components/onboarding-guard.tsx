'use client';

// All auth logic has been removed to support a non-authenticated video flow.
// This component now simply renders its children.

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
