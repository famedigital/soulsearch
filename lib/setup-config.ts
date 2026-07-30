import { DEFAULT_GLOBAL_THEME, normalizeGlobalTheme, type GlobalTheme } from '@/lib/theme-config'
import {
  DEFAULT_SITE_TEMPLATE,
  normalizeSiteTemplate,
  type SiteTemplateId,
} from '@/lib/template-config'
import { HOME_DEFAULTS, mergeHomeContent, type HomeContent } from '@/lib/content/home'
import { ABOUT_DEFAULTS, mergeAboutContent, type AboutContent } from '@/lib/content/about'
import {
  CONTACT_DEFAULTS,
  mergeContactContent,
  type ContactContent,
} from '@/lib/content/contact'
import { DEFAULT_COMPANY_NAME, DEFAULT_COMPANY_TAGLINE } from '@/lib/brand-defaults'

export const SETUP_SETTING_KEY = 'admin_setup'

export const SETUP_STEPS = [
  'identity',
  'contact',
  'design',
  'homepage',
  'about',
  'tours',
  'blog',
  'faqs',
  'review',
] as const

export type SetupStepId = (typeof SETUP_STEPS)[number]

export type SetupMedia = {
  url: string
  publicId?: string
}

export type SetupIdentity = {
  siteName: string
  siteTagline: string
  siteDescription: string
  siteUrl: string
  siteLogo: string
}

export type SetupHeroSlide = {
  setupId: string
  title: string
  subtitle: string
  description: string
  imageUrl: string
  imagePublicId: string
  ctaText: string
  ctaLink: string
}

export type SetupTourCategory = {
  id: string
  name: string
  slug: string
  description: string
  sort_order: number
  is_active: boolean
}

export type SetupTour = {
  setupId: string
  title: string
  slug: string
  tagline: string
  description: string
  category: string
  duration: number
  price: number
  difficultyLevel: string
  heroImageUrl: string
  thumbnailUrl: string
  isFeatured: boolean
  showPrice: boolean
}

export type SetupBlogPost = {
  setupId: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  featuredImageUrl: string
  featuredImagePublicId: string
  authorName: string
}

export type SetupFaq = {
  setupId: string
  question: string
  answer: string
  category: string
}

export type SetupInviteAdmin = {
  enabled: boolean
  name: string
  email: string
  password: string
  role: 'admin' | 'editor' | 'viewer'
}

export type SetupDraft = {
  identity: SetupIdentity
  contact: ContactContent
  theme: GlobalTheme
  template: SiteTemplateId
  home: HomeContent
  heroSlides: SetupHeroSlide[]
  about: AboutContent
  tourCategories: SetupTourCategory[]
  tours: SetupTour[]
  blogPosts: SetupBlogPost[]
  faqs: SetupFaq[]
  inviteAdmin: SetupInviteAdmin
}

export type SetupState = {
  completed: boolean
  dismissed: boolean
  currentStep: SetupStepId
  completedAt: string | null
  completedBy: string | null
  lastError: string | null
  publishedIds: {
    tours: Record<string, string>
    blogPosts: Record<string, string>
    faqs: Record<string, string>
    heroSlides: Record<string, string>
  }
  draft: SetupDraft
}

export type StepMeta = {
  id: SetupStepId
  title: string
  description: string
}

export const SETUP_STEP_META: StepMeta[] = [
  {
    id: 'identity',
    title: 'Agency identity',
    description: 'Company name, logo, and how the site introduces itself.',
  },
  {
    id: 'contact',
    title: 'Contact & social',
    description: 'Email, phone, WhatsApp, address, and social profiles.',
  },
  {
    id: 'design',
    title: 'Look & layout',
    description: 'Color theme and homepage layout template.',
  },
  {
    id: 'homepage',
    title: 'Homepage',
    description: 'Hero slides, featured journey headings, and differentiators.',
  },
  {
    id: 'about',
    title: 'About page',
    description: 'Your story, values, and key statistics.',
  },
  {
    id: 'tours',
    title: 'Tours',
    description: 'Categories and at least one journey to feature.',
  },
  {
    id: 'blog',
    title: 'Blog',
    description: 'Your first story for the travel journal.',
  },
  {
    id: 'faqs',
    title: 'FAQs & team',
    description: 'Common questions and an optional second admin.',
  },
  {
    id: 'review',
    title: 'Review & publish',
    description: 'Check everything, then publish the full website.',
  },
]

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback
}

