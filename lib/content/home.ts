/** Homepage CMS content — Difference section + featured headings */

export type HomeDifferentiator = {
  icon: string
  title: string
  description: string
}

export type HomeContent = {
  differentiators: {
    eyebrow: string
    title: string
    titleAccent: string
    items: HomeDifferentiator[]
  }
  featured: {
    eyebrow: string
    title: string
    subtitle: string
  }
}

export const HOME_DEFAULTS: HomeContent = {
  differentiators: {
    eyebrow: 'Why Choose Us',
    title: 'The Soul Search',
    titleAccent: 'Difference',
    items: [
      {
        icon: 'Heart',
        title: 'Local Expertise',
        description:
          'Bhutanese-led journeys with deep knowledge of every trail, temple, and community.',
      },
      {
        icon: 'Shield',
        title: 'Authentic Experiences',
        description:
          'No tourist traps. Genuine culture, real communities, and meaningful connections.',
      },
      {
        icon: 'Mountain',
        title: 'Sustainable Tourism',
        description:
          'Responsible travel that respects the environment and preserves cultural heritage.',
      },
      {
        icon: 'Clock',
        title: '24/7 Support',
        description:
          'Always available to assist you throughout your journey, from planning to departure.',
      },
    ],
  },
  featured: {
    eyebrow: 'Curated experiences',
    title: 'Featured journeys',
    subtitle: 'Our most loved experiences, crafted with care and attention to every detail.',
  },
}

const ALLOWED_ICONS = new Set([
  'Heart',
  'Shield',
  'Mountain',
  'Clock',
  'Users',
  'Compass',
  'Star',
  'Globe',
])

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback
}

function mergeItem(raw: unknown, fallback: HomeDifferentiator): HomeDifferentiator {
  const row = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const icon = asString(row.icon, fallback.icon)
  return {
    icon: ALLOWED_ICONS.has(icon) ? icon : fallback.icon,
    title: asString(row.title, fallback.title),
    description: asString(row.description, fallback.description),
  }
}

export function mergeHomeContent(raw: unknown): HomeContent {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const diffRaw =
    data.differentiators && typeof data.differentiators === 'object'
      ? (data.differentiators as Record<string, unknown>)
      : {}
  const featuredRaw =
    data.featured && typeof data.featured === 'object'
      ? (data.featured as Record<string, unknown>)
      : {}

  const defaultItems = HOME_DEFAULTS.differentiators.items
  const rawItems = Array.isArray(diffRaw.items) ? diffRaw.items : null
  const items =
    rawItems && rawItems.length > 0
      ? rawItems.map((item, i) => mergeItem(item, defaultItems[i % defaultItems.length]))
      : defaultItems

  return {
    differentiators: {
      eyebrow: asString(diffRaw.eyebrow, HOME_DEFAULTS.differentiators.eyebrow),
      title: asString(diffRaw.title, HOME_DEFAULTS.differentiators.title),
      titleAccent: asString(diffRaw.titleAccent, HOME_DEFAULTS.differentiators.titleAccent),
      items,
    },
    featured: {
      eyebrow: asString(featuredRaw.eyebrow, HOME_DEFAULTS.featured.eyebrow),
      title: asString(featuredRaw.title, HOME_DEFAULTS.featured.title),
      subtitle: asString(featuredRaw.subtitle, HOME_DEFAULTS.featured.subtitle),
    },
  }
}
