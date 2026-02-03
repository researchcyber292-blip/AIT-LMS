'use client';

import { Film } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ExplorePage() {
  const videos = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    title: `Cybersecurity Concepts Part ${i + 1}`,
  }));

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-10 text-center">
        <h1 className="font-headline text-4xl font-bold">Explore Our Video Library</h1>
        <p className="mt-2 text-muted-foreground">
          A vast collection of video tutorials and security briefings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1">
            <CardContent className="p-0">
              <div className="aspect-video w-full bg-muted flex items-center justify-center">
                <Film className="h-12 w-12 text-muted-foreground" />
              </div>
            </CardContent>
            <CardHeader className="p-4">
              <CardTitle className="font-headline text-base h-10 truncate" title={video.title}>
                {video.title}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
