import { Header } from '../components/layout/Header'
import { MapView } from '../components/map/MapView'
import { useCoffeePlaces } from '../hooks/useCoffeePlaces'
import { useGeolocation } from '../hooks/useGeolocation'
import { useNearbyPlaces } from '../hooks/useNearbyPlaces'
import { Crosshair } from 'lucide-react'

export function MapPage() {
  const { places } = useCoffeePlaces()
  const { position, requestPosition } = useGeolocation()

  const nearbyPlaces = useNearbyPlaces(
    places,
    position?.lat ?? null,
    position?.lng ?? null
  )

  return (
    <div className="flex flex-col h-dvh">
      <Header
        title="מפה"
        action={
          <button
            onClick={requestPosition}
            className="p-2 rounded-lg hover:bg-glass-bg text-text-secondary hover:text-accent transition-colors cursor-pointer"
            title="מרכז על המיקום שלי"
          >
            <Crosshair size={20} />
          </button>
        }
      />
      <div className="flex-1 relative">
        <MapView
          places={nearbyPlaces}
          userPosition={position}
          className="h-full w-full"
        />
        {places.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 glass rounded-xl px-4 py-2 text-center">
            <span className="text-xs text-text-secondary">
              {places.filter((p) => p.location).length} מקומות על המפה
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
