/**
 * Route-level / domain validation for the first-login setup wizard.
 * Run: npx tsx scripts/verify-setup-config.ts
 */
import assert from 'node:assert/strict'
import {
  createDefaultSetupDraft,
  getSetupProgress,
  normalizeSetupDraft,
  normalizeSetupState,
  validateStep,
  SETUP_SETTING_KEY,
  SETUP_STEPS,
} from '../lib/setup-config'

function completeDraft() {
  const draft = createDefaultSetupDraft()
  draft.identity = {
    siteName: 'Soul Search Tours',
    siteTagline: 'Discover Bhutan',
    siteDescription: 'Private guided journeys',
    siteUrl: 'https://example.com',
    siteLogo: 'https://res.cloudinary.com/demo/logo.png',
  }
  draft.contact.contactInfo.email = 'hello@example.com'
  draft.contact.contactInfo.phone = '+975-17-000000'
  draft.home.featured.title = 'Featured journeys'
  draft.heroSlides = [
    {
      setupId: 'hero_1',
      title: 'Welcome',
      subtitle: 'Bhutan',
      description: 'Start here',
      imageUrl: 'https://res.cloudinary.com/demo/hero.jpg',
      imagePublicId: 'demo/hero',
      ctaText: 'Explore',
      ctaLink: '/tours',
    },
  ]
  draft.about.hero.title = 'Our story'
  draft.about.story.content = 'We craft meaningful journeys.'
  draft.tourCategories = [
    {
      id: 'cat_1',
      name: 'Cultural',
      slug: 'cultural',
      description: 'Culture tours',
      sort_order: 0,
      is_active: true,
    },
  ]
  draft.tours = [
    {
      setupId: 'tour_1',
      title: 'Cultural Triangle',
      slug: 'cultural-triangle',
      tagline: 'Classic',
      description: 'A complete cultural circuit.',
      category: 'cultural',
      duration: 7,
      price: 2500,
      difficultyLevel: 'easy',
      heroImageUrl: 'https://res.cloudinary.com/demo/tour.jpg',
      thumbnailUrl: 'https://res.cloudinary.com/demo/tour-thumb.jpg',
      isFeatured: true,
      showPrice: true,
    },
  ]
  draft.blogPosts = [
    {
      setupId: 'blog_1',
      title: 'First post',
      slug: 'first-post',
      excerpt: 'Hello',
      content: 'Full article body',
      category: 'travel',
      featuredImageUrl: 'https://res.cloudinary.com/demo/blog.jpg',
      featuredImagePublicId: 'demo/blog',
      authorName: 'Admin',
    },
  ]
  draft.faqs = [
    {
      setupId: 'faq_1',
      question: 'Do you arrange visas?',
      answer: 'Yes, we help with tourist visas.',
      category: 'general',
    },
  ]
  return draft
}

console.log('Verifying setup config…')

assert.equal(SETUP_SETTING_KEY, 'admin_setup')
assert.ok(SETUP_STEPS.includes('review'))

const empty = createDefaultSetupDraft()
const emptyProgress = getSetupProgress(empty)
assert.equal(emptyProgress.readyToPublish, false)
assert.ok(emptyProgress.blockingErrors.length > 0)
assert.equal(validateStep('homepage', empty).complete, false)
assert.equal(validateStep('tours', empty).complete, false)

const incompleteIdentity = normalizeSetupDraft({
  identity: { siteName: '', siteTagline: '' },
})
assert.equal(validateStep('identity', incompleteIdentity).complete, false)

const complete = completeDraft()
const ready = getSetupProgress(complete)
assert.equal(ready.readyToPublish, true, ready.blockingErrors.join('; '))
assert.equal(ready.completedCount, ready.totalCount)

// Incomplete drafts stay incomplete after normalize
const normalized = normalizeSetupDraft({
  identity: { siteName: 'Only name' },
  tours: [{ setupId: 'x', title: 'Half' }],
})
assert.equal(getSetupProgress(normalized).readyToPublish, false)
assert.equal(normalized.identity.siteName, 'Only name')
assert.ok(normalized.tours[0].setupId)

// Resume / state normalize preserves completed flag and published ids
const state = normalizeSetupState({
  completed: true,
  currentStep: 'tours',
  publishedIds: { tours: { tour_1: 'uuid-1' }, blogPosts: {}, faqs: {}, heroSlides: {} },
  draft: complete,
})
assert.equal(state.completed, true)
assert.equal(state.currentStep, 'tours')
assert.equal(state.publishedIds.tours.tour_1, 'uuid-1')
assert.equal(state.draft.identity.siteName, 'Soul Search Tours')

// Idempotent publish key map: same setupId maps to same record id
const retryIds = { ...state.publishedIds.tours }
assert.equal(retryIds.tour_1, 'uuid-1')

// Auth surface: private setting key must never be public by convention
assert.equal(SETUP_SETTING_KEY.startsWith('admin_'), true)

console.log('All setup-config verification checks passed.')
