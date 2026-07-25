/** Shared Contact CMS shape + defaults (admin General & Contact settings). */

export type ContactInfo = {
  email: string
  phone: string
  address: string
  whatsapp?: string
}

export type ContactAutoReply = {
  enabled: boolean
  subject: string
  message: string
}

export type ContactContent = {
  hero?: {
    title?: string
    subtitle?: string
    backgroundImage?: string
  }
  contactInfo: ContactInfo
  officeHours?: {
    weekdays?: string
    saturdays?: string
    sundays?: string
  }
  socialMedia?: Record<string, string | undefined>
  autoReply?: ContactAutoReply
}

export const CONTACT_INFO_DEFAULTS: ContactInfo = {
  email: 'info@wangchuktour.com',
  phone: '+975 17643416',
  address: 'Thimphu, Bhutan',
  whatsapp: '+97517643416',
}

export const CONTACT_AUTO_REPLY_DEFAULTS: ContactAutoReply = {
  enabled: true,
  subject: 'Thank you for contacting Wangchuks Bhutan Tours!',
  message:
    'We have received your inquiry and will respond within 24 hours. In the meantime, explore our tour packages for inspiration!',
}

export const CONTACT_DEFAULTS: ContactContent = {
  hero: {
    title: 'Contact Us',
    subtitle: "We're here to help you plan your perfect Bhutanese adventure",
    backgroundImage:
      'https://res.cloudinary.com/hckgrdeh/image/upload/v1782965945/punakhadzong_xkcrcu.jpg',
  },
  contactInfo: { ...CONTACT_INFO_DEFAULTS },
  officeHours: {
    weekdays: '9:00 AM - 6:00 PM',
    saturdays: '10:00 AM - 4:00 PM',
    sundays: 'Closed',
  },
  socialMedia: {},
  autoReply: { ...CONTACT_AUTO_REPLY_DEFAULTS },
}

export function mergeContactContent(raw: unknown): ContactContent {
  const incoming =
    raw && typeof raw === 'object' ? (raw as Partial<ContactContent>) : {}
  const info: Partial<ContactInfo> =
    incoming.contactInfo && typeof incoming.contactInfo === 'object'
      ? incoming.contactInfo
      : {}

  const autoReplyRaw =
    incoming.autoReply && typeof incoming.autoReply === 'object'
      ? (incoming.autoReply as Partial<ContactAutoReply>)
      : {}

  return {
    ...CONTACT_DEFAULTS,
    ...incoming,
    contactInfo: {
      ...CONTACT_INFO_DEFAULTS,
      ...info,
      email: String(info.email || CONTACT_INFO_DEFAULTS.email).trim() || CONTACT_INFO_DEFAULTS.email,
      phone: String(info.phone || CONTACT_INFO_DEFAULTS.phone).trim() || CONTACT_INFO_DEFAULTS.phone,
      address:
        String(info.address || CONTACT_INFO_DEFAULTS.address).trim() ||
        CONTACT_INFO_DEFAULTS.address,
      whatsapp:
        String(info.whatsapp || CONTACT_INFO_DEFAULTS.whatsapp || '').trim() ||
        CONTACT_INFO_DEFAULTS.whatsapp,
    },
    autoReply: {
      ...CONTACT_AUTO_REPLY_DEFAULTS,
      ...autoReplyRaw,
      enabled:
        autoReplyRaw.enabled === undefined
          ? CONTACT_AUTO_REPLY_DEFAULTS.enabled
          : Boolean(autoReplyRaw.enabled),
      subject:
        String(autoReplyRaw.subject || CONTACT_AUTO_REPLY_DEFAULTS.subject).trim() ||
        CONTACT_AUTO_REPLY_DEFAULTS.subject,
      message:
        String(autoReplyRaw.message || CONTACT_AUTO_REPLY_DEFAULTS.message).trim() ||
        CONTACT_AUTO_REPLY_DEFAULTS.message,
    },
  }
}

/**
 * First phone/WhatsApp digits from a CRM field that may list multiple numbers.
 * Handles: "A / B", "A, B", "A or B", "A +B", "A+B", and fully concatenated digits.
 */
export function parsePrimaryPhoneDigits(value?: string | null): string {
  const raw = String(value || '').trim()
  if (!raw) return ''

  // Split on separators, "or"/"and", and a new number starting with +
  const parts = raw
    .split(/[/|,;]+|\bor\b|\band\b|(?=\+\d)/i)
    .map((p) => p.trim())
    .filter(Boolean)

  for (const part of parts) {
    const digits = part.replace(/[^\d]/g, '')
    // E.164-ish: country code + local, typically 8–15 digits
    if (digits.length >= 8 && digits.length <= 15) return digits
  }

  const fallback = raw.replace(/[^\d]/g, '')
  if (fallback.length >= 8 && fallback.length <= 15) return fallback

  // Concatenated multi-numbers with no separator (e.g. 97517643416 + 97517645738)
  if (fallback.length > 15) {
    for (const len of [11, 12, 10, 13, 14, 15, 9, 8]) {
      if (fallback.length >= len * 2 || fallback.length > 15) {
        const candidate = fallback.slice(0, len)
        if (candidate[0] !== '0') return candidate
      }
    }
  }

  return ''
}

/** Build a tel: href from a display phone number (uses first number if several). */
export function phoneToTelHref(phone: string): string {
  const digits = parsePrimaryPhoneDigits(phone)
  return digits ? `tel:+${digits}` : 'tel:'
}

/**
 * First WhatsApp number from CRM Contact Settings.
 * Supports values like "+97517643416 / +97517645738".
 */
export function parsePrimaryWhatsApp(whatsapp?: string | null): string {
  return parsePrimaryPhoneDigits(whatsapp)
}

/** Build https://wa.me/... from CRM WhatsApp field. */
export function whatsappToHref(whatsapp?: string | null): string {
  const digits =
    parsePrimaryWhatsApp(whatsapp) ||
    parsePrimaryWhatsApp(CONTACT_INFO_DEFAULTS.whatsapp)
  return `https://wa.me/${digits}`
}
