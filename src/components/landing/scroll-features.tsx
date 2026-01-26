import { Award, TerminalSquare, Users, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: 'Expert Instructors',
    description: 'Learn from industry veterans with real-world experience in cybersecurity.',
  },
  {
    icon: <TerminalSquare className="h-10 w-10 text-primary" />,
    title: 'Hands-On Labs',
    description: 'Apply your skills in realistic, interactive lab environments. No theory, just practice.',
  },
  {
    icon: <Award className="h-10 w-10 text-primary" />,
    title: 'Career-Ready Certifications',
    description: 'Earn industry-recognized certifications that validate your skills to employers.',
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: 'Community & Support',
    description: 'Join a vibrant community of learners and get support from mentors and peers.',
  },
];

export function ScrollFeatures() {
  return (
    <section id="features" className="bg-background py-20 md:py-28">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-4xl font-bold">Why Choose Aviraj Info Tech?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            We provide a comprehensive learning ecosystem designed for your success.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="feature-card bg-card border rounded-lg p-8 text-center flex flex-col items-center opacity-0 transform">
              <div className="bg-primary/10 p-4 rounded-full">
                {feature.icon}
              </div>
              <h3 className="mt-6 font-headline text-xl font-bold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground flex-1">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
