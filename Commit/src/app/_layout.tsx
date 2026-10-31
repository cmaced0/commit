import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { useAuth } from '@/features/auth/hooks'
import { theme } from '@/utils/theme'

SplashScreen.preventAutoHideAsync()

// This must be a CHILD of AuthProvider. useAuth() reads the provider's context,
// so it can't be called in the same component that renders <AuthProvider>.
function RootNavigator() {
  const { session, loading } = useAuth()

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync()
  }, [loading])

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg } }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AuthProvider>
  )
}