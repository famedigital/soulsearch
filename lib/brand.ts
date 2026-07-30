import { createAdminClient } from '@/utils/supabase/admin'
import {
  DEFAULT_COMPANY_NAME,
  DEFAULT_COMPANY_TAGLINE,
  DEFAULT_SITE_LOGO,
  normalizeCompanyName,
  normalizeSiteLogo,
} from '@/lib/brand-defaults'

export {
  DEFAULT_COMPANY_NAME,
  DEFAULT_COMPANY_TAGLINE,
  DEFAULT_SITE_LOGO,
  normalizeCompanyName,
  normalizeSiteLogo,
} from '@/lib/brand-defaults'

function asCleanName(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const t = value.trim()
  return t || null
}

function nameFromSeoBlob(raw: unknown): string | null {
  if (!raw) return null
  let obj: Record<string, unknown> | null = null
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    obj = raw as Record<string, unknown>
  } else if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') obj = parsed as Record<string, unknown>
    } catch {
      return null
    }
  }
  if (!obj) return null
  return asCleanName(obj.site_name)
}

function logoFromSeoBlob(raw: unknown): string {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return DEFAULT_SITE_LOGO
  return normalizeSiteLogo((raw as Record<string, unknown>).site_logo)
}

/**
 * Company / brand name from CRM:
 * Admin → SEO & Site Settings → Company name
 * (seo_settings.site_name, mirrored to flat site_name)
 *
 * Uses service-role admin client (no next/headers) so this is safe from
 * App Route / Server Component code without pulling cookies into clients.
 */
export async function getCompanyName(): Promise<string> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['site_name', 'seo_settings'])

    const map = Object.fromEntries((data || []).map((row) => [row.key, row.value]))

    const raw =
      asCleanName(map.site_name) ||
      nameFromSeoBlob(map.seo_settings) ||
      DEFAULT_COMPANY_NAME

    const normalized = normalizeCompanyName(raw)

    // One-time upgrade: rewrite legacy CRM company name so admin + public stay in sync
    if (raw !== normalized) {
      void upgradeStoredCompanyName(supabase, map.seo_settings, normalized).catch((err) =>
        console.error('[getCompanyName] upgrade failed', err)
      )
    }

    return normalized
  } catch (err) {
    console.error('[getCompanyName]', err)
    return DEFAULT_COMPANY_NAME
  }
}

async function upgradeStoredCompanyName(
  supabase: ReturnType<typeof createAdminClient>,
  seoRaw: unknown,
  companyName: string
) {
  const now = new Date().toISOString()

  const { data: existingName } = await supabase
    .from('site_settings')
    .select('id')
    .eq('key', 'site_name')
    .maybeSingle()

  if (existingName?.id) {
    await supabase
      .from('site_settings')
      .update({ value: companyName, updated_at: now })
      .eq('key', 'site_name')
  } else {
    await supabase.from('site_settings').insert({
      key: 'site_name',
      value: companyName,
      category: 'general',
      description: 'Company / site name shown across the public site and CRM',
      is_public: true,
    })
  }

  let seoBlob: Record<string, unknown> | null = null
  if (seoRaw && typeof seoRaw === 'object' && !Array.isArray(seoRaw)) {
    seoBlob = { ...(seoRaw as Record<string, unknown>), site_name: companyName }
  } else if (typeof seoRaw === 'string') {
    try {
      const parsed = JSON.parse(seoRaw)
      if (parsed && typeof parsed === 'object') {
        seoBlob = { ...parsed, site_name: companyName }
      }
    } catch {
      /* ignore */
    }
  }

  if (seoBlob) {
    await supabase
      .from('site_settings')
      .update({ value: seoBlob, updated_at: now })
      .eq('key', 'seo_settings')
  }
}

export async function getCompanyTagline(): Promise<string> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['site_tagline', 'seo_settings'])

    const map = Object.fromEntries((data || []).map((row) => [row.key, row.value]))
    const flat = asCleanName(map.site_tagline)
    if (flat) return flat

    const blob = map.seo_settings
    if (blob && typeof blob === 'object' && !Array.isArray(blob)) {
      const t = asCleanName((blob as Record<string, unknown>).site_tagline)
      if (t) return t
    }
    return DEFAULT_COMPANY_TAGLINE
  } catch {
    return DEFAULT_COMPANY_TAGLINE
  }
}

export async function getSiteLogo(): Promise<string> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['site_logo', 'seo_settings'])

    const map = Object.fromEntries((data || []).map((row) => [row.key, row.value]))
    const flat = normalizeSiteLogo(map.site_logo)
    if (flat) return flat
    return logoFromSeoBlob(map.seo_settings)
  } catch {
    return DEFAULT_SITE_LOGO
  }
}

export type BrandInfo = {
  name: string
  tagline: string
  logo: string
}

export async function getBrand(): Promise<BrandInfo> {
  const [name, tagline, logo] = await Promise.all([
    getCompanyName(),
    getCompanyTagline(),
    getSiteLogo(),
  ])
  return { name, tagline, logo }
}
