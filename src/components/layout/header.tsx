
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth, useUser } from '@/firebase';
import { UserNav } from './user-nav';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/explore', label: 'Explore' },
  { href: '/live-classes', label: 'Live Classes' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <header className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 h-20", 
        isAuthPage 
            ? "bg-[#0D0D0D]" 
            : (isScrolled 
                ? "bg-background/80 border-b border-border/40 backdrop-blur-sm" 
                : "bg-transparent")
    )}>
      <div className="container flex h-full items-center">
        {/* Logo */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/avirajinfotech.png"
              alt="Aviraj Info Tech Logo"
              width={70}
              height={70}
              className="object-contain"
            />
             <span className={cn("font-bold hidden sm:inline-block", isAuthPage ? "text-white" : "text-foreground")}>AVIRAJ INFO TECH</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-8">
            {navLinks.map((link) => (
                <Link key={link.label} href={link.href} className={cn(
                    "text-sm font-medium transition-colors whitespace-nowrap hover:text-primary",
                    pathname === link.href ? 'text-primary' : (isAuthPage ? 'text-white/80' : 'text-foreground/80')
                )}>
                    {link.label}
                </Link>
            ))}
        </nav>
        
        {/* Auth Buttons & Mobile Nav */}
        <div className="flex-1 flex justify-end items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              {!isUserLoading && !user && (
                 <Button asChild size="sm" variant="ghost" className={cn(isAuthPage && "text-white hover:bg-white/10 hover:text-white")}>
                    <Link href="/signup">
                        Sign Up
                    </Link>
                </Button>
              )}

              {!isUserLoading && (
                user ? (
                  <Button asChild size="sm" variant="default" className="rounded-full font-bold">
                    <Link href="/dashboard">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      CONSOLE
                    </Link>
                  </Button>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="default" className="rounded-full font-bold">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        CONSOLE
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Access Your Console</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/login">
                                <Users className="mr-2 h-4 w-4" />
                                <span>Student Console</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/login">
                                <Briefcase className="mr-2 h-4 w-4" />
                                <span>Instructor Console</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              )}
              
              {!isUserLoading && user && (
                <UserNav user={user} />
              )}
            </div>
            
            {/* Mobile Nav Trigger */}
            <div className="md:hidden">
               <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className={cn("hover:bg-accent/10", isAuthPage ? "text-white" : "text-foreground")}>
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[90%] max-w-xs p-0 bg-background text-foreground">
                    <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between border-b p-4">
                             <Link href="/" className="flex items-center space-x-2">
                               <Image
                                    src="/avirajinfotech.png"
                                    alt="Aviraj Info Tech Logo"
                                    width={60}
                                    height={60}
                                    className="object-contain"
                                />
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
                        
                        <div className="mt-auto flex flex-col gap-3 border-t p-4">
                          {!isUserLoading && !user && (
                            <>
                                <SheetClose asChild>
                                    <Button asChild className="w-full rounded-full" variant="default">
                                        <Link href="/login">
                                            <Users className="mr-2 h-4 w-4" />
                                            Student Console
                                        </Link>
                                    </Button>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Button asChild className="w-full rounded-full" variant="secondary">
                                        <Link href="/login">
                                            <Briefcase className="mr-2 h-4 w-4" />
                                            Instructor Console
                                        </Link>
                                    </Button>
                                </SheetClose>
                                
                                <div className="relative my-2">
                                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                      <div className="w-full border-t border-border" />
                                  </div>
                                  <div className="relative flex justify-center text-sm">
                                      <span className="bg-background px-2 text-muted-foreground">OR</span>
                                  </div>
                                </div>
                                
                                <SheetClose asChild>
                                    <Button asChild className="w-full rounded-full" variant="outline">
                                        <Link href="/signup">
                                            Create an Account
                                        </Link>
                                    </Button>
                                </SheetClose>
                            </>
                          )}
                          {!isUserLoading && user && (
                              <>
                                  <SheetClose asChild>
                                    <Button asChild className="w-full rounded-full" variant="default">
                                      <Link href="/dashboard">
                                          <ShieldCheck className="mr-2 h-4 w-4" />
                                          Go to Console
                                      </Link>
                                    </Button>
                                  </SheetClose>
                                  <SheetClose asChild>
                                      <Button asChild className="w-full rounded-full" variant="ghost" onClick={() => auth.signOut()}>
                                          <Link href="#">
                                            Sign Out
                                          </Link>
                                      </Button>
                                  </SheetClose>
                              </>
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
