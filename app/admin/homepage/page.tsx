'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { HomePageForm } from '@/components/admin/forms/HomePageForm';

export default function HomepageAdminPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Homepage</h1>
          <p className="mt-1 text-muted-foreground">
            Edit homepage sections — including The Soul Search Difference
          </p>
        </div>
        <HomePageForm />
      </div>
    </AdminLayout>
  );
}
