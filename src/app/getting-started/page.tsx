'use client';

export default function GettingStartedPage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <video
        autoPlay
        muted
        playsInline
        className="absolute top-0 left-0 h-full w-full object-cover"
      >
        <source src="/3.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
