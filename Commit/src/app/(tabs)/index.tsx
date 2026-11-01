import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useAuth } from '@/features/auth/hooks'
import { theme } from '@/utils/theme'

export default function Home() {
  const { session, signOut } = useAuth()

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Signed in as {session?.user.phone}</Text>

      <Pressable style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { color: '#FFFFFF', fontSize: 32, fontWeight: '800' },
  subtitle: { color: theme.muted, marginTop: 8, marginBottom: 32 },
  button: { height: 52, paddingHorizontal: 32, borderRadius: 20, backgroundColor: theme.neon, justifyContent: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
})