function asNumber(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : fallback
}

function newId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export function createDefaultSetupDraft(): SetupDraft {
  return {
    identity: {
      siteName: DEFAULT_COMPANY_NAME,
      siteTagline: DEFAULT_COMPANY_TAGLINE,
      siteDescription: `Experience authentic Bhutan with ${DEFAULT_COMPANY_NAME}.`,
      siteUrl: '',
      siteLogo: '',
    },
    contact: mergeContactContent(CONTACT_DEFAULTS),
    theme: { ...DEFAULT_GLOBAL_THEME },
    template: DEFAULT_SITE_TEMPLATE,
    home: mergeHomeContent(HOME_DEFAULTS),
    heroSlides: [
      {
        setupId: newId('hero'),
        title: 'Discover Bhutan',
        subtitle: 'The Last Shangri-La awaits',
        description: 'Curated journeys through the Himalayas.',
        imageUrl: '',
        imagePublicId: '',
        ctaText: 'Explore Tours',
        ctaLink: '/tours',
      },
    ],
    about: mergeAboutContent(ABOUT_DEFAULTS),
    tourCategories: [
      {
        id: 'international',
        name: 'International Tour',
        slug: 'international',
        description: 'Tours for international travelers',
        sort_order: 0,
        is_active: true,
      },
      {
        id: 'regional',
        name: 'Regional Tour',
        slug: 'regional',
        description: 'Regional and local tours',
        sort_order: 1,
        is_active: true,
      },
    ],
    tours: [
      {
        setupId: newId('tour'),
        title: '',
        slug: '',
        tagline: '',
        description: '',
        category: 'international',
        duration: 7,
        price: 0,
        difficultyLevel: 'easy',
        heroImageUrl: '',
        thumbnailUrl: '',
        isFeatured: true,
        showPrice: true,
      },
    ],
    blogPosts: [
      {
        setupId: newId('blog'),
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'Travel Tips',
        featuredImageUrl: '',
        featuredImagePublicId: '',
        authorName: DEFAULT_COMPANY_NAME,
      },
    ],
    faqs: [
      {
        setupId: newId('faq'),
        question: 'Do I need a visa to visit Bhutan?',
        answer:
          'Yes. Most visitors need a visa arranged through a licensed tour operator before arrival.',
        category: 'General',
      },
    ],
    inviteAdmin: {
      enabled: false,
      name: '',
      email: '',
      password: '',
      role: 'editor',
    },
  }
}

export function createDefaultSetupState(): SetupState {
  return {
    completed: false,
    dismissed: false,
    currentStep: 'identity',
    completedAt: null,
    completedBy: null,
    lastError: null,
    publishedIds: {
      tours: {},
      blogPosts: {},
      faqs: {},
      heroSlides: {},
    },
    draft: createDefaultSetupDraft(),
  }
}

function normalizeHeroSlide(raw: unknown, index: number): SetupHeroSlide {
  const row = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    setupId: asString(row.setupId, newId('hero')),
    title: asString(row.title, index === 0 ? 'Discover Bhutan' : ''),
    subtitle: asString(row.subtitle),
    description: asString(row.description),
    imageUrl: asString(row.imageUrl || row.image_url),
    imagePublicId: asString(row.imagePublicId || row.image_public_id),
    ctaText: asString(row.ctaText || row.cta_text, 'Explore Tours'),
    ctaLink: asString(row.ctaLink || row.cta_link, '/tours'),
  }
}

function normalizeTour(raw: unknown): SetupTour {
  const row = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const title = asString(row.title)
  return {
    setupId: asString(row.setupId, newId('tour')),
    title,
    slug: asString(row.slug) || slugify(title),
    tagline: asString(row.tagline),
    description: asString(row.description),
    category: asString(row.category, 'international'),
    duration: Math.max(1, asNumber(row.duration, 7)),
    price: Math.max(0, asNumber(row.price, 0)),
    difficultyLevel: asString(row.difficultyLevel || row.difficulty_level, 'easy'),
    heroImageUrl: asString(row.heroImageUrl || row.hero_image_url),
    thumbnailUrl: asString(row.thumbnailUrl || row.thumbnail_url),
    isFeatured: row.isFeatured !== false && row.is_featured !== false,
    showPrice: row.showPrice !== false && row.show_price !== false,
  }
}

