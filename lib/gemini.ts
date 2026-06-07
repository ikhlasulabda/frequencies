// lib/gemini.ts

import { GeminiResult } from '@/types'

export async function callGemini(prompt: string): Promise<GeminiResult> {

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/` +
        `gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    response_mime_type: 'application/json',
                    temperature: 0.7,
                    maxOutputTokens: 8192
                }
            }),
            signal: AbortSignal.timeout(20000)
        }
    )

    if (!response.ok) throw new Error('GEMINI_API_ERROR')

    const data = await response.json()
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!rawText) throw new Error('GEMINI_EMPTY_RESPONSE')

    let parsed: GeminiResult
    try {
        const clean = rawText.replace(/```json|```/g, '').trim()
        parsed = JSON.parse(clean)
    } catch {
        throw new Error('GEMINI_INVALID_JSON')
    }

    const { judul, penyanyi, mood_tag, punchline } = parsed

    if (!judul || !penyanyi || !mood_tag || !punchline) {
        throw new Error('GEMINI_INCOMPLETE_FIELDS')
    }

    return { judul, penyanyi, mood_tag, punchline }
}