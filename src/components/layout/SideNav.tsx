import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Map, Plus, Settings, Coffee } from 'lucide-react'
import { cn } from '../../utils/cn'

const tabs = [
  { path: '/', icon: Home, label: 'בית' },
  { path: '/map', icon: Map, label: 'מפה' },
  { path: '/add', icon: Plus, label: 'הוספה' },
  { path: '/settings', icon: Settings, label: 'הגדרות' },
]

export function SideNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="hidden lg:flex fixed inset-y-0 start-0 w-64 flex-col bg-bg-surface/95 backdrop-blur-md border-e border-glass-border z-40">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-glass-border">
        <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
          <Coffee size={20} className="text-accent" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-text-primary">Coffee Map</h1>
          <p className="text-xs text-text-muted">גלה עגלות קפה</p>
        </div>
      </div>

      <div className="flex flex-col gap-1 p-3 flex-1">
        {tabs.map((tab) => {
          const isActive = tab.path === '/' ? location.pathname === '/' : location.pathname.startsWith(tab.path)
          const Icon = tab.icon

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
                isActive
                  ? 'bg-accent/15 text-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-glass-bg'
              )}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      <div className="p-4 border-t border-glass-border">
        <p className="text-xs text-text-muted text-center">Coffee Map v1.0</p>
      </div>
    </nav>
  )
}
