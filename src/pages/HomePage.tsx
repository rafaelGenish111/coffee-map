import { useState } from 'react'
import { Search } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { CoffeeCardList } from '../components/places/CoffeeCardList'
import { useCoffeePlaces } from '../hooks/useCoffeePlaces'
import { useGeolocation } from '../hooks/useGeolocation'
import { useNearbyPlaces } from '../hooks/useNearbyPlaces'
import { motion, AnimatePresence } from 'framer-motion'

type SortMode = 'recent' | 'nearby' | 'rating'

export function HomePage() {
  const { places } = useCoffeePlaces()
  const { position } = useGeolocation()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortMode>('recent')
  const [showSearch, setShowSearch] = useState(false)

  const nearbyPlaces = useNearbyPlaces(
    places,
    position?.lat ?? null,
    position?.lng ?? null
  )

  const filtered = nearbyPlaces.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location?.address?.includes(search) ||
    p.notes?.includes(search)
  )

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'nearby') return a.distance - b.distance
    if (sort === 'rating') return b.rating - a.rating
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const sortOptions: { key: SortMode; label: string }[] = [
    { key: 'recent', label: 'אחרון' },
    { key: 'nearby', label: 'קרוב' },
    { key: 'rating', label: 'דירוג' },
  ]

  return (
    <div>
      <Header
        title="Coffee Map"
        action={
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-lg hover:bg-glass-bg text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <Search size={20} />
          </button>
        }
      />

      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-4 bg-bg-surface border-b border-glass-border"
          >
            <div className="py-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="חיפוש מקום..."
                className="w-full bg-bg-card border border-glass-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/40"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto w-full">
        <div className="flex gap-2 px-4 pt-4">
          {sortOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSort(opt.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                sort === opt.key
                  ? 'bg-accent text-bg-primary'
                  : 'bg-bg-card text-text-secondary border border-glass-border hover:border-accent/30'
              }`}
            >
              {opt.label}
            </button>
          ))}
          <span className="text-xs text-text-muted self-center mr-auto">
            {places.length} מקומות
          </span>
        </div>

        <CoffeeCardList places={sorted} />
      </div>
    </div>
  )
}
