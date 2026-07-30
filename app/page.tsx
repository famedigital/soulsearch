import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { getFeaturedTours, getActiveHeroSlides, getFeaturedTestimonials } from '@/lib/database';
import { TestimonialsSection } from '@/components/public/TestimonialsSection';

// Force dynamic rendering for this page since it uses cookies
export const dynamic = 'force-dynamic';
import { DifferentiatorsSection } from '@/components/public/DifferentiatorsSection';
import { CTASection } from '@/components/public/CTASection';
import { HeroAurora } from '@/components/public/home/HeroAurora';
import { HeroEditorial } from '@/components/public/home/HeroEditorial';
import { HeroImmersive } from '@/components/public/home/HeroImmersive';
import { FeaturedTours } from '@/components/public/home/FeaturedTours';
import type { Metadata } from 'next';
import { buildSocialMetadata, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo';
import { getCompanyName } from '@/lib/brand';
import { DEFAULT_COMPANY_NAME } from '@/lib/brand-defaults';
import { getHomePageContent } from '@/lib/content/get-home';
import { getSiteTemplate } from '@/lib/template';
import { SITE_TEMPLATE_IDS, type SiteTemplateId } from '@/lib/template-config';

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

const HERO_BY_TEMPLATE = {
  aurora: HeroAurora,
  editorial: HeroEditorial,
  immersive: HeroImmersive,
} as const;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const [featuredTours, heroSlides, dbTestimonials, homeContent, savedTemplate, params] =
    await Promise.all([
      getFeaturedTours(),
      getActiveHeroSlides(),
      getFeaturedTestimonials(),
      getHomePageContent(),
      getSiteTemplate(),
      searchParams,
    ]);

  // `?template=` previews a layout without publishing it; anything invalid
  // falls back to the saved setting.
  const isPreview = SITE_TEMPLATE_IDS.includes(params.template as SiteTemplateId);
  const template = isPreview ? (params.template as SiteTemplateId) : savedTemplate;

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

  const Hero = HERO_BY_TEMPLATE[template];

  return (
    <div className="flex min-h-screen flex-col bg-background safe-bottom-padding lg:pb-0">
      <Navigation variant={template} />

      <Hero slides={heroSlides} autoPlay interval={6000} />

      <FeaturedTours tours={featuredTours} content={homeContent.featured} variant={template} />

      <DifferentiatorsSection content={homeContent.differentiators} variant={template} />

      <TestimonialsSection testimonials={testimonials} />

      {/* Immersive closes with the footer's own call-to-action band instead. */}
      {template !== 'immersive' && <CTASection />}

      <Footer variant={template} />
    </div>
  );
}
