'use client';

import { useEffect, useState } from 'react';
import {
  DEFAULT_COMPANY_NAME,
  DEFAULT_COMPANY_TAGLINE,
  DEFAULT_SITE_LOGO,
  normalizeCompanyName,
  normalizeSiteLogo,
} from '@/lib/brand-defaults';

export type BrandInfo = {
  name: string;
  tagline: string;
  logo: string;
};

/**
 * Client hook — company name + logo from Admin → SEO.
 * Starts with the canonical default so legacy CRM values don't flash wrong.
 */
export function useCompanyBrand(): BrandInfo {
  const [brand, setBrand] = useState<BrandInfo>({
    name: DEFAULT_COMPANY_NAME,
    tagline: DEFAULT_COMPANY_TAGLINE,
    logo: DEFAULT_SITE_LOGO,
  });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/brand', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setBrand({
          name: normalizeCompanyName(data.name),
          tagline:
            String(data.tagline || DEFAULT_COMPANY_TAGLINE).trim() || DEFAULT_COMPANY_TAGLINE,
          logo: normalizeSiteLogo(data.logo),
        });
      })
      .catch(() => {
        /* keep defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return brand;
}
