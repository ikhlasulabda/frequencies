// app/api/analyze/route.ts
// Pipeline utama: sanitasi → rate limit → Gemini → Deezer → Redis

import { NextRequest } from 'next/server'
import { createHash, randomUUID } from 'crypto'
import redis from '@/lib/redis'
import { sanitizeInput, validateChoice } from '@/lib/sanitize'
import { buildPrompt } from '@/lib/prompt'
import { callGemini } from '@/lib/gemini'
import { searchDeezer } from '@/lib/deezer'
import { getFallbackSong } from '@/lib/fallback'
import { QUESTIONS, Q2_BRANCHES } from '@/lib/questions'
import { SessionResult } from '@/types'

function getClientIp(req: NextRequest): string {
    return (
        req.headers.get('x-forwarded-for')?.split(',')[0] ??
        req.headers.get('x-real-ip') ??
        'unknown'
    )
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { fingerprint, answers, nama } = body

        // 1. Validasi fingerprint
        if (!fingerprint || typeof fingerprint !== 'string') {
            return Response.json({ error: 'INVALID_FINGERPRINT' }, { status: 400 })
        }

        // 2. Rate limit re-check server-side
        const ip = getClientIp(req)
        const raw = fingerprint + ':' + ip
        const key = 'ratelimit:' + createHash('sha256').update(raw).digest('hex')
        const count = await redis.get<number>(key) ?? 0

        if (count > 4) {
            const ttl = await redis.ttl(key)
            return Response.json({ error: 'RATE_LIMITED', retryAfter: ttl }, { status: 429 })
        }

        // 3. Sanitasi + validasi semua jawaban
        const q1Labels = QUESTIONS[0].choices!.map(c => c.label)
        const cleanQ1 = validateChoice(answers.q1, q1Labels)

        const q2Branch = Q2_BRANCHES[cleanQ1]
        if (!q2Branch) {
            return Response.json({ error: 'INVALID_Q1_BRANCH' }, { status: 400 })
        }
        const branchLabels = q2Branch.choices.map(c => c.label)
        let cleanQ2 = ''
        if (branchLabels.includes(answers.q2)) {
            cleanQ2 = answers.q2
        } else {
            cleanQ2 = sanitizeInput(answers.q2, 100)
        }

        const q3Labels = QUESTIONS[2].choices!.map(c => c.label)
        const cleanQ3 = validateChoice(answers.q3, q3Labels)

        const cleanAnswers = {
            q1: cleanQ1,
            q2: cleanQ2,
            q3: cleanQ3,
            q4: sanitizeInput(answers.q4, 150),
            q5: sanitizeInput(answers.q5, 30),
        }

        const cleanNama = nama
            ? sanitizeInput(nama, 30)
            : undefined

        // 4. Pipeline Gemini + Deezer dengan retry max 3x
        const excludeSongs: string[] = []
        let geminiResult = null
        let deezerTrack = null

        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                const prompt = buildPrompt(cleanAnswers, excludeSongs)
                geminiResult = await callGemini(prompt)

                // searchDeezer now internally runs 4 strategies:
                // strict → combined → title-only → artist-only with fuzzy scoring
                const track = await searchDeezer(geminiResult.judul, geminiResult.penyanyi)

                if (track) {
                    deezerTrack = track
                    break
                }

                // Lagu tidak ditemukan di Deezer setelah 4 strategi — blacklist dan retry Gemini
                console.warn(
                    `[analyze] Attempt ${attempt + 1}/3: Deezer miss for "${geminiResult.judul}" by "${geminiResult.penyanyi}"`
                )
                excludeSongs.push(`${geminiResult.judul} - ${geminiResult.penyanyi}`)

            } catch (err) {
                // Gemini atau Deezer error — log dan retry
                console.warn(`[analyze] Attempt ${attempt + 1}/3 error:`, err instanceof Error ? err.message : err)
                continue
            }
        }

        // 5. Fallback kalau semua retry gagal — coba beberapa fallback sebelum menyerah
        if (!geminiResult || !deezerTrack) {
            let fallbackFound = false

            // Coba max 3 lagu dari fallback pool (bisa jadi satu lagu hilang dari Deezer)
            for (let f = 0; f < 3; f++) {
                const fallback = getFallbackSong(cleanAnswers.q1, cleanAnswers.q3, excludeSongs)
                const fallbackTrack = await searchDeezer(fallback.judul, fallback.penyanyi)

                if (fallbackTrack) {
                    geminiResult = fallback
                    deezerTrack = fallbackTrack
                    fallbackFound = true
                    break
                }

                // Blacklist fallback yang gagal juga
                excludeSongs.push(`${fallback.judul} - ${fallback.penyanyi}`)
                console.warn(`[analyze] Fallback miss for "${fallback.judul}" by "${fallback.penyanyi}"`)
            }

            if (!fallbackFound || !geminiResult || !deezerTrack) {
                return Response.json({ error: 'SERVICE_UNAVAILABLE' }, { status: 503 })
            }
        }

        // 6. Simpan ke Redis dengan TTL 30 menit
        const sessionId = randomUUID()

        const sessionData: SessionResult = {
            judul: geminiResult.judul,
            penyanyi: geminiResult.penyanyi,
            mood_tag: geminiResult.mood_tag,
            punchline: geminiResult.punchline,
            deezer_id: deezerTrack.id,
            cover_url: deezerTrack.album.cover_big,
            nama: cleanNama,
            created_at: Date.now(),
        }

        await redis.set(`session:${sessionId}`, sessionData, { ex: 1800 })

        return Response.json({ sessionId })

    } catch {
        return Response.json({ error: 'SERVER_ERROR' }, { status: 500 })
    }
}