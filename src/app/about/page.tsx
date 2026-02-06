import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Aviraj Info Tech",
  description: "Learn about Aviraj Infotech Private Limited, an emerging technology and education company based in Pithoragarh, Uttarakhand, India.",
};

export default function AboutUsPage() {
  return (
    <div className="bg-background text-foreground pt-14">
      <div className="container mx-auto max-w-4xl py-16 md:py-24 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl">
            About Aviraj Infotech
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            An Emerging Technology and Education Company
          </p>
        </div>

        <div className="space-y-6 text-lg text-foreground/90">
            <p className="leading-relaxed">
                Aviraj Infotech Private Limited is an emerging technology and education company based in Pithoragarh, Uttarakhand, India. Incorporated on April 11, 2024, the firm operates as a dual-purpose entity, providing specialized IT services to businesses while functioning as a skill development and training hub for students and professionals.
            </p>

            <h2 className="font-headline text-3xl !mt-12 !mb-4 border-l-4 border-primary pl-4">Core Business Segments</h2>
            <p>The company divides its operations into two primary pillars:</p>
            
            <div className="!mt-8 space-y-8">
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="font-headline text-2xl mb-3 text-primary">1. Information Technology Services</h3>
                    <p className="text-base text-muted-foreground mb-4">Aviraj Infotech functions as an IT consultancy and development firm, focusing on modern digital transformation. Its service portfolio includes:</p>
                    <ul className="mt-4 space-y-3 text-base list-disc list-inside">
                        <li><span className="font-semibold">Software & Web Development:</span> Creating custom software solutions, responsive websites, and mobile applications.</li>
                        <li><span className="font-semibold">Emerging Tech:</span> Specializing in Internet of Things (IoT) and Artificial Intelligence (AI) development, including machine learning models and natural language processing.</li>
                        <li><span className="font-semibold">Digital Marketing:</span> Providing services such as SEO and broader digital strategy to enhance business visibility.</li>
                    </ul>
                </div>

                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <h3 className="font-headline text-2xl mb-3 text-primary">2. Education and Skill Development</h3>
                    <p className="text-base text-muted-foreground mb-4">As a training institute, it is recognized as a leader in skill development within the Pithoragarh region.</p>
                    <ul className="mt-4 space-y-3 text-base list-disc list-inside">
                        <li><span className="font-semibold">Technical Training:</span> Offers programs in AI, Python, C++, and Cyber Security.</li>
                        <li><span className="font-semibold">Online Learning:</span> Operates as a provider of online courses and educational bundles across categories like robotics and data science.</li>
                        <li><span className="font-semibold">Institutional Support:</span> Provides robotic solutions and educational programs specifically designed for schools to equip the next generation with technical skills.</li>
                    </ul>
                </div>
            </div>

            <h2 className="font-headline text-3xl !mt-12 !mb-4 border-l-4 border-primary pl-4">Corporate Profile</h2>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
                <ul className="space-y-4 text-base">
                    <li><span className="font-semibold text-muted-foreground">Directors:</span> The company's board currently includes Gaurav Rodiyal and Avanish Garkoti.</li>
                    <li><span className="font-semibold text-muted-foreground">Registered Office:</span> C/o Jayanand Ram Chandra, Takana Bend, Pithoragarh, Uttarakhand, 262501.</li>
                    <li><span className="font-semibold text-muted-foreground">Financial Status:</span> It is a private, non-government company with an authorized share capital of ₹1,000,000.</li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
}
