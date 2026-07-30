import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { getCurrentUser } from '@/lib/auth/jwt'
import { createAdminClient } from '@/utils/supabase/admin'
import { getSetupState, saveSetupState } from '@/lib/setup'
import { getSetupProgress, slugify, type SetupState } from '@/lib/setup-config'

export const dynamic = 'force-dynamic'

async function upsertSetting(
  supabase: ReturnType<typeof createAdminClient>,
  key: string,
  value: unknown,
  category: string,
  description: string,
  is_public = true
) {
  const { data: existing } = await supabase
    .from('site_settings')
    .select('id')
    .eq('key', key)
    .maybeSingle()

  const now = new Date().toISOString()
  if (existing?.id) {
    const { error } = await supabase
      .from('site_settings')
      .update({ value, category, description, is_public, updated_at: now })
      .eq('key', key)
    if (error) throw error
  } else {
    const { error } = await supabase.from('site_settings').insert({
      key,
      value,
      category,
      description,
      is_public,
    })
    if (error) throw error
  }
}

async function upsertContentPage(
  supabase: ReturnType<typeof createAdminClient>,
  pageType: string,
  content: unknown,
  metadata: Record<string, unknown>,
  userId: string
) {
  const { data: existing } = await supabase
    .from('content_pages')
    .select('id')
    .eq('page_type', pageType)
    .maybeSingle()

  const now = new Date().toISOString()
  if (existing?.id) {
    const { error } = await supabase
      .from('content_pages')
      .update({
        content,
        metadata,
        is_active: true,
        updated_at: now,
        updated_by: userId,
      })
      .eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('content_pages').insert({
      page_type: pageType,
      content,
      metadata,
      is_active: true,
      created_by: userId,
      updated_by: userId,
    })
    if (error) throw error
  }
}

