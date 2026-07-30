'use client'

import { cn } from '@/lib/utils'
import type { SiteTemplateId } from '@/lib/template-config'

function initialsFrom(name: string): string {
  const words = name
    .replace(/[^a-z0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean)

  if (words.length === 0) return 'S'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

/**
 * Brand mark: uses the CMS-uploaded logo when present, otherwise a typographic
 * monogram derived from the company name and the active colour theme.
 */
export function BrandMark({
  name,
  tagline,
  logo,
  variant,
  tone = 'dark',
  showTagline = false,
  showName = true,
  size = 'md',
  className,
}: {
  name: string
  tagline?: string
  logo?: string
  variant?: SiteTemplateId
  tone?: 'dark' | 'light'
  showTagline?: boolean
  showName?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const initials = initialsFrom(name)
  const onLight = tone === 'dark'
  const resolvedVariant = variant ?? 'aurora'

  const imageHeight =
    size === 'sm' ? 'h-8' : size === 'lg' ? 'h-14' : size === 'xl' ? 'h-20' : 'h-11'

  if (logo) {
    return (
      <span className={cn('flex items-center gap-3', className)}>
        <img
          src={logo}
          alt={name}
          className={cn(imageHeight, 'w-auto max-w-[12rem] object-contain')}
        />
        {showName && resolvedVariant === 'editorial' ? null : null}
        {showTagline && tagline && (
          <span className={cn('text-[11px]', onLight ? 'text-muted-foreground' : 'text-white/65')}>
            {tagline}
          </span>
        )}
      </span>
    )
  }

  if (resolvedVariant === 'editorial') {
    return (
      <span className={cn('flex flex-col items-center leading-none', className)}>
        <span
          className={cn(
            'font-accent tracking-[0.18em] uppercase',
            size === 'xl' ? 'text-3xl' : size === 'lg' ? 'text-2xl' : 'text-xl md:text-2xl',
            onLight ? 'text-foreground' : 'text-white'
          )}
        >
          {name}
        </span>
        {showTagline && tagline && (
          <span
            className={cn(
              'mt-1.5 text-[10px] tracking-[0.3em] uppercase',
              onLight ? 'text-muted-foreground' : 'text-white/60'
            )}
          >
            {tagline}
          </span>
        )}
      </span>
    )
  }

  if (resolvedVariant === 'immersive') {
    return (
      <span className={cn('flex items-center gap-2.5', className)}>
        <span
          className={cn(
            'flex items-center justify-center rounded-full border text-[11px] font-semibold tracking-wide',
            size === 'sm' ? 'size-7' : 'size-8',
            onLight
              ? 'border-foreground/25 text-foreground'
              : 'border-white/40 text-white'
          )}
        >
          {initials}
        </span>
        {showName && (
          <span className="flex flex-col leading-tight">
            <span
              className={cn(
                'font-heading text-sm font-semibold tracking-wide',
                onLight ? 'text-foreground' : 'text-white'
              )}
            >
              {name}
            </span>
            {showTagline && tagline && (
              <span className={cn('text-[10px]', onLight ? 'text-muted-foreground' : 'text-white/60')}>
                {tagline}
              </span>
            )}
          </span>
        )}
      </span>
    )
  }

  return (
    <span className={cn('flex items-center gap-3', className)}>
      <span
        className={cn(
          'flex items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground',
          size === 'sm' ? 'size-8 text-xs' : size === 'lg' ? 'size-12 text-base' : size === 'xl' ? 'size-16 text-xl' : 'size-9 text-sm'
        )}
      >
        {initials}
      </span>
      {showName && (
        <span className="flex flex-col leading-tight">
          <span
            className={cn(
              'font-heading font-bold tracking-tight',
              size === 'xl' ? 'text-xl' : size === 'lg' ? 'text-lg' : 'text-base',
              onLight ? 'text-foreground' : 'text-white'
            )}
          >
            {name}
          </span>
          {showTagline && tagline && (
            <span className={cn('text-[11px]', onLight ? 'text-muted-foreground' : 'text-white/65')}>
              {tagline}
            </span>
          )}
        </span>
      )}
    </span>
  )
}
