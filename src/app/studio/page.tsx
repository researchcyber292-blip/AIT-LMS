
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function StudioPage() {
    const router = useRouter();

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

            <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="details">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Details
                    </TabsTrigger>
                    <TabsTrigger value="curriculum" disabled>
                        Curriculum
                    </TabsTrigger>
                    <TabsTrigger value="media" disabled>
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
                            <div className="flex justify-end">
                                <Button disabled>Save & Continue</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
