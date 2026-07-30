export interface HeroSlide {
  id: string
  title: string
  subtitle: string
  description: string
  image_public_id: string
  image_url: string
  mobile_image_public_id?: string | null
  mobile_image_url?: string | null
  cta_text?: string | null
  cta_link?: string | null
  slide_order: number
  is_active: boolean
}

export interface HeroLayoutProps {
  slides?: HeroSlide[]
  autoPlay?: boolean
  interval?: number
}
