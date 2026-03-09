import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'
import type { CoffeePlace } from '../types/coffee-place'

export function useCoffeePlaces() {
  const places = useLiveQuery(() => db.places.orderBy('createdAt').reverse().toArray()) ?? []

  async function addPlace(place: Omit<CoffeePlace, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString()
    await db.places.add({
      ...place,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    })
  }

  async function updatePlace(id: string, updates: Partial<CoffeePlace>) {
    await db.places.update(id, { ...updates, updatedAt: new Date().toISOString() })
  }

  async function deletePlace(id: string) {
    await db.places.delete(id)
  }

  async function getPlace(id: string) {
    return db.places.get(id)
  }

  return { places, addPlace, updatePlace, deletePlace, getPlace }
}
