'use client'

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Twitter, Linkedin, Github } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function Footer() {
  const pathname = usePathname();

  return (
    <footer className="border-t border-border/40 bg-card">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-7 w-7 rounded-full bg-white overflow-hidden flex items-center justify-center">
              <Image
                src="/image.png"
                alt="Aviraj Info Tech Logo"
                width={28}
                height={28}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="font-bold">AVIRAJ INFO TECH</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Safeguarding the Future of Digital.
          </p>
          <div className="flex items-center gap-4 mt-4">
              <Link href="#" target="_blank" rel="noreferrer">
                  <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="#" target="_blank" rel="noreferrer">
                  <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="#" target="_blank" rel="noreferrer">
                  <Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
          </div>
        </div>
        
        <div>
          <h4 className="font-headline font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
            <li><Link href="/courses" className="text-muted-foreground hover:text-primary">Courses</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Careers</Link></li>
            <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-headline font-semibold mb-4">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Blog</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Help Center</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
            <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-headline font-semibold mb-4">Subscribe for updates</h4>
          <form className="flex flex-col gap-2">
            <Input type="email" placeholder="Your email address" className="bg-background" />
            <Button type="submit" className="bg-accent hover:bg-accent/90 rounded-full">Subscribe</Button>
          </form>
        </div>
      </div>
      <div className="border-t border-border/40 py-4">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Aviraj Info Tech. All Rights Reserved.
          </p>
      </div>
    </footer>
  );
}
