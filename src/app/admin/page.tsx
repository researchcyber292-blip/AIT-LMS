'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, Briefcase, Code, BarChart3, Bot, Cpu } from 'lucide-react';
import { adminCredentials } from '@/lib/admin-credentials';
import Image from 'next/image';

const categoryIcons: { [key: string]: React.ElementType } = {
  'ethical-hacking': Shield,
  'data-science': BarChart3,
  'full-stack-dev': Code,
  'ai-ml': Bot,
  'robotics-tech': Cpu,
  'coding': Briefcase,
};

export default function AdminCategorySelectionPage() {
  const router = useRouter();

  const handleCategorySelect = (category: string) => {
    router.push(`/admin/login?category=${category}`);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
       <Image
        src="https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYmVyJTIwc2VjdXJpdHklMjBoYWNrZXJ8ZW58MHx8fHwxNzcxMjYxMjMzfDA&ixlib=rb-4.1.0&q=80&w=1080"
        alt="Cyber security background"
        fill
        className="object-cover"
        data-ai-hint="cyber security hacker"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="z-10 w-full max-w-4xl text-center">
        <h1 className="font-headline text-4xl font-bold text-white">Select Instructor Console</h1>
        <p className="mt-2 mb-8 text-muted-foreground">Choose the administrative panel you want to access.</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.keys(adminCredentials).map((category) => {
            const Icon = categoryIcons[category] || Shield;
            const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return (
              <Card 
                key={category} 
                onClick={() => handleCategorySelect(category)}
                className="cursor-pointer bg-card/50 backdrop-blur-sm border-primary/20 text-white hover:border-primary hover:bg-card/70 transition-all duration-300"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{categoryName}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Login</div>
                  <p className="text-xs text-muted-foreground">Access the {categoryName} panel</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
