// app/api/result/[sessionId]/route.ts
// Ambil data hasil analisis dari Redis berdasarkan sessionId.

import redis from '@/lib/redis'
import { SessionResult } from '@/types'
import { getDeezerTrackById } from '@/lib/deezer'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params

        if (!sessionId || typeof sessionId !== 'string') {
            return Response.json({ error: 'INVALID_SESSION' }, { status: 400 })
        }

        const raw = await redis.get<SessionResult>(`session:${sessionId}`)

        if (!raw) {
            return Response.json({ error: 'SESSION_NOT_FOUND' }, { status: 404 })
        }

        // Fetch preview URL fresh dari Deezer (URL-nya expire)
        const freshTrack = await getDeezerTrackById(raw.deezer_id)

        return Response.json({
            ...raw,
            preview_url: freshTrack?.preview ?? null,
        })

    } catch {
        return Response.json({ error: 'SERVER_ERROR' }, { status: 500 })
    }
}