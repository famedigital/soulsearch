/** Shared About page content shape + deep merge for CMS ↔ public */

export type AboutHero = {
  title: string
  subtitle: string
  backgroundImage: string
  cta: { text: string; link: string }
}

export type AboutStory = {
  title: string
  content: string
  founded: string
}

export type AboutValue = { title: string; description: string; icon?: string }
export type AboutStat = { number: string; label: string }
export type AboutTimelineEvent = { year: string; title: string; description: string }
export type AboutTeamMember = { name: string; role: string; bio: string; image?: string }

export type AboutContent = {
  hero: AboutHero
  story: AboutStory
  values: AboutValue[]
  statistics: AboutStat[]
  timeline: AboutTimelineEvent[]
  team: AboutTeamMember[]
}

export const ABOUT_DEFAULTS: AboutContent = {
  hero: {
    title: 'Discover the Last Shangri-La',
    subtitle:
      'Experience authentic Bhutanese culture and Himalayan landscapes with a locally owned team.',
    backgroundImage: '',
    cta: { text: 'Explore our tours', link: '/tours' },
  },
  story: {
    title: 'Our Story',
    content:
      'Soul Search Tours is your gateway to experiencing the authentic beauty of Bhutan — temples, trails, and communities, guided by people who call this place home.',
    founded: '2010',
  },
  values: [
    {
      icon: 'Heart',
      title: 'Authentic experiences',
      description: 'Genuine culture, not staged tourist loops.',
    },
    {
      icon: 'Shield',
      title: 'Sustainable travel',
      description: 'Respect for land, people, and heritage.',
    },
    {
      icon: 'Users',
      title: 'Personal service',
      description: 'Itineraries shaped around how you travel.',
    },
    {
      icon: 'Mountain',
      title: 'Local expertise',
      description: 'Bhutanese guides who know every trail.',
    },
  ],
  statistics: [
    { number: '500+', label: 'Happy travelers' },
    { number: '15+', label: 'Years experience' },
    { number: '50+', label: 'Unique tours' },
    { number: '100%', label: 'Bhutanese owned' },
  ],
  timeline: [],
  team: [],
}

/** Deep-merge CMS payload so nested hero/story/arrays from admin are never dropped. */
export function mergeAboutContent(raw: unknown): AboutContent {
  const data = (raw && typeof raw === 'object' ? raw : {}) as Record<string, any>

  const heroRaw = data.hero && typeof data.hero === 'object' ? data.hero : {}
  const storyRaw = data.story && typeof data.story === 'object' ? data.story : {}
  const ctaRaw = heroRaw.cta && typeof heroRaw.cta === 'object' ? heroRaw.cta : {}

  const values = Array.isArray(data.values)
    ? data.values.filter((v: any) => v && (v.title || v.description))
    : ABOUT_DEFAULTS.values

  const statistics = Array.isArray(data.statistics)
    ? data.statistics.filter((s: any) => s && (s.number || s.label))
    : ABOUT_DEFAULTS.statistics

  const timeline = Array.isArray(data.timeline)
    ? data.timeline.filter((t: any) => t && (t.year || t.title || t.description))
    : []

  const team = Array.isArray(data.team)
    ? data.team.filter((m: any) => m && (m.name || m.role || m.bio))
    : []

  return {
    hero: {
      title: heroRaw.title || ABOUT_DEFAULTS.hero.title,
      subtitle: heroRaw.subtitle || ABOUT_DEFAULTS.hero.subtitle,
      backgroundImage: heroRaw.backgroundImage || ABOUT_DEFAULTS.hero.backgroundImage,
      cta: {
        text: ctaRaw.text || ABOUT_DEFAULTS.hero.cta.text,
        link: ctaRaw.link || ABOUT_DEFAULTS.hero.cta.link,
      },
    },
    story: {
      title: storyRaw.title || ABOUT_DEFAULTS.story.title,
      content: storyRaw.content || ABOUT_DEFAULTS.story.content,
      founded: storyRaw.founded || ABOUT_DEFAULTS.story.founded,
    },
    values,
    statistics,
    timeline,
    team,
  }
}
