import { Link } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { fontSize, palette, spacing } from '@/constants/theme'
import { useAppearance } from '@/features/appearance/useAppearance'

export default function NotFound() {
  const { accent } = useAppearance()

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Page not found</Text>
      <Link href="/" style={[styles.link, { color: accent }]}>
        Go home
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg, alignItems: 'center', justifyContent: 'center' },
  title: { color: palette.text, fontSize: fontSize.body + 7, fontWeight: '700', marginBottom: spacing.md },
  link: { fontSize: fontSize.body, fontWeight: '600' },
})