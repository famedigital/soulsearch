'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { SiteTemplateForm } from '@/components/admin/forms/SiteTemplateForm'

export default function SiteTemplateSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Website layout</h1>
          <p className="mt-1 text-muted-foreground">
            Choose how the public website is laid out. This changes the homepage structure,
            navigation, and footer across every page. Your colours and content stay the same.
          </p>
        </div>
        <SiteTemplateForm />
      </div>
    </AdminLayout>
  )
}
