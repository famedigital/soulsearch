'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCompanyBrand } from '@/hooks/use-company-brand';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_public_id: string;
  image_url: string;
  mobile_image_public_id?: string | null;
  mobile_image_url?: string | null;
  cta_text?: string | null;
  cta_link?: string | null;
  slide_order: number;
  is_active: boolean;
}

const optimizeImageUrl = (url: string) => url;

interface HeroSlideshowProps {
  slides?: HeroSlide[];
  autoPlay?: boolean;
  interval?: number;
}

function HeroContent({
  headline,
  tagline,
  ctaText,
  ctaLink,
  brandName,
}: {
  headline: string;
  tagline: string;
  ctaText: string;
  ctaLink: string;
  brandName: string;
}) {
  return (
    <div className="max-w-2xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-2"
      >
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
          {brandName}
        </p>
        <h1 className="font-accent text-4xl font-medium tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.5rem] lg:leading-[1.1]">
          {headline}
        </h1>
      </motion.div>

      {tagline && (
        <motion.p
          className="max-w-lg text-base leading-relaxed text-white/80 sm:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08, duration: 0.3 }}
        >
          {tagline}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12, duration: 0.3 }}
        className="flex flex-wrap gap-3"
      >
        <Link
          href={ctaLink}
          className={cn(
            buttonVariants({ size: 'lg' }),
            'h-11 gap-2 bg-primary px-6 text-primary-foreground hover:bg-primary/90'
          )}
        >
          {ctaText}
          <ArrowRight className="size-4" />
        </Link>
        <Link
          href="/contact"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'lg' }),
            'h-11 border-white/30 bg-white/10 px-6 text-white hover:bg-white/15 hover:text-white'
          )}
        >
          Get a Quote
        </Link>
      </motion.div>
    </div>
  );
}

export function HeroSlideshow({
  slides = [],
  autoPlay = true,
  interval = 6000,
}: HeroSlideshowProps) {
  const brand = useCompanyBrand();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  const activeSlides = slides.length > 0 ? slides : [];

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!autoPlay || activeSlides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, activeSlides.length]);

  const currentSlide = activeSlides[currentIndex];

  if (!currentSlide) {
    return (
      <section className="relative h-[100svh] min-h-[32rem] w-full overflow-hidden bg-secondary">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/90 to-black" />
        <div className="relative z-10 flex h-full items-end pb-28 pt-24 lg:items-center lg:pb-0 lg:pt-20">
          <div className="container">
            <HeroContent
              headline="Discover Bhutan"
              tagline="The Last Shangri-La awaits — curated journeys through the Himalayas."
              ctaText="Explore Tours"
              ctaLink="/tours"
              brandName={brand.name}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[100svh] min-h-[32rem] w-full overflow-hidden bg-secondary">
      <div className="absolute inset-0">
        {activeSlides.map((slide, index) => (
          <motion.div
            key={slide.id}
            initial={false}
            animate={{ opacity: index === currentIndex ? 1 : 0 }}
            transition={hasMounted ? { duration: 1.2, ease: 'easeInOut' } : { duration: 0 }}
            className="absolute inset-0"
          >
            <img
              src={optimizeImageUrl(slide.image_url)}
              alt={slide.title}
              className="h-full w-full object-cover object-top"
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/25" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex h-full items-end pb-28 pt-24 lg:items-center lg:pb-0 lg:pt-20">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <HeroContent
                headline={currentSlide.title}
                tagline={currentSlide.subtitle || currentSlide.description}
                ctaText={currentSlide.cta_text || 'Explore Tours'}
                ctaLink={currentSlide.cta_link || '/tours'}
                brandName={brand.name}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {activeSlides.length > 1 && (
        <div className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 gap-2 lg:bottom-10">
          {activeSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'h-1 rounded-full transition-all',
                index === currentIndex ? 'w-8 bg-white' : 'w-4 bg-white/35 hover:bg-white/60'
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
