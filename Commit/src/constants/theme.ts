// Design tokens. Anything visual that more than one screen needs lives here.
// The neon colors are NOT here as fixed values: the user picks a palette and they
// come from useAppearance(). The neutrals below never change.

// Marble-gray neutrals. A faint cool tint keeps them from looking flat.
export const palette = {
  bg: '#121317',       // deepest layer (screen background)
  bgRaised: '#181A20', // cards, tab bar
  surface: '#1E2128',  // inputs and buttons (kept opaque so glows render on Android)
  vein: '#2A2E38',     // dividers, subtle marble veining
  border: '#343947',   // non-accent outlines
  text: '#F4F5F8',
  muted: '#8E94A6',
  danger: '#FF5C7A',   // fixed: errors never change with the palette
} as const

export type Palette = { id: string; name: string; primary: string; secondary: string }

// Choices offered to the user in the settings screen.
// Keep each pair far apart on the color wheel so the secondary reads as contrast.
export const PALETTES: readonly Palette[] = [
  { id: 'synthwave', name: 'Synthwave', primary: '#FF2EC4', secondary: '#22D3EE' },
  { id: 'ultraviolet', name: 'Ultraviolet', primary: '#B026FF', secondary: '#FFB020' },
  { id: 'miami', name: 'Miami', primary: '#22D3EE', secondary: '#FF6B3D' },
  { id: 'arcade', name: 'Arcade', primary: '#39FF88', secondary: '#B026FF' },
  { id: 'sunset', name: 'Sunset', primary: '#FFB020', secondary: '#FF2EC4' },
]

export const DEFAULT_PALETTE_ID = 'ultraviolet'

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const
export const radius = { md: 14, lg: 20 } as const

// Arcade-cabinet frame proportions (section 6). Shares of the height inside the safe
// areas, not pixels, so the layout fits any phone.
export const cabinet = {
  panelWidthRatio: 0.92, // center panel width as a share of the page width
  marqueeFlex: 11, // top plate    \
  panelFlex: 75, // center panel   > height shares, they add up to 100
  deckFlex: 14, // bottom plate    /
  panelRadius: 12,
  panelTint: 0.12, // how much of the primary color is blended into the panel
} as const

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