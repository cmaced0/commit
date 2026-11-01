// Design tokens. Anything visual that more than one screen needs lives here.
// The accent color is NOT here as a fixed value: it's user-changeable and comes
// from useAppearance(). DEFAULT_ACCENT is only the starting point.

export const palette = {
  bg: '#0A1022',      // deep navy background
  surface: '#0F1731', // inputs and buttons (kept opaque so glows render on Android)
  text: '#FFFFFF',
  muted: '#8B93B0',
  danger: '#FF6B8B',
} as const

export const DEFAULT_ACCENT = '#B026FF' // neon purple

// Choices offered to the user later in a settings screen
export const ACCENT_PRESETS = [
  { name: 'Neon purple', value: '#B026FF' },
  { name: 'Electric cyan', value: '#22D3EE' },
  { name: 'Hot pink', value: '#FF2EC4' },
  { name: 'Mint', value: '#39FF88' },
  { name: 'Amber', value: '#FFB020' },
] as const

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const
export const radius = { md: 14, lg: 20 } as const

// Thin outlines everywhere
export const lineWidth = 1

export const fontSize = {
  body: 17,
  input: 18,
  title: 34,
  brand: 26,
} as const

export const layout = {
  // Content never gets wider than this, so tablets and desktop browsers
  // show a centered phone-sized column instead of a stretched layout.
  maxContentWidth: 420,
  // Minimum (not fixed) height so larger system fonts can grow the control.
  controlHeight: 56,
  // Caps system font scaling so large accessibility text can't break layouts.
  maxFontScale: 1.3,
} as const