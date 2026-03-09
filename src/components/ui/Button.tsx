import { cn } from '../../utils/cn'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const variants = {
  primary: 'bg-accent text-bg-primary hover:bg-accent-hover',
  secondary: 'bg-bg-card text-text-primary border border-glass-border hover:bg-bg-card-hover',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-glass-bg',
  danger: 'bg-error/15 text-error border border-error/20 hover:bg-error/25',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-xl font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none cursor-pointer',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
