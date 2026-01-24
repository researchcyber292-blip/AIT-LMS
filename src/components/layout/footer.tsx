'use client'

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Github, Instagram, Linkedin, Send } from 'lucide-react';
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
              <Link href="https://whatsapp.com/channel/0029Vb6kdko2kNFlxxNKNo1Z" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary"
                    aria-hidden="true"
                  >
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.068-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                  </svg>
              </Link>
              <Link href="#" target="_blank" rel="noreferrer" aria-label="Telegram">
                  <Send className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="#" target="_blank" rel="noreferrer" aria-label="Github">
                  <Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="#" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
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
