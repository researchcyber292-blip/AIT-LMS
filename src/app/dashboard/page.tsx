
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, Mic, Wallet, BookCopy, Users, BarChart } from 'lucide-react';
import { COURSES } from '@/data/content';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { Enrollment, Instructor, Wallet as WalletType } from '@/lib/types';
import Loading from '@/app/loading';

// Instructor Dashboard Component
function InstructorDashboard({ instructor }: { instructor: Instructor }) {
  const firestore = useFirestore();
  const { user } = useUser();

  // Fetch Wallet info
  const walletDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'wallets', user.uid);
  }, [firestore, user]);
  const { data: wallet, isLoading: isWalletLoading } = useDoc<WalletType>(walletDocRef);

  // Fetch instructor's courses from the main `COURSES` static data for now
  const instructorCourses = COURSES.filter(c => c.instructor.id === instructor.id);

  // Placeholder data for stats
  const totalStudents = 1234; // Placeholder

  const isLoading = isWalletLoading;

  if (isLoading) {
    return <Loading />;
  }

  const stats = [
    { title: "Total Earnings", value: `₹${(wallet?.totalEarned || 0).toLocaleString()}`, icon: Wallet },
    { title: "Courses Published", value: instructorCourses.length, icon: BookCopy },
    { title: "Total Students", value: totalStudents.toLocaleString(), icon: Users },
  ];

  const actions = [
      { title: "Launch Live Class", description: "Start a real-time session for your students.", href:"https://moderated.jitsi.net/", icon: Mic, external: true },
      { title: "Course Studio", description: "Create, edit, and manage your course content.", href:"#", icon: BookCopy, external: false },
      { title: "Earnings & Payouts", description: "View your balance and request withdrawals.", href:"#", icon: Wallet, external: false },
      { title: "Student Analytics", description: "Gain insights into student progress and engagement.", href:"#", icon: BarChart, external: false },
  ];

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-10">
        <h1 className="font-headline text-4xl font-bold">Instructor Command Center</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back, {instructor.firstName}. Here's your mission overview.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actions.map((action, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-sm border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 group">
                <Link href={action.href} target={action.external ? "_blank" : "_self"} rel={action.external ? "noopener noreferrer" : ""}>
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                                <action.icon className="h-6 w-6 text-blue-300" />
                            </div>
                            <CardTitle className="font-headline text-xl">{action.title}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{action.description}</p>
                    </CardContent>
                </Link>
            </Card>
        ))}
      </div>

    </div>
  );
}


// Student Dashboard Component
function StudentDashboard() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const enrollmentsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'enrollments');
  }, [firestore, user]);

  const { data: enrollments, isLoading: enrollmentsLoading } = useCollection<Enrollment>(enrollmentsQuery);

  if (isUserLoading || enrollmentsLoading) {
    return <Loading />;
  }

  const enrolledCourses = (enrollments || [])
    .map(enrollment => {
      const course = COURSES.find(c => c.id === enrollment.courseId);
      if (course) {
        return { ...course, progress: Math.floor(Math.random() * 80) + 10 };
      }
      return null;
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-10">
        <h1 className="font-headline text-4xl font-bold">Welcome Back, {user?.displayName || 'Student'}!</h1>
        <p className="mt-2 text-muted-foreground">
          Continue your learning journey and sharpen your cybersecurity skills.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <section>
          <h2 className="font-headline text-2xl font-semibold mb-4">My Courses</h2>
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map(course => (
                <Card key={course.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="font-headline">{course.title}</CardTitle>
                    <CardDescription>{course.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2">
                        <Progress value={course.progress} aria-label={`${course.progress}% complete`} />
                        <p className="text-sm text-muted-foreground">{course.progress}% complete</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/courses/${course.id}`}>Continue Learning</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-card p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-headline text-xl font-semibold">No Courses Yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You haven't enrolled in any courses. Explore our catalog to get started.
              </p>
              <Button asChild className="mt-6">
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </div>
          )}
        </section>

        <section>
          <h2 className="font-headline text-2xl font-semibold mb-4">Featured Videos</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden bg-card/50">
                <div className="aspect-video w-full bg-muted flex items-center justify-center">
                  <Video className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardHeader>
                  <CardTitle className="font-headline text-base h-10">Placeholder Video Title {i+1}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}


export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const instructorDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'instructors', user.uid);
  }, [firestore, user]);
  const { data: instructor, isLoading: isInstructorLoading } = useDoc<Instructor>(instructorDocRef);

  const isLoading = isUserLoading || isInstructorLoading;

  if (isLoading) {
    return <Loading />;
  }

  if (instructor) {
    return <InstructorDashboard instructor={instructor} />;
  }

  return <StudentDashboard />;
}
