
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
  { href: '/programs', label: 'EXPLORE' },
  { href: '/certifications', label: 'Workspace' },
  { href: '/about', label: 'ACCOUNTS' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = pathname === '/';
  const { user, isUserLoading } = useUser();
  const auth = useAuth();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const headerDynamicClasses = isHomePage && !isScrolled 
    ? 'bg-transparent text-white' 
    : 'bg-background/90 border-b border-border/40 backdrop-blur-sm text-foreground';
    
  const linkDynamicClasses = isHomePage && !isScrolled
    ? 'hover:text-white/80'
    : 'hover:text-foreground/80';

  return (
    <header className={cn("fixed top-0 z-50 w-full transition-all duration-300 h-14", headerDynamicClasses)}>
      <div className="container flex h-full items-center">
        {/* Logo */}
        <div className="flex-1 flex justify-start">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="relative h-7 w-7 rounded-full bg-white overflow-hidden flex items-center justify-center">
              <Image
                src="/image.png"
                alt="Aviraj Info Tech Logo"
                width={28}
                height={28}
                className="object-cover w-full h-full"
              />
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-8">
            {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={cn("text-sm font-medium transition-colors whitespace-nowrap", linkDynamicClasses, pathname === link.href ? 'text-primary' : '')}>
                    {link.label}
                </Link>
            ))}
        </nav>
        
        {/* Auth Buttons & Mobile Nav */}
        <div className="flex-1 flex justify-end items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <Button asChild size="sm" variant="outline" className={cn("rounded-full border-primary/50 text-primary hover:bg-primary/10 hover:text-primary font-bold", isHomePage && !isScrolled && "border-white/50 text-white hover:bg-white/10 hover:text-white")}>
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
                  <Button variant="ghost" size="icon" className={cn("hover:bg-foreground/10", isHomePage && !isScrolled ? 'text-white hover:text-white hover:bg-white/10' : 'text-foreground')}>
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[90%] max-w-xs p-0 bg-background text-foreground">
                    <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between border-b p-4">
                             <Link href="/admin" className="flex items-center space-x-2">
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
