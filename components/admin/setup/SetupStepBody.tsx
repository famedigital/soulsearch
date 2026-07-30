'use client'

import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { SetupMediaField } from '@/components/admin/setup/SetupMediaField'
import { THEME_PRESETS } from '@/lib/theme-config'
import { SITE_TEMPLATES } from '@/lib/template-config'
import { cn } from '@/lib/utils'
import type { SetupDraft, SetupStepId } from '@/lib/setup-config'

function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export function SetupStepBody({
  step,
  draft,
  onChange,
}: {
  step: SetupStepId
  draft: SetupDraft
  onChange: (next: SetupDraft) => void
}) {
  if (step === 'identity') {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Company name">
          <Input
            value={draft.identity.siteName}
            onChange={(e) =>
              onChange({
                ...draft,
                identity: { ...draft.identity, siteName: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Tagline">
          <Input
            value={draft.identity.siteTagline}
            onChange={(e) =>
              onChange({
                ...draft,
                identity: { ...draft.identity, siteTagline: e.target.value },
              })
            }
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Short description" hint="Used for SEO and social sharing">
            <Textarea
              rows={3}
              value={draft.identity.siteDescription}
              onChange={(e) =>
                onChange({
                  ...draft,
                  identity: { ...draft.identity, siteDescription: e.target.value },
                })
              }
            />
          </Field>
        </div>
        <Field label="Website URL">
          <Input
            type="url"
            placeholder="https://yoursite.com"
            value={draft.identity.siteUrl}
            onChange={(e) =>
              onChange({
                ...draft,
                identity: { ...draft.identity, siteUrl: e.target.value },
              })
            }
          />
        </Field>
        <div className="md:col-span-2">
          <SetupMediaField
            label="Company logo"
            url={draft.identity.siteLogo}
            onChange={({ url }) =>
              onChange({
                ...draft,
                identity: { ...draft.identity, siteLogo: url },
              })
            }
            hint="Also used for favicon and the installable admin app icon."
          />
        </div>
      </div>
    )
  }

  if (step === 'contact') {
    const info = draft.contact.contactInfo
    const social = draft.contact.socialMedia || {}
    const hours = draft.contact.officeHours || {}
    const auto = draft.contact.autoReply

    return (
      <div className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Email">
            <Input
              type="email"
              value={info.email}
              onChange={(e) =>
                onChange({
                  ...draft,
                  contact: {
                    ...draft.contact,
                    contactInfo: { ...info, email: e.target.value },
                  },
                })
              }
            />
          </Field>
          <Field label="Phone">
            <Input
              value={info.phone}
              onChange={(e) =>
                onChange({
                  ...draft,
                  contact: {
                    ...draft.contact,
                    contactInfo: { ...info, phone: e.target.value },
                  },
                })
              }
            />
          </Field>
          <Field label="WhatsApp">
            <Input
              value={info.whatsapp || ''}
              onChange={(e) =>
                onChange({
                  ...draft,
                  contact: {
                    ...draft.contact,
                    contactInfo: { ...info, whatsapp: e.target.value },
                  },
                })
              }
            />
          </Field>
          <Field label="Address">
            <Input
              value={info.address}
              onChange={(e) =>
                onChange({
                  ...draft,
                  contact: {
                    ...draft.contact,
                    contactInfo: { ...info, address: e.target.value },
                  },
                })
              }
            />
          </Field>
          <Field label="Weekday hours">
            <Input
              value={hours.weekdays || ''}
              onChange={(e) =>
                onChange({
                  ...draft,
                  contact: {
                    ...draft.contact,
                    officeHours: { ...hours, weekdays: e.target.value },
                  },
                })
              }
            />
          </Field>
          <Field label="Saturday hours">
            <Input
              value={hours.saturdays || ''}
              onChange={(e) =>
                onChange({
                  ...draft,
                  contact: {
                    ...draft.contact,
                    officeHours: { ...hours, saturdays: e.target.value },
                  },
                })
              }
            />
          </Field>
          <Field label="Facebook URL">
            <Input
              value={social.facebook || ''}
              onChange={(e) =>
                onChange({
                  ...draft,
                  contact: {
                    ...draft.contact,
                    socialMedia: { ...social, facebook: e.target.value },
                  },
                })
              }
            />
          </Field>
          <Field label="Instagram URL">
            <Input
              value={social.instagram || ''}
              onChange={(e) =>
                onChange({
                  ...draft,
                  contact: {
                    ...draft.contact,
                    socialMedia: { ...social, instagram: e.target.value },
                  },
                })
              }
            />
          </Field>
        </div>
        <Field label="Auto-reply subject">
          <Input
            value={auto?.subject || ''}
            onChange={(e) =>
              onChange({
                ...draft,
                contact: {
                  ...draft.contact,
                  autoReply: {
                    enabled: auto?.enabled ?? true,
                    subject: e.target.value,
                    message: auto?.message || '',
                  },
                },
              })
            }
          />
        </Field>
        <Field label="Auto-reply message">
          <Textarea
            rows={3}
            value={auto?.message || ''}
            onChange={(e) =>
              onChange({
                ...draft,
                contact: {
                  ...draft.contact,
                  autoReply: {
                    enabled: auto?.enabled ?? true,
                    subject: auto?.subject || '',
                    message: e.target.value,
                  },
                },
              })
            }
          />
        </Field>
      </div>
    )
  }

  if (step === 'design') {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="mb-3 font-heading text-lg font-semibold">Color theme</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {THEME_PRESETS.map((preset) => {
              const active =
                draft.theme.primary === preset.colors.primary &&
                draft.theme.secondary === preset.colors.secondary
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => onChange({ ...draft, theme: preset.colors })}
                  className={cn(
                    'rounded-xl border p-4 text-left transition-colors',
                    active ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/40'
                  )}
                >
                  <div className="mb-3 flex gap-2">
                    {Object.values(preset.colors)
                      .slice(0, 4)
                      .map((color) => (
                        <span
                          key={color}
                          className="size-6 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                  </div>
                  <p className="font-medium">{preset.name}</p>
                  <p className="text-xs text-muted-foreground">{preset.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-heading text-lg font-semibold">Website layout</h3>
          <div className="grid gap-3 lg:grid-cols-3">
            {SITE_TEMPLATES.map((template) => {
              const active = draft.template === template.id
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => onChange({ ...draft, template: template.id })}
                  className={cn(
                    'rounded-xl border p-4 text-left transition-colors',
                    active ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/40'
                  )}
                >
                  <p className="font-heading text-lg font-semibold">{template.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{template.tagline}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{template.description}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (step === 'homepage') {
    return (
      <div className="space-y-8">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Featured eyebrow">
            <Input
              value={draft.home.featured.eyebrow}
              onChange={(e) =>
                onChange({
                  ...draft,
                  home: {
                    ...draft.home,
                    featured: { ...draft.home.featured, eyebrow: e.target.value },
                  },
                })
              }
            />
          </Field>
          <Field label="Featured title">
            <Input
              value={draft.home.featured.title}
              onChange={(e) =>
                onChange({
                  ...draft,
                  home: {
                    ...draft.home,
                    featured: { ...draft.home.featured, title: e.target.value },
                  },
                })
              }
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Featured subtitle">
              <Textarea
                rows={2}
                value={draft.home.featured.subtitle}
                onChange={(e) =>
                  onChange({
                    ...draft,
                    home: {
                      ...draft.home,
                      featured: { ...draft.home.featured, subtitle: e.target.value },
                    },
                  })
                }
              />
            </Field>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold">Hero slides</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={draft.heroSlides.length >= 3}
              onClick={() =>
                onChange({
                  ...draft,
                  heroSlides: [
                    ...draft.heroSlides,
                    {
                      setupId: newId('hero'),
                      title: '',
                      subtitle: '',
                      description: '',
                      imageUrl: '',
                      imagePublicId: '',
                      ctaText: 'Explore Tours',
                      ctaLink: '/tours',
                    },
                  ],
                })
              }
            >
              <Plus className="size-4" />
              Add slide
            </Button>
          </div>
          <div className="space-y-4">
            {draft.heroSlides.map((slide, index) => (
              <Card key={slide.setupId} className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Slide {index + 1}</p>
                  {draft.heroSlides.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        onChange({
                          ...draft,
                          heroSlides: draft.heroSlides.filter((s) => s.setupId !== slide.setupId),
                        })
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Title">
                    <Input
                      value={slide.title}
                      onChange={(e) => {
                        const heroSlides = [...draft.heroSlides]
                        heroSlides[index] = { ...slide, title: e.target.value }
                        onChange({ ...draft, heroSlides })
                      }}
                    />
                  </Field>
                  <Field label="Subtitle">
                    <Input
                      value={slide.subtitle}
                      onChange={(e) => {
                        const heroSlides = [...draft.heroSlides]
                        heroSlides[index] = { ...slide, subtitle: e.target.value }
                        onChange({ ...draft, heroSlides })
                      }}
                    />
                  </Field>
                  <Field label="CTA text">
                    <Input
                      value={slide.ctaText}
                      onChange={(e) => {
                        const heroSlides = [...draft.heroSlides]
                        heroSlides[index] = { ...slide, ctaText: e.target.value }
                        onChange({ ...draft, heroSlides })
                      }}
                    />
                  </Field>
                  <Field label="CTA link">
                    <Input
                      value={slide.ctaLink}
                      onChange={(e) => {
                        const heroSlides = [...draft.heroSlides]
                        heroSlides[index] = { ...slide, ctaLink: e.target.value }
                        onChange({ ...draft, heroSlides })
                      }}
                    />
                  </Field>
                </div>
                <SetupMediaField
                  label="Slide image"
                  url={slide.imageUrl}
                  publicId={slide.imagePublicId}
                  onChange={({ url, publicId }) => {
                    const heroSlides = [...draft.heroSlides]
                    heroSlides[index] = {
                      ...slide,
                      imageUrl: url,
                      imagePublicId: publicId,
                    }
                    onChange({ ...draft, heroSlides })
                  }}
                />
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-heading text-lg font-semibold">Differentiators</h3>
          <div className="mb-4 grid gap-4 md:grid-cols-3">
            <Field label="Eyebrow">
              <Input
                value={draft.home.differentiators.eyebrow}
                onChange={(e) =>
                  onChange({
                    ...draft,
                    home: {
                      ...draft.home,
                      differentiators: {
                        ...draft.home.differentiators,
                        eyebrow: e.target.value,
                      },
                    },
                  })
                }
              />
            </Field>
            <Field label="Title">
              <Input
                value={draft.home.differentiators.title}
                onChange={(e) =>
                  onChange({
                    ...draft,
                    home: {
                      ...draft.home,
                      differentiators: {
                        ...draft.home.differentiators,
                        title: e.target.value,
                      },
                    },
                  })
                }
              />
            </Field>
            <Field label="Accent word">
              <Input
                value={draft.home.differentiators.titleAccent}
                onChange={(e) =>
                  onChange({
                    ...draft,
                    home: {
                      ...draft.home,
                      differentiators: {
                        ...draft.home.differentiators,
                        titleAccent: e.target.value,
                      },
                    },
                  })
                }
              />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {draft.home.differentiators.items.map((item, index) => (
              <Card key={`${item.title}-${index}`} className="space-y-3 p-4">
                <Field label="Title">
                  <Input
                    value={item.title}
                    onChange={(e) => {
                      const items = [...draft.home.differentiators.items]
                      items[index] = { ...item, title: e.target.value }
                      onChange({
                        ...draft,
                        home: {
                          ...draft.home,
                          differentiators: { ...draft.home.differentiators, items },
                        },
                      })
                    }}
                  />
                </Field>
                <Field label="Description">
                  <Textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const items = [...draft.home.differentiators.items]
                      items[index] = { ...item, description: e.target.value }
                      onChange({
                        ...draft,
                        home: {
                          ...draft.home,
                          differentiators: { ...draft.home.differentiators, items },
                        },
                      })
                    }}
                  />
                </Field>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (step === 'about') {
    return (
      <div className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Hero title">
            <Input
              value={draft.about.hero.title}
              onChange={(e) =>
                onChange({
                  ...draft,
                  about: {
                    ...draft.about,
                    hero: { ...draft.about.hero, title: e.target.value },
                  },
                })
              }
            />
          </Field>
          <Field label="Hero subtitle">
            <Input
              value={draft.about.hero.subtitle}
              onChange={(e) =>
                onChange({
                  ...draft,
                  about: {
                    ...draft.about,
                    hero: { ...draft.about.hero, subtitle: e.target.value },
                  },
                })
              }
            />
          </Field>
        </div>
        <SetupMediaField
          label="About hero image"
          url={draft.about.hero.backgroundImage}
          onChange={({ url }) =>
            onChange({
              ...draft,
              about: {
                ...draft.about,
                hero: { ...draft.about.hero, backgroundImage: url },
              },
            })
          }
        />
        <Field label="Story title">
          <Input
            value={draft.about.story.title}
            onChange={(e) =>
              onChange({
                ...draft,
                about: {
                  ...draft.about,
                  story: { ...draft.about.story, title: e.target.value },
                },
              })
            }
          />
        </Field>
        <Field label="Our story">
          <Textarea
            rows={5}
            value={draft.about.story.content}
            onChange={(e) =>
              onChange({
                ...draft,
                about: {
                  ...draft.about,
                  story: { ...draft.about.story, content: e.target.value },
                },
              })
            }
          />
        </Field>
        <div>
          <h3 className="mb-3 font-heading text-lg font-semibold">Values</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {draft.about.values.map((value, index) => (
              <Card key={`${value.title}-${index}`} className="space-y-3 p-4">
                <Field label="Title">
                  <Input
                    value={value.title}
                    onChange={(e) => {
                      const values = [...draft.about.values]
                      values[index] = { ...value, title: e.target.value }
                      onChange({ ...draft, about: { ...draft.about, values } })
                    }}
                  />
                </Field>
                <Field label="Description">
                  <Textarea
                    rows={2}
                    value={value.description}
                    onChange={(e) => {
                      const values = [...draft.about.values]
                      values[index] = { ...value, description: e.target.value }
                      onChange({ ...draft, about: { ...draft.about, values } })
                    }}
                  />
                </Field>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (step === 'tours') {
    return (
      <div className="space-y-8">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold">Categories</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                onChange({
                  ...draft,
                  tourCategories: [
                    ...draft.tourCategories,
                    {
                      id: newId('cat'),
                      name: '',
                      slug: '',
                      description: '',
                      sort_order: draft.tourCategories.length,
                      is_active: true,
                    },
                  ],
                })
              }
            >
              <Plus className="size-4" />
              Add category
            </Button>
          </div>
          <div className="space-y-3">
            {draft.tourCategories.map((cat, index) => (
              <div key={cat.id} className="grid gap-3 rounded-xl border p-3 md:grid-cols-[1fr_1fr_auto]">
                <Input
                  placeholder="Category name"
                  value={cat.name}
                  onChange={(e) => {
                    const tourCategories = [...draft.tourCategories]
                    const name = e.target.value
                    tourCategories[index] = {
                      ...cat,
                      name,
                      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    }
                    onChange({ ...draft, tourCategories })
                  }}
                />
                <Input
                  placeholder="Description"
                  value={cat.description}
                  onChange={(e) => {
                    const tourCategories = [...draft.tourCategories]
                    tourCategories[index] = { ...cat, description: e.target.value }
                    onChange({ ...draft, tourCategories })
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={draft.tourCategories.length <= 1}
                  onClick={() =>
                    onChange({
                      ...draft,
                      tourCategories: draft.tourCategories.filter((c) => c.id !== cat.id),
                    })
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold">Tours</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                onChange({
                  ...draft,
                  tours: [
                    ...draft.tours,
                    {
                      setupId: newId('tour'),
                      title: '',
                      slug: '',
                      tagline: '',
                      description: '',
                      category: draft.tourCategories[0]?.slug || 'international',
                      duration: 7,
                      price: 0,
                      difficultyLevel: 'easy',
                      heroImageUrl: '',
                      thumbnailUrl: '',
                      isFeatured: true,
                      showPrice: true,
                    },
                  ],
                })
              }
            >
              <Plus className="size-4" />
              Add tour
            </Button>
          </div>
          <div className="space-y-4">
            {draft.tours.map((tour, index) => (
              <Card key={tour.setupId} className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Tour {index + 1}</p>
                  {draft.tours.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        onChange({
                          ...draft,
                          tours: draft.tours.filter((t) => t.setupId !== tour.setupId),
                        })
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Title">
                    <Input
                      value={tour.title}
                      onChange={(e) => {
                        const tours = [...draft.tours]
                        const title = e.target.value
                        tours[index] = {
                          ...tour,
                          title,
                          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                        }
                        onChange({ ...draft, tours })
                      }}
                    />
                  </Field>
                  <Field label="Category">
                    <select
                      className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                      value={tour.category}
                      onChange={(e) => {
                        const tours = [...draft.tours]
                        tours[index] = { ...tour, category: e.target.value }
                        onChange({ ...draft, tours })
                      }}
                    >
                      {draft.tourCategories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.name || cat.slug}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Tagline">
                    <Input
                      value={tour.tagline}
                      onChange={(e) => {
                        const tours = [...draft.tours]
                        tours[index] = { ...tour, tagline: e.target.value }
                        onChange({ ...draft, tours })
                      }}
                    />
                  </Field>
                  <Field label="Duration (days)">
                    <Input
                      type="number"
                      min={1}
                      value={tour.duration}
                      onChange={(e) => {
                        const tours = [...draft.tours]
                        tours[index] = { ...tour, duration: Number(e.target.value) || 1 }
                        onChange({ ...draft, tours })
                      }}
                    />
                  </Field>
                  <Field label="Price (USD)">
                    <Input
                      type="number"
                      min={0}
                      value={tour.price}
                      onChange={(e) => {
                        const tours = [...draft.tours]
                        tours[index] = { ...tour, price: Number(e.target.value) || 0 }
                        onChange({ ...draft, tours })
                      }}
                    />
                  </Field>
                  <Field label="Difficulty">
                    <select
                      className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                      value={tour.difficultyLevel}
                      onChange={(e) => {
                        const tours = [...draft.tours]
                        tours[index] = { ...tour, difficultyLevel: e.target.value }
                        onChange({ ...draft, tours })
                      }}
                    >
                      <option value="easy">Easy</option>
                      <option value="moderate">Moderate</option>
                      <option value="challenging">Challenging</option>
                    </select>
                  </Field>
                </div>
                <Field label="Description">
                  <Textarea
                    rows={3}
                    value={tour.description}
                    onChange={(e) => {
                      const tours = [...draft.tours]
                      tours[index] = { ...tour, description: e.target.value }
                      onChange({ ...draft, tours })
                    }}
                  />
                </Field>
                <SetupMediaField
                  label="Tour image"
                  url={tour.heroImageUrl}
                  onChange={({ url }) => {
                    const tours = [...draft.tours]
                    tours[index] = {
                      ...tour,
                      heroImageUrl: url,
                      thumbnailUrl: url,
                    }
                    onChange({ ...draft, tours })
                  }}
                />
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (step === 'blog') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold">Blog posts</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({
                ...draft,
                blogPosts: [
                  ...draft.blogPosts,
                  {
                    setupId: newId('blog'),
                    title: '',
                    slug: '',
                    excerpt: '',
                    content: '',
                    category: 'Travel Tips',
                    featuredImageUrl: '',
                    featuredImagePublicId: '',
                    authorName: draft.identity.siteName,
                  },
                ],
              })
            }
          >
            <Plus className="size-4" />
            Add post
          </Button>
        </div>
        {draft.blogPosts.map((post, index) => (
          <Card key={post.setupId} className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">Post {index + 1}</p>
              {draft.blogPosts.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onChange({
                      ...draft,
                      blogPosts: draft.blogPosts.filter((p) => p.setupId !== post.setupId),
                    })
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title">
                <Input
                  value={post.title}
                  onChange={(e) => {
                    const blogPosts = [...draft.blogPosts]
                    const title = e.target.value
                    blogPosts[index] = {
                      ...post,
                      title,
                      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    }
                    onChange({ ...draft, blogPosts })
                  }}
                />
              </Field>
              <Field label="Category">
                <Input
                  value={post.category}
                  onChange={(e) => {
                    const blogPosts = [...draft.blogPosts]
                    blogPosts[index] = { ...post, category: e.target.value }
                    onChange({ ...draft, blogPosts })
                  }}
                />
              </Field>
            </div>
            <Field label="Excerpt">
              <Textarea
                rows={2}
                value={post.excerpt}
                onChange={(e) => {
                  const blogPosts = [...draft.blogPosts]
                  blogPosts[index] = { ...post, excerpt: e.target.value }
                  onChange({ ...draft, blogPosts })
                }}
              />
            </Field>
            <Field label="Content">
              <Textarea
                rows={6}
                value={post.content}
                onChange={(e) => {
                  const blogPosts = [...draft.blogPosts]
                  blogPosts[index] = { ...post, content: e.target.value }
                  onChange({ ...draft, blogPosts })
                }}
              />
            </Field>
            <SetupMediaField
              label="Featured image"
              url={post.featuredImageUrl}
              publicId={post.featuredImagePublicId}
              onChange={({ url, publicId }) => {
                const blogPosts = [...draft.blogPosts]
                blogPosts[index] = {
                  ...post,
                  featuredImageUrl: url,
                  featuredImagePublicId: publicId,
                }
                onChange({ ...draft, blogPosts })
              }}
            />
          </Card>
        ))}
      </div>
    )
  }

  if (step === 'faqs') {
    return (
      <div className="space-y-8">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold">FAQs</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                onChange({
                  ...draft,
                  faqs: [
                    ...draft.faqs,
                    {
                      setupId: newId('faq'),
                      question: '',
                      answer: '',
                      category: 'General',
                    },
                  ],
                })
              }
            >
              <Plus className="size-4" />
              Add FAQ
            </Button>
          </div>
          <div className="space-y-4">
            {draft.faqs.map((faq, index) => (
              <Card key={faq.setupId} className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">FAQ {index + 1}</p>
                  {draft.faqs.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        onChange({
                          ...draft,
                          faqs: draft.faqs.filter((f) => f.setupId !== faq.setupId),
                        })
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
                <Field label="Question">
                  <Input
                    value={faq.question}
                    onChange={(e) => {
                      const faqs = [...draft.faqs]
                      faqs[index] = { ...faq, question: e.target.value }
                      onChange({ ...draft, faqs })
                    }}
                  />
                </Field>
                <Field label="Answer">
                  <Textarea
                    rows={3}
                    value={faq.answer}
                    onChange={(e) => {
                      const faqs = [...draft.faqs]
                      faqs[index] = { ...faq, answer: e.target.value }
                      onChange({ ...draft, faqs })
                    }}
                  />
                </Field>
              </Card>
            ))}
          </div>
        </div>

        <Card className="space-y-4 p-4">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={draft.inviteAdmin.enabled}
              onChange={(e) =>
                onChange({
                  ...draft,
                  inviteAdmin: { ...draft.inviteAdmin, enabled: e.target.checked },
                })
              }
            />
            Invite a second admin (optional)
          </label>
          {draft.inviteAdmin.enabled && (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Name">
                <Input
                  value={draft.inviteAdmin.name}
                  onChange={(e) =>
                    onChange({
                      ...draft,
                      inviteAdmin: { ...draft.inviteAdmin, name: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  value={draft.inviteAdmin.email}
                  onChange={(e) =>
                    onChange({
                      ...draft,
                      inviteAdmin: { ...draft.inviteAdmin, email: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Temporary password">
                <Input
                  type="password"
                  value={draft.inviteAdmin.password}
                  onChange={(e) =>
                    onChange({
                      ...draft,
                      inviteAdmin: { ...draft.inviteAdmin, password: e.target.value },
                    })
                  }
                />
              </Field>
              <Field label="Role">
                <select
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                  value={draft.inviteAdmin.role}
                  onChange={(e) =>
                    onChange({
                      ...draft,
                      inviteAdmin: {
                        ...draft.inviteAdmin,
                        role: e.target.value as 'admin' | 'editor' | 'viewer',
                      },
                    })
                  }
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </Field>
            </div>
          )}
        </Card>
      </div>
    )
  }

  // review
  return (
    <div className="space-y-4 text-sm">
      <p className="text-muted-foreground">
        Nothing is live yet. Review the checklist on the right, then publish when every required
        section is complete.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="p-4">
          <p className="font-medium">{draft.identity.siteName}</p>
          <p className="text-muted-foreground">{draft.identity.siteTagline}</p>
        </Card>
        <Card className="p-4">
          <p className="font-medium">Template</p>
          <p className="capitalize text-muted-foreground">{draft.template}</p>
        </Card>
        <Card className="p-4">
          <p className="font-medium">{draft.heroSlides.length} hero slides</p>
          <p className="text-muted-foreground">{draft.tours.length} tours drafted</p>
        </Card>
        <Card className="p-4">
          <p className="font-medium">{draft.blogPosts.length} blog posts</p>
          <p className="text-muted-foreground">{draft.faqs.length} FAQs</p>
        </Card>
      </div>
    </div>
  )
}
