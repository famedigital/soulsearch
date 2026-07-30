'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCompanyBrand } from '@/hooks/use-company-brand'
import { useSlideshow } from '@/components/public/home/use-slideshow'
import type { HeroLayoutProps } from '@/components/public/home/types'

const FALLBACK = {
  title: 'Discover Bhutan',
  subtitle: 'The Last Shangri-La awaits — curated journeys through the Himalayas.',
  cta_text: 'Explore Tours',
  cta_link: '/tours',
}

/**
 * Aurora hero — a solid colour panel sits beside the photography so the
 * headline stays legible regardless of which slide is showing.
 */
export function HeroAurora({ slides = [], autoPlay = true, interval = 6000 }: HeroLayoutProps) {
  const brand = useCompanyBrand()
  const { index, setIndex, hasMounted } = useSlideshow(slides.length, autoPlay, interval)
  const slide = slides[index]

  const title = slide?.title || FALLBACK.title
  const tagline = slide?.subtitle || slide?.description || FALLBACK.subtitle
  const ctaText = slide?.cta_text || FALLBACK.cta_text
  const ctaLink = slide?.cta_link || FALLBACK.cta_link

  return (
    <section className="grid min-h-[38rem] pt-16 lg:min-h-[100svh] lg:grid-cols-2 xl:pt-[4.5rem]">
      <div className="order-2 flex items-center bg-secondary px-6 py-14 text-secondary-foreground sm:px-10 lg:order-1 lg:px-14 xl:px-20">
        <div className="w-full max-w-xl">
          <p className="mb-4 text-xs font-medium tracking-[0.28em] uppercase text-secondary-foreground/70">
            {brand.name}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">
                {title}
              </h1>
              {tagline && (
                <p className="mt-5 max-w-md text-base leading-relaxed text-secondary-foreground/80 sm:text-lg">
                  {tagline}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={ctaLink} className={cn(buttonVariants({ size: 'lg' }), 'h-12 gap-2 px-7')}>
              {ctaText}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contact#contact-form"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'h-12 border-secondary-foreground/30 bg-transparent px-7 text-secondary-foreground hover:bg-secondary-foreground/10 hover:text-secondary-foreground'
              )}
            >
              Get a Quote
            </Link>
          </div>

          {slides.length > 1 && (
            <div className="mt-12 flex items-center gap-3">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    i === index
                      ? 'w-10 bg-secondary-foreground'
                      : 'w-4 bg-secondary-foreground/30 hover:bg-secondary-foreground/60'
                  )}
                />
              ))}
              <span className="ml-2 text-xs tracking-widest text-secondary-foreground/60">
                {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="relative order-1 min-h-[16rem] overflow-hidden bg-muted lg:order-2 lg:min-h-full">
        {slides.length > 0 ? (
          slides.map((s, i) => (
            <motion.img
              key={s.id}
              src={s.image_url}
              alt={s.title}
              initial={false}
              animate={{ opacity: i === index ? 1 : 0 }}
              transition={hasMounted ? { duration: 0.9, ease: 'easeInOut' } : { duration: 0 }}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ))
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/25 to-secondary/40" />
        )}
      </div>
    </section>
  )
}
