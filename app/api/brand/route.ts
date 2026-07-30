import { NextResponse } from 'next/server'
import { getBrand } from '@/lib/brand'

export const dynamic = 'force-dynamic'

/** Public brand/company name + logo from CRM (SEO settings). */
export async function GET() {
  try {
    const brand = await getBrand()
    return NextResponse.json(brand, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch (error) {
    console.error('Brand API error:', error)
    const {
      DEFAULT_COMPANY_NAME,
      DEFAULT_COMPANY_TAGLINE,
      DEFAULT_SITE_LOGO,
    } = await import('@/lib/brand')
    return NextResponse.json({
      name: DEFAULT_COMPANY_NAME,
      tagline: DEFAULT_COMPANY_TAGLINE,
      logo: DEFAULT_SITE_LOGO,
    })
  }
}
