'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';

export function SecurityInterceptor() {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const detectBurp = async () => {
      try {
        // Burp Suite's default proxy listener is at http://127.0.0.1:8080, 
        // and it often exposes an internal "burp" domain.
        // We'll check for the proxy directly, as the domain can be inconsistent.
        // We use "no-cors" mode to avoid CORS errors, as we only care if the request succeeds, not about the response.
        await fetch('http://127.0.0.1:8080', { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
        
        // If the fetch doesn't throw an error, it means something is listening on that port.
        // This is a strong indicator of an active interception proxy.
        setIsBlocked(true);

      } catch (error) {
        // An error is the expected outcome in a normal browser without a proxy.
        // We can safely ignore it.
      }
    };

    detectBurp();
    
  }, []);

  if (!isBlocked) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
      <ShieldAlert className="h-16 w-16 text-destructive mb-6" />
      <h1 className="font-headline text-3xl font-bold text-destructive">Security Alert</h1>
      <p className="mt-2 max-w-md text-center text-lg text-muted-foreground">
        Access to this application has been blocked due to the detection of a potential security threat.
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
          Please disable any active interception proxies or security analysis tools and refresh the page.
      </p>
    </div>
  );
}
