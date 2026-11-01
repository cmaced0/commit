import { Link } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { theme } from '@/utils/theme'

export default function NotFound() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Page not found</Text>
      <Link href="/" style={styles.link}>Go home</Link>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '700', marginBottom: 12 },
  link: { color: theme.neon, fontSize: 16, fontWeight: '600' },
})