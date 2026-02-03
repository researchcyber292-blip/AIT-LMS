'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ExplorePage() {
  const youtubeLinks = [
    '0c2G4PM6oF4', 'U-mAqnc6ZkI', '42u_2e6eNF4', 'csYtPidvvFQ', 
    'ZwwYDeFdXp8', 'Lwc47ABbspA', 'ISc5_x_3MWM', '8C_kHJ5YEiA', 
    'YJyXfjbBmc8', 't9MJ1gxcJ4w', 'M7n551ot8oQ', 'mTpwIsTfBcw', 
    'KNfZrLKIufI', 'y0aRAeVwp_Y', 'NKLfaSv3y2A', 'nDXX6LIJx8A'
  ];

  const videos = Array.from({ length: 40 }, (_, i) => ({
    id: youtubeLinks[i % youtubeLinks.length],
    title: `Cybersecurity Concepts Part ${i + 1}`,
    uniqueKey: `${i}-${youtubeLinks[i % youtubeLinks.length]}`
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
          <Card key={video.uniqueKey} className="overflow-hidden bg-card/50 transition-all hover:shadow-lg hover:-translate-y-1">
            <CardContent className="p-0">
              <div className="aspect-video w-full bg-black">
                 <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
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
