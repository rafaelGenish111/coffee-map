const MAX_SIZE = 1024 * 1024 // 1MB
const THUMBNAIL_SIZE = 200

export async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  const maxDim = 1600
  let { width, height } = bitmap

  if (width > maxDim || height > maxDim) {
    const ratio = Math.min(maxDim / width, maxDim / height)
    width = Math.round(width * ratio)
    height = Math.round(height * ratio)
  }

  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  let quality = 0.85
  let blob = await canvasToBlob(canvas, quality)

  while (blob.size > MAX_SIZE && quality > 0.3) {
    quality -= 0.1
    blob = await canvasToBlob(canvas, quality)
  }

  return blob
}

export async function createThumbnail(blob: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(blob)
  const canvas = document.createElement('canvas')
  const ratio = Math.min(THUMBNAIL_SIZE / bitmap.width, THUMBNAIL_SIZE / bitmap.height)
  canvas.width = Math.round(bitmap.width * ratio)
  canvas.height = Math.round(bitmap.height * ratio)
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return canvasToBlob(canvas, 0.7)
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality)
  })
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.readAsDataURL(blob)
  })
}

export function blobToUrl(blob: Blob): string {
  return URL.createObjectURL(blob)
}
