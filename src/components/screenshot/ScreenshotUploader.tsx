import { useRef } from 'react'
import { Camera, Image } from 'lucide-react'
import { Button } from '../ui/Button'

interface ScreenshotUploaderProps {
  onFileSelect: (file: File) => void
}

export function ScreenshotUploader({ onFileSelect }: ScreenshotUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-6">
      <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center">
        <Camera size={40} className="text-accent" />
      </div>

      <div className="text-center">
        <h2 className="text-lg font-bold text-text-primary mb-1">העלאת צילום מסך</h2>
        <p className="text-sm text-text-secondary">
          העלה צילום מסך מאינסטגרם ונחלץ את הפרטים אוטומטית
        </p>
      </div>

      <div className="flex gap-3 w-full max-w-xs">
        <Button
          variant="primary"
          className="flex-1 flex items-center justify-center gap-2"
          onClick={() => fileRef.current?.click()}
        >
          <Image size={16} />
          <span>גלריה</span>
        </Button>
        <Button
          variant="secondary"
          className="flex-1 flex items-center justify-center gap-2"
          onClick={() => cameraRef.current?.click()}
        >
          <Camera size={16} />
          <span>מצלמה</span>
        </Button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
      />
    </div>
  )
}
