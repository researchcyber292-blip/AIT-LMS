import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Admin Panel - Aviraj Info Tech',
};

export default function AdminPage() {
  return (
    <div className="container py-24 text-center">
      <h1 className="text-4xl font-bold font-headline">Admin Panel</h1>
      <p className="text-muted-foreground mt-4">This page is under construction.</p>
    </div>
  );
}
