
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CategoryConsoleClient() {
    const router = useRouter();
    const params = useParams();
    const category = params.category as string;

    const categoryName = category ? category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Admin';

    return (
        <div className="container py-12 md:py-16">
            <div className="flex items-center gap-4 mb-8">
                 <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="font-headline text-4xl font-bold">{categoryName} Console</h1>
                    <p className="text-muted-foreground">Manage all content related to {categoryName}.</p>
                </div>
            </div>

            <div className="rounded-lg border-2 border-dashed bg-card min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold">Content Management Area</h2>
                    <p className="text-muted-foreground mt-2">Tools for managing {categoryName} courses will be displayed here.</p>
                </div>
            </div>
        </div>
    );
}
