import { cn } from '../../utils/cn'
import type { ReactNode } from 'react'

interface HeaderProps {
  title: string
  action?: ReactNode
  className?: string
}

export function Header({ title, action, className }: HeaderProps) {
  return (
    <header className={cn('flex items-center justify-between px-5 py-4 bg-bg-surface/80 backdrop-blur-md border-b border-glass-border sticky top-0 z-40', className)}>
      <h1 className="text-xl font-bold text-text-primary">{title}</h1>
      {action}
    </header>
  )
}
