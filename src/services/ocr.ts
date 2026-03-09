import type { ExtractionResult } from '../types/coffee-place'
import { blobToBase64 } from './image'

export async function extractPlaceInfo(
  imageBlob: Blob,
  apiKey: string
): Promise<ExtractionResult> {
  const base64 = await blobToBase64(imageBlob)

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: imageBlob.type || 'image/jpeg',
                  data: base64,
                },
              },
              {
                text: `Analyze this screenshot of a coffee cart or coffee stand from Instagram or social media.
Extract the following information:
1. "name": The business or place name
2. "websiteUrl": Any website URL visible
3. "instagramHandle": Any Instagram handle visible (with @)
4. "description": A brief description in Hebrew of what you see
5. "locationHint": Any location information visible (address, city, area name)

Return ONLY valid JSON with these exact fields. Use null for any field you cannot determine.
Do not wrap in markdown code blocks.`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.2,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

  if (!text) throw new Error('No response from API')

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Could not parse response')

  return JSON.parse(jsonMatch[0]) as ExtractionResult
}
