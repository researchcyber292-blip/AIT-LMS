
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/course-card';
import { COURSES } from '@/data/content';
import { ArrowDown, ShieldCheck, Zap, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 min-h-full min-w-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-center text-white">
          <h1 className="font-stylish text-5xl font-bold tracking-tight drop-shadow-xl md:text-7xl">
            AVIRAJ INFO TECH
          </h1>
          <p className="mt-6 max-w-2xl font-body text-2xl text-gray-200 drop-shadow-lg md:text-3xl">
            CYBER SECURITY COURSES
          </p>
          <Link
            href="/courses"
            className="mt-10 rounded-full border border-white/40 bg-black/20 px-10 py-3 text-lg font-medium text-white backdrop-blur-md transition-all hover:border-white/70 hover:bg-white/10"
          >
            Get Started
          </Link>

          <div className="absolute bottom-10 animate-bounce">
            <a href="#featured-courses" aria-label="Scroll to next section">
                <ArrowDown className="h-8 w-8 text-white/70" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="featured-courses" className="bg-background scroll-mt-20">
        {/* Featured Courses Section */}
        <section className="container py-16 md:py-24">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">Featured Courses</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Kickstart your journey into cybersecurity with our most popular courses.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {COURSES.slice(0, 4).map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/courses">View All Courses</Link>
            </Button>
          </div>
        </section>
        
        {/* Why Choose Us Section */}
        <section className="bg-card border-y">
            <div className="container py-16 md:py-24">
                <div className="text-center">
                    <h2 className="font-headline text-3xl font-bold md:text-4xl">Why Aviraj Info Tech?</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                        We provide industry-leading education to build the next generation of security experts.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                    <Card className="text-center p-6 border-transparent shadow-lg hover:shadow-primary/20 transition-shadow">
                        <div className="flex justify-center mb-4">
                            <div className="bg-primary/10 text-primary p-4 rounded-full">
                                <Award className="h-8 w-8" />
                            </div>
                        </div>
                        <CardHeader>
                            <CardTitle className="font-headline">Expert-Led Training</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Learn from seasoned professionals who are leaders in the cybersecurity industry.</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center p-6 border-transparent shadow-lg hover:shadow-accent/20 transition-shadow">
                         <div className="flex justify-center mb-4">
                            <div className="bg-accent/10 text-accent p-4 rounded-full">
                                <Zap className="h-8 w-8" />
                            </div>
                        </div>
                        <CardHeader>
                            <CardTitle className="font-headline">Hands-On Labs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Apply what you learn in real-world scenarios with our interactive lab environments.</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center p-6 border-transparent shadow-lg hover:shadow-secondary-foreground/20 transition-shadow">
                        <div className="flex justify-center mb-4">
                            <div className="bg-secondary text-secondary-foreground p-4 rounded-full">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                        </div>
                        <CardHeader>
                            <CardTitle className="font-headline">Career-Focused</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Our curriculum is designed to equip you with the skills demanded by top employers.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
      </div>
    </>
  );
}
