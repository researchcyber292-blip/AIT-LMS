
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function LiveClassroomRedirectPage() {
    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                        <Info className="h-8 w-8" />
                    </div>
                    <CardTitle>Page Moved</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">The live classroom functionality has been moved. Please use the new live classes hub.</p>
                    <Button asChild className="mt-6">
                        <Link href="/live-classes">Go to Live Classes</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
