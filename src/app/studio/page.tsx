
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Send, ListVideo, CheckCircle, Plus, Trash2, Image as ImageIcon, Video, Eye, BarChart, Clock, Crown, Settings, UploadCloud, Film } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { uploadToHostinger } from '@/app/actions/upload';
import type { Video as VideoType, Course } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const courseCategories = [
    { value: 'ethical-hacking', label: 'Ethical Hacking' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'full-stack-dev', label: 'Full Stack Dev' },
    { value: 'ai-ml', label: 'AI & ML' },
    { value: 'robotics-tech', label: 'Robotics & Tech' },
    { value: 'coding', label: 'Coding' },
    { value: 'python', label: 'Python' },
];


export default function StudioPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('details');

    // --- STATE MANAGEMENT FOR THE ENTIRE FORM ---
    // Details Tab
    const [title, setTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Highly Advanced'>('Beginner');
    const [category, setCategory] = useState('');
    const [categorySelection, setCategorySelection] = useState('');
    const [learningObjectives, setLearningObjectives] = useState(['']);

    // Curriculum Tab
    const [priceType, setPriceType] = useState<'paid' | 'free'>('paid');
    const [paymentMethod, setPaymentMethod] = useState<'direct' | 'templates'>('direct');
    const [directPrice, setDirectPrice] = useState('');
    
    const [goldFeatures, setGoldFeatures] = useState(() => Array(5).fill(''));
    const [platinumFeatures, setPlatinumFeatures] = useState(() => Array(5).fill(''));
    const [silverFeatures, setSilverFeatures] = useState(() => Array(5).fill(''));

    const [goldPrice, setGoldPrice] = useState('');
    const [platinumPrice, setPlatinumPrice] = useState('');
    const [silverPrice, setSilverPrice] = useState('');

    const [goldDescription, setGoldDescription] = useState('');
    const [platinumDescription, setPlatinumDescription] = useState('');
    const [silverDescription, setSilverDescription] = useState('');

    // Additional Details Tab
    const [courseDuration, setCourseDuration] = useState([1]);
    const [wantsToGoLive, setWantsToGoLive] = useState(false);
    const [providesResources, setProvidesResources] = useState(false);

    // Media Tab
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [uploadingFile, setUploadingFile] = useState<File | null>(null);
    const [uploadingVideoTitle, setUploadingVideoTitle] = useState('');
    const [isUploadingVideo, setIsUploadingVideo] = useState(false);
    const [videosForCategory, setVideosForCategory] = useState<VideoType[]>([]);
    const [isLoadingVideos, setIsLoadingVideos] = useState(false);
    
    // Publish Tab
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

     // Effect to fetch videos when category changes
    useEffect(() => {
        if (!firestore || !category) {
            setVideosForCategory([]);
            return;
        }

        setIsLoadingVideos(true);
        const videosQuery = query(collection(firestore, 'course_videos'), where('category', '==', category));
        
        getDocs(videosQuery).then(snapshot => {
            const videosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoType));
            videosData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setVideosForCategory(videosData);
        }).catch(error => {
            console.error("Error fetching course videos:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch existing videos for this category.' });
        }).finally(() => {
            setIsLoadingVideos(false);
        });

    }, [category, firestore, toast]);
    
    // --- HANDLER FUNCTIONS ---

    const formatDuration = (value: number): string => {
        if (value <= 4) {
            return `${value} week${value !== 1 ? 's' : ''}`;
        }
        if (value < 16) {
            const months = value - 3;
            return `${months} month${months !== 1 ? 's' : ''}`;
        }
        if (value === 16) {
            return '1 Year';
        }
        return `${value} weeks`; // Fallback should not be reached
    };

    const handleObjectiveChange = (index: number, value: string) => {
        const newObjectives = [...learningObjectives];
        newObjectives[index] = value;
        setLearningObjectives(newObjectives);
    };

    const addObjective = () => {
        if (learningObjectives.length < 10) {
            setLearningObjectives([...learningObjectives, '']);
        }
    };

    const removeObjective = (index: number) => {
        if (learningObjectives.length > 1) {
            const newObjectives = [...learningObjectives];
            newObjectives.splice(index, 1);
            setLearningObjectives(newObjectives);
        }
    };


    const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setThumbnailPreview(null);
        }
    };

    const handleFeatureChange = (
        plan: 'gold' | 'platinum' | 'silver',
        index: number,
        value: string
    ) => {
        if (plan === 'gold') {
            const newFeatures = [...goldFeatures];
            newFeatures[index] = value;
            setGoldFeatures(newFeatures);
        } else if (plan === 'platinum') {
            const newFeatures = [...platinumFeatures];
            newFeatures[index] = value;
            setPlatinumFeatures(newFeatures);
        } else { // silver
            const newFeatures = [...silverFeatures];
            newFeatures[index] = value;
            setSilverFeatures(newFeatures);
        }
    };

    const addFeatureLine = (plan: 'gold' | 'platinum' | 'silver') => {
        if (plan === 'gold' && goldFeatures.length < 11) {
            setGoldFeatures([...goldFeatures, '']);
        } else if (plan === 'platinum' && platinumFeatures.length < 11) {
            setPlatinumFeatures([...platinumFeatures, '']);
        } else if (plan === 'silver' && silverFeatures.length < 11) {
            setSilverFeatures([...silverFeatures, '']);
        }
    };
    
    const handleRemoveFeature = (
        plan: 'gold' | 'platinum' | 'silver',
        index: number
    ) => {
        if (plan === 'gold') {
            if (goldFeatures.length > 1) {
                const newFeatures = [...goldFeatures];
                newFeatures.splice(index, 1);
                setGoldFeatures(newFeatures);
            }
        } else if (plan === 'platinum') {
            if (platinumFeatures.length > 1) {
                const newFeatures = [...platinumFeatures];
                newFeatures.splice(index, 1);
                setPlatinumFeatures(newFeatures);
            }
        } else { // silver
            if (silverFeatures.length > 1) {
                const newFeatures = [...silverFeatures];
                newFeatures.splice(index, 1);
                setSilverFeatures(newFeatures);
            }
        }
    };

    const handleUploadVideo = async () => {
        if (!uploadingFile || !uploadingVideoTitle || !category) {
            toast({ variant: 'destructive', title: 'Missing Information', description: 'Please provide a file, title, and set a course category in the Details tab.' });
            return;
        }
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to upload a video.' });
            return;
        }

        setIsUploadingVideo(true);
        const formData = new FormData();
        formData.append('video', uploadingFile);
        formData.append('category', category);

        try {
            const result = await uploadToHostinger(formData);
            if (result.success && result.url) {
                const newVideoData: Omit<VideoType, 'id' | 'createdAt'> = {
                    url: result.url,
                    fileName: result.url.split('/').pop() || 'video.mp4',
                    title: uploadingVideoTitle,
                    category: category,
                    uploaderId: user.uid,
                };
                const docRef = await addDoc(collection(firestore, 'course_videos'), {
                    ...newVideoData,
                    createdAt: serverTimestamp(),
                });
                
                setVideosForCategory(prev => [{id: docRef.id, createdAt: new Date(), ...newVideoData}, ...prev]);

                toast({ title: 'Video Uploaded!', description: `${uploadingFile.name} is now available.` });
                setUploadingFile(null);
                setUploadingVideoTitle('');
                const fileInput = document.getElementById('video-file-upload') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            } else {
                toast({ variant: 'destructive', title: 'Upload Failed', description: result.error || 'An unknown error occurred.' });
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Upload Error', description: error.message });
        } finally {
            setIsUploadingVideo(false);
        }
    };
    

    const handlePublish = async () => {
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to publish a course.' });
            return;
        }

        if (!title || !longDescription || !thumbnailPreview) {
            toast({ variant: 'destructive', title: 'Missing Information', description: 'Please fill out title, description, and add a thumbnail before publishing.' });
            setActiveTab('details');
            return;
        }

        setIsPublishing(true);

        const newCourseData = {
            title,
            description: shortDescription,
            longDescription,
            level,
            category,
            learningObjectives: learningObjectives.filter(o => o.trim() !== ''),
            curriculum: [], // Curriculum builder not implemented yet
            instructorId: user.uid,
            image: thumbnailPreview, // Storing as base64 data URL
            imageHint: 'custom course thumbnail',
            createdAt: serverTimestamp(),
            priceType,
            paymentMethod: priceType === 'paid' ? paymentMethod : undefined,
            price: priceType === 'paid' && paymentMethod === 'direct' ? parseFloat(directPrice) || 0 : 0,
            subscriptionTiers: priceType === 'paid' && paymentMethod === 'templates' ? {
                gold: { price: goldPrice, description: goldDescription, features: goldFeatures.filter(Boolean) },
                platinum: { price: platinumPrice, description: platinumDescription, features: platinumFeatures.filter(Boolean) },
                silver: { price: silverPrice, description: silverDescription, features: silverFeatures.filter(Boolean) },
            } : null,
            duration: formatDuration(courseDuration[0]),
            liveSessionsEnabled: wantsToGoLive,
            resourcesEnabled: providesResources,
        };

        try {
            const coursesCol = collection(firestore, 'courses');
            await addDoc(coursesCol, newCourseData);
            toast({
                title: 'Course Published!',
                description: 'Your course is now live for students.',
            });
            router.push('/dashboard');
        } catch (error: any) {
            console.error("Error publishing course:", error);
            toast({
                variant: 'destructive',
                title: 'Publish Failed',
                description: 'Could not save the course to the database. Check permissions and try again.',
            });
        } finally {
            setIsPublishing(false);
        }
    };


    return (
        <div className="container py-12 md:py-16">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="font-headline text-4xl font-bold">AIT Course Studio</h1>
                    <p className="text-muted-foreground">Create and manage your next course.</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="details">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Details
                    </TabsTrigger>
                    <TabsTrigger value="curriculum">
                        <ListVideo className="mr-2 h-4 w-4" />
                        Curriculum
                    </TabsTrigger>
                    <TabsTrigger value="additional-details">
                        <Settings className="mr-2 h-4 w-4" />
                        Additional
                    </TabsTrigger>
                    <TabsTrigger value="media">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Media
                    </TabsTrigger>
                    <TabsTrigger value="publish">
                        <Eye className="mr-2 h-4 w-4" />
                        Publish
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Course Details</CardTitle>
                            <CardDescription>Start by providing the fundamental information for your course.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="course-title">Course Title</Label>
                                <Input id="course-title" placeholder="e.g., Advanced Penetration Testing" value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="course-description">Short Description</Label>
                                <Textarea id="course-description" placeholder="A brief summary that will appear on the course card." value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="min-h-[100px]" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="course-long-description">Detailed Description</Label>
                                <Textarea id="course-long-description" placeholder="A comprehensive overview of the course content, goals, and target audience." value={longDescription} onChange={(e) => setLongDescription(e.target.value)} className="min-h-[200px]" />
                            </div>
                             <div className="space-y-2">
                                <Label>Category</Label>
                                <Select
                                    value={categorySelection}
                                    onValueChange={(value) => {
                                        setCategorySelection(value);
                                        if (value !== 'other') {
                                            setCategory(value);
                                        } else {
                                            setCategory('');
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courseCategories.map((cat) => (
                                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                        ))}
                                        <SelectItem value="other">Other...</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {categorySelection === 'other' && (
                                <div className="space-y-2">
                                    <Label htmlFor="custom-category">Custom Category Name</Label>
                                    <Input
                                        id="custom-category"
                                        placeholder="e.g., Mobile Security"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    />
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label>Level</Label>
                                <RadioGroup value={level} onValueChange={(v) => setLevel(v as any)} className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Beginner" id="level-beginner" />
                                        <Label htmlFor="level-beginner">Beginner</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Intermediate" id="level-intermediate" />
                                        <Label htmlFor="level-intermediate">Intermediate</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Advanced" id="level-advanced" />
                                        <Label htmlFor="level-advanced">Advanced</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Highly Advanced" id="level-highly-advanced" />
                                        <Label htmlFor="level-highly-advanced">Highly Advanced</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="space-y-2">
                                <Label>What You'll Learn</Label>
                                <p className="text-sm text-muted-foreground">List the key skills and knowledge students will gain. (Max 10)</p>
                                <div className="space-y-2">
                                    {learningObjectives.map((objective, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                            <Input
                                                placeholder={`Objective #${index + 1}`}
                                                value={objective}
                                                onChange={(e) => handleObjectiveChange(index, e.target.value)}
                                            />
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeObjective(index)} className="h-8 w-8 flex-shrink-0" disabled={learningObjectives.length <= 1}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                {learningObjectives.length < 10 && (
                                    <Button type="button" variant="outline" size="sm" onClick={addObjective} className="mt-2">
                                        <Plus className="mr-2 h-4 w-4" /> Add Objective
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={() => setActiveTab('curriculum')}>Next</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="curriculum">
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Course Curriculum & Pricing</CardTitle>
                            <CardDescription>Build out the sections, define pricing, and choose a payment method.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-4">
                                <Label className="text-lg font-medium">Make the Course</Label>
                                <RadioGroup 
                                    value={priceType}
                                    onValueChange={(value: 'paid' | 'free') => setPriceType(value)}
                                    className="grid grid-cols-2 gap-4 pt-2"
                                >
                                    <div>
                                        <RadioGroupItem value="paid" id="price-paid" className="peer sr-only" />
                                        <Label htmlFor="price-paid" className="flex h-16 flex-col items-center justify-center rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-lg font-semibold">
                                            Paid
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="free" id="price-free" className="peer sr-only" />
                                        <Label htmlFor="price-free" className="flex h-16 flex-col items-center justify-center rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-lg font-semibold">
                                            Free
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {priceType === 'paid' && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <Label className="text-lg font-medium">Payment Board Method</Label>
                                        <RadioGroup
                                            value={paymentMethod}
                                            onValueChange={(value: 'direct' | 'templates') => setPaymentMethod(value)}
                                            className="grid grid-cols-2 gap-4 pt-2"
                                        >
                                            <div>
                                                <RadioGroupItem value="direct" id="payment-direct" className="peer sr-only" />
                                                <Label htmlFor="payment-direct" className="flex h-16 flex-col items-center justify-center rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-lg font-semibold">
                                                    Direct Way
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem value="templates" id="payment-templates" className="peer sr-only" />
                                                <Label htmlFor="payment-templates" className="flex h-16 flex-col items-center justify-center rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-lg font-semibold">
                                                    Templates
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {paymentMethod === 'direct' && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Direct Pricing</CardTitle>
                                                <CardDescription>Set a one-time price for your course.</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <Label htmlFor="course-price">Course Price (INR)</Label>
                                                <Input id="course-price" type="number" placeholder="e.g., 499" value={directPrice} onChange={(e) => setDirectPrice(e.target.value)} />
                                            </CardContent>
                                        </Card>
                                    )}

                                    {paymentMethod === 'templates' && (
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-medium">Subscription Templates</h3>
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                <Card className="border-yellow-500/50 bg-yellow-500/5">
                                                    <CardHeader>
                                                        <CardTitle className="text-yellow-400">Gold Plan</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div>
                                                            <Label htmlFor="gold-price">Price</Label>
                                                            <Input id="gold-price" placeholder="e.g., 4999 / 6 months" value={goldPrice} onChange={(e) => setGoldPrice(e.target.value)} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Features</Label>
                                                            <div className="space-y-2">
                                                                {goldFeatures.map((feature, index) => (
                                                                    <div key={index} className="flex items-center gap-2">
                                                                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                                        <Input
                                                                            placeholder={`Line ${index + 1}...`}
                                                                            value={feature}
                                                                            onChange={(e) => handleFeatureChange('gold', index, e.target.value)}
                                                                        />
                                                                         <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveFeature('gold', index)} className="h-8 w-8 flex-shrink-0" disabled={goldFeatures.length <= 1}>
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {goldFeatures.length < 11 && (
                                                                <Button type="button" variant="outline" size="sm" onClick={() => addFeatureLine('gold')} className="mt-2">
                                                                    <Plus className="mr-2 h-4 w-4" /> Add Line
                                                                </Button>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2 pt-4">
                                                            <Label htmlFor="gold-description">Description</Label>
                                                            <Textarea id="gold-description" placeholder="Briefly describe this plan..." value={goldDescription} onChange={(e) => setGoldDescription(e.target.value)} />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                                <Card className="border-slate-400/50 bg-slate-500/5">
                                                    <CardHeader>
                                                        <CardTitle className="text-slate-300">Platinum Plan</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div>
                                                            <Label htmlFor="platinum-price">Price</Label>
                                                            <Input id="platinum-price" placeholder="e.g., 2999 / 3 months" value={platinumPrice} onChange={(e) => setPlatinumPrice(e.target.value)} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Features</Label>
                                                            <div className="space-y-2">
                                                                {platinumFeatures.map((feature, index) => (
                                                                    <div key={index} className="flex items-center gap-2">
                                                                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                                        <Input
                                                                            placeholder={`Line ${index + 1}...`}
                                                                            value={feature}
                                                                            onChange={(e) => handleFeatureChange('platinum', index, e.target.value)}
                                                                        />
                                                                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveFeature('platinum', index)} className="h-8 w-8 flex-shrink-0" disabled={platinumFeatures.length <= 1}>
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {platinumFeatures.length < 11 && (
                                                                <Button type="button" variant="outline" size="sm" onClick={() => addFeatureLine('platinum')} className="mt-2">
                                                                    <Plus className="mr-2 h-4 w-4" /> Add Line
                                                                </Button>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2 pt-4">
                                                            <Label htmlFor="platinum-description">Description</Label>
                                                            <Textarea id="platinum-description" placeholder="Briefly describe this plan..." value={platinumDescription} onChange={(e) => setPlatinumDescription(e.target.value)} />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle>Silver Plan</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div>
                                                            <Label htmlFor="silver-price">Price</Label>
                                                            <Input id="silver-price" placeholder="e.g., 599 / month" value={silverPrice} onChange={(e) => setSilverPrice(e.target.value)} />
                                                        </div>
                                                         <div className="space-y-2">
                                                            <Label>Features</Label>
                                                            <div className="space-y-2">
                                                                {silverFeatures.map((feature, index) => (
                                                                    <div key={index} className="flex items-center gap-2">
                                                                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                                        <Input
                                                                            placeholder={`Line ${index + 1}...`}
                                                                            value={feature}
                                                                            onChange={(e) => handleFeatureChange('silver', index, e.target.value)}
                                                                        />
                                                                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveFeature('silver', index)} className="h-8 w-8 flex-shrink-0" disabled={silverFeatures.length <= 1}>
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {silverFeatures.length < 11 && (
                                                                <Button type="button" variant="outline" size="sm" onClick={() => addFeatureLine('silver')} className="mt-2">
                                                                    <Plus className="mr-2 h-4 w-4" /> Add Line
                                                                </Button>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2 pt-4">
                                                            <Label htmlFor="silver-description">Description</Label>
                                                            <Textarea id="silver-description" placeholder="Briefly describe this plan..." value={silverDescription} onChange={(e) => setSilverDescription(e.target.value)} />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between mt-8">
                            <Button variant="outline" onClick={() => setActiveTab('details')}>
                                Back
                            </Button>
                            <Button onClick={() => setActiveTab('additional-details')}>
                                Next
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                 <TabsContent value="additional-details">
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Additional Details</CardTitle>
                            <CardDescription>Configure duration, live sessions, and other course options.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-4">
                                <Label htmlFor="course-duration">Course Duration: {formatDuration(courseDuration[0])}</Label>
                                <Slider
                                    id="course-duration"
                                    min={1}
                                    max={16}
                                    step={1}
                                    value={courseDuration}
                                    onValueChange={setCourseDuration}
                                />
                                <p className="text-sm text-muted-foreground">Set the estimated time to complete the course.</p>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="live-sessions" className="text-base">Enable Live Teaching Sessions</Label>
                                    <p className="text-sm text-muted-foreground">
                                    Offer live video sessions to interact with your students directly.
                                    </p>
                                </div>
                                <Switch
                                    id="live-sessions"
                                    checked={wantsToGoLive}
                                    onCheckedChange={setWantsToGoLive}
                                />
                            </div>
                            
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label htmlFor="downloadable-resources" className="text-base">Provide Downloadable Resources</Label>
                                    <p className="text-sm text-muted-foreground">
                                    Allow students to download materials like PDFs, code files, etc.
                                    </p>
                                </div>
                                <Switch
                                    id="downloadable-resources"
                                    checked={providesResources}
                                    onCheckedChange={setProvidesResources}
                                />
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={() => setActiveTab('curriculum')}>Back</Button>
                            <Button onClick={() => setActiveTab('media')}>Next</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="media">
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Course Media</CardTitle>
                            <CardDescription>Upload assets for your course like a thumbnail image and video content.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-2">
                                <Label>Upload Thumbnail</Label>
                                <div className="flex items-center gap-4">
                                    {thumbnailPreview && (
                                        <div className="relative w-48 aspect-video rounded-md overflow-hidden border bg-muted">
                                            <Image src={thumbnailPreview} alt="Thumbnail preview" fill className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                    <Input 
                                        id="thumbnail-upload-input" 
                                        type="file" 
                                        className="hidden" 
                                        onChange={handleThumbnailChange}
                                        accept="image/png, image/jpeg, image/webp"
                                    />
                                    <Label
                                        htmlFor="thumbnail-upload-input"
                                        className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                                    >
                                        <ImageIcon className="mr-2 h-4 w-4" />
                                        {thumbnailPreview ? 'Change File' : 'Choose File'}
                                    </Label>
                                </div>
                                <p className="text-sm text-muted-foreground">Recommended: 1280x720px, JPG or PNG.</p>
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Upload Course Videos</h3>
                                <p className="text-sm text-muted-foreground">Upload videos one by one. They will be associated with the course category you set in the 'Details' tab.</p>
                                <Card className="p-4 bg-muted/50">
                                    <div className="space-y-4">
                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="video-file-upload">Video File</Label>
                                            <Input id="video-file-upload" type="file" accept="video/*" onChange={(e) => setUploadingFile(e.target.files?.[0] || null)} />
                                        </div>
                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="uploading-video-title">Video Title</Label>
                                            <Input id="uploading-video-title" value={uploadingVideoTitle} onChange={(e) => setUploadingVideoTitle(e.target.value)} placeholder="e.g., Module 1: Introduction" />
                                        </div>
                                        <Button onClick={handleUploadVideo} disabled={isUploadingVideo || !uploadingFile || !uploadingVideoTitle || !category}>
                                            {isUploadingVideo ? 'Uploading...' : 'Upload Video'}
                                        </Button>
                                        {!category && <p className="text-xs text-destructive">Please set a course category in the 'Details' tab first.</p>}
                                    </div>
                                </Card>
                            </div>
                            
                            <div className="mt-6 space-y-4">
                                <h3 className="font-semibold text-lg">Uploaded Videos for "{courseCategories.find(c => c.value === category)?.label || category || 'Not Set'}"</h3>
                                {isLoadingVideos ? <p className="text-muted-foreground">Loading videos...</p> : videosForCategory.length > 0 ? (
                                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                                        {videosForCategory.map((video: VideoType) => (
                                            <div key={video.id} className="flex items-center justify-between rounded-lg border bg-background p-3 gap-2">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <Film className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                    <p className="font-medium truncate">{video.title}</p>
                                                </div>
                                                <Badge variant="secondary">{courseCategories.find(c => c.value === video.category)?.label || video.category}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No videos uploaded for this category yet.</p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={() => setActiveTab('additional-details')}>Back</Button>
                            <Button onClick={() => setActiveTab('publish')}>Save & Continue</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="publish">
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Preview & Publish</CardTitle>
                            <CardDescription>Review how your course will look to students. When you're ready, publish it.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-background p-4 sm:p-8 rounded-lg border">
                                <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                                    <div className="md:col-span-1 h-fit md:sticky md:top-24">
                                        <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
                                            {thumbnailPreview ? (
                                                <div className="aspect-video w-full relative">
                                                    <Image
                                                        src={thumbnailPreview}
                                                        alt={title || "Course thumbnail"}
                                                        fill
                                                        className="w-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="aspect-video w-full bg-muted flex items-center justify-center">
                                                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                                                </div>
                                            )}

                                            {priceType === 'paid' && paymentMethod === 'templates' ? (
                                                 <div className="p-6">
                                                    <p className="mb-4 text-4xl font-bold font-headline text-primary">Subscription</p>
                                                    <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => setIsPricingModalOpen(true)}>
                                                        View Subscription Plans
                                                    </Button>
                                                    <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                                                        <li className="flex items-center gap-3">
                                                            <BarChart className="h-5 w-5 text-primary" />
                                                            <span className="capitalize">Level: {level.replace('-', ' ')}</span>
                                                        </li>
                                                         <li className="flex items-center gap-3">
                                                            <Clock className="h-5 w-5 text-primary" />
                                                            <span>Duration: {formatDuration(courseDuration[0])}</span>
                                                        </li>
                                                        <li className="flex items-center gap-3">
                                                            <Clock className="h-5 w-5 text-primary" />
                                                            <span>~20 Hours to complete</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            ) : (
                                                <div className="p-6">
                                                    {priceType === 'free' ? (
                                                        <p className="mb-4 text-4xl font-bold font-headline text-primary">Free</p>
                                                    ) : (
                                                        <p className="mb-4 text-4xl font-bold font-headline text-primary">₹{directPrice || '0.00'}</p>
                                                    )}
                                                    <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled>
                                                        {priceType === 'free' ? 'Enroll for Free (Preview)' : 'Buy Now (Preview)'}
                                                    </Button>
                                                    <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                                                        <li className="flex items-center gap-3">
                                                            <BarChart className="h-5 w-5 text-primary" />
                                                            <span className="capitalize">Level: {level.replace('-', ' ')}</span>
                                                        </li>
                                                        <li className="flex items-center gap-3">
                                                            <Clock className="h-5 w-5 text-primary" />
                                                            <span>Duration: {formatDuration(courseDuration[0])}</span>
                                                        </li>
                                                        <li className="flex items-center gap-3">
                                                            <Clock className="h-5 w-5 text-primary" />
                                                            <span>~20 Hours to complete</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <Badge variant="secondary" className="mb-2 capitalize">{courseCategories.find(c => c.value === category)?.label || category || "Category"}</Badge>
                                        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">{title || "Your Course Title"}</h1>
                                        <p className="mt-4 text-lg text-muted-foreground">{longDescription || "Your detailed course description will appear here."}</p>

                                        <div className="mt-10">
                                            <h2 className="font-headline text-2xl font-semibold border-l-4 border-primary pl-4">What You'll Learn</h2>
                                            {learningObjectives.filter(o => o.trim() !== '').length > 0 ? (
                                                <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                    {learningObjectives.filter(o => o.trim() !== '').map((obj, i) => (
                                                        <li key={i} className="flex items-start gap-3">
                                                            <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                                                            <span>{obj}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="mt-4 text-muted-foreground">Add learning objectives in the 'Details' tab.</p>
                                            )}
                                        </div>

                                         <div className="mt-10">
                                            <h2 className="font-headline text-2xl font-semibold border-l-4 border-primary pl-4">Course Curriculum</h2>
                                            <p className="mt-4 text-muted-foreground">The full curriculum will be displayed here once the builder is implemented.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                         <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={() => setActiveTab('media')}>Back</Button>
                            <Button onClick={handlePublish} disabled={isPublishing}>
                                {isPublishing ? 'Publishing...' : 'Publish Course'}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={isPricingModalOpen} onOpenChange={setIsPricingModalOpen}>
                <DialogContent className="max-w-5xl bg-background border-border">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-3xl text-center">Subscription Plans</DialogTitle>
                        <DialogDescription className="text-center">
                            Choose the plan that's right for you.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
                        {goldPrice && (
                            <Card className="border-yellow-500/50 bg-yellow-500/10 flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-yellow-400 font-headline text-2xl flex items-center gap-2"><Crown /> Gold Plan</CardTitle>
                                    <p className="text-3xl font-bold pt-2">{goldPrice}</p>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-4">
                                    <p className="text-muted-foreground text-sm italic">{goldDescription}</p>
                                    <ul className="space-y-2 pt-2">
                                    {goldFeatures.filter(f => f.trim()).map((feature, i) => (
                                        <li key={`modal-gold-${i}`} className="flex items-start gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold" disabled>Select Plan</Button>
                                </CardFooter>
                            </Card>
                        )}
                        {platinumPrice && (
                             <Card className="border-slate-400/50 bg-slate-400/10 flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-slate-300 font-headline text-2xl">Platinum Plan</CardTitle>
                                    <p className="text-3xl font-bold pt-2">{platinumPrice}</p>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-4">
                                    <p className="text-muted-foreground text-sm italic">{platinumDescription}</p>
                                    <ul className="space-y-2 pt-2">
                                    {platinumFeatures.filter(f => f.trim()).map((feature, i) => (
                                        <li key={`modal-plat-${i}`} className="flex items-start gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-slate-500 hover:bg-slate-600 font-bold" disabled>Select Plan</Button>
                                </CardFooter>
                            </Card>
                        )}
                        {silverPrice && (
                            <Card className="border-zinc-500/50 bg-zinc-500/10 flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-zinc-300 font-headline text-2xl">Silver Plan</CardTitle>
                                    <p className="text-3xl font-bold pt-2">{silverPrice}</p>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-4">
                                    <p className="text-muted-foreground text-sm italic">{silverDescription}</p>
                                    <ul className="space-y-2 pt-2">
                                    {silverFeatures.filter(f => f.trim()).map((feature, i) => (
                                        <li key={`modal-silv-${i}`} className="flex items-start gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-zinc-500 hover:bg-zinc-600 font-bold" disabled>Select Plan</Button>
                                </CardFooter>
                            </Card>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

