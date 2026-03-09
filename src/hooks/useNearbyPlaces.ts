import { useMemo } from 'react'
import type { CoffeePlace } from '../types/coffee-place'
import { haversineDistance } from '../services/distance'

export interface PlaceWithDistance extends CoffeePlace {
  distance: number
}

export function useNearbyPlaces(
  places: CoffeePlace[],
  userLat: number | null,
  userLng: number | null
): PlaceWithDistance[] {
  return useMemo(() => {
    if (userLat === null || userLng === null) return places.map((p) => ({ ...p, distance: Infinity }))

    return places
      .filter((p) => p.location)
      .map((p) => ({
        ...p,
        distance: haversineDistance(userLat, userLng, p.location!.lat, p.location!.lng),
      }))
      .sort((a, b) => a.distance - b.distance)
  }, [places, userLat, userLng])
}
