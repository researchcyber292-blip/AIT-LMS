'use client';

import { useEffect } from 'react';

export function SecurityInterceptor() {

  useEffect(() => {
    const checkHacker = async () => {
      try {
        // --- Probe 1: Initial Latency Check ---
        // We send a small dummy request and time it. We use no-store to bypass the browser cache.
        const start1 = performance.now();
        await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' });
        const end1 = performance.now();
        const time1 = end1 - start1;

        // If the very first request takes longer than 4 seconds, it's highly likely
        // that it was manually intercepted and held. A normal slow connection won't
        // have such a high initial latency for a tiny file.
        if (time1 > 4000) {
          window.location.href = atob("YnVzdGVkLmh0bWw=");
          return; // Trigger the roast and stop further checks.
        }

        // A small delay to allow a human interceptor to act on the first request differently.
        await new Promise(resolve => setTimeout(resolve, 500));

        // --- Probe 2: Jitter Detection ---
        // Send the exact same request again.
        const start2 = performance.now();
        await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' });
        const end2 = performance.now();
        const time2 = end2 - start2;
        
        // Jitter is the difference in latency between two consecutive requests.
        // A normal connection has low jitter (e.g., time1=2000ms, time2=2100ms).
        // An intercepted connection has high jitter (e.g., time1=300ms, time2=5000ms)
        // because the human is inconsistent. We'll use a 3-second threshold.
        if (Math.abs(time2 - time1) > 3000) { 
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
