import { ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAppearance } from '@/features/appearance/useAppearance'
import { cabinet, fontSize, layout, lineWidth, palette, spacing } from '@/constants/theme'
import { glow } from '@/utils/glow'
import { mix } from '@/utils/color'
import { CabinetPlate } from './CabinetPlate'

type Props = {
  title: string
  left?: ReactNode // top-left slot (profile button)
  right?: ReactNode // top-right slot (options button)
  deck?: ReactNode // bottom slot. The plate is always drawn; its content is optional.
  children: ReactNode // the center panel
}

// The arcade-cabinet shell: a marquee on top with the title, a rounded center panel
// for the actual page, and a control deck on the bottom. It has no product logic, so
// whatever sits in the slots is decided by the layout that uses it.
//
// Heights are shares of the space inside the safe areas (see `cabinet` in theme.ts),
// so the proportions hold on any phone. The frame never scrolls; pages scroll inside
// the panel.
export function CabinetFrame({ title, left, right, deck, children }: Props) {
  const insets = useSafeAreaInsets()
  const { primary } = useAppearance()

  // Opaque on purpose: the glow below needs an opaque background to render on Android.
  // The panel is the primary color blended into the marble gray, so it follows the palette.
  const panelFill = mix(palette.bg, primary, cabinet.panelTint)

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top + spacing.sm,
          paddingBottom: insets.bottom + spacing.sm,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <View style={styles.column}>
        <CabinetPlate variant="marquee" grow={cabinet.marqueeFlex}>
          <View style={styles.marqueeRow}>
            <View style={styles.side}>{left}</View>
            <Text
              style={[styles.title, { textShadowColor: primary }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              accessibilityRole="header"
              maxFontSizeMultiplier={layout.maxFontScale}
            >
              {title}
            </Text>
            <View style={[styles.side, styles.sideRight]}>{right}</View>
          </View>
        </CabinetPlate>

        {/* Outer view carries the border and glow, inner view clips the content to the
            rounded corners. They are separate because clipping would hide the glow. */}
        <View
          style={[
            styles.panel,
            { backgroundColor: panelFill, borderColor: primary },
            glow(primary, 'soft'),
          ]}
        >
          <View style={styles.panelClip}>{children}</View>
        </View>

        <CabinetPlate variant="deck" grow={cabinet.deckFlex}>
          {deck}
        </CabinetPlate>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  column: {
    flex: 1,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  marqueeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    width: 44,
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    color: palette.text,
    fontSize: fontSize.brand - 4,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  panel: {
    flex: cabinet.panelFlex,
    width: `${cabinet.panelWidthRatio * 100}%`,
    alignSelf: 'center',
    borderWidth: lineWidth,
    borderRadius: cabinet.panelRadius,
  },
  panelClip: {
    flex: 1,
    borderRadius: cabinet.panelRadius - lineWidth,
    overflow: 'hidden',
  },
})