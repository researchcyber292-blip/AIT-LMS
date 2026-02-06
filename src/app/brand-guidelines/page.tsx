import { Palette, Type, Shield } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Brand Guidelines - Aviraj Info Tech',
};

export default function BrandGuidelinesPage() {
  return (
    <div className="container py-24">
       <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold font-headline">Brand Guidelines</h1>
          <p className="text-muted-foreground mt-4">
            Guidelines on how to use our brand and assets. Please follow these rules to ensure consistency.
          </p>
      </div>

      <div className="space-y-12 max-w-4xl mx-auto">
        <div>
            <h2 className="font-headline text-3xl font-semibold mb-4 flex items-center gap-3"><Shield className="h-8 w-8 text-primary" /> Our Logo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="bg-card border rounded-lg p-8 flex items-center justify-center">
                    <span className="text-2xl font-bold">AVIRAJ INFO TECH</span>
                </div>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Do not alter the colors of the logo.</li>
                    <li>Ensure there is clear space around the logo.</li>
                    <li>Do not stretch or distort the logo.</li>
                    <li>Use the primary logo on light backgrounds.</li>
                </ul>
            </div>
        </div>

        <div>
            <h2 className="font-headline text-3xl font-semibold mb-4 flex items-center gap-3"><Palette className="h-8 w-8 text-primary" /> Color Palette</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg border">
                    <div className="w-full h-20 rounded-md bg-primary mb-2"></div>
                    <p className="font-bold">Primary</p>
                    <p className="text-sm text-muted-foreground">#5A2E98</p>
                </div>
                 <div className="p-4 rounded-lg border">
                    <div className="w-full h-20 rounded-md bg-foreground mb-2"></div>
                    <p className="font-bold">Foreground</p>
                    <p className="text-sm text-muted-foreground">#09090b</p>
                </div>
                 <div className="p-4 rounded-lg border">
                    <div className="w-full h-20 rounded-md bg-background mb-2 border"></div>
                    <p className="font-bold">Background</p>
                    <p className="text-sm text-muted-foreground">#fafafa</p>
                </div>
                 <div className="p-4 rounded-lg border">
                    <div className="w-full h-20 rounded-md bg-accent mb-2"></div>
                    <p className="font-bold">Accent</p>
                    <p className="text-sm text-muted-foreground">#16a34a</p>
                </div>
            </div>
        </div>

         <div>
            <h2 className="font-headline text-3xl font-semibold mb-4 flex items-center gap-3"><Type className="h-8 w-8 text-primary" /> Typography</h2>
            <div className="bg-card p-8 rounded-lg border">
                <p className="font-headline text-4xl">Headline Font: Space Grotesk</p>
                <p className="font-body text-lg mt-4">Body Font: Inter</p>
                <p className="font-stylish text-2xl mt-4">Stylish Font: Audiowide</p>
            </div>
        </div>

      </div>
    </div>
  );
}
