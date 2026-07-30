import Link from 'next/link';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal, StaggerChildren } from '@/components/ui/scroll-reveal';
import { Calendar, User, Clock, Tag, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { getPublishedBlogPosts } from '@/lib/database';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { cn } from '@/lib/utils';

// Always fetch fresh posts after admin edits (avoid stale Vercel/RSC cache)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const optimizeImageUrl = (url: string, width: number, height: number) => {
  if (url.includes('cloudinary')) {
    const transformations = `q_auto,f_auto,w_${width},h_${height},c_fill`;
    return url.replace('/image/upload/', `/image/upload/${transformations}/`);
  }
  return url;
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  const featuredPosts = posts.filter((post) => post.status === 'published').slice(0, 3);
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags || [])));

  if (!posts || posts.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="mb-4 font-heading text-2xl font-semibold">No stories yet</h2>
            <p className="text-muted-foreground">Check back soon for new stories from Bhutan.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const PostCard = ({ post }: { post: (typeof posts)[0] }) => (
    <Link href={`/blog/${post.slug}`} className="h-full">
      <Card className="group flex h-full flex-col overflow-hidden border-border py-0 shadow-none transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted sm:aspect-[16/10]">
          {post.featured_image_url ? (
            <img
              src={optimizeImageUrl(post.featured_image_url, 800, 500)}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-3xl sm:text-5xl">🏔️</span>
            </div>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col space-y-2 p-3 sm:space-y-4 sm:p-6">
          <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex sm:gap-4 sm:text-sm">
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {post.author_name}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : 'Draft'}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="mb-1 truncate text-[10px] font-medium tracking-wider text-muted-foreground uppercase sm:mb-2 sm:text-xs sm:tracking-[0.15em]">
              {post.category}
            </p>
            <h3 className="font-accent line-clamp-2 text-sm leading-snug transition-colors group-hover:text-primary sm:text-xl">
              {post.title}
            </h3>
          </div>

          <p className="hidden line-clamp-2 text-sm text-muted-foreground sm:block">
            {post.excerpt || post.content?.substring(0, 150) + '...'}
          </p>

          <div className="flex items-center justify-between border-t border-border pt-2 sm:pt-4">
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground sm:text-sm">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              {post.read_time ? `${post.read_time} min` : '5 min'}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-primary transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={optimizeImageUrl(
                'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80',
                1920,
                1080
              )}
              alt="Tiger's Nest Monastery"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/30" />
          </div>

          <div className="relative container pt-32 pb-16 md:pt-40 md:pb-24">
            <ScrollReveal direction="down">
              <div className="mx-auto max-w-3xl text-center">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-white/70">Blog</p>
                <h1 className="font-accent mb-6 text-4xl font-medium tracking-tight text-white md:text-5xl lg:text-6xl">
                  Stories from the Land of the Thunder Dragon
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/85">
                  Discover Bhutan through our travel guides, cultural insights, and stories from the Himalayan kingdom.
                </p>
                <BlogSearch />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {featuredPosts.length > 0 && (
          <section className="py-20 md:py-28">
            <div className="container">
              <ScrollReveal>
                <div className="mb-12 max-w-xl">
                  <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Featured
                  </p>
                  <h2 className="font-accent text-3xl font-medium md:text-4xl">Featured stories</h2>
                </div>
              </ScrollReveal>

              <StaggerChildren className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8 lg:grid-cols-3">
                {featuredPosts.map((post) => (
                  <ScrollReveal key={post.id}>
                    <PostCard post={post} />
                  </ScrollReveal>
                ))}
              </StaggerChildren>
            </div>
          </section>
        )}

        <section className="border-t border-border bg-muted/30 py-20 md:py-28">
          <div className="container">
            <ScrollReveal>
              <div className="mb-12 max-w-xl">
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Latest
                </p>
                <h2 className="font-accent text-3xl font-medium md:text-4xl">Latest from Bhutan</h2>
              </div>
            </ScrollReveal>

            <StaggerChildren className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8 lg:grid-cols-3">
              {posts.map((post) => (
                <ScrollReveal key={post.id}>
                  <PostCard post={post} />
                </ScrollReveal>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {allTags.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="container">
              <ScrollReveal>
                <div className="mb-10 text-center">
                  <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Explore
                  </p>
                  <h2 className="font-accent text-3xl font-medium md:text-4xl">Popular topics</h2>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
                  {allTags.slice(0, 12).map((tag) => (
                    <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                      <Badge variant="outline" className="cursor-pointer px-5 py-2.5 text-sm hover:border-primary hover:text-primary">
                        <Tag className="mr-2 h-4 w-4" />
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0">
            <img
              src={optimizeImageUrl(
                'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80',
                1920,
                1080
              )}
              alt="Buddha Point, Thimphu"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
          </div>

          <div className="relative container">
            <ScrollReveal>
              <div className="max-w-2xl">
                <h2 className="font-accent mb-5 text-3xl font-medium text-white md:text-4xl">
                  Ready to experience Bhutan?
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-white/85">
                  Let our stories inspire your journey. Explore our tours and discover the magic of the Land of the Thunder Dragon.
                </p>
                <Link href="/tours" className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}>
                  Explore Tours
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
