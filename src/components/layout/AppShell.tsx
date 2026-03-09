import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { SideNav } from './SideNav'

export function AppShell() {
  return (
    <div className="flex min-h-[100dvh]">
      <SideNav />
      <main className="flex-1 pb-20 lg:pb-0 lg:ps-64">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
