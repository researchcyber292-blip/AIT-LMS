'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ShieldCheck, BrainCircuit, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

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

export function FeaturesSection() {
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Animate feature cards
            gsap.from(".feature-card", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
                opacity: 0,
                y: 50,
                stagger: 0.2,
                duration: 0.8,
                ease: 'power3.out',
            });

            // Animate the image
             gsap.from(".feature-image", {
                scrollTrigger: {
                    trigger: ".feature-image-container",
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
                opacity: 0,
                scale: 0.9,
                duration: 1,
                ease: 'power3.out',
            });

        }, sectionRef);
        return () => ctx.revert();
    }, []);


  return (
    <section ref={sectionRef} className="bg-background py-20 md:py-28">
      <div className="container">
        <div className="text-center mb-16">
           <h2 className="font-headline text-4xl font-bold">A Complete Learning Experience</h2>
           <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
             We provide everything you need to succeed in the fast-paced world of cybersecurity.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
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

        <div className="feature-image-container relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-2xl">
             <Image
                src="https://picsum.photos/seed/cyber-landscape/1920/1080"
                alt="Cybersecurity landscape"
                fill
                className="object-cover feature-image"
                data-ai-hint="cyber landscape"
            />
        </div>

      </div>
    </section>
  );
}
