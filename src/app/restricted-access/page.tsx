import { Lock } from 'lucide-react';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Access Denied - Aviraj Info Tech',
};

export default function RestrictedAccessPage() {
  return (
    <div className="container py-24 text-center">
      <Lock className="mx-auto h-24 w-24 text-destructive" />
      <h1 className="mt-8 text-4xl font-bold font-headline">Access Restricted</h1>
      <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
        The information you are trying to access is confidential and requires administrative privileges.
      </p>
      <div className="mt-8 flex gap-4 justify-center">
          <Button asChild variant="outline">
              <Link href="/">Go to Homepage</Link>
          </Button>
          <Button asChild>
              <Link href="/admin">Admin Login</Link>
          </Button>
      </div>
    </div>
  );
}
