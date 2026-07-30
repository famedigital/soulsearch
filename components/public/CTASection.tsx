'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80"
          alt="Punakha Dzong"
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/45 to-black/35" />
      </div>

      <div className="container relative z-10 px-6 text-center">
        <motion.div
          className="mx-auto max-w-3xl"
          initial={{ opacity: 0.01, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15, margin: '80px 0px' }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-accent mb-5 text-4xl font-medium leading-tight text-white md:text-5xl lg:text-6xl">
            Ready to explore Bhutan?
          </h2>

          <p className="mb-10 text-lg leading-relaxed text-white/85 md:text-xl">
            With 15+ years crafting journeys through the Land of the Thunder Dragon,
            we&apos;ll create your transformational Himalayan experience.
          </p>

          <Link
            href="/contact"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'inline-flex h-11 gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90'
            )}
          >
            Start Your Journey
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
