
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowDown, ShieldCheck, Zap, Award, BookOpen, Target, TrendingUp } from 'lucide-react';

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

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-center text-white">
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
            <a href="#main-content" aria-label="Scroll to next section">
                <ArrowDown className="h-8 w-8 text-white/70" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="main-content" className="bg-background scroll-mt-20">
        <section className="container py-16 md:py-24">
            <div className="text-center mb-12">
                <h2 className="font-headline text-3xl font-bold md:text-4xl">Your Gateway to Cybersecurity Mastery</h2>
                <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">
                    At Aviraj Info Tech, we're dedicated to forging the next generation of cybersecurity experts. We provide cutting-edge, hands-on training to equip you with the skills demanded by the industry.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="bg-primary/10 text-primary p-3 rounded-full">
                            <Award className="h-6 w-6" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Expert-Led Training</h3>
                        <p className="text-muted-foreground">Learn from seasoned professionals who are leaders in the cybersecurity industry, bringing real-world experience to every lesson.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="bg-primary/10 text-primary p-3 rounded-full">
                            <Zap className="h-6 w-6" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Hands-On Labs</h3>
                        <p className="text-muted-foreground">Apply what you learn in real-world scenarios with our interactive lab environments designed to build practical, job-ready skills.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="bg-primary/10 text-primary p-3 rounded-full">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Career-Focused Curriculum</h3>
                        <p className="text-muted-foreground">Our curriculum is designed in collaboration with industry experts to equip you with the skills demanded by top employers.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="bg-primary/10 text-primary p-3 rounded-full">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Industry-Recognized Certifications</h3>
                        <p className="text-muted-foreground">Validate your skills and enhance your resume with certifications that are respected and valued by employers worldwide.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="bg-primary/10 text-primary p-3 rounded-full">
                            <BookOpen className="h-6 w-6" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Comprehensive Course Catalog</h3>
                        <p className="text-muted-foreground">From beginner fundamentals to advanced specializations, find the perfect course to match your skill level and career goals.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="bg-primary/10 text-primary p-3 rounded-full">
                            <Target className="h-6 w-6" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Personalized Learning Paths</h3>
                        <p className="text-muted-foreground">Our platform helps you track your progress and suggests courses to help you achieve your specific career objectives.</p>
                    </div>
                </div>
            </div>
            <div className="mt-12 text-center">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                    <Link href="/courses">Explore All Courses</Link>
                </Button>
            </div>
        </section>
      </div>
    </>
  );
}
