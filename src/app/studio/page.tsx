
'use client';

import { useState, useEffect, useCallback } from 'react';
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

interface UploadItem {
  id: string;
  file: File | null;
  title: string;
  isUploading: boolean;
}

export default function StudioPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('details');

    // --- STATE MANAGEMENT ---
    // Details
    const [title, setTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Highly Advanced'>('Beginner');
    const [category, setCategory] = useState('');
    const [categorySelection, setCategorySelection] = useState('');
    const [learningObjectives, setLearningObjectives] = useState(['']);

    // Curriculum
    const [priceType, setPriceType] = useState<'paid' | 'free'>('paid');
    const [paymentMethod, setPaymentMethod] = useState<'direct' | 'templates'>('direct');
    const [directPrice, setDirectPrice] = useState('');
    const [goldFeatures, setGoldFeatures] = useState(['']);
    const [platinumFeatures, setPlatinumFeatures] = useState(['']);
    const [silverFeatures, setSilverFeatures] = useState(['']);
    const [goldPrice, setGoldPrice] = useState('');
    const [platinumPrice, setPlatinumPrice] = useState('');
    const [silverPrice, setSilverPrice] = useState('');
    const [goldDescription, setGoldDescription] = useState('');
    const [platinumDescription, setPlatinumDescription] = useState('');
    const [silverDescription, setSilverDescription] = useState('');

    // Additional
    const [courseDuration, setCourseDuration] = useState([1]);
    const [wantsToGoLive, setWantsToGoLive] = useState(false);
    const [providesResources, setProvidesResources] = useState(false);

    // Media
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [videosForCategory, setVideosForCategory] = useState<VideoType[]>([]);
    const [isLoadingVideos, setIsLoadingVideos] = useState(false);
    const [uploadItems, setUploadItems] = useState<{
        gold: UploadItem[];
        silver: UploadItem[];
        platinum: UploadItem[];
        general: UploadItem[];
    }>({
        gold: [{ id: `gold-${Date.now()}`, file: null, title: '', isUploading: false }],
        silver: [{ id: `silver-${Date.now()}`, file: null, title: '', isUploading: false }],
        platinum: [{ id: `platinum-${Date.now()}`, file: null, title: '', isUploading: false }],
        general: [{ id: `general-${Date.now()}`, file: null, title: '', isUploading: false }],
    });

    // Publish
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    // --- DATA FETCHING & EFFECTS ---
    const fetchVideos = useCallback(async () => {
        if (!firestore || !category) {
            setVideosForCategory([]);
            return;
        }
        setIsLoadingVideos(true);
        const videosQuery = query(collection(firestore, 'course_videos'), where('category', '==', category));
        try {
            const snapshot = await getDocs(videosQuery);
            const videosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoType));
            videosData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            setVideosForCategory(videosData);
        } catch (error) {
            console.error("Error fetching course videos:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch existing videos.' });
        } finally {
            setIsLoadingVideos(false);
        }
    }, [firestore, category, toast]);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    useEffect(() => {
        const newCategoryLabel = courseCategories.find(c => c.value === category)?.label || category || '';
        
        const updateTitlesForPlan = (plan: keyof typeof uploadItems, items: UploadItem[]): UploadItem[] => {
            const existingVideosCount = videosForCategory.filter(v => (v.plan || 'general') === plan).length;
            return items.map((item, index) => ({
                ...item,
                title: newCategoryLabel ? `Part-${existingVideosCount + index + 1}-${newCategoryLabel}` : '',
            }));
        };

        setUploadItems(prev => ({
            gold: updateTitlesForPlan('gold', prev.gold),
            silver: updateTitlesForPlan('silver', prev.silver),
            platinum: updateTitlesForPlan('platinum', prev.platinum),
            general: updateTitlesForPlan('general', prev.general),
        }));
    }, [category, videosForCategory]);


    // --- HANDLER FUNCTIONS ---

    const formatDuration = (value: number): string => {
        if (value <= 4) return `${value} week${value !== 1 ? 's' : ''}`;
        if (value < 16) return `${value - 3} month${value - 3 !== 1 ? 's' : ''}`;
        if (value === 16) return '1 Year';
        return `${value} weeks`;
    };

    const handleObjectiveChange = (index: number, value: string) => {
        const newObjectives = [...learningObjectives];
        newObjectives[index] = value;
        setLearningObjectives(newObjectives);
    };

    const addObjective = () => {
        if (learningObjectives.length < 10) setLearningObjectives([...learningObjectives, '']);
    };

    const removeObjective = (index: number) => {
        if (learningObjectives.length > 1) {
            setLearningObjectives(learningObjectives.filter((_, i) => i !== index));
        }
    };
    
    const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setThumbnailPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setThumbnailPreview(null);
        }
    };

    // --- Template Features Handlers ---
    const handleFeatureChange = (plan: 'gold' | 'platinum' | 'silver', index: number, value: string) => {
        const setters = { gold: setGoldFeatures, platinum: setPlatinumFeatures, silver: setSilverFeatures };
        const features = { gold: goldFeatures, platinum: platinumFeatures, silver: silverFeatures };
        const newFeatures = [...features[plan]];
        newFeatures[index] = value;
        setters[plan](newFeatures);
    };

    const addFeatureLine = (plan: 'gold' | 'platinum' | 'silver') => {
        const setters = { gold: setGoldFeatures, platinum: setPlatinumFeatures, silver: setSilverFeatures };
        const features = { gold: goldFeatures, platinum: platinumFeatures, silver: silverFeatures };
        if (features[plan].length < 11) {
            setters[plan]([...features[plan], '']);
        }
    };

    const handleRemoveFeature = (plan: 'gold' | 'platinum' | 'silver', index: number) => {
        const setters = { gold: setGoldFeatures, platinum: setPlatinumFeatures, silver: setSilverFeatures };
        const features = { gold: goldFeatures, platinum: platinumFeatures, silver: silverFeatures };
        if (features[plan].length > 1) {
            setters[plan](features[plan].filter((_, i) => i !== index));
        }
    };

    // --- Video Upload Handlers ---
    const addUploadSlot = (plan: keyof typeof uploadItems) => {
        const newCategoryLabel = courseCategories.find(c => c.value === category)?.label || category;
        const existingVideosCount = videosForCategory.filter(v => (v.plan || 'general') === plan).length;
        
        setUploadItems(prev => {
            const newPartNumber = existingVideosCount + prev[plan].length + 1;
            const newItem: UploadItem = {
                id: `${plan}-${Date.now()}`,
                file: null,
                title: newCategoryLabel ? `Part-${newPartNumber}-${newCategoryLabel}` : '',
                isUploading: false,
            };
            return { ...prev, [plan]: [...prev[plan], newItem] };
        });
    };
    
    const removeUploadSlot = (plan: keyof typeof uploadItems, id: string) => {
        setUploadItems(prev => ({ ...prev, [plan]: prev[plan].filter(item => item.id !== id) }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, plan: keyof typeof uploadItems, id: string) => {
        const file = event.target.files?.[0];
        if (file && !file.type.startsWith('video/')) {
            toast({ variant: 'destructive', title: 'Invalid File', description: 'Please select a video file.' });
            return;
        }
        setUploadItems(prev => ({
            ...prev,
            [plan]: prev[plan].map(item => item.id === id ? { ...item, file: file || null } : item)
        }));
    };
    
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>, plan: keyof typeof uploadItems, id: string) => {
        const newTitle = event.target.value;
        setUploadItems(prev => ({
            ...prev,
            [plan]: prev[plan].map(item => item.id === id ? { ...item, title: newTitle } : item)
        }));
    };

    const handleUploadVideo = async (plan: keyof typeof uploadItems, id: string) => {
        const itemToUpload = uploadItems[plan].find(item => item.id === id);
        if (!itemToUpload || !itemToUpload.file || !itemToUpload.title || !category) {
            toast({ variant: 'destructive', title: 'Missing Info', description: 'Please provide a file, title, and course category.' });
            return;
        }
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'Auth Error', description: 'You must be logged in to upload.' });
            return;
        }
        const instructorUsername = user.displayName;
        if (!instructorUsername) {
            toast({ variant: 'destructive', title: 'Auth Error', description: 'Instructor name not found.' });
            return;
        }

        setUploadItems(prev => ({ ...prev, [plan]: prev[plan].map(item => item.id === id ? { ...item, isUploading: true } : item) }));

        const formData = new FormData();
        formData.append('video', itemToUpload.file);
        formData.append('category', category);
        formData.append('instructorUsername', instructorUsername);

        try {
            const result = await uploadToHostinger(formData);
            if (result.success && result.url && result.folderName) {
                const newVideoData: Omit<VideoType, 'id'|'createdAt'> = {
                    url: result.url,
                    fileName: result.url.split('/').pop() || 'video.mp4',
                    title: itemToUpload.title,
                    category: category,
                    uploaderId: user.uid,
                    instructorUsername: instructorUsername.toLowerCase().replace(/\s+/g, ''),
                    folderName: result.folderName,
                    ...(plan !== 'general' && { plan }),
                };
                await addDoc(collection(firestore, 'course_videos'), { ...newVideoData, createdAt: serverTimestamp() });
                await fetchVideos();
                toast({ title: 'Video Uploaded!', description: `${itemToUpload.file.name} is now available.` });
                removeUploadSlot(plan, id);
            } else {
                toast({ variant: 'destructive', title: 'Upload Failed', description: result.error });
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Upload Error', description: error.message });
        } finally {
            setUploadItems(prev => ({ ...prev, [plan]: prev[plan].map(item => item.id === id ? { ...item, isUploading: false } : item) }));
        }
    };

    // --- Render Functions ---
    const renderVideoList = (videoList: VideoType[]) => {
        if (isLoadingVideos) return <p className="text-muted-foreground">Loading videos...</p>;
        if (videoList.length > 0) {
            return (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {videoList.map(video => (
                        <div key={video.id} className="flex items-center justify-between rounded-lg border bg-background p-3 gap-2">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <Film className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                <p className="font-medium truncate">{video.title}</p>
                            </div>
                            <Badge variant="secondary">{courseCategories.find(c => c.value === video.category)?.label || video.category}</Badge>
                        </div>
                    ))}
                </div>
            );
        }
        return <p className="text-sm text-muted-foreground">No videos uploaded for this plan yet.</p>;
    };

    const renderUploadForms = (plan: keyof typeof uploadItems) => {
        const planItems = uploadItems[plan];
        const planLabel = plan === 'platinum' ? 'Premium (Platinum)' : plan.charAt(0).toUpperCase() + plan.slice(1);
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="capitalize">{planLabel} Plan Videos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {planItems.map((item) => (
                        <div key={item.id} className="p-4 rounded-lg bg-muted/50 border border-dashed relative space-y-4">
                            {planItems.length > 1 && (
                                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeUploadSlot(plan, item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor={`video-file-${item.id}`}>Video File</Label>
                                <Input id={`video-file-${item.id}`} type="file" accept="video/*" onChange={(e) => handleFileChange(e, plan, item.id)} />
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor={`video-title-${item.id}`}>Video Title</Label>
                                <Input id={`video-title-${item.id}`} value={item.title} onChange={(e) => handleTitleChange(e, plan, item.id)} placeholder="e.g., Module 1: Introduction" />
                            </div>
                            <Button onClick={() => handleUploadVideo(plan, item.id)} disabled={item.isUploading || !item.file || !item.title || !category}>
                                {item.isUploading ? 'Uploading...' : 'Upload Video'}
                            </Button>
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => addUploadSlot(plan)} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add Another Video
                    </Button>
                     <div className="mt-4">
                        <h4 className="font-semibold text-sm mb-2">Uploaded Videos for {planLabel}</h4>
                        {renderVideoList(videosForCategory.filter(v => v.plan === plan))}
                    </div>
                </CardContent>
            </Card>
        );
    };

    // --- Publish Handler ---
    const handlePublish = async () => {
        if (!user || !firestore) return toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
        if (!title || !longDescription || !thumbnailPreview) {
            setActiveTab('details');
            return toast({ variant: 'destructive', title: 'Missing Information', description: 'Please fill out title, description, and add a thumbnail.' });
        }
        setIsPublishing(true);
        const newCourseData = {
            title, shortDescription, longDescription, level, category,
            learningObjectives: learningObjectives.filter(o => o.trim() !== ''),
            curriculum: [], instructorId: user.uid, image: thumbnailPreview, imageHint: 'custom course thumbnail',
            createdAt: serverTimestamp(), priceType,
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
            await addDoc(collection(firestore, 'courses'), newCourseData);
            toast({ title: 'Course Published!', description: 'Your course is now live.' });
            router.push('/dashboard');
        } catch (error: any) {
            console.error("Error publishing course:", error);
            toast({ variant: 'destructive', title: 'Publish Failed', description: 'Could not save the course. Check permissions.' });
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
                    <TabsTrigger value="details"><BookOpen className="mr-2 h-4 w-4" />Details</TabsTrigger>
                    <TabsTrigger value="curriculum"><ListVideo className="mr-2 h-4 w-4" />Curriculum</TabsTrigger>
                    <TabsTrigger value="additional-details"><Settings className="mr-2 h-4 w-4" />Additional</TabsTrigger>
                    <TabsTrigger value="media"><ImageIcon className="mr-2 h-4 w-4" />Media</TabsTrigger>
                    <TabsTrigger value="publish"><Eye className="mr-2 h-4 w-4" />Publish</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <Card className="mt-6">
                        <CardHeader><CardTitle>Course Details</CardTitle><CardDescription>Start with the fundamental information.</CardDescription></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2"><Label htmlFor="course-title">Course Title</Label><Input id="course-title" placeholder="e.g., Advanced Penetration Testing" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="course-description">Short Description</Label><Textarea id="course-description" placeholder="A brief summary for the course card." value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="course-long-description">Detailed Description</Label><Textarea id="course-long-description" placeholder="A comprehensive overview of the course." value={longDescription} onChange={(e) => setLongDescription(e.target.value)} className="min-h-[150px]" /></div>
                            <div className="space-y-2"><Label>Category</Label>
                                <Select value={categorySelection} onValueChange={(value) => { setCategorySelection(value); if (value !== 'other') setCategory(value); else setCategory(''); }}>
                                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                                    <SelectContent>
                                        {courseCategories.map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}
                                        <SelectItem value="other">Other...</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {categorySelection === 'other' && (<div className="space-y-2"><Label htmlFor="custom-category">Custom Category Name</Label><Input id="custom-category" placeholder="e.g., Mobile Security" value={category} onChange={(e) => setCategory(e.target.value)} /></div>)}
                            <div className="space-y-2"><Label>Level</Label>
                                <RadioGroup value={level} onValueChange={(v) => setLevel(v as any)} className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="Beginner" id="level-beginner" /><Label htmlFor="level-beginner">Beginner</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="Intermediate" id="level-intermediate" /><Label htmlFor="level-intermediate">Intermediate</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="Advanced" id="level-advanced" /><Label htmlFor="level-advanced">Advanced</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="Highly Advanced" id="level-highly-advanced" /><Label htmlFor="level-highly-advanced">Highly Advanced</Label></div>
                                </RadioGroup>
                            </div>
                            <div className="space-y-2"><Label>What You'll Learn</Label><p className="text-sm text-muted-foreground">List key skills students will gain. (Max 10)</p>
                                <div className="space-y-2">
                                    {learningObjectives.map((obj, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                            <Input placeholder={`Objective #${index + 1}`} value={obj} onChange={(e) => handleObjectiveChange(index, e.target.value)} />
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeObjective(index)} className="h-8 w-8 flex-shrink-0" disabled={learningObjectives.length <= 1}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    ))}
                                </div>
                                {learningObjectives.length < 10 && (<Button type="button" variant="outline" size="sm" onClick={addObjective} className="mt-2"><Plus className="mr-2 h-4 w-4" /> Add Objective</Button>)}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end"><Button onClick={() => setActiveTab('curriculum')}>Next</Button></CardFooter>
                    </Card>
                </TabsContent>
                
                <TabsContent value="curriculum">
                     <Card className="mt-6">
                        <CardHeader><CardTitle>Course Curriculum & Pricing</CardTitle><CardDescription>Build out sections, define pricing, and choose payment methods.</CardDescription></CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-4"><Label className="text-lg font-medium">Course Price</Label>
                                <RadioGroup value={priceType} onValueChange={(value: 'paid' | 'free') => setPriceType(value)} className="grid grid-cols-2 gap-4 pt-2">
                                    {[ 'paid', 'free' ].map(type => (<div key={type}><RadioGroupItem value={type} id={`price-${type}`} className="peer sr-only" /><Label htmlFor={`price-${type}`} className="flex h-16 flex-col items-center justify-center rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-lg font-semibold capitalize">{type}</Label></div>))}
                                </RadioGroup>
                            </div>
                            {priceType === 'paid' && (
                                <div className="space-y-8">
                                    <div className="space-y-4"><Label className="text-lg font-medium">Payment Method</Label>
                                        <RadioGroup value={paymentMethod} onValueChange={(value: 'direct' | 'templates') => setPaymentMethod(value)} className="grid grid-cols-2 gap-4 pt-2">
                                            {[ 'direct', 'templates' ].map(type => (<div key={type}><RadioGroupItem value={type} id={`payment-${type}`} className="peer sr-only" /><Label htmlFor={`payment-${type}`} className="flex h-16 flex-col items-center justify-center rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-lg font-semibold capitalize">{type === 'direct' ? 'Direct Way' : 'Templates'}</Label></div>))}
                                        </RadioGroup>
                                    </div>
                                    {paymentMethod === 'direct' && (<Card><CardHeader><CardTitle>Direct Pricing</CardTitle><CardDescription>Set a one-time price for your course.</CardDescription></CardHeader><CardContent><Label htmlFor="course-price">Course Price (INR)</Label><Input id="course-price" type="number" placeholder="e.g., 499" value={directPrice} onChange={(e) => setDirectPrice(e.target.value)} /></CardContent></Card>)}
                                    {paymentMethod === 'templates' && (
                                        <div className="space-y-6"><h3 className="text-lg font-medium">Subscription Templates</h3>
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                {([ 'gold', 'platinum', 'silver' ] as const).map(plan => (<Card key={plan} className={`border-${plan === 'gold' ? 'yellow' : plan === 'platinum' ? 'slate' : 'zinc'}-500/50 bg-${plan === 'gold' ? 'yellow' : plan === 'platinum' ? 'slate' : 'zinc'}-500/5`}>
                                                    <CardHeader><CardTitle className={`text-${plan === 'gold' ? 'yellow' : plan === 'platinum' ? 'slate' : 'zinc'}-400 capitalize`}>{plan === 'platinum' ? 'Premium (Platinum)' : plan} Plan</CardTitle></CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div><Label htmlFor={`${plan}-price`}>Price</Label><Input id={`${plan}-price`} placeholder="e.g., 4999 / 6 months" value={{gold: goldPrice, platinum: platinumPrice, silver: silverPrice}[plan]} onChange={(e) => ({gold: setGoldPrice, platinum: setPlatinumPrice, silver: setSilverPrice}[plan])(e.target.value)} /></div>
                                                        <div className="space-y-2"><Label>Features</Label>
                                                            <div className="space-y-2">
                                                                {{gold: goldFeatures, platinum: platinumFeatures, silver: silverFeatures}[plan].map((feature, index) => (<div key={index} className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" /><Input placeholder={`Line ${index + 1}...`} value={feature} onChange={(e) => handleFeatureChange(plan, index, e.target.value)} /><Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveFeature(plan, index)} className="h-8 w-8 flex-shrink-0" disabled={{gold: goldFeatures, platinum: platinumFeatures, silver: silverFeatures}[plan].length <= 1}><Trash2 className="h-4 w-4" /></Button></div>))}
                                                            </div>
                                                            {{gold: goldFeatures, platinum: platinumFeatures, silver: silverFeatures}[plan].length < 11 && (<Button type="button" variant="outline" size="sm" onClick={() => addFeatureLine(plan)} className="mt-2"><Plus className="mr-2 h-4 w-4" /> Add Line</Button>)}
                                                        </div>
                                                        <div className="space-y-2 pt-4"><Label htmlFor={`${plan}-description`}>Description</Label><Textarea id={`${plan}-description`} placeholder="Briefly describe this plan..." value={{gold: goldDescription, platinum: platinumDescription, silver: silverDescription}[plan]} onChange={(e) => ({gold: setGoldDescription, platinum: setPlatinumDescription, silver: setSilverDescription}[plan])(e.target.value)} /></div>
                                                    </CardContent></Card>))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between mt-8"><Button variant="outline" onClick={() => setActiveTab('details')}>Back</Button><Button onClick={() => setActiveTab('additional-details')}>Next</Button></CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="additional-details">
                    <Card className="mt-6"><CardHeader><CardTitle>Additional Details</CardTitle><CardDescription>Configure duration, live sessions, and other options.</CardDescription></CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-4"><Label htmlFor="course-duration">Course Duration: {formatDuration(courseDuration[0])}</Label><Slider id="course-duration" min={1} max={16} step={1} value={courseDuration} onValueChange={setCourseDuration} /><p className="text-sm text-muted-foreground">Set the estimated time to complete the course.</p></div>
                            <div className="flex items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><Label htmlFor="live-sessions" className="text-base">Enable Live Teaching Sessions</Label><p className="text-sm text-muted-foreground">Offer live video sessions to interact directly.</p></div><Switch id="live-sessions" checked={wantsToGoLive} onCheckedChange={setWantsToGoLive} /></div>
                            <div className="flex items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><Label htmlFor="downloadable-resources" className="text-base">Provide Downloadable Resources</Label><p className="text-sm text-muted-foreground">Allow students to download materials.</p></div><Switch id="downloadable-resources" checked={providesResources} onCheckedChange={setProvidesResources} /></div>
                        </CardContent>
                        <CardFooter className="flex justify-between"><Button variant="outline" onClick={() => setActiveTab('curriculum')}>Back</Button><Button onClick={() => setActiveTab('media')}>Next</Button></CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="media">
                    <Card className="mt-6"><CardHeader><CardTitle>Course Media</CardTitle><CardDescription>Upload a thumbnail and video content.</CardDescription></CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-2"><Label>Upload Thumbnail</Label>
                                <div className="flex items-center gap-4">
                                    {thumbnailPreview && (<div className="relative w-48 aspect-video rounded-md overflow-hidden border bg-muted"><Image src={thumbnailPreview} alt="Thumbnail preview" fill className="h-full w-full object-cover" /></div>)}
                                    <Input id="thumbnail-upload-input" type="file" className="hidden" onChange={handleThumbnailChange} accept="image/png, image/jpeg, image/webp" />
                                    <Label htmlFor="thumbnail-upload-input" className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"><ImageIcon className="mr-2 h-4 w-4" />{thumbnailPreview ? 'Change File' : 'Choose File'}</Label>
                                </div><p className="text-sm text-muted-foreground">Recommended: 1280x720px, JPG or PNG.</p>
                            </div>
                            {priceType === 'paid' && paymentMethod === 'templates' ? (
                                <div className="space-y-6"><h3 className="font-semibold text-lg">Upload Videos for Each Plan</h3>
                                    {renderUploadForms('gold')}
                                    {renderUploadForms('platinum')}
                                    {renderUploadForms('silver')}
                                </div>
                            ) : (
                                <div className="space-y-4"><h3 className="font-semibold text-lg">Upload Course Videos</h3><p className="text-sm text-muted-foreground">Upload videos one by one. They will be associated with the course category.</p>
                                    {uploadItems.general.map((item, index) => (
                                        <Card key={item.id} className="p-4 bg-muted/50 relative space-y-4">
                                            {uploadItems.general.length > 1 && (<Button variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeUploadSlot('general', item.id)}><Trash2 className="h-4 w-4" /></Button>)}
                                            <div className="grid w-full items-center gap-1.5"><Label htmlFor={`video-file-${item.id}`}>Video File</Label><Input id={`video-file-${item.id}`} type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'general', item.id)} /></div>
                                            <div className="grid w-full items-center gap-1.5"><Label htmlFor={`video-title-${item.id}`}>Video Title</Label><Input id={`video-title-${item.id}`} value={item.title} onChange={(e) => handleTitleChange(e, 'general', item.id)} placeholder="e.g., Module 1: Introduction" /></div>
                                            <Button onClick={() => handleUploadVideo('general', item.id)} disabled={item.isUploading || !item.file || !item.title || !category}>{item.isUploading ? 'Uploading...' : 'Upload Video'}</Button>
                                        </Card>
                                    ))}
                                    <Button variant="outline" onClick={() => addUploadSlot('general')} className="w-full"><Plus className="mr-2 h-4 w-4" /> Add Another Video</Button>
                                    {!category && <p className="text-xs text-destructive">Please set a course category in the 'Details' tab first.</p>}
                                    <div className="mt-6 space-y-4"><h3 className="font-semibold text-lg">Uploaded Videos for "{courseCategories.find(c => c.value === category)?.label || category || 'Not Set'}"</h3>{renderVideoList(videosForCategory.filter(v => !v.plan))}</div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between"><Button variant="outline" onClick={() => setActiveTab('additional-details')}>Back</Button><Button onClick={() => setActiveTab('publish')}>Save & Continue</Button></CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="publish">
                    <Card className="mt-6"><CardHeader><CardTitle>Preview & Publish</CardTitle><CardDescription>Review how your course will look to students.</CardDescription></CardHeader>
                        <CardContent>
                            <div className="bg-background p-4 sm:p-8 rounded-lg border">
                                <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                                    <div className="md:col-span-1 h-fit md:sticky md:top-24">
                                        <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
                                            {thumbnailPreview ? (<div className="aspect-video w-full relative"><Image src={thumbnailPreview} alt={title || "Course thumbnail"} fill className="w-full object-cover" /></div>) : (<div className="aspect-video w-full bg-muted flex items-center justify-center"><ImageIcon className="h-12 w-12 text-muted-foreground" /></div>)}
                                            {priceType === 'paid' && paymentMethod === 'templates' ? (
                                                 <div className="p-6"><p className="mb-4 text-4xl font-bold font-headline text-primary">Subscription</p><Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => setIsPricingModalOpen(true)}>View Subscription Plans</Button>
                                                    <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                                                        <li className="flex items-center gap-3"><BarChart className="h-5 w-5 text-primary" /><span className="capitalize">Level: {level.replace('-', ' ')}</span></li>
                                                        <li className="flex items-center gap-3"><Clock className="h-5 w-5 text-primary" /><span>Duration: {formatDuration(courseDuration[0])}</span></li>
                                                        <li className="flex items-center gap-3"><Clock className="h-5 w-5 text-primary" /><span>~20 Hours to complete</span></li>
                                                    </ul>
                                                </div>
                                            ) : (
                                                <div className="p-6"><p className="mb-4 text-4xl font-bold font-headline text-primary">{priceType === 'free' ? 'Free' : `₹${directPrice || '0.00'}`}</p><Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled>{priceType === 'free' ? 'Enroll for Free (Preview)' : 'Buy Now (Preview)'}</Button>
                                                    <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                                                        <li className="flex items-center gap-3"><BarChart className="h-5 w-5 text-primary" /><span>Level: {level}</span></li>
                                                        <li className="flex items-center gap-3"><Clock className="h-5 w-5 text-primary" /><span>Duration: {formatDuration(courseDuration[0])}</span></li>
                                                        <li className="flex items-center gap-3"><Clock className="h-5 w-5 text-primary" /><span>~20 Hours to complete</span></li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Badge variant="secondary" className="mb-2 capitalize">{courseCategories.find(c => c.value === category)?.label || category || "Category"}</Badge>
                                        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">{title || "Your Course Title"}</h1><p className="mt-4 text-lg text-muted-foreground">{longDescription || "Your detailed course description will appear here."}</p>
                                        <div className="mt-10"><h2 className="font-headline text-2xl font-semibold border-l-4 border-primary pl-4">What You'll Learn</h2>{learningObjectives.filter(o => o.trim() !== '').length > 0 ? (<ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">{learningObjectives.filter(o => o.trim() !== '').map((obj, i) => (<li key={i} className="flex items-start gap-3"><CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-accent" /><span>{obj}</span></li>))}</ul>) : (<p className="mt-4 text-muted-foreground">Add learning objectives in the 'Details' tab.</p>)}</div>
                                        <div className="mt-10"><h2 className="font-headline text-2xl font-semibold border-l-4 border-primary pl-4">Course Curriculum</h2><p className="mt-4 text-muted-foreground">The curriculum builder will be displayed here.</p></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between"><Button variant="outline" onClick={() => setActiveTab('media')}>Back</Button><Button onClick={handlePublish} disabled={isPublishing}>{isPublishing ? 'Publishing...' : 'Publish Course'}</Button></CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={isPricingModalOpen} onOpenChange={setIsPricingModalOpen}>
                <DialogContent className="max-w-5xl bg-background border-border">
                    <DialogHeader><DialogTitle className="font-headline text-3xl text-center">Subscription Plans</DialogTitle><DialogDescription className="text-center">Choose the plan that's right for you.</DialogDescription></DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
                        {goldPrice && (
                            <Card className="border-yellow-500/50 bg-yellow-500/10 flex flex-col"><CardHeader><CardTitle className="text-yellow-400 font-headline text-2xl flex items-center gap-2"><Crown /> Gold Plan</CardTitle><p className="text-3xl font-bold pt-2">{goldPrice}</p></CardHeader><CardContent className="flex-grow space-y-4"><p className="text-muted-foreground text-sm italic">{goldDescription}</p><ul className="space-y-2 pt-2">{goldFeatures.filter(Boolean).map((feature, i) => (<li key={`modal-gold-${i}`} className="flex items-start gap-2 text-sm"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" /><span>{feature}</span></li>))}</ul></CardContent><CardFooter><Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold" disabled>Select Plan</Button></CardFooter></Card>
                        )}
                        {platinumPrice && (
                             <Card className="border-slate-400/50 bg-slate-400/10 flex flex-col"><CardHeader><CardTitle className="text-slate-300 font-headline text-2xl">Premium (Platinum) Plan</CardTitle><p className="text-3xl font-bold pt-2">{platinumPrice}</p></CardHeader><CardContent className="flex-grow space-y-4"><p className="text-muted-foreground text-sm italic">{platinumDescription}</p><ul className="space-y-2 pt-2">{platinumFeatures.filter(Boolean).map((feature, i) => (<li key={`modal-plat-${i}`} className="flex items-start gap-2 text-sm"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" /><span>{feature}</span></li>))}</ul></CardContent><CardFooter><Button className="w-full bg-slate-500 hover:bg-slate-600 font-bold" disabled>Select Plan</Button></CardFooter></Card>
                        )}
                        {silverPrice && (
                            <Card className="border-zinc-500/50 bg-zinc-500/10 flex flex-col"><CardHeader><CardTitle className="text-zinc-300 font-headline text-2xl">Silver Plan</CardTitle><p className="text-3xl font-bold pt-2">{silverPrice}</p></CardHeader><CardContent className="flex-grow space-y-4"><p className="text-muted-foreground text-sm italic">{silverDescription}</p><ul className="space-y-2 pt-2">{silverFeatures.filter(Boolean).map((feature, i) => (<li key={`modal-silv-${i}`} className="flex items-start gap-2 text-sm"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" /><span>{feature}</span></li>))}</ul></CardContent><CardFooter><Button className="w-full bg-zinc-500 hover:bg-zinc-600 font-bold" disabled>Select Plan</Button></CardFooter></Card>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
