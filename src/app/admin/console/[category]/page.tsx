import { adminCredentials } from '@/lib/admin-credentials';
import CategoryConsoleClient from '@/components/admin/category-console-client';

export function generateStaticParams() {
  return Object.keys(adminCredentials).map((category) => ({
    category,
  }));
}

export default function CategoryConsolePage() {
    // The client component can get the category from useParams
    return <CategoryConsoleClient />;
}
