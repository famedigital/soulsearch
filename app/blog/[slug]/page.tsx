import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, Tag, ArrowLeft, Mail, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { getBlogPostBySlug, getPublishedBlogPosts } from '@/lib/database';
import { BlogMarkdown } from '@/components/public/BlogMarkdown';
import { cn } from '@/lib/utils';
import { buildSocialMetadata, SITE_NAME } from '@/lib/seo';

// Always fetch fresh posts after admin edits (avoid stale Vercel/RSC cache)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const optimizeImageUrl = (url: string | null | undefined, width: number, height: number) => {
  if (!url) return '/placeholder.jpg';
  if (url.includes('cloudinary')) {
    const transformations = `q_auto,f_auto,w_${width},h_${height},c_fill`;
    return url.replace('/image/upload/', `/image/upload/${transformations}/`);
  }
  return url;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogPostBySlug(slug);

  if (!blog) {
    return { title: `Post not found | ${SITE_NAME}` };
  }

  return buildSocialMetadata({
    title: blog.title,
    description: blog.meta_description || blog.excerpt || `Read ${blog.title} on ${SITE_NAME}.`,
    path: `/blog/${slug}`,
    image: blog.featured_image_url,
    type: 'article',
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogPostBySlug(slug);

  if (!blog) {
    notFound();
  }

  const allPosts = await getPublishedBlogPosts();
  const relatedPosts = allPosts
    .filter((post) => post.category === blog.category && post.id !== blog.id)
    .slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={optimizeImageUrl(blog.featured_image_url, 1920, 1080)}
              alt={blog.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/35" />
          </div>

          <div className="relative container pt-32 pb-16 md:pt-40 md:pb-24">
            <Link
              href="/blog"
              className="mb-6 inline-flex items-center gap-2 font-medium text-white/75 transition-colors hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Back to Blog
            </Link>
            <div className="mx-auto max-w-4xl">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-white/70">
                {blog.category}
              </p>
              <h1 className="font-accent mb-8 text-4xl font-medium text-white md:text-5xl lg:text-6xl">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/85">
                <span className="inline-flex items-center gap-2">
                  <User className="size-4 text-accent" />
                  {blog.author_name}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Calendar className="size-4 text-accent" />
                  {format(new Date(blog.published_at || blog.created_at || new Date()), 'MMMM d, yyyy')}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="size-4 text-accent" />
                  {Math.ceil(blog.content.length / 1000)} min read
                </span>
              </div>
            </div>
          </div>
        </section>

        <article className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              {blog.tags.length > 0 && (
                <div className="mb-10 flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="px-3 py-1.5 text-sm">
                      <Tag className="mr-2 size-3.5" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <BlogMarkdown content={blog.content || ''} />

              <div className="mt-16 border-t border-border pt-10">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div>
                    <p className="mb-1 font-heading text-lg font-semibold">Share this article</p>
                    <p className="text-muted-foreground">Help others discover Bhutan</p>
                  </div>
                  <Link href="/contact" className={cn(buttonVariants(), 'gap-2')}>
                    <Mail className="size-4" />
                    Share
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>

        <section className="bg-muted/30 py-16 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <Card className="border-border shadow-none">
                <CardContent className="flex gap-6 p-8 md:p-10">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted md:h-28 md:w-28">
                    <img
                      src={optimizeImageUrl(
                        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80',
                        200,
                        200
                      )}
                      alt={blog.author_name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="mb-2 font-heading text-lg font-semibold">Written by {blog.author_name}</p>
                    <p className="leading-relaxed text-muted-foreground">{blog.author_bio}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {relatedPosts.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="container">
              <div className="mx-auto max-w-5xl">
                <h2 className="font-accent mb-10 text-2xl font-medium md:text-3xl">Related articles</h2>
                <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 md:gap-8">
                  {relatedPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group h-full">
                      <Card className="flex h-full flex-col overflow-hidden border-border py-0 shadow-none transition-shadow hover:shadow-md">
                        <div className="relative aspect-[4/3] overflow-hidden bg-muted sm:h-44 sm:aspect-auto">
                          <img
                            src={optimizeImageUrl(post.featured_image_url, 600, 400)}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        </div>
                        <CardContent className="space-y-1 p-3 sm:space-y-2 sm:p-5">
                          <p className="truncate text-[10px] font-medium tracking-wider text-muted-foreground uppercase sm:text-xs sm:tracking-[0.15em]">
                            {post.category}
                          </p>
                          <h3 className="font-heading line-clamp-2 text-sm font-semibold transition-colors group-hover:text-primary sm:text-base">
                            {post.title}
                          </h3>
                          <p className="hidden line-clamp-2 text-sm text-muted-foreground sm:block">{post.excerpt}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
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
              alt="Buddha Point"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>

          <div className="relative container text-center">
            <h2 className="font-accent mb-5 text-3xl font-medium text-white md:text-4xl">
              Inspired to visit Bhutan?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/85">
              Let us help you plan your journey through the Land of the Thunder Dragon.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/tours"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'bg-white text-primary hover:bg-white/90'
                )}
              >
                Explore Our Tours
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'border-white/30 bg-white/10 text-white hover:bg-white/15 hover:text-white'
                )}
              >
                <Mail className="size-4" />
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
