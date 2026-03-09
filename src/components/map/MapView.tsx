import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { RatingStars } from '../places/RatingStars'
import { formatDistance } from '../../services/distance'
import { renderToStaticMarkup } from 'react-dom/server'
import type { CoffeePlace } from '../../types/coffee-place'

const coffeeIcon = L.divIcon({
  className: '',
  html: renderToStaticMarkup(
    <div style={{
      width: 36, height: 36, borderRadius: '50%', background: '#c9a96e',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(201,169,110,0.4)', border: '2px solid #0f0f23',
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f0f23" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" />
      </svg>
    </div>
  ),
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

const userIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative;width:16px;height:16px;">
    <div class="location-pulse" style="position:absolute;inset:0;border-radius:50%;background:rgba(100,255,218,0.3);"></div>
    <div style="position:absolute;inset:2px;border-radius:50%;background:#64ffda;border:2px solid #0f0f23;"></div>
  </div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], map.getZoom())
  }, [lat, lng, map])
  return null
}

interface MapViewProps {
  places: (CoffeePlace & { distance?: number })[]
  userPosition?: { lat: number; lng: number } | null
  center?: { lat: number; lng: number }
  zoom?: number
  onMapClick?: (lat: number, lng: number) => void
  className?: string
}

export function MapView({ places, userPosition, center, zoom = 13, onMapClick, className }: MapViewProps) {
  const navigate = useNavigate()
  const mapCenter = useMemo(
    () => center || (userPosition ? { lat: userPosition.lat, lng: userPosition.lng } : { lat: 32.0853, lng: 34.7818 }),
    [center, userPosition]
  )

  return (
    <MapContainer
      center={[mapCenter.lat, mapCenter.lng]}
      zoom={zoom}
      className={className || 'h-full w-full'}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {center && <RecenterMap lat={center.lat} lng={center.lng} />}

      {onMapClick && <MapClickHandler onClick={onMapClick} />}

      {userPosition && (
        <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon} />
      )}

      {places.map((place) =>
        place.location ? (
          <Marker
            key={place.id}
            position={[place.location.lat, place.location.lng]}
            icon={coffeeIcon}
          >
            <Popup>
              <div className="min-w-[180px] p-1" dir="rtl">
                <h3 className="font-bold text-sm mb-1">{place.name}</h3>
                <RatingStars rating={place.rating} size={12} />
                {place.distance !== undefined && place.distance !== Infinity && (
                  <p className="text-xs mt-1 opacity-70">{formatDistance(place.distance)}</p>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => navigate(`/place/${place.id}`)}
                    className="text-xs text-[#c9a96e] font-medium cursor-pointer"
                  >
                    פרטים
                  </button>
                  {place.location && (
                    <a
                      href={`https://waze.com/ul?ll=${place.location.lat},${place.location.lng}&navigate=yes`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#64ffda] font-medium flex items-center gap-1"
                    >
                      <span>ניווט</span>
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  )
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  const map = useMap()
  useEffect(() => {
    const handler = (e: L.LeafletMouseEvent) => onClick(e.latlng.lat, e.latlng.lng)
    map.on('click', handler)
    return () => { map.off('click', handler) }
  }, [map, onClick])
  return null
}
