'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ExternalLink, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  DEFAULT_SITE_TEMPLATE,
  SITE_TEMPLATES,
  normalizeSiteTemplate,
  type SiteTemplateId,
} from '@/lib/template-config'

/** Miniature wireframe so the choice is understandable without leaving admin. */
function TemplatePreview({ id }: { id: SiteTemplateId }) {
  if (id === 'editorial') {
    return (
      <div className="flex h-full flex-col gap-1.5 bg-background p-3">
        <div className="flex items-center justify-center gap-1 border-b border-border pb-1.5">
          <div className="h-1 w-4 rounded-full bg-foreground/20" />
          <div className="mx-2 h-1.5 w-10 rounded-full bg-foreground/60" />
          <div className="h-1 w-4 rounded-full bg-foreground/20" />
        </div>
        <div className="mx-auto h-1.5 w-16 rounded-full bg-foreground/40" />
        <div className="mt-1 h-10 rounded-sm bg-secondary/40" />
        <div className="mt-1 flex gap-2">
          <div className="h-5 flex-1 rounded-sm bg-muted" />
          <div className="flex flex-1 flex-col justify-center gap-1">
            <div className="h-1 w-full rounded-full bg-foreground/25" />
            <div className="h-1 w-2/3 rounded-full bg-foreground/15" />
          </div>
        </div>
      </div>
    )
  }

  if (id === 'immersive') {
    return (
      <div className="flex h-full flex-col bg-foreground p-3">
        <div className="mb-2 flex items-center justify-between rounded-full border border-background/25 px-2 py-1">
          <div className="h-1 w-5 rounded-full bg-background/70" />
          <div className="flex gap-1">
            <div className="h-1 w-3 rounded-full bg-background/35" />
            <div className="h-1 w-3 rounded-full bg-background/35" />
          </div>
        </div>
        <div className="relative flex-1 rounded-md bg-secondary/50">
          <div className="absolute inset-x-2 bottom-2 space-y-1">
            <div className="h-1.5 w-3/4 rounded-full bg-background/85" />
            <div className="h-1 w-1/2 rounded-full bg-background/45" />
          </div>
        </div>
        <div className="mt-2 flex gap-1.5 overflow-hidden">
          <div className="h-7 w-8 shrink-0 rounded bg-background/25" />
          <div className="h-7 w-8 shrink-0 rounded bg-background/20" />
          <div className="h-7 w-8 shrink-0 rounded bg-background/15" />
          <div className="h-7 w-5 shrink-0 rounded bg-background/10" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-background p-3">
      <div className="mb-2 flex items-center justify-between border-b-2 border-primary pb-1.5">
        <div className="h-2 w-2 rounded bg-primary" />
        <div className="flex gap-1">
          <div className="h-1 w-3 rounded-full bg-foreground/25" />
          <div className="h-1 w-3 rounded-full bg-foreground/25" />
          <div className="h-1 w-3 rounded-full bg-foreground/25" />
        </div>
        <div className="h-2 w-5 rounded-sm bg-primary" />
      </div>
      <div className="flex flex-1 gap-1.5">
        <div className="flex flex-1 flex-col justify-center gap-1 rounded-sm bg-secondary/60 p-2">
          <div className="h-1.5 w-full rounded-full bg-secondary-foreground/60" />
          <div className="h-1 w-2/3 rounded-full bg-secondary-foreground/35" />
        </div>
        <div className="flex-1 rounded-sm bg-muted" />
      </div>
      <div className="mt-2 flex items-start gap-1.5">
        <div className="h-6 flex-1 rounded-sm bg-muted" />
        <div className="mt-2 h-6 flex-1 rounded-sm bg-muted" />
        <div className="h-6 flex-1 rounded-sm bg-muted" />
      </div>
    </div>
  )
}

export function SiteTemplateForm() {
  const router = useRouter()
  const [selected, setSelected] = useState<SiteTemplateId>(DEFAULT_SITE_TEMPLATE)
  const [saved, setSaved] = useState<SiteTemplateId>(DEFAULT_SITE_TEMPLATE)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings?category=appearance')
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Failed to load template')
        const loaded = normalizeSiteTemplate(data.settings?.site_template)
        setSelected(loaded)
        setSaved(loaded)
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to load template')
      })
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'site_template',
          value: selected,
          category: 'appearance',
          description: 'Layout template used across the public website',
          is_public: true,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to save template')

      setSaved(selected)
      toast.success('Template updated — the public website now uses this layout.')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save template')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card className="flex items-center justify-center p-12">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </Card>
    )
  }

  const dirty = selected !== saved

  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-3">
        {SITE_TEMPLATES.map((template) => {
          const active = selected === template.id
          const isLive = saved === template.id

          return (
            <Card
              key={template.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(template.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setSelected(template.id)
                }
              }}
              className={cn(
                'cursor-pointer overflow-hidden p-0 transition-all',
                active
                  ? 'border-primary ring-2 ring-primary/40'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className="relative h-40 border-b border-border">
                <TemplatePreview id={template.id} />
                {isLive && (
                  <span className="absolute top-2 right-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    Live
                  </span>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-lg font-semibold">{template.name}</h3>
                    <p className="text-xs text-muted-foreground">{template.tagline}</p>
                  </div>
                  <span
                    className={cn(
                      'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border',
                      active
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border'
                    )}
                  >
                    {active && <Check className="size-3" />}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {template.description}
                </p>

                <ul className="mt-4 space-y-1.5">
                  {template.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex gap-2 text-xs leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                      {highlight}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/?template=${template.id}`}
                  target="_blank"
                  onClick={(event) => event.stopPropagation()}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  Preview on the live site
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {dirty
            ? `Selected “${SITE_TEMPLATES.find((t) => t.id === selected)?.name}”. Save to publish it to the live site.`
            : `“${SITE_TEMPLATES.find((t) => t.id === saved)?.name}” is currently live.`}
        </p>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            View site
            <ExternalLink className="size-3.5" />
          </Link>
          <Button onClick={save} disabled={saving || !dirty}>
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Save template
          </Button>
        </div>
      </Card>
    </div>
  )
}
