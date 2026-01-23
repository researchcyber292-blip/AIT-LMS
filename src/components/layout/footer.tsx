import Link from 'next/link';
import { ShieldCheck, Twitter, Linkedin, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <ShieldCheck className="hidden h-6 w-6 text-primary md:block" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Aviraj Info Tech. The source code is available on{' '}
            <Link
              href="#"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center gap-4">
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
    </footer>
  );
}
