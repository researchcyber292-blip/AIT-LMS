'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/courses', label: 'Courses' },
  { href: '/programs', label: 'Programs' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        pathname.startsWith(href) ? "text-primary" : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-2xl font-bold font-headline text-primary">A</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.map(link => <NavLink key={link.href} {...link} />)}
          </nav>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href="/" className="mb-8 flex items-center space-x-2">
                 <span className="text-2xl font-bold font-headline text-primary">A</span>
                <span className="font-bold font-headline">AVIRAJ INFO TECH</span>
              </Link>
              <nav className="flex flex-col gap-6">
                {navLinks.map(link => <NavLink key={link.href} {...link} />)}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className='flex-1 md:hidden'>
            <Link href="/" className="flex items-center space-x-2 justify-center">
                <span className="text-2xl font-bold font-headline text-primary">A</span>
            </Link>
        </div>


        <div className="flex items-center justify-end space-x-2">
          <Button variant="link" className="text-muted-foreground">Sign up</Button>
          <Button size="sm" className="bg-accent hover:bg-accent/90 rounded-full px-6">Login</Button>
        </div>
      </div>
    </header>
  );
}
