'use client';

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, MapPin } from 'lucide-react';
import { FooterContact } from '@/components/public/FooterContact';
import { FooterSocial } from '@/components/public/FooterSocial';
import { useCompanyBrand } from '@/hooks/use-company-brand';
import { useSiteTemplate } from '@/components/providers/TemplateProvider';
import { BrandMark } from '@/components/public/BrandMark';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SiteTemplateId } from '@/lib/template-config';

const footerLinks = {
  explore: [
    { name: 'Tours', href: '/tours' },
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
  tours: [
    { name: 'Cultural Tours', href: '/tours?category=cultural' },
    { name: 'Trekking', href: '/tours?category=trekking' },
    { name: 'Festival Tours', href: '/tours?category=festival' },
    { name: 'Custom Tours', href: '/tours?category=custom' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Story', href: '/about#story' },
    { name: 'Team', href: '/about#team' },
    { name: 'Careers', href: '/contact' },
  ],
  support: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Travel Info', href: '/travel-info' },
    { name: 'Booking Policy', href: '/policy' },
    { name: 'Terms & Conditions', href: '/terms' },
  ],
};

const flatLinks = [
  { name: 'Tours', href: '/tours' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Travel Info', href: '/travel-info' },
];

const linkColumns = [
  ['Explore', footerLinks.explore],
  ['Tours', footerLinks.tours],
  ['Company', footerLinks.company],
  ['Support', footerLinks.support],
] as const;

export function Footer({ variant: variantOverride }: { variant?: SiteTemplateId } = {}) {
  const template = useSiteTemplate();
  const variant = variantOverride ?? template;
  const brand = useCompanyBrand();
  const year = new Date().getFullYear();

  const credit = (
    <a
      href="https://innovates.bt"
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs opacity-50 transition-opacity hover:opacity-90"
    >
      Designed by innovates.bt
    </a>
  );

  const legal = (
    <div className="flex gap-6 text-xs md:text-sm">
      <Link href="/privacy" className="opacity-60 transition-opacity hover:opacity-100">
        Privacy Policy
      </Link>
      <Link href="/terms" className="opacity-60 transition-opacity hover:opacity-100">
        Terms of Service
      </Link>
    </div>
  );

  const mapLink = (
    <a
      href="https://maps.app.goo.gl/augGCB49iedQwe398"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 opacity-60 transition-opacity hover:opacity-100"
    >
      <MapPin className="h-4 w-4" />
      Thimphu, Bhutan
    </a>
  );

  if (variant === 'editorial') {
    return (
      <footer className="border-t border-border bg-background text-foreground">
        <div className="container py-16 text-center md:py-20">
          <Link href="/" className="inline-block">
            {brand.logo ? (
              <img
                src={brand.logo}
                alt={brand.name}
                className="mx-auto h-14 w-auto max-w-[14rem] object-contain"
              />
            ) : (
              <span className="font-accent text-3xl tracking-[0.2em] uppercase md:text-4xl">
                {brand.name}
              </span>
            )}
          </Link>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Personalised journeys through the Land of the Thunder Dragon — cultural immersion,
            Himalayan landscapes, and guides who know every valley.
          </p>

          <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {flatLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground transition-colors hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-10 flex justify-center">
            <FooterSocial />
          </div>

          <Separator className="my-10" />

          <div className="flex flex-col items-center gap-4 text-xs text-muted-foreground md:text-sm">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <FooterContact />
              {mapLink}
            </div>
            {legal}
            <p className="opacity-70">
              © {year} {brand.name}. All rights reserved.
            </p>
            {credit}
          </div>
        </div>
      </footer>
    );
  }

  if (variant === 'immersive') {
    return (
      <footer className="bg-foreground text-background">
        <div className="container border-b border-background/15 py-14 md:py-20">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <h2 className="font-accent max-w-xl text-3xl leading-tight md:text-5xl">
              Ready to see Bhutan the way it deserves to be seen?
            </h2>
            <Link
              href="/contact#contact-form"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'shrink-0 gap-2 rounded-full bg-background px-7 text-foreground hover:bg-background/90'
              )}
            >
              Plan your journey
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="container py-14 md:py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <Link href="/" className="inline-block">
                <BrandMark
                  name={brand.name}
                  tagline={brand.tagline}
                  logo={brand.logo}
                  variant="immersive"
                  tone="light"
                  showTagline={!brand.logo}
                  showName={!brand.logo}
                />
              </Link>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-background/70">
                Experience authentic Bhutan with {brand.name}. We craft personalised journeys
                combining cultural immersion with breathtaking natural beauty.
              </p>
              <div className="mt-6">
                <FooterSocial />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {linkColumns.map(([title, links]) => (
                <div key={title}>
                  <h3 className="font-heading mb-4 text-xs font-semibold tracking-[0.18em] uppercase text-background/50">
                    {title}
                  </h3>
                  <ul className="space-y-2.5">
                    {links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-background/75 transition-colors hover:text-primary"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-10 bg-background/15" />

          <div className="flex flex-col items-center justify-between gap-4 text-xs md:text-sm lg:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <p className="opacity-50">
                © {year} {brand.name}. All rights reserved.
              </p>
              <FooterContact />
              {mapLink}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {legal}
              {credit}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t-2 border-primary/70 bg-muted text-foreground">
      <div className="container py-14 md:py-16">
        <p className="font-heading mb-10 text-4xl font-bold tracking-tight text-foreground/10 md:text-6xl lg:text-7xl">
          {brand.name}
        </p>

        <div className="mb-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <Link href="/" className="inline-block">
              <BrandMark
                name={brand.name}
                tagline={brand.tagline}
                logo={brand.logo}
                variant="aurora"
                tone="dark"
                showTagline={!brand.logo}
                showName={!brand.logo}
              />
            </Link>
            <p className="mt-6 mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Experience authentic Bhutan with {brand.name}. We craft personalised journeys through
              the Land of the Thunder Dragon, combining cultural immersion with breathtaking
              natural beauty.
            </p>
            <FooterSocial />
          </div>

          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {linkColumns.map(([title, links]) => (
              <div key={title}>
                <h3 className="font-heading mb-4 text-sm font-semibold tracking-wide text-foreground">
                  {title}
                </h3>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground md:text-sm lg:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <p className="opacity-70">
              © {year} {brand.name}. All rights reserved.
            </p>
            <FooterContact />
            {mapLink}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {legal}
            {credit}
          </div>
        </div>
      </div>
    </footer>
  );
}
