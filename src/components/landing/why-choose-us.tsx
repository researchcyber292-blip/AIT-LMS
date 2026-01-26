import Image from 'next/image';

export function WhyChooseUs() {
  return (
    <section className="choose-us-section relative h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      <div className="text-container text-center font-headline font-extrabold" style={{ fontSize: 'clamp(3rem, 15vw, 12rem)', lineHeight: 1 }}>
        <h2 className="why-to">WHY TO</h2>
        <div className="flex items-center justify-center">
          <span className="letter">C</span>
          <span className="letter">H</span>
          <div className="choose-o relative rounded-full border-[1vw] border-foreground flex items-center justify-center" style={{ width: '0.9em', height: '0.9em' }}>
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image 
                src="https://picsum.photos/seed/zoomeffect/400/400"
                alt="Zoom effect image"
                fill
                className="object-cover choose-o-image"
                data-ai-hint="cyber security"
              />
            </div>
          </div>
          <span className="letter">O</span>
          <span className="letter">O</span>
          <span className="letter">S</span>
          <span className="letter">E</span>
        </div>
        <h2 className="us">US</h2>
      </div>
    </section>
  );
}
