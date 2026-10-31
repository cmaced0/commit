import { Stack } from 'expo-router'
import { theme } from '@/utils/theme'

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: theme.bg },
      }}
    />
  )
}