
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PasswordReminderPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const storedPassword = localStorage.getItem('onboardingPassword');
    if (!storedPassword) {
      // If no password, user shouldn't be here. Redirect them.
      router.replace('/student-welcome');
      return;
    }
    setPassword(storedPassword);
  }, [router]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setIsCopied(true);
    toast({ title: 'Password copied to clipboard!' });
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleConfirm = () => {
      localStorage.removeItem('onboardingPassword'); // Clean up password from storage
      router.push('/avatar-selection');
  }

  return (
    <div className="container flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Remember Your Password</CardTitle>
          <CardDescription>Your account has been created. Please save your password securely. You will need it to log in.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              readOnly
              value={password}
              className="pr-10 text-lg font-mono"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={handleCopy}
            >
              {isCopied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={handleConfirm} className="w-full">
            Confirm & Continue
          </Button>
          <p className="text-xs text-muted-foreground">Click continue to choose your avatar.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
