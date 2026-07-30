import Link from 'next/link';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { buttonVariants } from '@/components/ui/button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { getFeaturedTours, getActiveHeroSlides, getFeaturedTestimonials } from '@/lib/database';
import { HeroSlideshow } from '@/components/public/HeroSlideshow';
import { TestimonialsSection } from '@/components/public/TestimonialsSection';

// Force dynamic rendering for this page since it uses cookies
export const dynamic = 'force-dynamic';
import { DifferentiatorsSection } from '@/components/public/DifferentiatorsSection';
import { TourCard } from '@/components/public/TourCard';
import { CTASection } from '@/components/public/CTASection';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { buildSocialMetadata, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo';
import { getCompanyName } from '@/lib/brand';
import { DEFAULT_COMPANY_NAME } from '@/lib/brand-defaults';
import { getHomePageContent } from '@/lib/content/get-home';

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompanyName();
  const description = SITE_DESCRIPTION.replace(DEFAULT_COMPANY_NAME, company);
  return {
    ...buildSocialMetadata({
      title: `${company} - Discover the Last Shangri-La`,
      description,
      path: '/',
      siteName: company,
    }),
    keywords: [
      'Bhutan tour',
      'Bhutan travel',
      'Bhutan trekking',
      'Bhutan festival',
      company,
      'Bhutan adventures',
    ],
  };
}

const fallbackTestimonials = [
  {
    name: 'Sarah & Michael',
    location: 'Sydney, Australia',
    text: `The journey to Tiger's Nest was transformative. ${SITE_NAME} made every moment magical with their authentic approach and deep knowledge of Bhutan.`,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    name: 'James Chen',
    location: 'Singapore',
    text: 'The Druk Path Trek exceeded all expectations. Professional guides, stunning campsites, and an authentic experience of the Himalayas.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    name: 'Emma Laurent',
    location: 'Paris, France',
    text: 'The Paro Tsechu festival experience was incredible. The access we got and the cultural insights from our guide were priceless.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
];

export default async function HomePage() {
  const [featuredTours, heroSlides, dbTestimonials, homeContent] = await Promise.all([
    getFeaturedTours(),
    getActiveHeroSlides(),
    getFeaturedTestimonials(),
    getHomePageContent(),
  ]);

  const testimonials =
    dbTestimonials.length > 0
      ? dbTestimonials.map((t) => ({
          name: t.name,
          location: t.location,
          text: t.text,
          rating: t.rating,
          image: t.image_url,
        }))
      : fallbackTestimonials;

  return (
    <div className="flex min-h-screen flex-col bg-background safe-bottom-padding lg:pb-0">
      <Navigation />

      <HeroSlideshow slides={heroSlides} autoPlay={true} interval={6000} />

      {/* Featured tours */}
      <section className="relative bg-muted py-20 md:py-28">
        <div className="container">
          <ScrollReveal>
            <div className="mb-14 max-w-2xl md:mb-16">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {homeContent.featured.eyebrow}
              </p>
              <h2 className="font-accent text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {homeContent.featured.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                {homeContent.featured.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8 lg:grid-cols-3">
            {featuredTours.length > 0 ? (
              featuredTours.map((tour, index) => (
                <TourCard key={tour.id} tour={tour} index={index} />
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <p className="text-lg text-muted-foreground">No featured tours available at the moment.</p>
                <Link href="/tours" className={cn(buttonVariants({ variant: 'outline' }), 'mt-6')}>
                  View All Tours
                </Link>
              </div>
            )}
          </div>

          {featuredTours.length > 0 && (
            <ScrollReveal direction="up" className="mt-14 text-center md:mt-16">
              <Link
                href="/tours"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'inline-flex gap-2')}
              >
                View All Tours
                <ArrowRight className="size-4" />
              </Link>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Why choose us */}
      <section className="relative overflow-hidden bg-background py-20 md:py-28">
        <div className="container">
          <DifferentiatorsSection content={homeContent.differentiators} />
        </div>
      </section>

      <TestimonialsSection testimonials={testimonials} />

      <CTASection />

      <Footer />
    </div>
  );
}