/** POST /api/admin/setup/publish — publish the full setup draft to the live site */
export async function POST() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const state = await getSetupState()
    const progress = getSetupProgress(state.draft)

    if (!progress.readyToPublish) {
      return NextResponse.json(
        {
          error: 'Setup is incomplete',
          blockingErrors: progress.blockingErrors,
          progress,
        },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    const draft = state.draft
    const publishedIds: SetupState['publishedIds'] = {
      tours: { ...state.publishedIds.tours },
      blogPosts: { ...state.publishedIds.blogPosts },
      faqs: { ...state.publishedIds.faqs },
      heroSlides: { ...state.publishedIds.heroSlides },
    }

    try {
      // 1. Identity / SEO / logo
      const seoSettings = {
        site_name: draft.identity.siteName,
        site_tagline: draft.identity.siteTagline,
        site_description: draft.identity.siteDescription,
        site_url: draft.identity.siteUrl,
        site_logo: draft.identity.siteLogo,
        contact_email: draft.contact.contactInfo.email,
        contact_phone: draft.contact.contactInfo.phone,
        contact_address: draft.contact.contactInfo.address,
        social_facebook: draft.contact.socialMedia?.facebook || '',
        social_instagram: draft.contact.socialMedia?.instagram || '',
        seo_title_template: `{title} | ${draft.identity.siteName}`,
        og_title: draft.identity.siteName,
        og_description: draft.identity.siteDescription,
        seo_canonical: draft.identity.siteUrl || '',
      }

      await upsertSetting(
        supabase,
        'seo_settings',
        seoSettings,
        'seo',
        'Comprehensive SEO settings for the entire website',
        false
      )
      await upsertSetting(
        supabase,
        'site_name',
        draft.identity.siteName,
        'general',
        'Company / site name shown across the public site and CRM',
        true
      )
      await upsertSetting(
        supabase,
        'site_tagline',
        draft.identity.siteTagline,
        'general',
        'Company tagline',
        true
      )
      await upsertSetting(
        supabase,
        'site_logo',
        draft.identity.siteLogo,
        'general',
        'Company logo URL shown across the public site and admin',
        true
      )
      await upsertSetting(
        supabase,
        'social_facebook',
        draft.contact.socialMedia?.facebook || '',
        'seo',
        'Public Facebook profile URL',
        true
      )
      await upsertSetting(
        supabase,
        'social_instagram',
        draft.contact.socialMedia?.instagram || '',
        'seo',
        'Public Instagram profile URL',
        true
      )

      // 2. Theme + template
      await upsertSetting(
        supabase,
        'global_theme',
        draft.theme,
        'appearance',
        'Global color theme for the public website and admin portal',
        true
      )
      await upsertSetting(
        supabase,
        'site_template',
        draft.template,
        'appearance',
        'Layout template used across the public website',
        true
      )

      // 3. Content pages
      await upsertContentPage(
        supabase,
        'home',
        draft.home,
        {
          seoTitle: `${draft.identity.siteName} - Discover the Last Shangri-La`,
          seoDescription: draft.identity.siteDescription,
        },
        user.userId
      )
      await upsertContentPage(
        supabase,
        'about',
        draft.about,
        {
          seoTitle: `About Us - ${draft.identity.siteName}`,
          seoDescription: draft.about.story.content.slice(0, 160),
        },
        user.userId
      )
      await upsertContentPage(
        supabase,
        'contact',
        draft.contact,
        {
          seoTitle: `Contact Us - ${draft.identity.siteName}`,
          seoDescription: 'Get in touch to plan your Bhutan journey',
        },
        user.userId
      )

      // 4. Hero slides — upsert by remembered IDs; deactivate others from prior publishes
      const activeHeroDbIds: string[] = []
      for (let i = 0; i < draft.heroSlides.length; i++) {
        const slide = draft.heroSlides[i]
        const existingId = publishedIds.heroSlides[slide.setupId]
        const payload = {
          title: slide.title,
          subtitle: slide.subtitle,
          description: slide.description,
          image_url: slide.imageUrl,
          image_public_id: slide.imagePublicId || slide.imageUrl,
          cta_text: slide.ctaText,
          cta_link: slide.ctaLink,
          slide_order: i,
          is_active: true,
          updated_at: new Date().toISOString(),
        }

        if (existingId) {
          const { error } = await supabase.from('hero_slides').update(payload).eq('id', existingId)
          if (error) throw error
          activeHeroDbIds.push(existingId)
        } else {
          const { data, error } = await supabase
            .from('hero_slides')
            .insert(payload)
            .select('id')
            .single()
          if (error) throw error
          publishedIds.heroSlides[slide.setupId] = data.id
          activeHeroDbIds.push(data.id)
        }
      }

      // Soft-deactivate previously published setup slides that were removed from the draft
      const staleHeroIds = Object.values(publishedIds.heroSlides).filter(
        (id) => !activeHeroDbIds.includes(id)
      )
      if (staleHeroIds.length > 0) {
        await supabase.from('hero_slides').update({ is_active: false }).in('id', staleHeroIds)
      }

      // 5. Tour categories
      await upsertSetting(
        supabase,
        'tour_categories',
        draft.tourCategories,
        'tours',
        'Tour navigation categories for public Tours submenu',
        true
      )

      // 6. Tours
      for (const tour of draft.tours) {
        if (!tour.title || !tour.description || !tour.heroImageUrl) continue
        const slug = tour.slug || slugify(tour.title)
        const payload = {
          title: tour.title,
          slug,
          tagline: tour.tagline,
          description: tour.description,
          long_description: tour.description,
          category: tour.category,
          duration: tour.duration,
          price: tour.price,
          difficulty_level: tour.difficultyLevel,
          hero_image_url: tour.heroImageUrl,
          thumbnail_url: tour.thumbnailUrl || tour.heroImageUrl,
          is_featured: tour.isFeatured,
          is_active: true,
          is_published: true,
          show_price: tour.showPrice,
          updated_at: new Date().toISOString(),
        }

        const existingId = publishedIds.tours[tour.setupId]
        if (existingId) {
          const { error } = await supabase.from('tours').update(payload).eq('id', existingId)
          if (error) throw error
        } else {
          // Prefer update by slug if a tour already exists with that slug
          const { data: bySlug } = await supabase
            .from('tours')
            .select('id')
            .eq('slug', slug)
            .maybeSingle()

          if (bySlug?.id) {
            const { error } = await supabase.from('tours').update(payload).eq('id', bySlug.id)
            if (error) throw error
            publishedIds.tours[tour.setupId] = bySlug.id
          } else {
            const { data, error } = await supabase
              .from('tours')
              .insert({ ...payload, created_at: new Date().toISOString() })
              .select('id')
              .single()
            if (error) throw error
            publishedIds.tours[tour.setupId] = data.id
          }
        }
      }

      // 7. Blog posts
      for (const post of draft.blogPosts) {
        if (!post.title || !post.content) continue
        const slug = post.slug || slugify(post.title)
        const payload = {
          title: post.title,
          slug,
          excerpt: post.excerpt || post.content.slice(0, 160),
          content: post.content,
          category: post.category,
          featured_image_url: post.featuredImageUrl || null,
          featured_image_public_id: post.featuredImagePublicId || null,
          author_name: post.authorName || draft.identity.siteName,
          status: 'published',
          published_at: new Date().toISOString(),
          read_time: Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200)),
          updated_by: user.userId,
          updated_at: new Date().toISOString(),
        }

        const existingId = publishedIds.blogPosts[post.setupId]
        if (existingId) {
          const { error } = await supabase.from('blog_posts').update(payload).eq('id', existingId)
          if (error) throw error
        } else {
          const { data: bySlug } = await supabase
            .from('blog_posts')
            .select('id')
            .eq('slug', slug)
            .maybeSingle()

          if (bySlug?.id) {
            const { error } = await supabase
              .from('blog_posts')
              .update(payload)
              .eq('id', bySlug.id)
            if (error) throw error
            publishedIds.blogPosts[post.setupId] = bySlug.id
          } else {
            const { data, error } = await supabase
              .from('blog_posts')
              .insert({
                ...payload,
                created_by: user.userId,
                created_at: new Date().toISOString(),
              })
              .select('id')
              .single()
            if (error) throw error
            publishedIds.blogPosts[post.setupId] = data.id
          }
        }
      }

      // 8. FAQs
      for (let i = 0; i < draft.faqs.length; i++) {
        const faq = draft.faqs[i]
        if (!faq.question || !faq.answer) continue
        const payload = {
          question: faq.question,
          answer: faq.answer,
          category: faq.category || 'General',
          sort_order: i,
          is_active: true,
          updated_by: user.userId,
          updated_at: new Date().toISOString(),
        }

        const existingId = publishedIds.faqs[faq.setupId]
        if (existingId) {
          const { error } = await supabase.from('faqs').update(payload).eq('id', existingId)
          if (error) throw error
        } else {
          const { data, error } = await supabase
            .from('faqs')
            .insert({
              ...payload,
              created_by: user.userId,
            })
            .select('id')
            .single()
          if (error) throw error
          publishedIds.faqs[faq.setupId] = data.id
        }
      }

      // 9. Optional second admin
      if (draft.inviteAdmin.enabled) {
        const email = draft.inviteAdmin.email.trim().toLowerCase()
        const { data: existingUser } = await supabase
          .from('admin_users')
          .select('id')
          .eq('email', email)
          .maybeSingle()

        if (!existingUser) {
          const passwordHash = await bcrypt.hash(draft.inviteAdmin.password, 10)
          const { error } = await supabase.from('admin_users').insert({
            email,
            name: draft.inviteAdmin.name,
            password_hash: passwordHash,
            role: draft.inviteAdmin.role || 'editor',
            is_active: true,
          })
          if (error) throw error
        }
      }

      // Mark complete only after all writes succeed
      const completedState: SetupState = {
        ...state,
        completed: true,
        dismissed: true,
        currentStep: 'review',
        completedAt: new Date().toISOString(),
        completedBy: user.userId,
        lastError: null,
        publishedIds,
        draft,
      }
      // Clear invite password from stored draft after publish
      completedState.draft = {
        ...draft,
        inviteAdmin: { ...draft.inviteAdmin, password: '' },
      }
      await saveSetupState(completedState)

      revalidatePath('/', 'layout')
      revalidatePath('/')
      revalidatePath('/about')
      revalidatePath('/contact')
      revalidatePath('/tours')
      revalidatePath('/blog')
      revalidatePath('/faq')
      revalidatePath('/admin', 'layout')
      revalidatePath('/admin/dashboard')
      revalidatePath('/admin/login')
      revalidatePath('/api/admin/manifest')
      revalidatePath('/api/brand')
      revalidatePath('/api/brand/icon/[size]', 'page')

      return NextResponse.json({
        ok: true,
        completed: true,
        publishedIds,
        message: 'Website published successfully',
      })
    } catch (publishError) {
      const message =
        publishError instanceof Error ? publishError.message : 'Publish failed'
      await saveSetupState({
        ...state,
        publishedIds,
        lastError: message,
        draft: {
          ...draft,
          inviteAdmin: { ...draft.inviteAdmin, password: draft.inviteAdmin.password },
        },
      })
      throw publishError
    }
  } catch (error) {
    console.error('[POST /api/admin/setup/publish]', error)
    return NextResponse.json(
      {
        error: 'Failed to publish website',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
