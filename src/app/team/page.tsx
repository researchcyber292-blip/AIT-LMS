import { Metadata } from 'next';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Our Team - Aviraj Info Tech',
  description: 'Meet the dedicated team of instructors and experts behind Aviraj Info Tech.',
};

const instructors = [
  {
    name: 'Gaurav Rodiyal',
    degree: 'B.Tech (CSE)',
    specialization: 'Ethical Hacking & Penetration Testing',
    experience: '7+ Years'
  },
  {
    name: 'Avanish Garkoti',
    degree: 'M.Sc. (Cyber Security)',
    specialization: 'Full Stack Development & Cloud Security',
    experience: '6+ Years'
  },
  {
    name: 'Priya Sharma',
    degree: 'Ph.D. in Computer Science',
    specialization: 'Artificial Intelligence & Machine Learning',
    experience: '10+ Years'
  },
  {
    name: 'Rajesh Kumar',
    degree: 'Certified Information Systems Security Professional (CISSP)',
    specialization: 'Network Security & Digital Forensics',
    experience: '12+ Years'
  },
  {
    name: 'Anjali Menon',
    degree: 'B.Eng (Robotics)',
    specialization: 'Robotics & IoT',
    experience: '5+ Years'
  },
  {
    name: 'Vijay Singh',
    degree: 'M.Tech (Data Science)',
    specialization: 'Data Science & Big Data Analytics',
    experience: '8+ Years'
  }
];

export default function TeamPage() {
  return (
    <div className="bg-background text-foreground pt-14">
        <div className="relative h-72 w-full">
            <Image
                src="https://picsum.photos/seed/team-banner/1920/480"
                alt="Our Team"
                fill
                className="object-cover"
                data-ai-hint="professional team"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl">
                        Our Expert Instructors
                    </h1>
                    <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
                        The driving force behind our mission to provide quality education.
                    </p>
                </div>
            </div>
        </div>

      <div className="container mx-auto max-w-6xl py-16 md:py-24 px-4">
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Sr. No.</TableHead>
                <TableHead>Instructor Name</TableHead>
                <TableHead>Highest Degree</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead className="text-right">Experience</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instructors.map((instructor, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-semibold">{instructor.name}</TableCell>
                  <TableCell>{instructor.degree}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{instructor.specialization}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{instructor.experience}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
