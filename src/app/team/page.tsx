import { Metadata } from 'next';
import Image from 'next/image';
import { TEAM_MEMBERS } from '@/data/content';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Our Team - Aviraj Info Tech',
  description: 'Meet the dedicated team behind Aviraj Info Tech.',
};

export default function TeamPage() {
  return (
    <div className="bg-background text-foreground pt-14">
      <div className="container mx-auto max-w-6xl py-16 md:py-24 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl">
            Meet Our Dedicated Team
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            The driving force behind our mission to provide quality education.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <Card key={member.id} className="text-center overflow-hidden group border">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  data-ai-hint={member.imageHint}
                />
                 <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              <CardContent className="p-4 bg-card">
                <h3 className="font-headline text-xl font-semibold">{member.name}</h3>
                <p className="text-sm text-primary">{member.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
