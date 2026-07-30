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
 * Immersive hero — full-bleed photography with the copy anchored to the bottom
 * left and a thumbnail rail for jumping between slides.
 */
export function HeroImmersive({ slides = [], autoPlay = true, interval = 6000 }: HeroLayoutProps) {
  const brand = useCompanyBrand()
  const { index, setIndex, hasMounted } = useSlideshow(slides.length, autoPlay, interval)
  const slide = slides[index]

  const title = slide?.title || FALLBACK.title
  const tagline = slide?.subtitle || slide?.description || FALLBACK.subtitle
  const ctaText = slide?.cta_text || FALLBACK.cta_text
  const ctaLink = slide?.cta_link || FALLBACK.cta_link

  return (
    <section className="relative h-[100svh] min-h-[34rem] w-full overflow-hidden bg-foreground">
      <div className="absolute inset-0">
        {slides.length > 0 ? (
          slides.map((s, i) => (
            <motion.div
              key={s.id}
              initial={false}
              animate={{ opacity: i === index ? 1 : 0, scale: i === index ? 1 : 1.04 }}
              transition={hasMounted ? { duration: 1.2, ease: 'easeInOut' } : { duration: 0 }}
              className="absolute inset-0"
            >
              <img
                src={s.image_url}
                alt={s.title}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'auto'}
                className="h-full w-full object-cover object-top"
              />
            </motion.div>
          ))
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/80 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/40" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-end pb-28 lg:pb-16">
        <div className="container">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-4 text-xs font-medium tracking-[0.3em] uppercase text-white/60">
                {brand.name}
              </p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="font-accent text-4xl leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                    {title}
                  </h1>
                  {tagline && (
                    <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
                      {tagline}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href={ctaLink}
                  className={cn(buttonVariants({ size: 'lg' }), 'h-12 gap-2 rounded-full px-7')}
                >
                  {ctaText}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/contact#contact-form"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'h-12 rounded-full border-white/30 bg-white/10 px-7 text-white hover:bg-white/20 hover:text-white'
                  )}
                >
                  Get a Quote
                </Link>
              </div>
            </div>

            {slides.length > 1 && (
              <div className="hidden shrink-0 items-end gap-4 lg:flex">
                <span className="pb-1 text-xs tracking-[0.25em] text-white/60">
                  {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </span>
                <div className="flex gap-3">
                  {slides.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className={cn(
                        'h-16 w-24 overflow-hidden rounded-md border-2 transition-all',
                        i === index
                          ? 'border-white opacity-100'
                          : 'border-white/25 opacity-55 hover:opacity-85'
                      )}
                    >
                      <img
                        src={s.image_url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover object-top"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {slides.length > 1 && (
            <div className="mt-8 flex gap-2 lg:hidden">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    'h-1 rounded-full transition-all',
                    i === index ? 'w-8 bg-white' : 'w-4 bg-white/35'
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
