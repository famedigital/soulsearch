export type SiteTemplateId = 'aurora' | 'editorial' | 'immersive'

export const SITE_TEMPLATE_IDS = ['aurora', 'editorial', 'immersive'] as const

export const DEFAULT_SITE_TEMPLATE: SiteTemplateId = 'aurora'

export type SiteTemplateMeta = {
  id: SiteTemplateId
  name: string
  tagline: string
  description: string
  highlights: string[]
}

export const SITE_TEMPLATES: SiteTemplateMeta[] = [
  {
    id: 'aurora',
    name: 'Aurora',
    tagline: 'Bright, structured, split-screen',
    description:
      'A confident modern layout that pairs a solid colour panel with your photography. Best when you want the headline and call to action to read instantly, before any scrolling.',
    highlights: [
      'Split-screen hero: colour panel beside the slideshow',
      'Solid navigation bar with centred links',
      'Staggered tour grid with offset cards',
      'Light footer with an oversized wordmark',
    ],
  },
  {
    id: 'editorial',
    name: 'Editorial',
    tagline: 'Magazine feel, generous whitespace',
    description:
      'A calm, print-inspired layout built around large serif headlines and full-width story rows. Best when the writing and individual journeys matter more than density.',
    highlights: [
      'Contained hero card framed by whitespace',
      'Centred logo with links split either side',
      'Tours as alternating full-width story rows',
      'Minimal centred footer',
    ],
  },
  {
    id: 'immersive',
    name: 'Immersive',
    tagline: 'Cinematic, dark, photography-led',
    description:
      'A full-bleed dark layout where the imagery carries the page. Best when you have strong landscape photography and want a premium, atmospheric first impression.',
    highlights: [
      'Full-bleed hero with slide thumbnails and a counter',
      'Floating glass pill navigation',
      'Tours in a horizontal scrolling rail',
      'Dark footer with a large call-to-action band',
    ],
  },
]

export function getSiteTemplateMeta(id: SiteTemplateId): SiteTemplateMeta {
  return SITE_TEMPLATES.find((template) => template.id === id) ?? SITE_TEMPLATES[0]
}

export function normalizeSiteTemplate(value: unknown): SiteTemplateId {
  let raw: unknown = value

  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const record = raw as Record<string, unknown>
    raw = record.id ?? record.template
  }

  if (typeof raw === 'string' && (SITE_TEMPLATE_IDS as readonly string[]).includes(raw)) {
    return raw as SiteTemplateId
  }

  return DEFAULT_SITE_TEMPLATE
}
