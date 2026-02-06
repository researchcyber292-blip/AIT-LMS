
'use client'

import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Youtube } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  const linkGroups = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Our Team', href: '/team' },
        { label: 'Blog', href: '/#blog' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Press Kit', href: '/press-kit' },
        { label: 'Brand Guidelines', href: '/brand-guidelines' },
        { label: 'Partnerships', href: '/restricted-access' },
        { label: 'Investors', href: '/restricted-access' },
      ]
    },
    {
      title: 'Popular Courses',
      links: [
        { label: 'Ethical Hacking', href: '/courses' },
        { label: 'Data Science', href: '/courses' },
        { label: 'Full Stack Dev', href: '/courses' },
        { label: 'AI & ML', href: '/courses' },
        { label: 'Robotics & Tech', href: '/courses' },
        { label: 'Cloud Security', href: '/courses' },
        { label: 'Network Security', href: '/courses' },
        { label: 'Malware Analysis', href: '/courses' },
        { label: 'Digital Forensics', href: '/courses' },
        { label: 'Penetration Testing', href: '/courses' },
        { label: 'Cybersecurity Law', href: '/courses' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Student Docs', href: '#' },
        { label: 'Instructor Docs', href: '#' },
        { label: 'Community Forum', href: '#' },
        { label: 'Live Classes', href: '/live-classes' },
        { label: 'Explore Videos', href: '/explore' },
        { label: 'Webinars', href: '#' },
        { label: 'Whitepapers', href: '#' },
        { label: 'Case Studies', href: '#' },
        { label: 'Glossary', href: '#' },
      ]
    },
    {
        title: 'For Business',
        links: [
            { label: 'Corporate Training', href: '#' },
            { label: 'Team Subscriptions', href: '#' },
            { label: 'Security Audits', href: '#' },
            { label: 'Consulting Services', href: '#' },
            { label: 'Enterprise Solutions', href: '#' },
        ]
    },
    {
        title: 'Support',
        links: [
            { label: 'General Support', href: '/contact' },
            { label: 'Technical Support', href: '/contact' },
            { label: 'Billing Inquiries', href: '/contact' },
            { label: 'Report an Issue', href: '/contact' },
            { label: 'Give Feedback', href: '#' },
        ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
        { label: 'Admin Login', href: '/admin' },
        { label: 'Student Login', href: '/login' },
        { label: 'Instructor Login', href: '/login' },
        { label: 'Sitemap', href: '#' },
        { label: 'Accessibility', href: '#' },
        { label: 'Security', href: '#' },
      ]
    },
    {
        title: 'Community',
        links: [
            { label: 'Discord Server', href: '#' },
            { label: 'Events', href: '#' },
            { label: 'Student Showcase', href: '#' },
            { label: 'Leaderboard', href: '#' },
            { label: 'Ambassador Program', href: '#' },
        ]
    },
     {
        title: 'More',
        links: [
            { label: 'Affiliate Program', href: '#' },
            { label: 'Scholarships', href: '#' },
            { label: 'Gift a Course', href: '#' },
            { label: 'Redeem Code', href: '#' },
            { label: 'System Status', href: '#' },
            { label: 'Swag Store', href: '#' },
            { label: 'Testimonials', href: '#' },
            { label: 'Press Inquiries', href: '#' },
        ]
    }
  ];

  return (
    <footer className="border-t bg-secondary/50">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Column 1: Company Info & Socials */}
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-10 w-10 rounded-full bg-white overflow-hidden flex items-center justify-center border-2 border-primary/20">
                <Image
                  src="/image.png"
                  alt="Aviraj Info Tech Logo"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="font-bold text-xl text-foreground">AVIRAJ INFO TECH</span>
            </Link>
            <p className="mt-4 max-w-xs text-muted-foreground">
              Empowering the next generation of tech professionals with affordable, high-quality education.
            </p>
            <div className="mt-8 flex gap-6">
              <a href="https://whatsapp.com/channel/0029Vb6kdko2kNFlxxNKNo1Z" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">WhatsApp</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.068-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/aviraj-infotech/?originalSubdomain=in" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">LinkedIn</span>
                  <Linkedin className="h-6 w-6" />
              </a>
               <a href="#" target="_blank" rel="noreferrer" aria-label="YouTube" className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">YouTube</span>
                  <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          {/* Link Groups */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-4">
            {linkGroups.map((group) => (
              <div key={group.title}>
                <p className="font-headline font-semibold text-foreground">{group.title}</p>
                <ul className="mt-6 space-y-4 text-sm">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-muted-foreground transition hover:text-primary">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-12 border-t border-border pt-8">
            <p className="text-center text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} Aviraj Info Tech. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  );
}
