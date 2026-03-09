import { Star } from 'lucide-react'
import { cn } from '../../utils/cn'

interface RatingStarsProps {
  rating: number
  onChange?: (rating: number) => void
  size?: number
}

export function RatingStars({ rating, onChange, size = 18 }: RatingStarsProps) {
  const interactive = !!onChange

  return (
    <div className="flex gap-0.5" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star === rating ? 0 : star)}
          className={cn(
            'transition-transform duration-150',
            interactive && 'cursor-pointer hover:scale-110 active:scale-95'
          )}
        >
          <Star
            size={size}
            className={cn(
              'transition-colors',
              star <= rating ? 'fill-star text-star' : 'fill-none text-text-muted'
            )}
          />
        </button>
      ))}
    </div>
  )
}
