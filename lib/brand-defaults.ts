/** Client-safe brand defaults (no server imports). */

export const DEFAULT_COMPANY_NAME = 'Soul Search Tours'

export const DEFAULT_COMPANY_TAGLINE = 'Discover the Last Shangri-La'

/** No logo until one is uploaded in Admin → SEO → Company logo. */
export const DEFAULT_SITE_LOGO = ''

/** Older CRM / seed values that should display as the current brand. */
const LEGACY_COMPANY_NAMES = new Set(
  [
    'Wangchuk Tours & Treks',
    'Wangchuks Tours & Treks',
    'Wangchuk Tours',
    'Wangchuks Tours',
    'Wangchuk Tours and Treks',
    'Wangchuks Tours and Treks',
    'Wangchuks Bhutan Tours & Treks',
    'Wangchuk Bhutan Tours & Treks',
  ].map((s) => s.toLowerCase())
)

/**
 * Normalize company name from CRM. Upgrades known legacy names so the public
 * site does not flash the new default then revert to an old stored value.
 */
export function normalizeCompanyName(value?: string | null): string {
  const raw = String(value || '').trim()
  if (!raw) return DEFAULT_COMPANY_NAME
  if (LEGACY_COMPANY_NAMES.has(raw.toLowerCase())) return DEFAULT_COMPANY_NAME
  return raw
}

export function normalizeSiteLogo(value?: unknown): string {
  if (typeof value !== 'string') return DEFAULT_SITE_LOGO
  const trimmed = value.trim()
  if (!trimmed) return DEFAULT_SITE_LOGO
  // Reject the previous company's Cloudinary wordmark if it somehow got stored.
  if (/wangchukstlogo|hckgrdeh/i.test(trimmed)) return DEFAULT_SITE_LOGO
  return trimmed
}
