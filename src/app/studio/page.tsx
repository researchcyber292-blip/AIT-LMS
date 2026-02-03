'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Send, ListVideo, CheckCircle, Plus, Trash2, Image, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function StudioPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('details');
    const [priceType, setPriceType] = useState<'paid' | 'free'>('paid');
    const [paymentMethod, setPaymentMethod] = useState<'direct' | 'templates'>('direct');
    
    const [goldFeatures, setGoldFeatures] = useState(() => Array(5).fill(''));
    const [platinumFeatures, setPlatinumFeatures] = useState(() => Array(5).fill(''));
    const [silverFeatures, setSilverFeatures] = useState(() => Array(5).fill(''));

    const [goldDescription, setGoldDescription] = useState('');
    const [platinumDescription, setPlatinumDescription] = useState('');
    const [silverDescription, setSilverDescription] = useState('');

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
        } else {
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
                        <Image className="mr-2 h-4 w-4" />
                        Media
                    </TabsTrigger>
                    <TabsTrigger value="publish" disabled>
                        <Send className="mr-2 h-4 w-4" />
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
                                <Input id="course-title" placeholder="e.g., Advanced Penetration Testing" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="course-description">Short Description</Label>
                                <Textarea id="course-description" placeholder="A brief summary that will appear on the course card." className="min-h-[100px]" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="course-long-description">Detailed Description</Label>
                                <Textarea id="course-long-description" placeholder="A comprehensive overview of the course content, goals, and target audience." className="min-h-[200px]" />
                            </div>
                             <div className="space-y-2">
                                <Label>Category</Label>
                                <RadioGroup defaultValue="beginner" className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
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
                                                <Input id="course-price" type="number" placeholder="e.g., 499" />
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
                                                            <Input id="gold-price" placeholder="e.g., 4999 / 6 months" />
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
                                                            <Input id="platinum-price" placeholder="e.g., 2999 / 3 months" />
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
                                                            <Input id="silver-price" placeholder="e.g., 599 / month" />
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
                                <Label htmlFor="course-thumbnail">Course Thumbnail</Label>
                                <div className="flex items-center gap-4">
                                    <div className="w-48 h-27 bg-muted rounded-md flex items-center justify-center">
                                        <Image className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <Input id="course-thumbnail" type="file" className="max-w-sm" />
                                </div>
                                <p className="text-sm text-muted-foreground">Recommended: 1280x720px, JPG or PNG.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="youtube-url">YouTube Video URL (Optional)</Label>
                                <Input id="youtube-url" type="url" placeholder="https://www.youtube.com/watch?v=..." />
                                <p className="text-sm text-muted-foreground">Link to your course's introduction video on YouTube.</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={() => setActiveTab('curriculum')}>Back</Button>
                            <Button onClick={() => setActiveTab('publish')}>Save & Continue</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
