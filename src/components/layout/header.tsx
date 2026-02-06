'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth, useUser } from '@/firebase';
import { UserNav } from './user-nav';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/explore', label: 'Explore' },
  { href: '/live-classes', label: 'Live Classes' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <header className={cn("fixed top-0 z-50 w-full transition-all duration-300 h-16", isScrolled ? "bg-background/80 border-b border-border/40 backdrop-blur-sm" : "bg-transparent")}>
      <div className="container flex h-full items-center">
        {/* Logo */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-full bg-white overflow-hidden flex items-center justify-center border-2 border-primary/20">
              <Image
                src="/image.png"
                alt="Aviraj Info Tech Logo"
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            </div>
             <span className="font-bold hidden sm:inline-block text-foreground">AVIRAJ INFO TECH</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-8">
            {navLinks.map((link) => (
                <Link key={link.label} href={link.href} className={cn("text-sm font-medium transition-colors whitespace-nowrap hover:text-primary", pathname === link.href ? 'text-primary' : 'text-foreground/80')}>
                    {link.label}
                </Link>
            ))}
        </nav>
        
        {/* Auth Buttons & Mobile Nav */}
        <div className="flex-1 flex justify-end items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <Button asChild size="sm" variant="default" className="rounded-full font-bold">
                <Link href={user ? "/dashboard" : "/login"}>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  CONSOLE
                </Link>
              </Button>
              {!isUserLoading && user && (
                <UserNav user={user} />
              )}
            </div>
            
            {/* Mobile Nav Trigger */}
            <div className="md:hidden">
               <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent/10">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[90%] max-w-xs p-0 bg-background text-foreground">
                    <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between border-b p-4">
                             <Link href="/" className="flex items-center space-x-2">
                               <div className="h-8 w-8 rounded-full bg-white overflow-hidden">
                                 <Image
                                      src="/image.png"
                                      alt="Aviraj Info Tech Logo"
                                      width={32}
                                      height={32}
                                      className="object-cover w-full h-full"
                                  />
                                </div>
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
                                <Link href={link.href} className="text-base font-medium text-foreground transition-colors hover:text-primary">
                                {link.label}
                                </Link>
                            </SheetClose>
                          ))}
                        </nav>
                        
                        <div className="mt-auto flex flex-col gap-2 border-t p-4">
                          <SheetClose asChild>
                            <Button asChild className="w-full rounded-full" variant={user ? "secondary" : "default"}>
                                <Link href={user ? "/dashboard" : "/login"}>
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    CONSOLE
                                </Link>
                            </Button>
                          </SheetClose>
                          {!isUserLoading && user && (
                              <SheetClose asChild>
                                  <Button asChild className="w-full rounded-full" onClick={() => auth.signOut()}>
                                      <Link href="#">
                                        Sign Out
                                      </Link>
                                  </Button>
                              </SheetClose>
                          )}
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
