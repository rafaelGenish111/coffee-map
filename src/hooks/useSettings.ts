import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'
import type { AppSettings } from '../types/coffee-place'

const DEFAULT_SETTINGS: AppSettings = {
  id: 'settings',
  defaultMapCenter: { lat: 32.0853, lng: 34.7818 }, // Tel Aviv
  defaultMapZoom: 13,
}

export function useSettings() {
  const settings = useLiveQuery(() => db.settings.get('settings')) ?? DEFAULT_SETTINGS

  async function updateSettings(updates: Partial<AppSettings>) {
    const existing = await db.settings.get('settings')
    if (existing) {
      await db.settings.update('settings', updates)
    } else {
      await db.settings.add({ ...DEFAULT_SETTINGS, ...updates })
    }
  }

  return { settings, updateSettings }
}
