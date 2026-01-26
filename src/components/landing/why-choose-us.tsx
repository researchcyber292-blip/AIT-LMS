
import Image from 'next/image';

export function WhyChooseUs() {
  return (
    <section className="choose-us-section relative h-[500vh] w-full bg-background">
      <div className="sticky-container sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        
        {/* This is the final text that fades in on the left */}
        <div className="final-text-container absolute left-[calc(50%-45vw)] top-1/2 w-[35vw] max-w-xl -translate-y-1/2 opacity-0">
          <h2 className="font-headline text-5xl font-bold">A Better Way to Learn</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Our platform provides an immersive, hands-on learning experience. We don't just teach theory; we prepare you for the real world with practical labs and expert mentorship.
          </p>
        </div>
        
        {/* This container holds the large text and provides the target for the animation */}
        <div className="animated-text-container absolute inset-0 flex flex-col items-center justify-center text-center font-headline font-extrabold" style={{ fontSize: 'clamp(8rem, 20vw, 15rem)', lineHeight: 1 }}>
            <h2 className="why-to">WHY TO</h2>
            <div className="flex items-center justify-center tracking-wider">
              <span className="letter">C</span>
              <span className="letter">H</span>
              <span className="letter choose-o-target">O</span>
              <span className="letter">O</span>
              <span className="letter">S</span>
              <span className="letter">E</span>
            </div>
            <h2 className="us">US</h2>
        </div>

        {/* This is the div that will actually animate. It's positioned via JS. */}
        <div className="choose-o-animator absolute rounded-full border-[8px] border-foreground bg-background" style={{ visibility: 'hidden' }}>
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <Image
                src="/CIRCULAR_GSAP.png"
                alt="Zoom effect image"
                fill
                className="animator-image object-cover opacity-0"
              />
            </div>
        </div>
      </div>
    </section>
  );
}
