import Image from 'next/image';
import type { Metadata } from 'next';
import { TEAM_MEMBERS } from '@/data/content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Rocket } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - CyberLearn',
  description: 'Learn about the mission, vision, and team behind Aviraj Info Tech Cyber Security.',
};

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-16">
      {/* Header Section */}
      <section className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          We are Aviraj Info Tech
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
          Dedicated to building the next generation of cybersecurity professionals through accessible, expert-led education.
        </p>
      </section>

      {/* Mission & Vision Section */}
      <section className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="p-8">
          <div className="flex items-center gap-4">
            <Rocket className="h-8 w-8 text-primary" />
            <h2 className="font-headline text-2xl font-bold">Our Mission</h2>
          </div>
          <p className="mt-4 text-muted-foreground">
            To democratize cybersecurity education, making it accessible to everyone, everywhere. We strive to empower individuals with the skills and knowledge to protect the digital world and build secure futures.
          </p>
        </Card>
        <Card className="p-8">
          <div className="flex items-center gap-4">
            <Eye className="h-8 w-8 text-primary" />
            <h2 className="font-headline text-2xl font-bold">Our Vision</h2>
          </div>
          <p className="mt-4 text-muted-foreground">
            To be the world's leading platform for cybersecurity training, recognized for our practical, hands-on approach and our commitment to student success. We envision a future where digital infrastructure is resilient and secure.
          </p>
        </Card>
      </section>

      {/* Team Section */}
      <section className="mt-16 text-center">
        <h2 className="font-headline text-3xl font-bold md:text-4xl">Meet the Team</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Our team of industry veterans and passionate educators is the driving force behind CyberLearn.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM_MEMBERS.map(member => (
            <Card key={member.id} className="text-center">
              <CardContent className="p-6">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={member.image} alt={member.name} data-ai-hint={member.imageHint} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h3 className="font-headline text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-primary">{member.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
