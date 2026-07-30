export type GlobalTheme = {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
}

export const DEFAULT_GLOBAL_THEME: GlobalTheme = {
  primary: '#F5C542',
  secondary: '#22B8E6',
  accent: '#63D9A6',
  background: '#F7FCFA',
  foreground: '#123047',
}

export const THEME_PRESETS: Array<{
  name: string
  description: string
  colors: GlobalTheme
}> = [
  {
    name: 'Soul Search Fresh',
    description: 'Citrus yellow, sky cyan, and fresh mint',
    colors: DEFAULT_GLOBAL_THEME,
  },
  {
    name: 'Himalayan Dawn',
    description: 'Warm sunrise with alpine blue',
    colors: {
      primary: '#F59E0B',
      secondary: '#38BDF8',
      accent: '#84CC16',
      background: '#FFFBEB',
      foreground: '#1E293B',
    },
  },
  {
    name: 'Mountain Forest',
    description: 'Evergreen, glacier, and moss',
    colors: {
      primary: '#15803D',
      secondary: '#0891B2',
      accent: '#A3E635',
      background: '#F6FBF7',
      foreground: '#143322',
    },
  },
  {
    name: 'Blue Horizon',
    description: 'Clear blue with a bright citrus accent',
    colors: {
      primary: '#0284C7',
      secondary: '#06B6D4',
      accent: '#FACC15',
      background: '#F5FAFF',
      foreground: '#172554',
    },
  },
]

const HEX_COLOR = /^#[0-9a-f]{6}$/i

export function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_COLOR.test(value)
}

export function normalizeGlobalTheme(value: unknown): GlobalTheme {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return DEFAULT_GLOBAL_THEME
  }

  const raw = value as Record<string, unknown>
  return {
    primary: isHexColor(raw.primary) ? raw.primary.toUpperCase() : DEFAULT_GLOBAL_THEME.primary,
    secondary: isHexColor(raw.secondary)
      ? raw.secondary.toUpperCase()
      : DEFAULT_GLOBAL_THEME.secondary,
    accent: isHexColor(raw.accent) ? raw.accent.toUpperCase() : DEFAULT_GLOBAL_THEME.accent,
    background: isHexColor(raw.background)
      ? raw.background.toUpperCase()
      : DEFAULT_GLOBAL_THEME.background,
    foreground: isHexColor(raw.foreground)
      ? raw.foreground.toUpperCase()
      : DEFAULT_GLOBAL_THEME.foreground,
  }
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  ]
}

function rgbToHex(rgb: [number, number, number]): string {
  return `#${rgb.map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`
}

function mix(first: string, second: string, secondWeight: number): string {
  const a = hexToRgb(first)
  const b = hexToRgb(second)
  return rgbToHex(
    a.map((channel, index) => channel * (1 - secondWeight) + b[index] * secondWeight) as [
      number,
      number,
      number,
    ]
  )
}

function luminance(hex: string): number {
  const channels = hexToRgb(hex).map((channel) => {
    const value = channel / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

function contrastForeground(background: string): string {
  return luminance(background) > 0.45 ? '#102A3A' : '#FFFFFF'
}

export function themeToCssVariables(themeValue: unknown): Record<string, string> {
  const theme = normalizeGlobalTheme(themeValue)
  const isDark = luminance(theme.background) < 0.25
  const surfaceTarget = isDark ? '#FFFFFF' : '#FFFFFF'
  const surfaceWeight = isDark ? 0.08 : 0.72
  const card = mix(theme.background, surfaceTarget, surfaceWeight)
  const muted = mix(theme.background, theme.foreground, isDark ? 0.16 : 0.07)
  const border = mix(theme.background, theme.foreground, isDark ? 0.26 : 0.14)

  return {
    '--background': theme.background,
    '--foreground': theme.foreground,
    '--card': card,
    '--card-foreground': theme.foreground,
    '--popover': card,
    '--popover-foreground': theme.foreground,
    '--primary': theme.primary,
    '--primary-foreground': contrastForeground(theme.primary),
    '--secondary': theme.secondary,
    '--secondary-foreground': contrastForeground(theme.secondary),
    '--accent': theme.accent,
    '--accent-foreground': contrastForeground(theme.accent),
    '--muted': muted,
    '--muted-foreground': mix(theme.foreground, theme.background, 0.38),
    '--border': border,
    '--input': border,
    '--ring': theme.primary,
    '--chart-1': theme.primary,
    '--chart-2': theme.secondary,
    '--chart-3': theme.accent,
    '--chart-4': mix(theme.primary, theme.secondary, 0.5),
    '--chart-5': mix(theme.secondary, theme.accent, 0.5),
    '--sidebar': card,
    '--sidebar-foreground': theme.foreground,
    '--sidebar-primary': theme.primary,
    '--sidebar-primary-foreground': contrastForeground(theme.primary),
    '--sidebar-accent': muted,
    '--sidebar-accent-foreground': theme.foreground,
    '--sidebar-border': border,
    '--sidebar-ring': theme.primary,
    '--prayer-red': theme.primary,
    '--monastery-red': theme.primary,
    '--crimson': theme.primary,
    '--color-crimson': theme.primary,
    '--color-monastery-red': theme.primary,
    '--color-prayer-red': theme.primary,
  }
}
