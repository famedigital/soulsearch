import { NextResponse } from 'next/server'
import { getBrand } from '@/lib/brand'
import { getGlobalTheme } from '@/lib/theme'
import { getSiteUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'

/** Dynamic admin PWA manifest — name/theme/icons follow CMS brand settings. */
export async function GET() {
  const [brand, theme] = await Promise.all([getBrand(), getGlobalTheme()])
  const siteUrl = getSiteUrl()

  const icon = (size: 192 | 512, purpose: 'any' | 'maskable' = 'any') => {
    if (brand.logo) {
      return {
        src: `${siteUrl}/api/brand/icon/${size}`,
        sizes: `${size}x${size}`,
        type: 'image/png',
        purpose,
      }
    }
    const file =
      purpose === 'maskable'
        ? `/admin-pwa/icons/icon-${size}-maskable.png`
        : `/admin-pwa/icons/icon-${size}.png`
    return {
      src: file,
      sizes: `${size}x${size}`,
      type: 'image/png',
      purpose,
    }
  }

  const shortName =
    brand.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || 'SS'

  const manifest = {
    id: '/admin/login',
    name: `${brand.name} Admin`,
    short_name: `${shortName} Admin`,
    description: `Admin login and dashboard for ${brand.name}`,
    start_url: '/admin/login',
    scope: '/admin/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: theme.background,
    theme_color: theme.primary,
    lang: 'en',
    dir: 'ltr',
    categories: ['business', 'productivity'],
    icons: [icon(192, 'any'), icon(512, 'any'), icon(512, 'maskable')],
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
