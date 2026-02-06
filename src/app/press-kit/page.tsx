import { Download, Image as ImageIcon, FileText } from 'lucide-react';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
    title: 'Press Kit - Aviraj Info Tech',
};

export default function PressKitPage() {
  return (
    <div className="container py-24">
      <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold font-headline">Press & Media Resources</h1>
          <p className="text-muted-foreground mt-4">
              Welcome to the Aviraj Info Tech press kit. Here you'll find brand assets, logos, and other resources for media use. For any press inquiries, please contact us directly.
          </p>
          <Button className="mt-6">Contact Press Team</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
            <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                    <ImageIcon className="h-8 w-8" />
                </div>
                <CardTitle className="text-center">Logos & Banners</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">Download our official logos and branding assets in various formats.</p>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Download Logos (.zip)</Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                    <FileText className="h-8 w-8" />
                </div>
                <CardTitle className="text-center">Company Fact Sheet</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">A concise overview of our company, mission, and key milestones.</p>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Download Fact Sheet (.pdf)</Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                    <ImageIcon className="h-8 w-8" />
                </div>
                <CardTitle className="text-center">Executive Headshots</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">High-resolution images of our leadership team for media features.</p>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Download Headshots (.zip)</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