function normalizeBlog(raw: unknown): SetupBlogPost {
  const row = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const title = asString(row.title)
  return {
    setupId: asString(row.setupId, newId('blog')),
    title,
    slug: asString(row.slug) || slugify(title),
    excerpt: asString(row.excerpt),
    content: asString(row.content),
    category: asString(row.category, 'Travel Tips'),
    featuredImageUrl: asString(row.featuredImageUrl || row.featured_image_url),
    featuredImagePublicId: asString(row.featuredImagePublicId || row.featured_image_public_id),
    authorName: asString(row.authorName || row.author_name, DEFAULT_COMPANY_NAME),
  }
}

function normalizeFaq(raw: unknown): SetupFaq {
  const row = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    setupId: asString(row.setupId, newId('faq')),
    question: asString(row.question),
    answer: asString(row.answer),
    category: asString(row.category, 'General'),
  }
}

function normalizeCategory(raw: unknown, index: number): SetupTourCategory {
  const row = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const name = asString(row.name, `Category ${index + 1}`)
  return {
    id: asString(row.id, slugify(name) || `cat-${index}`),
    name,
    slug: asString(row.slug) || slugify(name),
    description: asString(row.description),
    sort_order: asNumber(row.sort_order, index),
    is_active: row.is_active !== false,
  }
}

export function normalizeSetupDraft(raw: unknown): SetupDraft {
  const defaults = createDefaultSetupDraft()
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const identityRaw =
    data.identity && typeof data.identity === 'object'
      ? (data.identity as Record<string, unknown>)
      : {}
  const inviteRaw =
    data.inviteAdmin && typeof data.inviteAdmin === 'object'
      ? (data.inviteAdmin as Record<string, unknown>)
      : {}

  const heroSlides = Array.isArray(data.heroSlides)
    ? data.heroSlides.map((slide, i) => normalizeHeroSlide(slide, i))
    : defaults.heroSlides
  const tours = Array.isArray(data.tours) ? data.tours.map(normalizeTour) : defaults.tours
  const blogPosts = Array.isArray(data.blogPosts)
    ? data.blogPosts.map(normalizeBlog)
    : defaults.blogPosts
  const faqs = Array.isArray(data.faqs) ? data.faqs.map(normalizeFaq) : defaults.faqs
  const tourCategories = Array.isArray(data.tourCategories)
    ? data.tourCategories.map(normalizeCategory)
    : defaults.tourCategories

  return {
    identity: {
      siteName: asString(identityRaw.siteName, defaults.identity.siteName),
      siteTagline: asString(identityRaw.siteTagline, defaults.identity.siteTagline),
      siteDescription: asString(identityRaw.siteDescription, defaults.identity.siteDescription),
      siteUrl: asString(identityRaw.siteUrl),
      siteLogo: asString(identityRaw.siteLogo),
    },
    contact: mergeContactContent(data.contact ?? defaults.contact),
    theme: normalizeGlobalTheme(data.theme ?? defaults.theme),
    template: normalizeSiteTemplate(data.template ?? defaults.template),
    home: mergeHomeContent(data.home ?? defaults.home),
    heroSlides: heroSlides.length > 0 ? heroSlides : defaults.heroSlides,
    about: mergeAboutContent(data.about ?? defaults.about),
    tourCategories: tourCategories.length > 0 ? tourCategories : defaults.tourCategories,
    tours: tours.length > 0 ? tours : defaults.tours,
    blogPosts: blogPosts.length > 0 ? blogPosts : defaults.blogPosts,
    faqs: faqs.length > 0 ? faqs : defaults.faqs,
    inviteAdmin: {
      enabled: Boolean(inviteRaw.enabled),
      name: asString(inviteRaw.name),
      email: asString(inviteRaw.email),
      password: asString(inviteRaw.password),
      role:
        inviteRaw.role === 'admin' || inviteRaw.role === 'viewer' || inviteRaw.role === 'editor'
          ? inviteRaw.role
          : 'editor',
    },
  }
}

