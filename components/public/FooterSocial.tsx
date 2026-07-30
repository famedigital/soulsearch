'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Camera, MessageCircle } from 'lucide-react';
import { mergeContactContent } from '@/lib/content/contact';

type SocialLink = {
  name: string;
  href: string;
  icon: typeof MessageCircle;
};

const DEFAULTS: SocialLink[] = [];

function normalizeUrl(url?: string | null): string | null {
  const raw = String(url || '').trim();
  if (!raw || raw === '#') return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw.replace(/^\/+/, '')}`;
}

/**
 * Facebook + Instagram only (YouTube removed).
 * Sources: Contact Settings CMS, then SEO / site_settings via /api/social.
 */
export function FooterSocial() {
  const [links, setLinks] = useState<SocialLink[]>(DEFAULTS);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [contactRes, seoRes] = await Promise.all([
          fetch('/api/content?type=contact', { cache: 'no-store' }),
          fetch('/api/social', { cache: 'no-store' }),
        ]);

        const contactJson = contactRes.ok ? await contactRes.json() : null;
        const seoJson = seoRes.ok ? await seoRes.json() : null;
        const merged = mergeContactContent(contactJson?.content);
        const social = merged.socialMedia || {};

        // Prefer Contact Settings; fall back to SEO / site_settings
        const facebook =
          normalizeUrl(social.facebook) || normalizeUrl(seoJson?.facebook);
        const instagram =
          normalizeUrl(social.instagram) || normalizeUrl(seoJson?.instagram);

        if (cancelled) return;

        const next: SocialLink[] = [];
        if (facebook) {
          next.push({ name: 'Facebook', href: facebook, icon: MessageCircle });
        }
        if (instagram) {
          next.push({ name: 'Instagram', href: instagram, icon: Camera });
        }
        setLinks(next);
      } catch {
        setLinks([]);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (links.length === 0) return null;

  return (
    <div className="flex flex-row flex-wrap items-center gap-2">
      {links.map((social) => {
        const Icon = social.icon;
        return (
          <Link
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-secondary-foreground/15 px-4 py-2 text-sm text-secondary-foreground/85 transition-colors hover:border-accent/40 hover:text-accent"
          >
            <Icon className="h-4 w-4" />
            <span className="font-medium">{social.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
