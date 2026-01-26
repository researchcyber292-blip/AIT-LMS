
import Image from 'next/image';
import { ShieldCheck, BrainCircuit, Users } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Expert-Led Curriculum',
    description: 'Our courses are designed and taught by industry veterans with real-world experience in cybersecurity.',
  },
  {
    icon: BrainCircuit,
    title: 'Hands-On Labs',
    description: 'Move beyond theory with practical, hands-on labs that simulate real-world security challenges.',
  },
  {
    icon: Users,
    title: 'Community & Mentorship',
    description: 'Join a vibrant community of learners and get guidance from experienced mentors throughout your journey.',
  },
];


export function WhyChooseUs() {
  return (
    <section className="choose-us-section relative h-[600vh] w-full bg-background">
      <div className="sticky-container sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        
        {/* Container for the "WHY TO CHOOSE US" text */}
        <div className="animated-text-container absolute inset-0 flex flex-col items-center justify-center text-center font-headline font-extrabold" style={{ fontSize: 'clamp(6rem, 15vw, 12rem)', lineHeight: 1 }}>
            <h2 className="why-to">WHY TO</h2>
            <div className="flex items-center justify-center" style={{ letterSpacing: '0.25rem' }}>
              <span className="letter">C</span>
              <span className="letter">H</span>
              <span className="letter choose-o-target ml-4">O</span>
              <span className="letter">O</span>
              <span className="letter">S</span>
              <span className="letter">E</span>
            </div>
            <h2 className="us">US</h2>
        </div>
        
        {/* The div that animates from 'O' to fullscreen image and back to 'O' */}
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

        {/* NEW: Single container for all final content. Centered with transform. */}
        <div className="final-content-container container absolute w-full max-w-7xl opacity-0" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div className="final-aviraj-text-container text-center">
                <h2 className="font-stylish text-5xl font-bold tracking-tight drop-shadow-xl md:text-7xl">
                    <span>AVIRAJ&nbsp;</span>
                    {/* This structure is changed to fix spacing and allow for opacity animation */}
                    <span>INF</span><span className="final-o-target-new" style={{ display: 'inline-block' }}>O</span><span>&nbsp;TECH</span>
                </h2>
            </div>
            <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 opacity-0" style={{ y: 50 }}>
              {features.map((feature, index) => (
                <div key={index} className="feature-card bg-card border rounded-lg p-8 text-center shadow-lg">
                  <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit mb-6">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-headline text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="final-image-wrapper relative w-full max-w-4xl aspect-[16/9] rounded-xl overflow-hidden shadow-2xl mt-16 opacity-0 mx-auto">
                 <Image
                    src="https://picsum.photos/seed/cyber-landscape/1920/1080"
                    alt="Cybersecurity landscape"
                    fill
                    className="object-cover"
                    data-ai-hint="cyber landscape"
                />
            </div>
        </div>

      </div>
    </section>
  );
}
