import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useSettings } from '../hooks/useSettings'
import { useCoffeePlaces } from '../hooks/useCoffeePlaces'
import { useToast } from '../context/ToastContext'
import { db } from '../db/database'
import { Key, Download, Upload, Trash2, Database } from 'lucide-react'
import { Modal } from '../components/ui/Modal'

export function SettingsPage() {
  const { settings, updateSettings } = useSettings()
  const { places } = useCoffeePlaces()
  const { showToast } = useToast()
  const [apiKey, setApiKey] = useState(settings.geminiApiKey || '')
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  async function handleSaveApiKey() {
    await updateSettings({ geminiApiKey: apiKey.trim() })
    showToast('מפתח API נשמר', 'success')
  }

  async function handleExport() {
    const allPlaces = await db.places.toArray()
    const exportData = allPlaces.map(({ photo, photoThumbnail, ...rest }) => rest)
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `coffee-map-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('הנתונים יוצאו בהצלחה', 'success')
  }

  async function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const data = JSON.parse(text)
        if (!Array.isArray(data)) throw new Error('Invalid format')
        let count = 0
        for (const item of data) {
          if (item.id && item.name) {
            await db.places.put(item)
            count++
          }
        }
        showToast(`יובאו ${count} מקומות`, 'success')
      } catch {
        showToast('שגיאה בייבוא הקובץ', 'error')
      }
    }
    input.click()
  }

  async function handleClearAll() {
    await db.places.clear()
    setShowClearConfirm(false)
    showToast('כל הנתונים נמחקו', 'info')
  }

  return (
    <div>
      <Header title="הגדרות" />

      <div className="p-4 flex flex-col gap-6 max-w-2xl mx-auto w-full">
        <section className="glass rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-accent">
            <Key size={16} />
            <h3 className="font-bold text-sm">מפתח Google Gemini API</h3>
          </div>
          <p className="text-xs text-text-secondary">
            נדרש לחילוץ אוטומטי של פרטים מצילומי מסך. ניתן להשיג מפתח ב-Google AI Studio. המפתח נשמר מקומית בלבד.
          </p>
          <Input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIza..."
            type="password"
            dir="ltr"
          />
          <Button onClick={handleSaveApiKey} size="sm">
            שמור מפתח
          </Button>
        </section>

        <section className="glass rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-accent">
            <Database size={16} />
            <h3 className="font-bold text-sm">נתונים</h3>
          </div>
          <p className="text-xs text-text-secondary">
            {places.length} מקומות שמורים
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleExport} className="flex-1 flex items-center justify-center gap-2">
              <Download size={14} />
              <span>ייצוא</span>
            </Button>
            <Button variant="secondary" size="sm" onClick={handleImport} className="flex-1 flex items-center justify-center gap-2">
              <Upload size={14} />
              <span>ייבוא</span>
            </Button>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center justify-center gap-2"
          >
            <Trash2 size={14} />
            <span>מחק הכל</span>
          </Button>
        </section>

        <p className="text-xs text-text-muted text-center">
          Coffee Map v1.0 - כל הנתונים נשמרים מקומית במכשיר
        </p>
      </div>

      <Modal open={showClearConfirm} onClose={() => setShowClearConfirm(false)} title="מחיקת כל הנתונים">
        <p className="text-sm text-text-secondary mb-4">
          בטוח? כל המקומות יימחקו לצמיתות.
        </p>
        <div className="flex gap-2">
          <Button variant="danger" onClick={handleClearAll} className="flex-1">מחק הכל</Button>
          <Button variant="secondary" onClick={() => setShowClearConfirm(false)} className="flex-1">ביטול</Button>
        </div>
      </Modal>
    </div>
  )
}
