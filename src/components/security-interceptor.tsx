'use client';

import { useEffect } from 'react';

export function SecurityInterceptor() {

  useEffect(() => {
    const lockDownScreen = () => {
        document.body.innerHTML = `
            <style>
                body { background-color: #000; color: #0f0; font-family: monospace; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                .container { text-align: center; border: 2px solid #0f0; padding: 2rem; }
                h1 { font-size: 3rem; text-transform: uppercase; letter-spacing: 0.2em; animation: blink 1s infinite; }
                p { font-size: 1.2rem; }
                @keyframes blink { 50% { opacity: 0.5; } }
            </style>
            <div class="container">
                <h1>&#x2620; ACCESS DENIED &#x2620;</h1>
                <p>Security perimeter breached. Your activity has been logged.</p>
                <p>The A.I. is watching.</p>
            </div>
        `;
        document.head.innerHTML = '<title>BUSTED</title>';
    };

    const checkHacker = async () => {
      try {
        // --- Probe 1: Initial Latency Check ---
        const start1 = performance.now();
        await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' });
        const end1 = performance.now();
        const time1 = end1 - start1;

        if (time1 > 4000) {
          lockDownScreen();
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        // --- Probe 2: Jitter Detection ---
        const start2 = performance.now();
        await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' });
        const end2 = performance.now();
        const time2 = end2 - start2;
        
        if (Math.abs(time2 - time1) > 3000) { 
          lockDownScreen();
        }
      } catch (error) {
        console.log("Security check: A network request was intercepted or failed.");
      }
    };

    const timer = setTimeout(checkHacker, 1500);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
