import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { AppearanceProvider } from '@/features/appearance/AppearanceProvider'
import { useAppearance } from '@/features/appearance/useAppearance'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { useAuth } from '@/features/auth/hooks'
import { palette } from '@/constants/theme'

SplashScreen.preventAutoHideAsync()

// Must be a CHILD of the providers: useAuth() and useAppearance() read their context.
function RootNavigator() {
  const { session, loading } = useAuth()
  const { ready } = useAppearance()

  // Keep the splash screen up until both the saved session and the saved
  // accent color are loaded, so nothing flashes the wrong screen or color.
  useEffect(() => {
    if (!loading && ready) SplashScreen.hideAsync()
  }, [loading, ready])

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.bg } }}>
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
    <AppearanceProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </AuthProvider>
    </AppearanceProvider>
  )
}