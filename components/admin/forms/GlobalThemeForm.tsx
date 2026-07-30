'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, Palette, RotateCcw, Save } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DEFAULT_GLOBAL_THEME,
  THEME_PRESETS,
  isHexColor,
  normalizeGlobalTheme,
  themeToCssVariables,
  type GlobalTheme,
} from '@/lib/theme-config'

const COLOR_FIELDS: Array<{
  key: keyof GlobalTheme
  label: string
  description: string
}> = [
  { key: 'primary', label: 'Primary', description: 'Main actions, active items, and highlights' },
  { key: 'secondary', label: 'Secondary', description: 'Supporting sections and visual contrast' },
  { key: 'accent', label: 'Accent', description: 'Badges, details, and decorative moments' },
  { key: 'background', label: 'Background', description: 'Page background across public and admin' },
  { key: 'foreground', label: 'Text', description: 'Main text and high-contrast interface color' },
]

function applyTheme(theme: GlobalTheme) {
  const root = document.documentElement
  for (const [property, value] of Object.entries(themeToCssVariables(theme))) {
    root.style.setProperty(property, value)
  }
}

export function GlobalThemeForm() {
  const router = useRouter()
  const [theme, setTheme] = useState<GlobalTheme>(DEFAULT_GLOBAL_THEME)
  const [savedTheme, setSavedTheme] = useState<GlobalTheme>(DEFAULT_GLOBAL_THEME)
  const savedThemeRef = useRef<GlobalTheme>(DEFAULT_GLOBAL_THEME)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings?category=appearance')
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Failed to load theme')
        const loaded = normalizeGlobalTheme(data.settings?.global_theme)
        setTheme(loaded)
        setSavedTheme(loaded)
        savedThemeRef.current = loaded
        applyTheme(loaded)
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to load theme')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    return () => applyTheme(savedThemeRef.current)
  }, [])

  const updateColor = (key: keyof GlobalTheme, value: string) => {
    const next = { ...theme, [key]: value.toUpperCase() }
    setTheme(next)
    if (isHexColor(value)) applyTheme(next)
  }

  const selectPreset = (colors: GlobalTheme) => {
    const next = normalizeGlobalTheme(colors)
    setTheme(next)
    applyTheme(next)
  }

  const resetPreview = () => {
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }

  const save = async () => {
    if (Object.values(theme).some((color) => !isHexColor(color))) {
      toast.error('Every color must be a six-digit hex value, such as #F5C542')
      return
    }

    setSaving(true)
    try {
      const normalized = normalizeGlobalTheme(theme)
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'global_theme',
          value: normalized,
          category: 'appearance',
          description: 'Global color theme for the public website and admin portal',
          is_public: true,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to save theme')

      setTheme(normalized)
      setSavedTheme(normalized)
      savedThemeRef.current = normalized
      applyTheme(normalized)
      router.refresh()
      toast.success('Global theme applied everywhere')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save theme')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card className="flex min-h-64 items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-5 p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/20 p-2.5 text-primary-foreground">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold">Theme presets</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick a starting point, then fine-tune each color below. Changes preview immediately.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {THEME_PRESETS.map((preset) => {
            const selected = Object.entries(preset.colors).every(
              ([key, value]) => theme[key as keyof GlobalTheme] === value
            )
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => selectPreset(preset.colors)}
                className="relative rounded-xl border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:border-primary hover:shadow-sm"
              >
                {selected && (
                  <span className="absolute right-3 top-3 rounded-full bg-primary p-1 text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                <div className="mb-3 flex gap-1.5">
                  {[preset.colors.primary, preset.colors.secondary, preset.colors.accent].map(
                    (color) => (
                      <span
                        key={color}
                        className="h-7 w-7 rounded-full border border-black/10"
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                </div>
                <p className="font-semibold">{preset.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{preset.description}</p>
              </button>
            )
          })}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="space-y-5 p-6">
          <div>
            <h2 className="font-heading text-xl font-bold">Custom colors</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              These colors drive shared CSS tokens used by both storefront and CMS.
            </p>
          </div>

          <div className="space-y-4">
            {COLOR_FIELDS.map((field) => (
              <div
                key={field.key}
                className="grid gap-3 rounded-xl border bg-background/60 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div>
                  <Label htmlFor={`theme-${field.key}`} className="font-semibold">
                    {field.label}
                  </Label>
                  <p className="mt-1 text-xs text-muted-foreground">{field.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    aria-label={`${field.label} color picker`}
                    type="color"
                    value={isHexColor(theme[field.key]) ? theme[field.key] : '#000000'}
                    onChange={(event) => updateColor(field.key, event.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-lg border bg-card p-1"
                  />
                  <Input
                    id={`theme-${field.key}`}
                    value={theme[field.key]}
                    onChange={(event) => updateColor(field.key, event.target.value)}
                    maxLength={7}
                    className="w-28 font-mono uppercase"
                    aria-invalid={!isHexColor(theme[field.key])}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="h-fit overflow-hidden p-0">
          <div className="bg-secondary p-6 text-secondary-foreground">
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">Live preview</p>
            <h3 className="mt-2 font-heading text-2xl font-bold">Find your next adventure</h3>
            <p className="mt-2 text-sm opacity-80">
              A quick preview of headings, surfaces, actions, and accents.
            </p>
          </div>
          <div className="space-y-4 bg-background p-6">
            <div className="rounded-xl border bg-card p-4">
              <div className="mb-3 h-2 w-20 rounded-full bg-accent" />
              <h4 className="font-heading text-lg font-bold text-foreground">Mountain escape</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Thoughtful journeys designed around your pace.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button">Primary action</Button>
              <Button type="button" variant="secondary">
                Secondary
              </Button>
              <span className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
                Fresh accent
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="sticky bottom-4 flex flex-wrap items-center justify-end gap-2 rounded-xl border bg-card/95 p-3 shadow-lg backdrop-blur">
        <Button type="button" variant="outline" onClick={resetPreview} disabled={saving}>
          <RotateCcw className="h-4 w-4" />
          Undo preview
        </Button>
        <Button type="button" onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Apply globally
        </Button>
      </div>
    </div>
  )
}
