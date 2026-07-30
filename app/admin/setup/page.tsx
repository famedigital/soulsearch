'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { SetupWizard } from '@/components/admin/setup/SetupWizard'

export default function AdminSetupPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Website setup wizard</h1>
          <p className="mt-1 max-w-3xl text-muted-foreground">
            Walk through your agency identity, branding, homepage, tours, blog, and FAQs. Everything
            stays as a private draft until you publish from the final review step.
          </p>
        </div>
        <SetupWizard />
      </div>
    </AdminLayout>
  )
}
