'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, TrendingUp } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { TourCard } from '@/components/public/TourCard'
import { formatTourPrice, isTourPriceVisible } from '@/lib/tour-options'
import { normalizeCategoryKey } from '@/lib/tour-category'
import { cn } from '@/lib/utils'
import type { HomeContent } from '@/lib/content/home'
import type { SiteTemplateId } from '@/lib/template-config'

type Tour = Record<string, any>

function tourImage(tour: Tour): string {
  return (
    tour.hero_image_url ||
    tour.hero_image ||
    tour.thumbnail_url ||
    tour.thumbnail ||
    '/placeholder.jpg'
  )
}

function categoryLabel(tour: Tour): string {
  const key = normalizeCategoryKey(tour.category) || 'tour'
  if (key === 'international') return 'International'
  if (key === 'regional') return 'Regional'
  return tour.category || 'Tour'
}

function priceLabel(tour: Tour): string {
  return isTourPriceVisible(tour)
    ? formatTourPrice(tour.price || 0, tour.category)
    : 'Contact for price'
}

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <p className="text-lg text-muted-foreground">No featured tours available at the moment.</p>
      <Link href="/tours" className={cn(buttonVariants({ variant: 'outline' }), 'mt-6')}>
        View All Tours
      </Link>
    </div>
  )
}

function EditorialRow({ tour, index }: { tour: Tour; index: number }) {
  const flipped = index % 2 === 1

  return (
    <motion.article
      initial={{ opacity: 0.01, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="grid items-center gap-8 border-t border-border py-10 md:grid-cols-2 md:gap-14 md:py-14"
    >
      <Link
        href={`/tours/${tour.slug}`}
        className={cn('group block overflow-hidden bg-muted', flipped && 'md:order-2')}
      >
        <img
          src={tourImage(tour)}
          alt={tour.title}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </Link>

      <div className={cn(flipped && 'md:order-1')}>
        <p className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
          {String(index + 1).padStart(2, '0')} — {categoryLabel(tour)}
        </p>
        <h3 className="font-accent mt-4 text-2xl leading-tight text-foreground md:text-4xl">
          <Link href={`/tours/${tour.slug}`} className="transition-colors hover:text-primary">
            {tour.title}
          </Link>
        </h3>
        {(tour.tagline || tour.description) && (
          <p className="mt-4 line-clamp-3 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
            {tour.tagline || tour.description}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4 text-accent" />
            {tour.duration || 0} days
          </span>
          <span className="inline-flex items-center gap-1.5 capitalize">
            <TrendingUp className="size-4 text-accent" />
            {tour.difficulty_level || tour.difficulty || 'easy'}
          </span>
          <span className="font-medium text-primary">{priceLabel(tour)}</span>
        </div>

        <Link
          href={`/tours/${tour.slug}`}
          className="mt-7 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-foreground transition-colors hover:text-primary"
        >
          View journey
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </motion.article>
  )
}

function RailCard({ tour }: { tour: Tour }) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group relative block aspect-[3/4] w-[17rem] shrink-0 snap-start overflow-hidden rounded-xl bg-muted sm:w-[20rem]"
    >
      <img
        src={tourImage(tour)}
        alt={tour.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-[10px] tracking-[0.22em] uppercase text-white/65">
          {categoryLabel(tour)}
        </p>
        <h3 className="font-accent mt-2 line-clamp-2 text-xl leading-snug text-white">
          {tour.title}
        </h3>
        <div className="mt-3 flex items-center gap-4 text-[11px] text-white/70">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {tour.duration || 0}d
          </span>
          <span className="font-medium text-white">{priceLabel(tour)}</span>
        </div>
      </div>
    </Link>
  )
}

export function FeaturedTours({
  tours,
  content,
  variant,
}: {
  tours: Tour[]
  content: HomeContent['featured']
  variant: SiteTemplateId
}) {
  const heading = (
    <ScrollReveal>
      <div
        className={cn(
          'mb-14 md:mb-16',
          variant === 'editorial' ? 'max-w-3xl text-center md:mx-auto' : 'max-w-2xl'
        )}
      >
        <p
          className={cn(
            'mb-3 text-sm font-medium uppercase',
            variant === 'editorial'
              ? 'tracking-[0.28em] text-muted-foreground'
              : 'tracking-[0.2em] text-primary'
          )}
        >
          {content.eyebrow}
        </p>
        <h2
          className={cn(
            'text-3xl tracking-tight md:text-4xl lg:text-5xl',
            variant === 'aurora'
              ? 'font-heading font-bold text-foreground'
              : variant === 'immersive'
                ? 'font-accent text-background'
                : 'font-accent text-foreground'
          )}
        >
          {content.title}
        </h2>
        <p
          className={cn(
            'mt-4 text-base leading-relaxed md:text-lg',
            variant === 'immersive' ? 'text-background/70' : 'text-muted-foreground'
          )}
        >
          {content.subtitle}
        </p>
      </div>
    </ScrollReveal>
  )

  if (variant === 'editorial') {
    return (
      <section className="bg-background py-20 md:py-28">
        <div className="container">
          {heading}
          {tours.length > 0 ? (
            <>
              <div className="border-b border-border">
                {tours.map((tour, index) => (
                  <EditorialRow key={tour.id} tour={tour} index={index} />
                ))}
              </div>
              <ScrollReveal direction="up" className="mt-14 text-center">
                <Link
                  href="/tours"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'inline-flex gap-2 rounded-none'
                  )}
                >
                  View All Tours
                  <ArrowRight className="size-4" />
                </Link>
              </ScrollReveal>
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    )
  }

  if (variant === 'immersive') {
    return (
      <section className="bg-foreground py-20 text-background md:py-28">
        <div className="container">{heading}</div>

        {tours.length > 0 ? (
          <>
            <div className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 sm:px-10 lg:px-[max(2rem,calc((100vw-1280px)/2+2rem))]">
              {tours.map((tour) => (
                <RailCard key={tour.id} tour={tour} />
              ))}
            </div>
            <div className="container mt-12 text-center">
              <Link
                href="/tours"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'inline-flex gap-2 rounded-full border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background'
                )}
              >
                View All Tours
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </>
        ) : (
          <div className="container">
            <EmptyState />
          </div>
        )}
      </section>
    )
  }

  return (
    <section className="bg-muted py-20 md:py-28">
      <div className="container">
        {heading}

        {tours.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8 lg:grid-cols-3">
              {tours.map((tour, index) => (
                <div key={tour.id} className={cn(index % 3 === 1 && 'lg:mt-14')}>
                  <TourCard tour={tour} index={index} />
                </div>
              ))}
            </div>

            <ScrollReveal direction="up" className="mt-14 text-center md:mt-16">
              <Link
                href="/tours"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'inline-flex gap-2')}
              >
                View All Tours
                <ArrowRight className="size-4" />
              </Link>
            </ScrollReveal>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  )
}
