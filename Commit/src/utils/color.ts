// "#RRGGBB" -> [r, g, b], or null if it isn't a 6-digit hex color
function parse(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex)
  if (!m) return null
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// Blends `tint` into `base` and returns an OPAQUE hex color. `amount` is 0 (all base)
// to 1 (all tint). Use this instead of a see-through color when the surface also has
// a glow: Android only draws a glow on an opaque background.
export function mix(base: string, tint: string, amount: number): string {
  const a = parse(base)
  const b = parse(tint)
  if (!a || !b) return base
  const t = Math.min(1, Math.max(0, amount))
  const out = a.map((v, i) => Math.round(v + (b[i] - v) * t))
  return '#' + out.map((v) => v.toString(16).padStart(2, '0')).join('')
}