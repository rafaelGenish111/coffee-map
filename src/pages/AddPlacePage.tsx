import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { ScreenshotUploader } from '../components/screenshot/ScreenshotUploader'
import { ExtractionResult } from '../components/screenshot/ExtractionResult'
import { useCoffeePlaces } from '../hooks/useCoffeePlaces'
import { useSettings } from '../hooks/useSettings'
import { useGeolocation } from '../hooks/useGeolocation'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'
import { compressImage, createThumbnail, blobToUrl } from '../services/image'
import { extractPlaceInfo } from '../services/ocr'
import { geocodeAddress, reverseGeocode } from '../services/geocoding'
import { Loader2, AlertCircle, PenLine } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input, TextArea } from '../components/ui/Input'
import { RatingStars } from '../components/places/RatingStars'
import { motion, AnimatePresence } from 'framer-motion'
import type { ExtractionResult as ExtractionResultType } from '../types/coffee-place'

type Step = 'upload' | 'extracting' | 'review' | 'manual'

export function AddPlacePage() {
  const { addPlace } = useCoffeePlaces()
  const { settings } = useSettings()
  const { position } = useGeolocation()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('upload')
  const [imageBlob, setImageBlob] = useState<Blob | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [extractionData, setExtractionData] = useState<ExtractionResultType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // manual form state
  const [manualName, setManualName] = useState('')
  const [manualWebsite, setManualWebsite] = useState('')
  const [manualNotes, setManualNotes] = useState('')
  const [manualRating, setManualRating] = useState(0)

  async function handleFileSelect(file: File) {
    try {
      const compressed = await compressImage(file)
      setImageBlob(compressed)
      setImageUrl(blobToUrl(compressed))

      if (!settings.geminiApiKey) {
        setError('הגדר מפתח API בהגדרות כדי לחלץ פרטים אוטומטית')
        setStep('manual')
        return
      }

      setStep('extracting')
      setError(null)

      const result = await extractPlaceInfo(compressed, settings.geminiApiKey)
      setExtractionData(result)
      setStep('review')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בחילוץ פרטים')
      setStep('manual')
    }
  }

  async function handleSaveFromExtraction(data: {
    name: string
    websiteUrl: string
    instagramUrl: string
    notes: string
    rating: number
    useCurrentLocation: boolean
    locationHint: string
  }) {
    setSaving(true)
    try {
      let location = undefined

      if (data.useCurrentLocation && position) {
        const address = await reverseGeocode(position.lat, position.lng)
        location = { lat: position.lat, lng: position.lng, address: address || undefined }
      } else if (data.locationHint) {
        const geo = await geocodeAddress(data.locationHint)
        if (geo) location = { lat: geo.lat, lng: geo.lng, address: geo.address }
      }

      const thumbnail = imageBlob ? await createThumbnail(imageBlob) : undefined

      await addPlace({
        name: data.name,
        websiteUrl: data.websiteUrl || undefined,
        instagramUrl: data.instagramUrl || undefined,
        photo: imageBlob || undefined,
        photoThumbnail: thumbnail,
        rating: data.rating,
        notes: data.notes,
        location,
        tags: [],
      })

      showToast('המקום נוסף בהצלחה', 'success')
      navigate('/')
    } catch {
      showToast('שגיאה בשמירה', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleManualSave(e: React.FormEvent) {
    e.preventDefault()
    if (!manualName.trim()) return
    setSaving(true)
    try {
      let location = undefined
      if (position) {
        const address = await reverseGeocode(position.lat, position.lng)
        location = { lat: position.lat, lng: position.lng, address: address || undefined }
      }

      const thumbnail = imageBlob ? await createThumbnail(imageBlob) : undefined

      await addPlace({
        name: manualName.trim(),
        websiteUrl: manualWebsite || undefined,
        photo: imageBlob || undefined,
        photoThumbnail: thumbnail,
        rating: manualRating,
        notes: manualNotes,
        location,
        tags: [],
      })

      showToast('המקום נוסף בהצלחה', 'success')
      navigate('/')
    } catch {
      showToast('שגיאה בשמירה', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Header
        title="הוספת מקום"
        action={
          step === 'upload' ? (
            <button
              onClick={() => setStep('manual')}
              className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors cursor-pointer"
            >
              <PenLine size={14} />
              <span>ידני</span>
            </button>
          ) : undefined
        }
      />

      <div className="max-w-2xl mx-auto w-full">
      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScreenshotUploader onFileSelect={handleFileSelect} />
          </motion.div>
        )}

        {step === 'extracting' && (
          <motion.div key="extracting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            {imageUrl && <img src={imageUrl} alt="" className="w-32 h-32 rounded-xl object-cover opacity-60" />}
            <Loader2 size={32} className="text-accent animate-spin" />
            <p className="text-sm text-text-secondary">מחלץ פרטים מהתמונה...</p>
          </motion.div>
        )}

        {step === 'review' && extractionData && (
          <motion.div key="review" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <ExtractionResult
              data={extractionData}
              imageUrl={imageUrl}
              onSave={handleSaveFromExtraction}
              saving={saving}
            />
          </motion.div>
        )}

        {step === 'manual' && (
          <motion.div key="manual" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {error && (
              <div className="mx-4 mt-4 p-3 rounded-xl bg-error/10 border border-error/20 flex items-center gap-2">
                <AlertCircle size={16} className="text-error flex-shrink-0" />
                <span className="text-xs text-error">{error}</span>
              </div>
            )}

            <form onSubmit={handleManualSave} className="flex flex-col gap-4 p-4">
              {imageUrl && (
                <img src={imageUrl} alt="" className="w-full h-48 object-cover rounded-xl" />
              )}

              {!imageBlob && (
                <ScreenshotUploader onFileSelect={async (file) => {
                  const compressed = await compressImage(file)
                  setImageBlob(compressed)
                  setImageUrl(blobToUrl(compressed))
                }} />
              )}

              <Input
                label="שם המקום"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="שם בית הקפה / עגלת קפה"
                required
              />

              <Input
                label="אתר אינטרנט"
                value={manualWebsite}
                onChange={(e) => setManualWebsite(e.target.value)}
                placeholder="https://..."
                type="url"
                dir="ltr"
              />

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-text-secondary font-medium">דירוג</span>
                <RatingStars rating={manualRating} onChange={setManualRating} size={24} />
              </div>

              <TextArea
                label="הערות"
                value={manualNotes}
                onChange={(e) => setManualNotes(e.target.value)}
                placeholder="מה חשבת? איך הקפה?"
                rows={3}
              />

              <Button type="submit" disabled={!manualName.trim() || saving} className="mt-2">
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
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}
