'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Rocket, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type SetupStatus = {
  completed: boolean
  dismissed: boolean
  currentStep: string
  progress: {
    completedCount: number
    totalCount: number
    readyToPublish: boolean
  }
}

type SetupProgressBannerProps = {
  /** Compact strip for AdminLayout; card layout for dashboard */
  variant?: 'banner' | 'card'
  className?: string
}

export function SetupProgressBanner({
  variant = 'banner',
  className,
}: SetupProgressBannerProps) {
  const pathname = usePathname()
  const [status, setStatus] = useState<SetupStatus | null>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/setup')
      .then(async (response) => {
        if (!response.ok) return null
        return response.json()
      })
      .then((data) => {
        if (!cancelled && data) setStatus(data)
      })
      .catch(() => {
        /* ignore — banner is non-critical */
      })
    return () => {
      cancelled = true
    }
  }, [pathname])

  if (hidden || !status || status.completed) return null
  if (variant === 'banner' && pathname.startsWith('/admin/setup')) return null
  // Dashboard uses the richer card variant below the heading
  if (variant === 'banner' && pathname.startsWith('/admin/dashboard')) return null

  const pct = Math.round(
    (status.progress.completedCount / Math.max(status.progress.totalCount, 1)) * 100
  )

  if (variant === 'card') {
    return (
      <Card
        className={cn(
          'border-primary/30 bg-primary/5 p-5',
          className
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              Website setup
            </p>
            <h2 className="font-heading mt-1 text-xl font-semibold">
              Finish your first-run website wizard
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {status.progress.completedCount} of {status.progress.totalCount} sections ready ·{' '}
              {status.progress.readyToPublish
                ? 'Ready to publish from the review step'
                : 'Drafts stay private until you publish'}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <Link href="/admin/setup" className={cn(buttonVariants())}>
            <Rocket className="size-4" />
            Continue setup
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <div
      className={cn(
        'mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3',
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          Website setup in progress ({status.progress.completedCount}/
          {status.progress.totalCount})
        </p>
        <p className="text-xs text-muted-foreground">
          Continue the wizard anytime — nothing goes live until you publish.
        </p>
        <div className="mt-2 h-1.5 max-w-xs overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/admin/setup" className={cn(buttonVariants({ size: 'sm' }))}>
          Continue setup
        </Link>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label="Hide setup banner for this session"
          onClick={() => setHidden(true)}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}
