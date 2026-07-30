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
}: {
  content?: HomeContent['differentiators'];
}) {
  const section = content || HOME_DEFAULTS.differentiators;

  return (
    <>
      <ScrollReveal>
        <div className="mb-16 text-center md:mb-20">
          <p className="mb-3 text-sm font-medium tracking-widest text-primary uppercase">
            {section.eyebrow}
          </p>
          <h2 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">
            {section.title}{' '}
            <span className="font-accent text-primary italic">{section.titleAccent}</span>
          </h2>
        </div>
      </ScrollReveal>

      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        {section.items.map((item, index) => {
          const Icon = ICON_MAP[item.icon] || Star;
          return (
            <ScrollReveal key={`${item.title}-${index}`} direction="up" delay={index * 0.04}>
              <div className="group text-center transition-transform duration-200 hover:-translate-y-1">
                <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="size-7 text-primary" />
                </div>
                <h3 className="font-heading mb-3 text-lg font-semibold transition-colors group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </>
  );
}
