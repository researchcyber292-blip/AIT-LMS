'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/programs', label: 'Programs' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = href === '/' ? pathname === href : pathname.startsWith(href);
    return (
        <Link
        href={href}
        className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive ? "text-primary" : "text-muted-foreground"
        )}
        >
        {label}
        </Link>
    );
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-colors duration-300",
      hasScrolled ? "border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : "border-b border-transparent"
    )}>
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
          </Link>
          
          <nav className="hidden gap-6 md:flex">
              {navLinks.map(link => <NavLink key={link.href} {...link} />)}
          </nav>
        </div>

        {/* Right: Auth Buttons & Mobile Menu */}
        <div className="flex items-center gap-4">
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
                               <Shield className="h-7 w-7 text-primary" />
                             </Link>
                             <SheetClose asChild>
                                 <Button variant="ghost" size="icon">
                                     <X className="h-5 w-5" />
                                     <span className="sr-only">Close</span>
                                 </Button>
                             </SheetClose>
                        </div>
                        
                        <nav className="flex flex-col gap-6 p-4">
                          {navLinks.map(link => {
                              const isActive = link.href === '/' ? pathname === link.href : pathname.startsWith(link.href);
                              return (
                                  <SheetClose asChild key={link.href}>
                                      <Link 
                                        href={link.href} 
                                        className={cn(
                                            "text-base font-medium transition-colors hover:text-primary",
                                            isActive ? "text-primary" : "text-foreground"
                                        )}
                                      >
                                        {link.label}
                                      </Link>
                                  </SheetClose>
                              )
                          })}
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
