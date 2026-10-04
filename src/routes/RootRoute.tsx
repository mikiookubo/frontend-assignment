import { Outlet } from 'react-router'
import { AppLayout } from '../components/layout/AppLayout/AppLayout'
import { Logo } from '../components/layout/Logo/Logo'

export function RootRoute() {
  return (
    <AppLayout sidebar={<Logo />}>
      <Outlet />
    </AppLayout>
  )
}
