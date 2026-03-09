import { useParams, useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'
import { useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { RatingStars } from '../components/places/RatingStars'
import { TextArea } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { useToast } from '../context/ToastContext'
import { useCoffeePlaces } from '../hooks/useCoffeePlaces'
import { blobToUrl } from '../services/image'
import { MapPin, Globe, Instagram, Trash2, ExternalLink, Navigation, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function PlaceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { updatePlace, deletePlace } = useCoffeePlaces()
  const place = useLiveQuery(() => (id ? db.places.get(id) : undefined), [id])

  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [rating, setRating] = useState(0)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    if (place) {
      setNotes(place.notes)
      setRating(place.rating)
      if (place.photo) {
        const url = blobToUrl(place.photo)
        setPhotoUrl(url)
        return () => URL.revokeObjectURL(url)
      }
    }
  }, [place])

  if (!place) {
    return (
      <div className="flex items-center justify-center h-[60dvh]">
        <p className="text-text-secondary">טוען...</p>
      </div>
    )
  }

  async function handleSave() {
    if (!id) return
    await updatePlace(id, { notes, rating })
    showToast('נשמר', 'success')
  }

  async function handleDelete() {
    if (!id) return
    await deletePlace(id)
    showToast('המקום נמחק', 'info')
    navigate('/')
  }

  const wazeUrl = place.location
    ? `https://waze.com/ul?ll=${place.location.lat},${place.location.lng}&navigate=yes`
    : null

  const googleMapsUrl = place.location
    ? `https://www.google.com/maps/dir/?api=1&destination=${place.location.lat},${place.location.lng}`
    : null

  return (
    <div>
      <Header
        title=""
        action={
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-glass-bg text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <ArrowRight size={20} />
          </button>
        }
      />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-8 max-w-3xl mx-auto w-full">
        {photoUrl && (
          <img src={photoUrl} alt={place.name} className="w-full h-56 object-cover" />
        )}

        <div className="p-5 flex flex-col gap-5">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">{place.name}</h1>
            <RatingStars rating={rating} onChange={(r) => { setRating(r); updatePlace(place.id, { rating: r }) }} size={22} />
          </div>

          {place.location?.address && (
            <div className="flex items-start gap-2 text-text-secondary">
              <MapPin size={16} className="mt-0.5 flex-shrink-0" />
              <span className="text-sm">{place.location.address}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {place.websiteUrl && (
              <a
                href={place.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
              >
                <Globe size={14} />
                <span>אתר</span>
                <ExternalLink size={10} />
              </a>
            )}
            {place.instagramUrl && (
              <a
                href={place.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
              >
                <Instagram size={14} />
                <span>אינסטגרם</span>
                <ExternalLink size={10} />
              </a>
            )}
          </div>

          {(wazeUrl || googleMapsUrl) && (
            <div className="flex gap-2">
              {wazeUrl && (
                <a
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-accent/10 border border-accent/20 rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-accent text-sm font-medium"
                >
                  <Navigation size={14} />
                  <span>Waze</span>
                </a>
              )}
              {googleMapsUrl && (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-success/10 border border-success/20 rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-success text-sm font-medium"
                >
                  <MapPin size={14} />
                  <span>Google Maps</span>
                </a>
              )}
            </div>
          )}

          <div>
            <TextArea
              label="הערות"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="הוסף הערות..."
              rows={4}
            />
            <Button onClick={handleSave} size="sm" variant="secondary" className="mt-2">
              שמור הערות
            </Button>
          </div>

          <div className="pt-4 border-t border-glass-border">
            <Button variant="danger" onClick={() => setShowDelete(true)} className="w-full flex items-center justify-center gap-2">
              <Trash2 size={14} />
              <span>מחק מקום</span>
            </Button>
          </div>

          <p className="text-xs text-text-muted text-center">
            נוסף: {new Date(place.createdAt).toLocaleDateString('he-IL')}
          </p>
        </div>
      </motion.div>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="מחיקת מקום">
        <p className="text-sm text-text-secondary mb-4">
          בטוח שברצונך למחוק את "{place.name}"? לא ניתן לשחזר.
        </p>
        <div className="flex gap-2">
          <Button variant="danger" onClick={handleDelete} className="flex-1">מחק</Button>
          <Button variant="secondary" onClick={() => setShowDelete(false)} className="flex-1">ביטול</Button>
        </div>
      </Modal>
    </div>
  )
}
