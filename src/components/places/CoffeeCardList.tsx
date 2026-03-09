import { Coffee } from 'lucide-react'
import { CoffeeCard } from './CoffeeCard'
import { EmptyState } from '../ui/EmptyState'
import { Button } from '../ui/Button'
import { useNavigate } from 'react-router-dom'
import type { CoffeePlace } from '../../types/coffee-place'

interface CoffeeCardListProps {
  places: (CoffeePlace & { distance?: number })[]
}

export function CoffeeCardList({ places }: CoffeeCardListProps) {
  const navigate = useNavigate()

  if (places.length === 0) {
    return (
      <EmptyState
        icon={<Coffee size={48} />}
        title="אין מקומות עדיין"
        description="הוסף את עגלת הקפה הראשונה שלך על ידי העלאת צילום מסך"
        action={
          <Button onClick={() => navigate('/add')}>הוסף מקום חדש</Button>
        }
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 p-4">
      {places.map((place, i) => (
        <CoffeeCard key={place.id} place={place} index={i} />
      ))}
    </div>
  )
}
