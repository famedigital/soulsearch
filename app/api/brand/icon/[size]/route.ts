import { NextRequest, NextResponse } from 'next/server'
import { getSiteLogo } from '@/lib/brand'

export const dynamic = 'force-dynamic'

const ALLOWED = new Set([32, 180, 192, 512])

/**
 * Same-origin icon endpoint for favicon / PWA.
 * Uses the CMS company logo when set (Cloudinary-resized), else the static Soul Search emblem.
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ size: string }> }
) {
  const { size: sizeRaw } = await context.params
  const size = Number.parseInt(sizeRaw, 10)
  if (!ALLOWED.has(size)) {
    return NextResponse.json({ error: 'Unsupported size' }, { status: 400 })
  }

  const logo = await getSiteLogo()
  if (logo) {
    const cloudinary = logo.match(
      /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/i
    )
    if (cloudinary) {
      const [, prefix, rest] = cloudinary
      const pathOnly = rest.replace(/^((?:[^/]+,)+\w+\/)*/, '')
      const transformed = `${prefix}c_pad,w_${size},h_${size},b_rgb:123047,f_png,q_auto/${pathOnly}`
      return NextResponse.redirect(transformed, 307)
    }
    return NextResponse.redirect(logo, 307)
  }

  if (size === 32) {
    return NextResponse.redirect(new URL('/favicon.png', _request.url), 307)
  }
  if (size === 180) {
    return NextResponse.redirect(new URL('/icons/apple-touch-icon.png', _request.url), 307)
  }
  return NextResponse.redirect(new URL(`/icons/icon-${size}.png`, _request.url), 307)
}
