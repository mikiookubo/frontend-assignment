import { Outlet } from 'react-router'
import { AppLayout } from '../components/layout/AppLayout/AppLayout'
import { Sidebar } from '../features/content/components/Sidebar/Sidebar'

export function RootRoute() {
  return (
    <AppLayout sidebar={<Sidebar />}>
      <Outlet />
    </AppLayout>
  )
}
