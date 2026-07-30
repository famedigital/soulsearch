'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Loader2, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content?type=faq');
      const data = await response.json();

      if (response.ok) {
        // Fetch active FAQs
        const faqsResponse = await fetch('/api/admin/content/faqs');
        const faqsData = await faqsResponse.json();

        if (faqsResponse.ok) {
          const activeFaqs = faqsData.faqs.filter((faq: any) => faq.is_active);
          setFaqs(activeFaqs);

          // Extract unique categories
          const uniqueCategories = Array.from(new Set(activeFaqs.map((faq: any) => faq.category))) as string[];
          setCategories(uniqueCategories);
        }
      }
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Filter FAQs
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Group by category
  const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  const optimizeImageUrl = (url: string, width: number, height: number) => {
    if (!url) return '';
    if (url.includes('cloudinary')) {
      const transformations = `q_auto,f_auto,w_${width},h_${height},c_fill`;
      return url.replace('/image/upload/', `/image/upload/${transformations}/`);
    }
    return url;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading FAQs...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-destructive">{error}</p>
            <Button onClick={fetchFAQs}>Try Again</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={optimizeImageUrl('https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80', 1920, 1080)}
              alt="Frequently Asked Questions"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/30" />
          </div>

          <div className="relative container pt-32 pb-16 md:pt-40 md:pb-24">
            <ScrollReveal direction="down">
              <div className="mx-auto max-w-3xl text-center">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-white/70">FAQ</p>
                <h1 className="font-accent mb-6 text-4xl font-medium tracking-tight text-white md:text-5xl lg:text-6xl">
                  Frequently Asked Questions
                </h1>
                <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
                  Find answers to common questions about traveling to Bhutan with our tours
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="sticky top-20 z-30 border-b border-border bg-background/90 py-6 backdrop-blur-xl">
          <div className="container">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="relative w-full flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 pl-10"
                />
              </div>

              <div className="flex w-full items-center gap-2 overflow-x-auto md:w-auto">
                <Filter className="size-4 shrink-0 text-muted-foreground" />
                <Button
                  type="button"
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    type="button"
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQs by Category */}
        <section className="py-16 md:py-20">
          <div className="container">
            {Object.keys(groupedFaqs).length > 0 ? (
              <div className="space-y-12">
                {Object.entries(groupedFaqs).map(([category, categoryFaqs]: [string, FAQ[]]) => (
                  <div key={category}>
                    <ScrollReveal>
                      <div className="mb-6">
                        <h2 className="font-heading text-2xl font-bold">{category}</h2>
                        <p className="text-muted-foreground">{categoryFaqs.length} questions</p>
                      </div>
                    </ScrollReveal>

                    <div className="space-y-4">
                      {categoryFaqs.map((faq, faqIndex) => {
                        const globalIndex = filteredFaqs.indexOf(faq);
                        const isOpen = openIndex === globalIndex;

                        return (
                          <ScrollReveal key={faq.id} delay={faqIndex * 50}>
                            <Card className="border-border shadow-none transition-shadow hover:shadow-sm">
                              <CardContent className="p-0">
                                <button
                                  onClick={() => toggleFAQ(globalIndex)}
                                  className="w-full text-left px-6 py-5 flex items-start justify-between gap-4"
                                >
                                  <div className="flex-1">
                                    <h3 className="font-heading font-semibold text-lg mb-2">
                                      {faq.question}
                                    </h3>
                                  </div>
                                  <div className="flex-shrink-0 pt-1">
                                    {isOpen ? (
                                      <ChevronUp className="size-5 text-primary" />
                                    ) : (
                                      <ChevronDown className="size-5 text-primary" />
                                    )}
                                  </div>
                                </button>

                                <AnimatePresence>
                                  {isOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="px-6 pb-6 pt-0">
                                        <div className="h-px w-full bg-border my-4" />
                                        <p className="text-muted-foreground leading-relaxed">
                                          {faq.answer}
                                        </p>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </CardContent>
                            </Card>
                          </ScrollReveal>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-3">No FAQs found</h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'Try adjusting your filters or search query.'
                    : 'No FAQs available yet.'}
                </p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <Button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={optimizeImageUrl('https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80', 1920, 1080)}
              alt="Contact Us"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>

          <div className="relative container text-center">
            <ScrollReveal>
              <h2 className="font-accent mb-5 text-3xl font-medium text-white md:text-4xl lg:text-5xl">
                Still have questions?
              </h2>
              <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
                Our team is here to help you plan your perfect Bhutan adventure. Reach out to us and we&apos;ll get back to you within 24 hours.
              </p>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'inline-flex bg-white text-primary hover:bg-white/90'
                )}
              >
                Contact Us
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}