export function normalizeSetupState(raw: unknown): SetupState {
  const defaults = createDefaultSetupState()
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return defaults
  const data = raw as Record<string, unknown>
  const step = asString(data.currentStep, defaults.currentStep) as SetupStepId
  const published =
    data.publishedIds && typeof data.publishedIds === 'object'
      ? (data.publishedIds as Record<string, unknown>)
      : {}

  return {
    completed: Boolean(data.completed),
    dismissed: Boolean(data.dismissed),
    currentStep: SETUP_STEPS.includes(step) ? step : 'identity',
    completedAt: asString(data.completedAt) || null,
    completedBy: asString(data.completedBy) || null,
    lastError: asString(data.lastError) || null,
    publishedIds: {
      tours:
        published.tours && typeof published.tours === 'object'
          ? (published.tours as Record<string, string>)
          : {},
      blogPosts:
        published.blogPosts && typeof published.blogPosts === 'object'
          ? (published.blogPosts as Record<string, string>)
          : {},
      faqs:
        published.faqs && typeof published.faqs === 'object'
          ? (published.faqs as Record<string, string>)
          : {},
      heroSlides:
        published.heroSlides && typeof published.heroSlides === 'object'
          ? (published.heroSlides as Record<string, string>)
          : {},
    },
    draft: normalizeSetupDraft(data.draft),
  }
}

export type StepCompletion = {
  id: SetupStepId
  complete: boolean
  errors: string[]
}

export function validateStep(step: SetupStepId, draft: SetupDraft): StepCompletion {
  const errors: string[] = []

  if (step === 'identity') {
    if (!draft.identity.siteName) errors.push('Company name is required')
    if (!draft.identity.siteTagline) errors.push('Tagline is required')
  }

  if (step === 'contact') {
    if (!draft.contact.contactInfo.email) errors.push('Contact email is required')
    if (!draft.contact.contactInfo.phone) errors.push('Contact phone is required')
  }

  if (step === 'design') {
    // Theme/template always have defaults
  }

  if (step === 'homepage') {
    if (!draft.home.featured.title) errors.push('Featured section title is required')
    if (draft.heroSlides.length < 1) errors.push('Add at least one hero slide')
    draft.heroSlides.forEach((slide, i) => {
      if (!slide.title) errors.push(`Hero slide ${i + 1} needs a title`)
      if (!slide.imageUrl) errors.push(`Hero slide ${i + 1} needs an image`)
    })
  }

  if (step === 'about') {
    if (!draft.about.hero.title) errors.push('About hero title is required')
    if (!draft.about.story.content) errors.push('About story content is required')
  }

  if (step === 'tours') {
    if (draft.tourCategories.filter((c) => c.is_active && c.name).length < 1) {
      errors.push('Add at least one tour category')
    }
    const ready = draft.tours.filter(
      (t) => t.title && t.description && t.heroImageUrl && t.duration >= 1
    )
    if (ready.length < 1) {
      errors.push('Add at least one complete tour (title, description, duration, image)')
    }
  }

  if (step === 'blog') {
    const ready = draft.blogPosts.filter((p) => p.title && p.content)
    if (ready.length < 1) errors.push('Add at least one blog post with title and content')
  }

  if (step === 'faqs') {
    const ready = draft.faqs.filter((f) => f.question && f.answer)
    if (ready.length < 1) errors.push('Add at least one FAQ')
    if (draft.inviteAdmin.enabled) {
      if (!draft.inviteAdmin.name) errors.push('Invite admin name is required')
      if (!draft.inviteAdmin.email) errors.push('Invite admin email is required')
      if (draft.inviteAdmin.password.length < 6) {
        errors.push('Invite admin password must be at least 6 characters')
      }
    }
  }

  return { id: step, complete: errors.length === 0, errors }
}

export function getSetupProgress(draft: SetupDraft) {
  const steps = SETUP_STEPS.filter((s) => s !== 'review').map((id) => validateStep(id, draft))
  const completedCount = steps.filter((s) => s.complete).length
  return {
    steps,
    completedCount,
    totalCount: steps.length,
    readyToPublish: steps.every((s) => s.complete),
    blockingErrors: steps.flatMap((s) => s.errors),
  }
}

export function nextSetupStep(current: SetupStepId): SetupStepId {
  const index = SETUP_STEPS.indexOf(current)
  return SETUP_STEPS[Math.min(index + 1, SETUP_STEPS.length - 1)]
}

export function prevSetupStep(current: SetupStepId): SetupStepId {
  const index = SETUP_STEPS.indexOf(current)
  return SETUP_STEPS[Math.max(index - 1, 0)]
}

export { slugify }
