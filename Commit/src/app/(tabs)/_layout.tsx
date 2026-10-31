import { Tabs } from 'expo-router'
import { theme } from '@/utils/theme'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.bg, borderTopColor: '#1F1F2E' },
        tabBarActiveTintColor: theme.neon,
        tabBarInactiveTintColor: theme.muted,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
    </Tabs>
  )
}