import { useState, useEffect, useCallback } from 'react'

interface GeoPosition {
  lat: number
  lng: number
  accuracy: number
}

export function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const requestPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('הדפדפן לא תומך במיקום')
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        })
        setLoading(false)
        setError(null)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }, [])

  useEffect(() => {
    requestPosition()
  }, [requestPosition])

  return { position, error, loading, requestPosition }
}
