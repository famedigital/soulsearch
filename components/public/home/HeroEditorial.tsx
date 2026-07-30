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
 * Editorial hero — the image is framed rather than full-bleed, with the
 * headline set over it and the supporting copy placed beneath as a caption.
 */
export function HeroEditorial({ slides = [], autoPlay = true, interval = 6000 }: HeroLayoutProps) {
  const brand = useCompanyBrand()
  const { index, setIndex, hasMounted } = useSlideshow(slides.length, autoPlay, interval)
  const slide = slides[index]

  const title = slide?.title || FALLBACK.title
  const tagline = slide?.subtitle || slide?.description || FALLBACK.subtitle
  const ctaText = slide?.cta_text || FALLBACK.cta_text
  const ctaLink = slide?.cta_link || FALLBACK.cta_link

  return (
    <section className="bg-background pt-16 xl:pt-[4.5rem]">
      <div className="container py-10 md:py-14">
        <div className="mb-8 flex flex-col items-center text-center">
          <p className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground">
            {brand.name} — Bhutan
          </p>
          <AnimatePresence mode="wait">
            <motion.h1
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="font-accent mt-5 max-w-4xl text-4xl leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              {title}
            </motion.h1>
          </AnimatePresence>
        </div>

        <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-muted md:aspect-[21/9]">
          {slides.length > 0 ? (
            slides.map((s, i) => (
              <motion.img
                key={s.id}
                src={s.image_url}
                alt={s.title}
                initial={false}
                animate={{ opacity: i === index ? 1 : 0 }}
                transition={hasMounted ? { duration: 1 , ease: 'easeInOut' } : { duration: 0 }}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'auto'}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            ))
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 via-accent/25 to-primary/30" />
          )}
        </div>

        <div className="mt-8 grid gap-6 border-t border-border pt-8 md:grid-cols-[1fr_auto] md:items-center">
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">{tagline}</p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={ctaLink}
              className={cn(buttonVariants({ size: 'lg' }), 'h-12 gap-2 rounded-none px-7')}
            >
              {ctaText}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contact#contact-form"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'h-12 rounded-none px-7'
              )}
            >
              Enquire
            </Link>
          </div>
        </div>

        {slides.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-6">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  'text-[11px] tracking-[0.22em] uppercase transition-colors',
                  i === index
                    ? 'text-foreground underline underline-offset-8'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
