
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, Mic, Wallet, BookCopy, Users, BarChart, ArrowLeft, BookUser, LayoutGrid, Trash2 } from 'lucide-react';
import { useAuth, useUser, useFirestore, useCollection, useDoc, useMemoFirebase, FirestorePermissionError, errorEmitter } from '@/firebase';
import { collection, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import type { Enrollment, Instructor, Wallet as WalletType, Course } from '@/lib/types';
import Loading from '@/app/loading';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import imageData from '@/lib/placeholder-images.json';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';


const { placeholderImages } = imageData;
const avatars = placeholderImages.filter(img => img.id.startsWith('avatar-'));


const profileSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters.").max(50, "Title is too long."),
    qualifications: z.string().optional(),
    bio: z.string().min(30, "Bio must be at least 30 characters long to be effective.").max(500, "Bio is too long."),
    photoURL: z.string({ required_error: "Please select a profile picture." }).min(1, "Please select a profile picture."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function InstructorProfileForm({ instructor, onBack }: { instructor: Instructor; onBack: () => void; }) {
    const firestore = useFirestore();
    const { toast } = useToast();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            title: instructor.title || '',
            qualifications: instructor.qualifications || '',
            bio: instructor.bio || '',
            photoURL: instructor.photoURL || '',
        }
    });

    const { formState: { isSubmitting }, setValue, watch } = form;
    const selectedAvatarUrl = watch('photoURL');


    const onSubmit = async (data: ProfileFormValues) => {
        if (!firestore || !instructor) return;
        
        const instructorDocRef = doc(firestore, 'instructors', instructor.id);

        try {
            // Also update the Auth user profile picture
            const { getAuth, updateProfile } = await import('firebase/auth');
            const auth = getAuth();
            if (auth.currentUser) {
              await updateProfile(auth.currentUser, { photoURL: data.photoURL });
            }

            await updateDoc(instructorDocRef, {
                title: data.title,
                qualifications: data.qualifications,
                bio: data.bio,
                photoURL: data.photoURL
            });
            toast({ title: "Profile Created!", description: "Your public profile is now live." });
            onBack();
        } catch (error: any) {
            console.error("Profile update failed:", error);
            const permissionError = new FirestorePermissionError({
                path: instructorDocRef.path,
                operation: 'update',
                requestResourceData: data,
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({ variant: "destructive", title: "Update Failed", description: "Could not save your profile. Please check permissions and try again." });
        }
    };
    
    return (
        <div className="container py-12 md:py-16">
             <div className="flex items-center gap-4 mb-10">
                <Button variant="outline" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="font-headline text-4xl font-bold">Create Your Public Profile</h1>
                    <p className="mt-2 text-muted-foreground">This information will be displayed on your course pages to attract students.</p>
                </div>
            </div>

            <Card className="max-w-5xl mx-auto bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10">
                <CardHeader>
                    <CardTitle>Instructor Details</CardTitle>
                    <CardDescription>
                        Hello, <span className="font-stylish text-primary">{instructor.firstName} {instructor.lastName}</span>.
                        Fill out the details below to complete your profile.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Enter Your Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Mr. Ashok Sir" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="qualifications"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Qualifications (Optional)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="List any degrees, certifications (OSCP, CEH, etc.), or major achievements."
                                                        className="min-h-[120px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Biography</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell students about your experience, passion, and what makes your teaching unique. (Minimum 30 characters)"
                                                    className="flex-grow min-h-[250px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="photoURL"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Profile Picture</FormLabel>
                                        <FormControl>
                                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
                                                {avatars.map(avatar => (
                                                <div
                                                    key={avatar.id}
                                                    onClick={() => setValue('photoURL', avatar.imageUrl, { shouldValidate: true })}
                                                    className={cn(
                                                    "relative aspect-square rounded-full overflow-hidden border-4 cursor-pointer transition-all duration-300",
                                                    selectedAvatarUrl === avatar.imageUrl ? 'border-primary scale-110 shadow-lg' : 'border-transparent hover:border-primary/50'
                                                    )}
                                                >
                                                    <Image
                                                        src={avatar.imageUrl}
                                                        alt={avatar.description}
                                                        fill
                                                        className="object-cover"
                                                        data-ai-hint={avatar.imageHint}
                                                        sizes="(max-width: 768px) 25vw, 12.5vw"
                                                    />
                                                </div>
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <div className="flex justify-end pt-4">
                                <Button type="submit" size="lg" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save & Complete Profile"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

function InstructorManagementView({ onBack, onEditProfile }: { onBack: () => void; onEditProfile: () => void; }) {
    const auth = useAuth();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');

    const handleDeleteAccount = async () => {
        const user = auth.currentUser;
        if (!user || !firestore) return;

        setIsDeleting(true);

        try {
            const instructorDocRef = doc(firestore, 'instructors', user.uid);
            const walletDocRef = doc(firestore, 'wallets', user.uid);

            await deleteDoc(instructorDocRef);
            await deleteDoc(walletDocRef);

            await deleteUser(user);
            
            toast({
                title: 'Account Deleted',
                description: 'Your instructor account has been permanently deleted.',
            });
        } catch (error: any) {
            console.error('Error deleting instructor account:', error);
            let description = 'An unexpected error occurred. Please try again.';
            if (error.code === 'auth/requires-recent-login') {
                description = 'This is a sensitive operation. Please sign out and sign back in before trying again.';
            }
             toast({
                variant: 'destructive',
                title: 'Deletion Failed',
                description,
            });
        } finally {
            setIsDeleting(false);
            setConfirmationText('');
        }
    };
    
    const isConfirmationMatch = confirmationText === 'DELETE';

    return (
        <div className="container py-12 md:py-16">
            <div className="flex items-center gap-4 mb-10">
                <Button variant="outline" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="font-headline text-4xl font-bold">My Courses &amp; Management</h1>
                    <p className="mt-2 text-muted-foreground">Manage your content and account settings.</p>
                </div>
            </div>

             <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Content & Profile Management</CardTitle>
                    <CardDescription>Manage your courses and public instructor profile.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    <div className="rounded-lg border bg-card/70 p-6 text-center flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold font-headline">Course Studio</h3>
                        <p className="text-sm text-muted-foreground mt-2 mb-4 flex-grow">Create, edit, and publish your video courses.</p>
                        <Button asChild>
                           <Link href="/studio">Open AIT Studio</Link>
                        </Button>
                    </div>
                    <div className="rounded-lg border bg-card/70 p-6 text-center flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold font-headline">Edit Profile Preview</h3>
                        <p className="text-sm text-muted-foreground mt-2 mb-4 flex-grow">Update your public name, bio, and picture.</p>
                        <Button onClick={onEditProfile} variant="outline">
                            Edit Your Profile
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription className="text-destructive/80">
                    These actions are permanent and cannot be undone.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-card p-4">
                        <div className="space-y-0.5">
                            <p className="font-medium text-destructive">Delete Account</p>
                            <p className="text-sm text-muted-foreground">
                            Permanently delete your instructor account and all associated data.
                            </p>
                        </div>
                        <AlertDialog onOpenChange={(open) => !open && setConfirmationText('')}>
                            <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account, your courses, and your earnings data. To confirm, please type{' '}
                                <span className="font-bold text-foreground">DELETE</span> in the box below.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="py-4">
                                <Label htmlFor="delete-confirm" className="sr-only">
                                Confirmation
                                </Label>
                                <Input
                                id="delete-confirm"
                                value={confirmationText}
                                onChange={(e) => setConfirmationText(e.target.value)}
                                placeholder="DELETE"
                                className="border-destructive focus-visible:ring-destructive"
                                autoComplete="off"
                                />
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                onClick={handleDeleteAccount}
                                disabled={!isConfirmationMatch || isDeleting}
                                className="bg-destructive hover:bg-destructive/90"
                                >
                                {isDeleting ? 'Deleting...' : 'I understand, delete my account'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Instructor Dashboard Component
function InstructorDashboard({ instructor }: { instructor: Instructor }) {
  const [view, setView] = useState<'main' | 'profile' | 'management'>('main');
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  // Fetch Wallet info
  const walletDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'wallets', user.uid);
  }, [firestore, user]);
  const { data: wallet, isLoading: isWalletLoading } = useDoc<WalletType>(walletDocRef);

  // Fetch instructor's courses from Firestore
  const coursesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, "courses");
  }, [firestore, user]);
  const { data: allCourses, isLoading: areCoursesLoading } = useCollection<Course>(coursesQuery);
  const instructorCourses = allCourses?.filter(c => c.instructorId === instructor.id) || [];


  // Placeholder data for stats
  const totalStudents = 1234; // Placeholder

  const isLoading = isWalletLoading || areCoursesLoading;

  const hasCompletedProfile = !!(instructor.title && instructor.bio && instructor.photoURL);

  if (isLoading) {
    return <Loading />;
  }

  const stats = [
    { title: "Total Earnings", value: `₹${(wallet?.totalEarned || 0).toLocaleString()}`, icon: Wallet },
    { title: "Courses Published", value: instructorCourses.length, icon: BookCopy },
    { title: "Total Students", value: totalStudents.toLocaleString(), icon: Users },
  ];

  const showNotImplementedToast = () => {
    toast({
        title: "Coming Soon",
        description: "This feature is currently under development.",
    });
  };
  
  const mainActions = [
      { title: "Launch Live Class", description: "Start a real-time session for your students.", onClick: () => window.open('https://moderated.jitsi.net/', '_blank'), icon: Mic, isEnabled: true },
      { 
        title: hasCompletedProfile ? "My Courses & Management" : "COMPLETE YOUR PROFILE", 
        description: hasCompletedProfile ? "Manage your courses, profile, and account settings." : "Create your public profile to display on course pages.", 
        onClick: () => hasCompletedProfile ? setView('management') : setView('profile'),
        icon: hasCompletedProfile ? LayoutGrid : BookUser,
        isEnabled: true,
        glow: !hasCompletedProfile
      },
      { title: "Earnings & Payouts", description: "View your balance and request withdrawals.", onClick: showNotImplementedToast, icon: Wallet, isEnabled: true },
      { title: "Student Analytics", description: "Gain insights into student progress and engagement.", onClick: showNotImplementedToast, icon: BarChart, isEnabled: true },
  ];

  if (view === 'profile') {
      return <InstructorProfileForm instructor={instructor} onBack={() => setView('main')} />
  }

  if (view === 'management') {
      return <InstructorManagementView onBack={() => setView('main')} onEditProfile={() => setView('profile')} />
  }

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
        {mainActions.map((action, i) => (
            <Card 
                key={i} 
                className={cn(
                    "bg-card/50 backdrop-blur-sm transition-all duration-300 shadow-lg group",
                    action.isEnabled && "cursor-pointer",
                    action.glow 
                        ? "animated-glowing-border rounded-lg hover:shadow-primary/20" 
                        : "border-blue-500/20 hover:border-blue-500/50 hover:shadow-blue-500/20"
                )} 
                onClick={action.isEnabled ? action.onClick : undefined}
            >
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "p-3 rounded-full border transition-colors",
                            action.glow ? "bg-primary/10 border-primary/20 group-hover:bg-primary/20" : "bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/20"
                        )}>
                            <action.icon className={cn("h-6 w-6", action.glow ? "text-primary" : "text-blue-300")} />
                        </div>
                        <CardTitle className="font-headline text-xl">{action.title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{action.description}</p>
                </CardContent>
            </Card>
        ))}
      </div>

    </div>
  );
}


function EnrolledCourseCard({ enrollment }: { enrollment: Enrollment }) {
    const firestore = useFirestore();
    const courseRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'courses', enrollment.courseId);
    }, [firestore, enrollment.courseId]);
    
    const { data: course, isLoading } = useDoc<Course>(courseRef);
    const [progress, setProgress] = useState<number | null>(null);

    useEffect(() => {
        // This code runs only on the client, after the component has mounted.
        setProgress(Math.floor(Math.random() * 80) + 10);
    }, []); // Empty dependency array ensures this runs only once.


    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-full" />
                </CardFooter>
            </Card>
        );
    }
    
    if (!course) {
        // This can happen if a course is deleted but an enrollment record still exists.
        return null; 
    }

    return (
        <Card key={course.id} className="flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline">{course.title}</CardTitle>
                <CardDescription>{course.level}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="space-y-2">
                    {progress !== null ? (
                        <>
                            <Progress value={progress} aria-label={`${progress}% complete`} />
                            <p className="text-sm text-muted-foreground">{progress}% complete</p>
                        </>
                    ) : (
                        <>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-20" />
                        </>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href={`/courses/${course.id}`}>Continue Learning</Link>
                </Button>
            </CardFooter>
        </Card>
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
          {enrollments && enrollments.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {enrollments.map(enrollment => (
                <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} />
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
