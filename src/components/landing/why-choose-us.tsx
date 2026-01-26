
import Image from 'next/image';

export function WhyChooseUs() {
  return (
    <section className="choose-us-section relative h-[700vh] w-full bg-background">
      <div className="sticky-container sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        
        {/* This container holds the large text and provides the target for the animation */}
        <div className="animated-text-container absolute inset-0 flex flex-col items-center justify-center text-center font-headline font-extrabold" style={{ fontSize: 'clamp(8rem, 20vw, 15rem)', lineHeight: 1 }}>
            <h2 className="why-to">WHY TO</h2>
            <div className="flex items-center justify-center" style={{ letterSpacing: '0.25rem' }}>
              <span className="letter">C</span>
              <span className="letter">H</span>
              <span className="letter choose-o-target">O</span>
              <span className="letter">O</span>
              <span className="letter">S</span>
              <span className="letter">E</span>
            </div>
            <h2 className="us">US</h2>
        </div>
        
        {/* This is the final text that appears */}
        <div className="final-aviraj-text-container absolute inset-0 flex items-center justify-center opacity-0">
          <h2 className="font-stylish text-5xl font-bold tracking-tight drop-shadow-xl md:text-7xl">
              <span>AVIRAJ&nbsp;</span>
              <span>INF</span><span className="final-o-target-new" style={{ display: 'inline-block' }}>O</span><span>&nbsp;TECH</span>
          </h2>
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
