import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Map, Plus, Settings } from 'lucide-react'
import { cn } from '../../utils/cn'

const tabs = [
  { path: '/', icon: Home, label: 'בית' },
  { path: '/map', icon: Map, label: 'מפה' },
  { path: '/add', icon: Plus, label: 'הוספה' },
  { path: '/settings', icon: Settings, label: 'הגדרות' },
]

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-bg-surface/90 backdrop-blur-md border-t border-glass-border safe-area-pb lg:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = tab.path === '/' ? location.pathname === '/' : location.pathname.startsWith(tab.path)
          const Icon = tab.icon
          const isAdd = tab.path === '/add'

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                'flex flex-col items-center gap-0.5 px-4 py-2 transition-all duration-200 cursor-pointer',
                isAdd
                  ? 'relative -top-3 bg-accent rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-accent/20'
                  : isActive
                    ? 'text-accent'
                    : 'text-text-muted hover:text-text-secondary'
              )}
            >
              <Icon size={isAdd ? 24 : 20} strokeWidth={isActive || isAdd ? 2.5 : 1.5} className={isAdd ? 'text-bg-primary' : ''} />
              {!isAdd && <span className="text-[10px] font-medium">{tab.label}</span>}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
