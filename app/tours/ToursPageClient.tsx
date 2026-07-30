'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { TourCard } from '@/components/public/TourCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { ScrollReveal, StaggerChildren } from '@/components/ui/scroll-reveal';
import { Compass, X, ArrowRight, Mail, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categoryMatches } from '@/lib/tour-category';

export function ToursPageClient({ tours }: { tours: any[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([
    { value: 'all', label: 'All Tours' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
  }, [searchParams]);

  useEffect(() => {
    fetch('/api/tour-categories')
      .then((r) => r.json())
      .then((data) => {
        const cats = (data.categories || []).map((c: any) => ({
          value: c.slug,
          label: c.name,
        }));
        setCategories([{ value: 'all', label: 'All Tours' }, ...cats]);
      })
      .catch(() => {
        setCategories([
          { value: 'all', label: 'All Tours' },
          { value: 'international', label: 'International Tour' },
          { value: 'regional', label: 'Regional Tour' },
        ]);
      });
  }, []);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const filteredTours = tours.filter((tour) => {
    if (!categoryMatches(tour.category, selectedCategory)) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchableText =
        `${tour.title} ${tour.description || ''} ${tour.tagline || ''} ${tour.locations?.join(' ') || ''}`.toLowerCase();
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });

  const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) + (searchQuery ? 1 : 0);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation forceSolid />

      <main className="flex-1 pt-16 xl:pt-[4.5rem]">
        <section className="border-b border-border bg-muted/30 pt-16 pb-16 md:pt-20 md:pb-20">
          <div className="container">
            <ScrollReveal>
              <div className="mb-10 max-w-2xl md:mb-12">
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Our collection
                </p>
                <h1 className="font-accent text-4xl font-medium tracking-tight text-foreground md:text-5xl">
                  Tours &amp; journeys
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  Discover your perfect Bhutan adventure — cultural immersions, treks, and festival experiences.
                </p>
              </div>
            </ScrollReveal>

            <div className="mb-8 max-w-xl">
              <div className="relative">
                <Compass className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tours..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  type="button"
                  variant={selectedCategory === cat.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <p className="font-heading text-2xl font-semibold text-foreground">
                  {filteredTours.length} {filteredTours.length === 1 ? 'tour' : 'tours'}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Discover your perfect Bhutan adventure</p>
              </div>
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{activeFiltersCount} active</Badge>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear
                  </Button>
                </div>
              )}
            </div>

            {filteredTours.length > 0 ? (
              <StaggerChildren>
                <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3 xl:gap-8">
                  {filteredTours.map((tour, index) => (
                    <TourCard key={tour.id} tour={tour} index={index} />
                  ))}
                </div>
              </StaggerChildren>
            ) : (
              <div className="py-20 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Compass className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-3 font-heading text-2xl font-semibold">No tours found</h3>
                <p className="mx-auto mb-8 max-w-md text-muted-foreground">
                  Try adjusting your search to discover more tours.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0">
            <img
              src="https://res.cloudinary.com/hckgrdeh/image/upload/v1782965945/punakhadzong_xkcrcu.jpg"
              alt="Punakha Dzong"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="relative container">
            <ScrollReveal>
              <div className="mx-auto max-w-2xl text-center">
                <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/90">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <h2 className="font-accent mb-4 text-3xl font-medium text-white md:text-4xl">
                  Can&apos;t find what you&apos;re looking for?
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-white/85">
                  Let us craft a custom Bhutanese experience tailored to your interests, schedule, and preferences.
                </p>
                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                  <Link href="/contact" className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}>
                    Request Custom Tour
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className={cn(
                      buttonVariants({ variant: 'outline', size: 'lg' }),
                      'gap-2 border-white/30 bg-white/10 text-white hover:bg-white/15 hover:text-white'
                    )}
                  >
                    Contact Us
                    <Mail className="size-4" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
