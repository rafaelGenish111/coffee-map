import Dexie, { type EntityTable } from 'dexie'
import type { CoffeePlace, AppSettings } from '../types/coffee-place'

const db = new Dexie('CoffeeMapDB') as Dexie & {
  places: EntityTable<CoffeePlace, 'id'>
  settings: EntityTable<AppSettings, 'id'>
}

db.version(1).stores({
  places: 'id, name, rating, createdAt',
  settings: 'id',
})

export { db }
