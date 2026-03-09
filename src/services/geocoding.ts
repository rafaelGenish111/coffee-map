interface NominatimResult {
  lat: string
  lon: string
  display_name: string
}

export async function geocodeAddress(query: string): Promise<{ lat: number; lng: number; address: string } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=il`

  const response = await fetch(url, {
    headers: { 'Accept-Language': 'he' },
  })

  if (!response.ok) return null

  const results: NominatimResult[] = await response.json()
  if (results.length === 0) return null

  return {
    lat: parseFloat(results[0].lat),
    lng: parseFloat(results[0].lon),
    address: results[0].display_name,
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`

  const response = await fetch(url, {
    headers: { 'Accept-Language': 'he' },
  })

  if (!response.ok) return null

  const result = await response.json()
  return result.display_name || null
}
