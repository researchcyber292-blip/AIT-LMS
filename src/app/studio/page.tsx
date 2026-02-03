'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Send, ListVideo, CheckCircle, Plus, Trash2, Image as ImageIcon, Video, Eye, BarChart, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';


export default function StudioPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('details');

    // --- STATE MANAGEMENT FOR THE ENTIRE FORM ---
    // Details Tab
    const [title, setTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [category, setCategory] = useState<'beginner' | 'intermediate' | 'advanced' | 'highly-advanced'>('beginner');
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

    // Media Tab
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    
    // --- HANDLER FUNCTIONS ---

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
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="details">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Details
                    </TabsTrigger>
                    <TabsTrigger value="curriculum">
                        <ListVideo className="mr-2 h-4 w-4" />
                        Curriculum
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
                             <div className="space-y-2">
                                <Label>Category</Label>
                                <RadioGroup value={category} onValueChange={(v) => setCategory(v as any)} className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="beginner" id="cat-beginner" />
                                        <Label htmlFor="cat-beginner">Beginner</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="intermediate" id="cat-intermediate" />
                                        <Label htmlFor="cat-intermediate">Intermediate</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="advanced" id="cat-advanced" />
                                        <Label htmlFor="cat-advanced">Advanced</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="highly-advanced" id="cat-highly-advanced" />
                                        <Label htmlFor="cat-highly-advanced">Highly Advanced</Label>
                                    </div>
                                </RadioGroup>
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
                            <Button onClick={() => setActiveTab('media')}>
                                Next
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="media">
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Course Media</CardTitle>
                            <CardDescription>Upload assets for your course like a thumbnail image and introduction video.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
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
                            <div className="space-y-2">
                                <Label htmlFor="youtube-url">YouTube Video URL (Optional)</Label>
                                <Input id="youtube-url" type="url" placeholder="https://www.youtube.com/watch?v=..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
                                <p className="text-sm text-muted-foreground">Link to your course's introduction video on YouTube.</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={() => setActiveTab('curriculum')}>Back</Button>
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

                                            <div className="p-6">
                                                {priceType === 'free' ? (
                                                     <p className="mb-4 text-4xl font-bold font-headline text-primary">Free</p>
                                                ) : (
                                                    paymentMethod === 'direct' && directPrice ? (
                                                        <p className="mb-4 text-4xl font-bold font-headline text-primary">₹{directPrice}</p>
                                                    ) : (
                                                        <p className="mb-4 text-2xl font-bold font-headline text-primary">Subscription</p>
                                                    )
                                                )}
                                                <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled>
                                                    Buy Now (Preview)
                                                </Button>
                                                <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                                                    <li className="flex items-center gap-3">
                                                        <BarChart className="h-5 w-5 text-primary" />
                                                        <span className="capitalize">Level: {category.replace('-', ' ')}</span>
                                                    </li>
                                                    <li className="flex items-center gap-3">
                                                        <Clock className="h-5 w-5 text-primary" />
                                                        <span>~20 Hours to complete</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <Badge variant="secondary" className="mb-2 capitalize">{category.replace('-', ' ')}</Badge>
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
                            <Button disabled>Publish Course (Coming Soon)</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
