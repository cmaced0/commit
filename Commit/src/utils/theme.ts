import { Platform } from 'react-native'

export const theme = {
  bg: '#0B0B12',
  text: '#FFFFFF',
  muted: '#9A9AB0',
  neon: '#B026FF',
  danger: '#FF6B8B',
}

// Purple glow around the input bubble; stronger while focused
export const neonGlow = (active: boolean) => ({
  shadowColor: theme.neon,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: active ? 0.9 : 0.45,
  shadowRadius: active ? 14 : 8,
  elevation: active ? 10 : 4,
})

// Removes the browser's default focus ring so only the neon outline shows on web
export const noWebOutline: any = Platform.select({
  web: { outlineStyle: 'none' },
  default: {},
})