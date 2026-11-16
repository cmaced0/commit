// Pure geometry for the arcade-cabinet frame. No React or React Native imports, so it
// can be reasoned about (and tested) on its own.
//
// Layout, top to bottom, inside the safe areas:
//   marquee zone  ->  center panel (rounded rectangle)  ->  deck zone
//
// Four straight "legs" leave the panel's four corners and run outward until they
// leave the screen. The leg and the panel side it continues meet at `joinAngle`
// degrees (180 = a straight continuation, 160 = leaning out by 20 degrees).
// The marquee is the area between the two upper legs, the deck the area between the
// two lower legs. They have no outer borders: the only glowing lines are the panel's
// outline and the four legs.

type Point = [number, number]

export type CabinetGeometry = {
  panel: { x: number; y: number; w: number; h: number; r: number }
  marqueePoints: string // polygon for the marquee fill
  deckPoints: string // polygon for the deck fill
  linePath: string // panel outline plus the four legs, as ONE path so every line matches
  marqueeZone: { top: number; bottom: number } // where marquee content can sit
  deckZone: { top: number; bottom: number } // where deck content can sit
}

type Input = {
  width: number
  height: number
  insetTop: number // safe area plus gutter above the marquee content
  insetBottom: number // safe area plus gutter below the deck content
  panelWidthRatio: number
  marqueeShare: number
  panelShare: number
  deckShare: number
  radius: number
  joinAngle: number // degrees between a panel side and the leg continuing from it
}

// How far past the screen edge the legs are drawn, so the stroke caps are never visible
const OVERSHOOT = 24

const n = (v: number) => v.toFixed(2)
const pt = ([x, y]: Point) => `${n(x)},${n(y)}`

export function cabinetGeometry(i: Input): CabinetGeometry {
  const innerH = Math.max(0, i.height - i.insetTop - i.insetBottom)
  const total = i.marqueeShare + i.panelShare + i.deckShare

  const top = i.insetTop + (innerH * i.marqueeShare) / total
  const ph = (innerH * i.panelShare) / total
  const bottom = top + ph

  const pw = i.width * i.panelWidthRatio
  const left = (i.width - pw) / 2
  const right = left + pw
  const r = Math.max(0, Math.min(i.radius, pw / 2, ph / 2))

  // 180 would be a vertical leg, much below 100 would be nearly flat
  const join = Math.min(180, Math.max(100, i.joinAngle))
  const slope = Math.tan(((180 - join) * Math.PI) / 180) // sideways travel per unit of height

  // Each leg starts on the corner's arc, at its 45 degree point, so it grows out of the
  // curve instead of leaving a gap at the sharp corner.
  const off = r * (1 - Math.SQRT1_2)
  const tl: Point = [left + off, top + off]
  const tr: Point = [right - off, top + off]
  const bl: Point = [left + off, bottom - off]
  const br: Point = [right - off, bottom - off]

  // Upper legs lean out to the left and right while going up
  const up = tl[1] + OVERSHOOT
  const eTL: Point = [tl[0] - up * slope, -OVERSHOOT]
  const eTR: Point = [tr[0] + up * slope, -OVERSHOOT]

  // Lower legs lean out while going down
  const down = i.height + OVERSHOOT - bl[1]
  const eBL: Point = [bl[0] - down * slope, i.height + OVERSHOOT]
  const eBR: Point = [br[0] + down * slope, i.height + OVERSHOOT]

  const outline =
    `M${n(left + r)},${n(top)} H${n(right - r)} ` +
    `A${n(r)},${n(r)} 0 0 1 ${n(right)},${n(top + r)} V${n(bottom - r)} ` +
    `A${n(r)},${n(r)} 0 0 1 ${n(right - r)},${n(bottom)} H${n(left + r)} ` +
    `A${n(r)},${n(r)} 0 0 1 ${n(left)},${n(bottom - r)} V${n(top + r)} ` +
    `A${n(r)},${n(r)} 0 0 1 ${n(left + r)},${n(top)} Z`

  const legs =
    `M${pt(tl)} L${pt(eTL)} M${pt(tr)} L${pt(eTR)} ` +
    `M${pt(bl)} L${pt(eBL)} M${pt(br)} L${pt(eBR)}`

  return {
    panel: { x: left, y: top, w: pw, h: ph, r },
    marqueePoints: [tl, eTL, eTR, tr].map(pt).join(' '),
    deckPoints: [bl, eBL, eBR, br].map(pt).join(' '),
    linePath: `${outline} ${legs}`,
    marqueeZone: { top: i.insetTop, bottom: top },
    deckZone: { top: bottom, bottom: i.height - i.insetBottom },
  }
}