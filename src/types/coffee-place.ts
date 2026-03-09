export interface PlaceLocation {
  lat: number
  lng: number
  address?: string
  city?: string
}

export interface CoffeePlace {
  id: string
  name: string
  websiteUrl?: string
  instagramUrl?: string
  photo?: Blob
  photoThumbnail?: Blob
  rating: number
  notes: string
  location?: PlaceLocation
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface AppSettings {
  id: 'settings'
  geminiApiKey?: string
  defaultMapCenter: { lat: number; lng: number }
  defaultMapZoom: number
}

export interface ExtractionResult {
  name: string | null
  websiteUrl: string | null
  instagramHandle: string | null
  description: string | null
  locationHint: string | null
}
