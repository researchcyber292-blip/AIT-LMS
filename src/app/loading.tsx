'use client';

import { Waveform } from 'ldrs/react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Waveform size="40" stroke="3.5" speed="1" color="white" />
    </div>
  );
}
