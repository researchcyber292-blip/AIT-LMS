'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const headerDynamicClasses = isHomePage && !isScrolled 
    ? 'bg-transparent' 
    : 'bg-background/90 border-b border-border/40 backdrop-blur-sm';
    
  const linkDynamicClasses = isHomePage && !isScrolled
    ? 'text-white/80 hover:text-white'
    : 'text-foreground/80 hover:text-foreground';

  return (
    <header className={cn("fixed top-0 z-50 w-full transition-all duration-300", headerDynamicClasses)}>
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/AVIRAJINFOTECHLOGO-removebg-preview.png"
            alt="Aviraj Info Tech Logo"
            width={48}
            height={48}
            className="rounded-full object-contain"
          />
        </Link>
        
        <div className="flex items-center gap-4">
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-4">
                {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className={cn("text-sm font-medium", linkDynamicClasses)}>
                        {link.label}
                    </Link>
                ))}
                 <Button variant="link" asChild className={cn("text-sm font-medium", linkDynamicClasses)}>
                    <Link href="#">Login</Link>
                </Button>
                <Button size="sm" className="rounded-full">
                    Sign up
                </Button>
            </nav>
            
            {/* Mobile Nav */}
            <div className="md:hidden">
               <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className={cn("hover:bg-foreground/10", isHomePage && !isScrolled ? 'text-white hover:text-white hover:bg-white/10' : 'text-foreground')}>
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[90%] max-w-xs p-0">
                    <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between border-b p-4">
                             <Link href="/" className="flex items-center space-x-2">
                               <Image
                                    src="/AVIRAJINFOTECHLOGO-removebg-preview.png"
                                    alt="Aviraj Info Tech Logo"
                                    width={32}
                                    height={32}
                                    className="rounded-full"
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
                        
                        <div className="mt-auto flex flex-col gap-2 border-t p-4">
                            <SheetClose asChild>
                                <Button variant="outline" asChild><Link href="#" className="w-full">Login</Link></Button>
                            </SheetClose>
                            <SheetClose asChild>
                                 <Button className="w-full rounded-full" asChild>
                                    <Link href="#">Sign up</Link>
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
