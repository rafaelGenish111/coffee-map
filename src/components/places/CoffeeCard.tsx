import { useNavigate } from 'react-router-dom'
import { MapPin, Globe, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { RatingStars } from './RatingStars'
import { formatDistance } from '../../services/distance'
import { blobToUrl } from '../../services/image'
import type { CoffeePlace } from '../../types/coffee-place'
import { useEffect, useState } from 'react'

interface CoffeeCardProps {
  place: CoffeePlace & { distance?: number }
  index: number
}

export function CoffeeCard({ place, index }: CoffeeCardProps) {
  const navigate = useNavigate()
  const [thumbUrl, setThumbUrl] = useState<string | null>(null)

  useEffect(() => {
    const blob = place.photoThumbnail || place.photo
    if (blob) {
      const url = blobToUrl(blob)
      setThumbUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [place.photoThumbnail, place.photo])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => navigate(`/place/${place.id}`)}
      className="glass rounded-2xl overflow-hidden cursor-pointer hover:bg-bg-card-hover transition-colors active:scale-[0.98] transition-transform duration-150"
    >
      <div className="flex gap-4 p-4">
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt={place.name}
            className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-bg-card flex items-center justify-center flex-shrink-0">
            <Globe size={24} className="text-text-muted" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-text-primary text-base truncate">{place.name}</h3>

          <div className="mt-1">
            <RatingStars rating={place.rating} size={14} />
          </div>

          {place.location?.address && (
            <div className="flex items-center gap-1.5 mt-2 text-text-secondary">
              <MapPin size={12} className="flex-shrink-0" />
              <span className="text-xs truncate">{place.location.address}</span>
            </div>
          )}

          <div className="flex items-center gap-3 mt-2">
            {place.distance !== undefined && place.distance !== Infinity && (
              <span className="text-xs text-accent font-medium">
                {formatDistance(place.distance)}
              </span>
            )}
            {place.websiteUrl && (
              <a
                href={place.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-text-muted hover:text-accent flex items-center gap-1"
              >
                <ExternalLink size={10} />
                <span>אתר</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
