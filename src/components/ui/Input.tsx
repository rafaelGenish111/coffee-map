import { cn } from '../../utils/cn'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className, id, ...props }: InputProps) {
  const inputId = id || label?.replace(/\s/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs text-text-secondary font-medium">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full bg-bg-card border border-glass-border rounded-xl px-4 py-2.5 text-sm text-text-primary',
          'placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-colors',
          className
        )}
        {...props}
      />
    </div>
  )
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function TextArea({ label, className, id, ...props }: TextAreaProps) {
  const inputId = id || label?.replace(/\s/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs text-text-secondary font-medium">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          'w-full bg-bg-card border border-glass-border rounded-xl px-4 py-3 text-sm text-text-primary',
          'placeholder:text-text-muted focus:outline-none focus:border-accent/40 transition-colors resize-none',
          className
        )}
        {...props}
      />
    </div>
  )
}
