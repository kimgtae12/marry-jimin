import { InvitationPage } from '@/pages/invitation'
import { AppProviders } from './providers/AppProviders'

export function App() {
  return (
    <AppProviders>
      <InvitationPage />
    </AppProviders>
  )
}
