import type { Course, Instructor, TeamMember } from '@/lib/types';
import imageData from '@/lib/placeholder-images.json';

const { placeholderImages } = imageData;

const findImage = (id: string): { url: string; hint: string } => {
  const image = placeholderImages.find(img => img.id === id);
  if (!image) {
    console.warn(`Image with id ${id} not found. Using default.`);
    return {
      url: `https://picsum.photos/seed/${id}/600/400`,
      hint: 'placeholder',
    };
  }
  return { url: image.imageUrl, hint: image.imageHint };
};

const instructorData: Omit<Instructor, 'image' | 'imageHint'>[] = [
  {
    id: 'inst-1',
    name: 'Dr. Evelyn Reed',
    title: 'Principal Security Architect',
    bio: 'With over 15 years of experience in cybersecurity, Dr. Reed is a leading expert in threat modeling and secure system design. She holds a Ph.D. in Computer Science and multiple security certifications.',
  },
  {
    id: 'inst-2',
    name: 'Marcus Chen',
    title: 'Senior Penetration Tester',
    bio: 'Marcus is a certified ethical hacker who specializes in identifying and exploiting vulnerabilities in complex systems. His hands-on approach to teaching makes complex topics accessible to all.',
  },
];

export const INSTRUCTORS: Instructor[] = instructorData.map(i => {
  const img = findImage(`person-${parseInt(i.id.split('-')[1]) + 0}`);
  return {
    ...i,
    image: img.url,
    imageHint: img.hint,
  };
});

const courseData: Omit<Course, 'image' | 'imageHint' | 'instructor'>[] = [
  {
    id: 'c1',
    title: 'Cloud Security Architecture',
    description: 'Design and implement secure cloud environments on major platforms.',
    longDescription: 'This course covers cloud security fundamentals, including identity and access management, data protection, and network security in cloud environments like AWS, Azure, and GCP. You will learn to build resilient and secure cloud-native applications.',
    price: 799,
    learningObjectives: [
      'Understand cloud security models (IaaS, PaaS, SaaS).',
      'Implement IAM policies and roles.',
      'Secure data at rest and in transit.',
      'Design secure network architectures in the cloud.',
    ],
    curriculum: [
      { title: 'Module 1: Intro to Cloud Security', content: 'Core concepts and shared responsibility model.' },
      { title: 'Module 2: Identity & Access Management', content: 'Managing users, roles, and permissions.' },
      { title: 'Module 3: Data Protection in the Cloud', content: 'Encryption, key management, and data loss prevention.' },
      { title: 'Module 4: Secure Cloud Networks', content: 'VPCs, security groups, and network ACLs.' },
    ],
    category: 'Advanced',
  },
  {
    id: 'c2',
    title: 'Ethical Hacking & Pentest',
    description: 'Learn to think like a hacker to defend against attacks.',
    longDescription: 'Dive deep into the world of penetration testing. You will learn the methodologies and tools used by ethical hackers to find and exploit vulnerabilities. This course prepares you for a career in offensive security.',
    price: 699,
    learningObjectives: [
      'Master the five phases of penetration testing.',
      'Use tools like Metasploit, Burp Suite, and Nmap.',
      'Exploit web application, network, and system vulnerabilities.',
      'Write professional penetration testing reports.',
    ],
    curriculum: [
      { title: 'Module 1: Introduction to Pentesting', content: 'Overview of methodologies and rules of engagement.' },
      { title: 'Module 2: Reconnaissance & Scanning', content: 'Information gathering and network mapping.' },
      { title: 'Module 3: Gaining Access', content: 'Exploitation techniques for various systems.' },
      { title: 'Module 4: Post-Exploitation', content: 'Maintaining access and covering tracks.' },
    ],
    category: 'Intermediate',
  },
  {
    id: 'c3',
    title: 'Digital Forensics',
    description: 'Investigate cybercrimes and analyze digital evidence.',
    longDescription: 'This course provides the skills to become a digital forensics expert. You will learn how to recover data, analyze evidence from digital devices, and present findings in a legally admissible way.',
    price: 599,
    learningObjectives: [
        'Master data acquisition from various digital sources.',
        'Analyze file systems and recover deleted data.',
        'Investigate network intrusions and malware infections.',
        'Understand legal and ethical considerations in digital forensics.'
    ],
    curriculum: [
        { title: 'Module 1: Forensics Fundamentals', content: 'Principles and methodologies of digital investigation.' },
        { title: 'Module 2: Filesystem Forensics', content: 'Analyzing FAT, NTFS, and ext4 filesystems.' },
        { title: 'Module 3: Memory Forensics', content: 'Extracting and analyzing volatile data from RAM.' },
        { title: 'Module 4: Mobile Device Forensics', content: 'Investigating smartphones and tablets.' },
    ],
    category: 'Advanced',
  },
   {
    id: 'c4',
    title: 'Cyber Security Awareness',
    description: 'Fundamental knowledge for everyone in the digital age.',
    longDescription: 'A comprehensive introduction to fundamental cybersecurity concepts. This course is perfect for anyone, providing foundational knowledge to protect against common threats.',
    price: 99,
    learningObjectives: [
      'Recognize and avoid phishing scams and malware.',
      'Create and manage strong passwords.',
      'Secure your home network and personal devices.',
      'Understand data privacy and online safety.',
    ],
    curriculum: [
      { title: 'Module 1: The Threat Landscape', content: 'Understanding common cyber threats.' },
      { title: 'Module 2: Protecting Your Digital Identity', content: 'Passwords, MFA, and social engineering.' },
      { title: 'Module 3: Safe Browsing & Email', content: 'Identifying malicious websites and emails.' },
      { title: 'Module 4: Device & Network Security', content: 'Securing your computers, phones, and Wi-Fi.' },
    ],
    category: 'Beginner',
  },
];

export const COURSES: Course[] = courseData.map((course, index) => {
  const instructorId = `inst-${(index % 2) + 1}`;
  const instructor = INSTRUCTORS.find(i => i.id === instructorId);
  if (!instructor) throw new Error('Instructor not found');
  const img = findImage(`course-${index + 1}`);
  return {
    ...course,
    instructor,
    image: img.url,
    imageHint: img.hint,
  };
});

const teamMemberData: Omit<TeamMember, 'image'| 'imageHint'>[] = [
  { id: 't1', name: 'Aviraj Singh', title: 'Founder & CEO' },
  { id: 't2', name: 'Priya Sharma', title: 'Head of Curriculum' },
  { id: 't3', name: 'Rajesh Kumar', title: 'Lead Instructor' },
  { id: 't4', name: 'Anjali Menon', title: 'Student Success Manager' },
];

export const TEAM_MEMBERS: TeamMember[] = teamMemberData.map(member => {
    const imgId = `person-${parseInt(member.id.split('')[1])}`;
    const img = findImage(imgId);
    return {
        ...member,
        image: img.url,
        imageHint: img.hint,
    }
});
