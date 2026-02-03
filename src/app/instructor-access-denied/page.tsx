import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Ban, Mail } from 'lucide-react';

// This is now a Server Component and can directly access searchParams
export default function InstructorAccessDeniedPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const status = searchParams?.status || 'restricted';

    const messages = {
        banned: {
            title: 'Account Banned',
            description: 'Your account has been temporarily banned. Please contact our support team for further information and assistance.',
        },
        rejected: {
            title: 'Application Rejected',
            description: 'We regret to inform you that your instructor application has been rejected. Please contact support if you believe this is an error.',
        },
        restricted: {
            title: 'Access Restricted',
            description: 'Your access to instructor resources is currently restricted. Please contact our support team for further information.',
        },
    }

    const { title, description } = messages[status as keyof typeof messages] || messages.restricted;

    return (
        <div className="container flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-12 text-center">
            <div className="w-full max-w-lg">
                <Ban className="mx-auto h-20 w-20 text-destructive" />
                <h1 className="mt-8 font-headline text-3xl font-bold text-foreground md:text-4xl">
                    {title}
                </h1>
                <p className="mt-4 text-muted-foreground">
                    {description}
                </p>
                <div className="mt-8">
                    <Button asChild>
                        <Link href="/contact">
                            <Mail className="mr-2 h-4 w-4" />
                            Contact Team
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
