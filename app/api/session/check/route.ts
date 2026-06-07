// app/api/session/check/route.ts

import { NextRequest } from 'next/server'
import redis from '@/lib/redis'
import { createHash } from 'crypto'

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
        const { fingerprint } = body

        if (!fingerprint || typeof fingerprint !== 'string') {
            return Response.json({ error: 'INVALID_FINGERPRINT' }, { status: 400 })
        }

        const ip = getClientIp(req)
        const raw = fingerprint + ':' + ip
        const key = 'ratelimit:' + createHash('sha256').update(raw).digest('hex')

        const count = await redis.incr(key)
        if (count === 1) {
            await redis.expire(key, 900) // 15 minutes (900 seconds)
        }

        // Limit to 4 requests per 15 minutes. The 5th one is blocked (count > 4).
        if (count > 4) {
            const ttl = await redis.ttl(key)
            return Response.json({ allowed: false, retryAfter: ttl }, { status: 429 })
        }

        return Response.json({ allowed: true, remaining: 4 - count })

    } catch {
        return Response.json({ error: 'SERVER_ERROR' }, { status: 500 })
    }
}