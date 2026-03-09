import { useState } from 'react'
import { Input, TextArea } from '../ui/Input'
import { Button } from '../ui/Button'
import { RatingStars } from '../places/RatingStars'
import { Loader2, MapPin } from 'lucide-react'
import type { ExtractionResult as ExtractionResultType } from '../../types/coffee-place'

interface ExtractionResultProps {
  data: ExtractionResultType
  imageUrl: string
  onSave: (data: {
    name: string
    websiteUrl: string
    instagramUrl: string
    notes: string
    rating: number
    useCurrentLocation: boolean
    locationHint: string
  }) => void
  saving: boolean
}

export function ExtractionResult({ data, imageUrl, onSave, saving }: ExtractionResultProps) {
  const [name, setName] = useState(data.name || '')
  const [websiteUrl, setWebsiteUrl] = useState(data.websiteUrl || '')
  const [instagramUrl, setInstagramUrl] = useState(
    data.instagramHandle ? `https://instagram.com/${data.instagramHandle.replace('@', '')}` : ''
  )
  const [notes, setNotes] = useState(data.description || '')
  const [rating, setRating] = useState(0)
  const [useCurrentLocation, setUseCurrentLocation] = useState(true)
  const [locationHint, setLocationHint] = useState(data.locationHint || '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), websiteUrl, instagramUrl, notes, rating, useCurrentLocation, locationHint })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <img src={imageUrl} alt="צילום מסך" className="w-full h-48 object-cover rounded-xl" />

      <Input
        label="שם המקום"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="שם בית הקפה / עגלת קפה"
        required
      />

      <Input
        label="אתר אינטרנט"
        value={websiteUrl}
        onChange={(e) => setWebsiteUrl(e.target.value)}
        placeholder="https://..."
        type="url"
        dir="ltr"
      />

      <Input
        label="אינסטגרם"
        value={instagramUrl}
        onChange={(e) => setInstagramUrl(e.target.value)}
        placeholder="https://instagram.com/..."
        dir="ltr"
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-text-secondary font-medium">דירוג</span>
        <RatingStars rating={rating} onChange={setRating} size={24} />
      </div>

      <TextArea
        label="הערות"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="מה חשבת? איך הקפה?"
        rows={3}
      />

      <div className="flex flex-col gap-2">
        <span className="text-xs text-text-secondary font-medium">מיקום</span>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useCurrentLocation}
            onChange={(e) => setUseCurrentLocation(e.target.checked)}
            className="accent-accent"
          />
          <span className="text-sm text-text-primary">השתמש במיקום הנוכחי</span>
        </label>
        {!useCurrentLocation && (
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-text-muted flex-shrink-0" />
            <Input
              value={locationHint}
              onChange={(e) => setLocationHint(e.target.value)}
              placeholder="הזן כתובת או שם מיקום"
              className="flex-1"
            />
          </div>
        )}
      </div>

      <Button type="submit" disabled={!name.trim() || saving} className="mt-2">
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            <span>שומר...</span>
          </span>
        ) : (
          'שמור מקום'
        )}
      </Button>
    </form>
  )
}
