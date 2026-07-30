'use client';

import { ScrollReveal } from '@/components/ui/scroll-reveal';
import {
  Heart,
  Shield,
  Mountain,
  Clock,
  Users,
  Compass,
  Star,
  Globe,
  type LucideIcon,
} from 'lucide-react';
import type { HomeContent } from '@/lib/content/home';
import { HOME_DEFAULTS } from '@/lib/content/home';
import type { SiteTemplateId } from '@/lib/template-config';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, LucideIcon> = {
  Heart,
  Shield,
  Mountain,
  Clock,
  Users,
  Compass,
  Star,
  Globe,
};

export function DifferentiatorsSection({
  content,
  variant = 'aurora',
}: {
  content?: HomeContent['differentiators'];
  variant?: SiteTemplateId;
}) {
  const section = content || HOME_DEFAULTS.differentiators;

  const heading = (
    <ScrollReveal>
      <div
        className={cn(
          'mb-16 md:mb-20',
          variant === 'aurora' ? 'max-w-2xl' : 'mx-auto max-w-3xl text-center'
        )}
      >
        <p
          className={cn(
            'mb-3 text-sm font-medium uppercase text-primary',
            variant === 'editorial' ? 'tracking-[0.28em]' : 'tracking-widest'
          )}
        >
          {section.eyebrow}
        </p>
        <h2
          className={cn(
            'text-4xl tracking-tight md:text-5xl',
            variant === 'aurora' ? 'font-heading font-bold' : 'font-accent'
          )}
        >
          {section.title}{' '}
          <span className="font-accent text-primary italic">{section.titleAccent}</span>
        </h2>
      </div>
    </ScrollReveal>
  );

  if (variant === 'editorial') {
    return (
      <section className="bg-muted py-20 md:py-28">
        <div className="container">
          {heading}
          <div className="mx-auto grid max-w-5xl gap-x-16 gap-y-12 md:grid-cols-2">
            {section.items.map((item, index) => (
              <ScrollReveal key={`${item.title}-${index}`} direction="up" delay={index * 0.05}>
                <div className="border-t border-border pt-8">
                  <span className="font-accent text-3xl text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-accent mt-4 text-2xl leading-snug">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'immersive') {
    return (
      <section className="bg-background py-20 md:py-28">
        <div className="container">
          {heading}
          <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {section.items.map((item, index) => {
              const Icon = ICON_MAP[item.icon] || Star;
              return (
                <ScrollReveal key={`${item.title}-${index}`} direction="up" delay={index * 0.04}>
                  <div className="group h-full rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary/60">
                    <div className="mb-6 flex size-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <h3 className="font-heading mb-3 text-lg font-semibold transition-colors group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container">
        {heading}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {section.items.map((item, index) => {
            const Icon = ICON_MAP[item.icon] || Star;
            return (
              <ScrollReveal key={`${item.title}-${index}`} direction="up" delay={index * 0.04}>
                <div className="group h-full border-t-4 border-primary bg-card p-7 shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-6 text-primary" />
                    </span>
                    <span className="font-heading text-3xl font-bold text-foreground/10">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="font-heading mb-3 text-lg font-semibold transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
