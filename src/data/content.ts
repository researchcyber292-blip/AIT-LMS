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
    title: 'Ethical Hacking Essentials',
    description: 'Learn the fundamentals of ethical hacking and penetration testing.',
    longDescription: 'Dive deep into the world of cybersecurity with our flagship course. You will learn the methodologies and tools used by hackers, but for ethical purposes. This course prepares you for a career in information security.',
    price: 499,
    learningObjectives: [
      'Understand core security principles.',
      'Master penetration testing methodologies.',
      'Learn to use key security tools like Metasploit and Wireshark.',
      'Write professional security assessment reports.',
    ],
    curriculum: [
      { title: 'Module 1: Introduction to Ethical Hacking', content: 'Overview of cybersecurity threats and vulnerabilities.' },
      { title: 'Module 2: Reconnaissance', content: 'Techniques for gathering information about target systems.' },
      { title: 'Module 3: Scanning and Enumeration', content: 'Discovering live hosts, open ports, and running services.' },
      { title: 'Module 4: Exploitation', content: 'Gaining access to systems using various exploit techniques.' },
    ],
    category: 'Intermediate',
  },
  {
    id: 'c2',
    title: 'Advanced Network Defense',
    description: 'Master the art of defending networks against sophisticated attacks.',
    longDescription: 'This course is for experienced professionals looking to enhance their defensive capabilities. We cover advanced topics like intrusion detection systems, firewalls, and security information and event management (SIEM).',
    price: 799,
    learningObjectives: [
      'Design and implement secure network architectures.',
      'Configure and manage firewalls and IDS/IPS.',
      'Analyze network traffic for signs of compromise.',
      'Develop incident response plans.',
    ],
    curriculum: [
      { title: 'Module 1: Secure Network Design', content: 'Principles of designing a defensible network.' },
      { title: 'Module 2: Advanced Firewall Configuration', content: 'Deep dive into next-generation firewalls.' },
      { title: 'Module 3: Intrusion Detection and Prevention', content: 'Using tools like Snort and Suricata.' },
      { title: 'Module 4: SIEM and Log Analysis', content: 'Correlating security events to identify threats.' },
    ],
    category: 'Advanced',
  },
  {
    id: 'c3',
    title: 'Cybersecurity for Beginners',
    description: 'Your first step into the world of digital security.',
    longDescription: 'A comprehensive introduction to the fundamental concepts of cybersecurity. This course is perfect for anyone new to the field, providing the foundational knowledge needed to pursue a career in security.',
    price: 199,
    learningObjectives: [
      'Learn about common cyber threats like malware and phishing.',
      'Understand the basics of encryption and access control.',
      'Learn how to secure your personal devices and data.',
      'Explore career paths in cybersecurity.',
    ],
    curriculum: [
      { title: 'Module 1: The Threat Landscape', content: 'Understanding who the attackers are and what they want.' },
      { title: 'Module 2: Protecting Your Digital Identity', content: 'Passwords, multi-factor authentication, and privacy.' },
      { title: 'Module 3: Network Basics', content: 'How data travels online and how to protect it.' },
      { title: 'Module 4: Introduction to Cryptography', content: 'The science of secret codes.' },
    ],
    category: 'Beginner',
  },
  {
    id: 'c4',
    title: 'Digital Forensics Investigator',
    description: 'Learn to trace digital footprints and investigate cybercrimes.',
    longDescription: 'This course provides the skills to become a digital forensics expert. You will learn how to recover data, analyze evidence from digital devices, and present findings in a legally admissible way.',
    price: 699,
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
