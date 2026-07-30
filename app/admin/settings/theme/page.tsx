'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { GlobalThemeForm } from '@/components/admin/forms/GlobalThemeForm'

export default function ThemeSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Global color theme</h1>
          <p className="mt-1 text-muted-foreground">
            Control the colors used across the public website and admin portal.
          </p>
        </div>
        <GlobalThemeForm />
      </div>
    </AdminLayout>
  )
}
