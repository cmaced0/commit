import { Cabinet } from '@/features/cabinet/Cabinet'
import { CabinetProvider } from '@/features/cabinet/CabinetProvider'

// Wraps every page in the arcade-cabinet frame (marquee, center panel, control deck).
// It is not a tab navigator anymore: the pages render inside a Stack in the panel.
export default function TabsLayout() {
  return (
    <CabinetProvider>
      <Cabinet />
    </CabinetProvider>
  )
}