'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
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
      <div className="container relative flex h-16 max-w-screen-2xl items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl font-bold font-headline text-primary">A</span>
            <span className="hidden font-bold sm:inline-block">AVIRAJ INFO TECH</span>
        </Link>
        
        {/* Center: Desktop Navigation */}
        <nav className="hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm md:flex">
            {navLinks.map(link => <NavLink key={link.href} {...link} />)}
        </nav>

        {/* Right: Auth Buttons & Mobile Menu */}
        <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
                <Button variant="link" className="text-muted-foreground">Sign up</Button>
                <Button size="sm" className="bg-accent hover:bg-accent/90 rounded-full px-6">Login</Button>
            </div>
            
            <div className="md:hidden">
               <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[90%] max-w-xs p-0">
                    <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between border-b p-4">
                             <Link href="/" className="flex items-center space-x-2">
                               <span className="text-2xl font-bold font-headline text-primary">A</span>
                               <span className="font-bold text-sm">AVIRAJ INFO TECH</span>
                             </Link>
                             <SheetClose asChild>
                                 <Button variant="ghost" size="icon">
                                     <X className="h-5 w-5" />
                                     <span className="sr-only">Close</span>
                                 </Button>
                             </SheetClose>
                        </div>
                        
                        <nav className="flex flex-col gap-6 p-4">
                          {navLinks.map(link => (
                              <SheetClose asChild key={link.href}>
                                  <Link 
                                    href={link.href} 
                                    className={cn(
                                        "text-base font-medium transition-colors hover:text-primary",
                                        pathname.startsWith(link.href) ? "text-primary" : "text-foreground"
                                    )}
                                  >
                                    {link.label}
                                  </Link>
                              </SheetClose>
                          ))}
                        </nav>
                        
                        <div className="mt-auto flex flex-col gap-2 border-t p-4">
                            <SheetClose asChild>
                                <Button variant="outline" asChild><Link href="#" className="w-full">Sign up</Link></Button>
                            </SheetClose>
                            <SheetClose asChild>
                                 <Button className="w-full bg-accent hover:bg-accent/90 rounded-full" asChild>
                                    <Link href="#">Login</Link>
                                 </Button>
                            </SheetClose>
                        </div>
                    </div>
                </SheetContent>
              </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
