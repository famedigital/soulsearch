'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Home, Compass, Users, Book, MessageCircle, ChevronDown } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCompanyBrand } from '@/hooks/use-company-brand';
import { useWhatsAppHref } from '@/hooks/use-whatsapp-link';
import { useSiteTemplate } from '@/components/providers/TemplateProvider';
import { BrandMark } from '@/components/public/BrandMark';
import type { SiteTemplateId } from '@/lib/template-config';

const baseNavLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About', href: '/about', icon: Users },
  { name: 'Blog', href: '/blog', icon: Book },
  { name: 'Contact', href: '/contact', icon: MessageCircle },
];

type TourCategory = { name: string; slug: string };

export function Navigation({
  forceSolid = false,
  variant: variantOverride,
}: {
  forceSolid?: boolean;
  variant?: SiteTemplateId;
}) {
  const pathname = usePathname();
  const template = useSiteTemplate();
  const variant = variantOverride ?? template;
  const brand = useCompanyBrand();
  const whatsappHref = useWhatsAppHref();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tourCategories, setTourCategories] = useState<TourCategory[]>([]);
  const [toursOpen, setToursOpen] = useState(false);
  const [mobileToursOpen, setMobileToursOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setScrolled(window.scrollY > 50);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/tour-categories')
      .then((r) => r.json())
      .then((data) => setTourCategories(data.categories || []))
      .catch(() =>
        setTourCategories([
          { name: 'International Tour', slug: 'international' },
          { name: 'Regional Tour', slug: 'regional' },
        ])
      );
  }, []);

  const isToursActive = pathname === '/tours' || pathname.startsWith('/tours');

  // Aurora and Editorial always sit on a solid bar; only Immersive floats over
  // a dark hero and swaps to a light pill once the page scrolls.
  const onLight = variant === 'immersive' ? forceSolid || !mounted || scrolled : true;

  const linkTone = (active?: boolean) =>
    onLight
      ? active
        ? 'text-primary'
        : 'text-foreground/75 hover:text-foreground'
      : active
        ? 'text-white'
        : 'text-white/85 hover:text-white';

  const linkClass = (active?: boolean) =>
    cn(
      'rounded-md text-sm font-medium transition-colors',
      variant === 'editorial'
        ? 'px-3 py-2 text-[11px] tracking-[0.18em] uppercase'
        : 'px-4 py-2',
      linkTone(active)
    );

  const toursMenu = (
    <div
      className="relative"
      onMouseEnter={() => setToursOpen(true)}
      onMouseLeave={() => setToursOpen(false)}
    >
      <button
        type="button"
        className={cn(linkClass(isToursActive), 'inline-flex items-center gap-1')}
        onClick={() => setToursOpen((v) => !v)}
      >
        Tours
        <ChevronDown className={cn('size-3.5 transition-transform', toursOpen && 'rotate-180')} />
      </button>
      {toursOpen && (
        <div className="absolute top-full left-0 min-w-[13rem] pt-2">
          <div className="overflow-hidden rounded-lg border border-border bg-card/95 py-1.5 shadow-lg backdrop-blur-xl">
            <Link
              href="/tours"
              className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary"
            >
              All Tours
            </Link>
            {tourCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/tours?category=${cat.slug}`}
                className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const pageLinks = baseNavLinks
    .filter((l) => l.name !== 'Home')
    .map((link) => (
      <Link
        key={link.name}
        href={link.href}
        className={linkClass(
          link.href === '/blog' ? pathname?.startsWith('/blog') : pathname === link.href
        )}
      >
        {link.name}
      </Link>
    ));

  const ctaClass = cn(
    buttonVariants({ size: 'sm' }),
    variant === 'editorial' && 'rounded-none text-[11px] tracking-[0.18em] uppercase',
    variant === 'immersive' && 'rounded-full',
    !onLight && 'bg-white text-foreground hover:bg-white/90'
  );

  const brandLink = (
    <Link href="/" className="group shrink-0">
      <BrandMark
        name={brand.name}
        logo={brand.logo}
        variant={variant}
        tone={onLight ? 'dark' : 'light'}
        showName={!brand.logo}
      />
    </Link>
  );

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 right-0 left-0 z-50 hidden transition-[background-color,box-shadow,backdrop-filter,border-color] duration-300 lg:block',
          variant === 'aurora' &&
            'border-b-2 border-primary/70 bg-background/90 shadow-sm backdrop-blur-xl',
          variant === 'editorial' && 'border-b border-border bg-background',
          variant === 'immersive' && 'bg-transparent'
        )}
      >
        {variant === 'aurora' && (
          <div className="container flex h-16 items-center justify-between gap-6 xl:h-[4.5rem]">
            {brandLink}
            <div className="flex flex-1 items-center justify-center gap-0.5">
              <Link href="/" className={linkClass(pathname === '/')}>
                Home
              </Link>
              {toursMenu}
              {pageLinks}
            </div>
            <Link href="/contact#contact-form" className={ctaClass}>
              Get Quote
            </Link>
          </div>
        )}

        {variant === 'editorial' && (
          <div className="container grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-6 xl:h-[4.5rem]">
            <div className="flex items-center gap-0.5">
              <Link href="/" className={linkClass(pathname === '/')}>
                Home
              </Link>
              {toursMenu}
            </div>
            {brandLink}
            <div className="flex items-center justify-end gap-0.5">
              {pageLinks}
              <Link href="/contact#contact-form" className={cn(ctaClass, 'ml-3')}>
                Enquire
              </Link>
            </div>
          </div>
        )}

        {variant === 'immersive' && (
          <div className="container flex h-16 items-center xl:h-[4.5rem]">
            <div
              className={cn(
                'flex w-full items-center justify-between gap-6 rounded-full border px-5 py-2 transition-colors duration-300',
                onLight
                  ? 'border-border bg-background/85 shadow-sm backdrop-blur-xl'
                  : 'border-white/20 bg-black/25 backdrop-blur-xl'
              )}
            >
              {brandLink}
              <div className="flex items-center gap-0.5">
                <Link href="/" className={linkClass(pathname === '/')}>
                  Home
                </Link>
                {toursMenu}
                {pageLinks}
              </div>
              <Link href="/contact#contact-form" className={ctaClass}>
                Get Quote
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile bottom nav */}
      <div className="safe-area-inset-bottom fixed right-0 bottom-0 left-0 z-50 border-t border-border bg-background/90 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] backdrop-blur-xl lg:hidden">
        {mobileToursOpen && (
          <div className="grid grid-cols-2 gap-2 border-b border-border bg-card px-3 py-2.5">
            <Link
              href="/tours"
              onClick={() => setMobileToursOpen(false)}
              className="flex min-h-11 items-center justify-center rounded-md bg-muted text-sm font-medium text-foreground"
            >
              All Tours
            </Link>
            {tourCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/tours?category=${cat.slug}`}
                onClick={() => setMobileToursOpen(false)}
                className="flex min-h-11 items-center justify-center rounded-md bg-muted px-2 text-center text-sm font-medium text-foreground"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
        <div className="mx-auto flex max-w-lg flex-row">
          <Link href="/" className="flex min-w-0 flex-1 flex-col items-center justify-center px-1 py-2.5">
            <Home className={cn('mb-0.5 size-5', pathname === '/' ? 'text-primary' : 'text-muted-foreground')} />
            <span
              className={cn(
                'text-[10px] font-semibold',
                pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Home
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileToursOpen((v) => !v)}
            className="flex min-w-0 flex-1 flex-col items-center justify-center px-1 py-2.5"
          >
            <Compass
              className={cn(
                'mb-0.5 size-5',
                isToursActive || mobileToursOpen ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <span
              className={cn(
                'text-[10px] font-semibold',
                isToursActive || mobileToursOpen ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Tours
            </span>
          </button>
          <Link href="/about" className="flex min-w-0 flex-1 flex-col items-center justify-center px-1 py-2.5">
            <Users
              className={cn('mb-0.5 size-5', pathname === '/about' ? 'text-primary' : 'text-muted-foreground')}
            />
            <span
              className={cn(
                'text-[10px] font-semibold',
                pathname === '/about' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              About
            </span>
          </Link>
          <Link href="/blog" className="flex min-w-0 flex-1 flex-col items-center justify-center px-1 py-2.5">
            <Book
              className={cn(
                'mb-0.5 size-5',
                pathname?.startsWith('/blog') ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <span
              className={cn(
                'text-[10px] font-semibold',
                pathname?.startsWith('/blog') ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              Blog
            </span>
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-0 flex-1 flex-col items-center justify-center px-1 py-2.5"
          >
            <MessageCircle className="mb-0.5 size-5 text-primary" />
            <span className="text-[10px] font-semibold text-primary">WhatsApp</span>
          </a>
        </div>
      </div>
    </>
  );
}
