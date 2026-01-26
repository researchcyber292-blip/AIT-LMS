'use client';

import { useEffect } from 'react';

export function SecurityInterceptor() {

  useEffect(() => {
    const checkHacker = async () => {
      try {
        // Send a small dummy request and time it. We use no-store to bypass the browser cache.
        const start1 = performance.now();
        await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' });
        const end1 = performance.now();
        const time1 = end1 - start1;

        // A small delay to allow a human interceptor to act on the first request.
        await new Promise(resolve => setTimeout(resolve, 500));

        // Send the exact same request again.
        const start2 = performance.now();
        await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' });
        const end2 = performance.now();
        const time2 = end2 - start2;
        
        // Jitter detection logic.
        // A normal slow connection would have high latency (e.g., time1=2000ms, time2=2100ms).
        // A proxy interceptor would have high jitter (e.g., time1=300ms, time2=5000ms) because
        // the user is manually inspecting and forwarding the request.
        if (Math.abs(time2 - time1) > 4000) { 
          // Obfuscate the redirect path to make it harder to find and disable.
          // atob("YnVzdGVkLmh0bWw=") decodes to "busted.html"
          window.location.href = atob("YnVzdGVkLmh0bWw=");
        }
      } catch (error) {
        // Errors are expected if the proxy blocks the request entirely, or if the network is down.
        // We can silently ignore them as part of the security check.
        console.log("Security check: A network request was intercepted or failed.");
      }
    };

    // Run the check once, shortly after the application mounts, to avoid impacting initial load performance.
    const timer = setTimeout(checkHacker, 1500);

    // Cleanup the timer if the component unmounts.
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs only once.

  // This component renders nothing. It is purely for the security side-effect.
  return null;
}
