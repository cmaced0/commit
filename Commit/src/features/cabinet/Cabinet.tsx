import { Stack, useGlobalSearchParams } from 'expo-router'
import { CabinetFrame, usePanelFill } from '@/components/ui/CabinetFrame'
import { useCabinet } from './useCabinet'
import { DeckNav } from './DeckNav'
import { OptionsButton, ProfileButton } from './TopButtons'

const DEFAULT_TITLE = 'Challenge Rooms'

// Puts the cabinet around every page in (tabs). The pages render inside the center
// panel through a Stack, so back navigation and screen history still work.
export function Cabinet() {
  const { title } = useCabinet()
  const panelFill = usePanelFill()

  // A page under room/[roomId] means a room is chosen, so the deck appears.
  const { roomId: rawRoomId } = useGlobalSearchParams<{ roomId?: string }>()
  const roomId = typeof rawRoomId === 'string' && rawRoomId ? rawRoomId : null

  return (
    <CabinetFrame
      title={title ?? DEFAULT_TITLE}
      // TODO: pass onPress={() => router.push('/profile')} and '/options' once those pages exist
      left={<ProfileButton />}
      right={<OptionsButton />}
      deck={roomId ? <DeckNav roomId={roomId} /> : undefined}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',

          contentStyle: {backgroundColor: panelFill}
        }}
      />
    </CabinetFrame>
  )
}