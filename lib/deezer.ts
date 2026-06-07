// lib/deezer.ts
// Deezer search with string sanitation, multi-strategy fallback, and fuzzy matching.

import { DeezerTrack } from '@/types'

// ─── Sanitation ──────────────────────────────────────────────────────────────

/**
 * Strip noise from Gemini-generated metadata before sending to Deezer API.
 * Removes: brackets & their contents, "feat/ft." clauses, remaster/version suffixes,
 * "Official Audio/Video" tags, and excess whitespace.
 */
function sanitizeQuery(input: string): string {
    let s = input

    // Remove anything inside parentheses, square brackets, or curly braces
    s = s.replace(/\([^)]*\)/g, '')
    s = s.replace(/\[[^\]]*\]/g, '')
    s = s.replace(/\{[^}]*\}/g, '')

    // Remove "feat.", "ft.", "featuring" and everything after it
    s = s.replace(/\b(feat\.?|ft\.?|featuring)\s+.*/i, '')

    // Remove common suffixes that break exact match
    s = s.replace(/\b(remaster(ed)?|deluxe|edition|version|remix|acoustic|live|official\s*(audio|video|music\s*video)?|bonus\s*track|radio\s*edit|single\s*version)\b/gi, '')

    // Remove stray punctuation left over
    s = s.replace(/[-–—]/g, ' ')
    s = s.replace(/['"`,;:!?]/g, '')

    // Collapse whitespace
    s = s.replace(/\s{2,}/g, ' ').trim()

    return s
}

// ─── Fuzzy Matching ──────────────────────────────────────────────────────────

/**
 * Compute a simple similarity score between two strings (0–1).
 * Uses case-insensitive token overlap + containment check.
 */
function similarity(a: string, b: string): number {
    const la = a.toLowerCase().trim()
    const lb = b.toLowerCase().trim()

    // Exact match
    if (la === lb) return 1.0

    // Containment: one string fully inside the other
    if (la.includes(lb) || lb.includes(la)) return 0.9

    // Token overlap (Jaccard-like)
    const tokensA = new Set(la.split(/\s+/))
    const tokensB = new Set(lb.split(/\s+/))
    let overlap = 0
    for (const t of tokensA) {
        if (tokensB.has(t)) overlap++
    }
    const union = new Set([...tokensA, ...tokensB]).size
    return union > 0 ? overlap / union : 0
}

// ─── Compilation Filter ─────────────────────────────────────────────────────

const COMPILATION_KEYWORDS = [
    'best', 'dinner', 'collection', 'playlist',
    'greatest hits', 'lounge', 'chill', 'café', 'cafe'
]

function isCompilationAlbum(albumTitle: string, artistName: string): boolean {
    const lowerAlbum = albumTitle.toLowerCase()
    const lowerArtist = artistName.toLowerCase()
    const hasKeyword = COMPILATION_KEYWORDS.some(k => lowerAlbum.includes(k))
    const hasArtist = lowerAlbum.includes(lowerArtist)
    return hasKeyword && !hasArtist
}

// ─── Core Deezer fetch ──────────────────────────────────────────────────────

async function deezerSearch(query: string, limit = 10): Promise<DeezerTrack[]> {
    const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=${limit}`
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) })

    if (!response.ok) return []

    const data = await response.json()
    if (!data.data || data.data.length === 0) return []

    return data.data as DeezerTrack[]
}

/**
 * Pick the best track from results: prefers non-compilation with preview,
 * optionally scoring by title/artist similarity if provided.
 */
function pickBest(
    tracks: DeezerTrack[],
    expectedTitle?: string,
    expectedArtist?: string
): DeezerTrack | null {
    // Filter to tracks with preview and not from compilation albums
    const viable = tracks.filter(t => t.preview)

    if (viable.length === 0) return null

    if (!expectedTitle && !expectedArtist) {
        // No fuzzy matching needed — just pick first non-compilation
        return viable.find(t => !isCompilationAlbum(t.album.title, t.artist.name))
            ?? viable[0]
    }

    // Score each track by similarity to expected title + artist
    const scored = viable.map(t => {
        const titleScore = expectedTitle ? similarity(t.title, expectedTitle) : 0
        const artistScore = expectedArtist ? similarity(t.artist.name, expectedArtist) : 0
        const compilationPenalty = isCompilationAlbum(t.album.title, t.artist.name) ? 0.2 : 0
        return { track: t, score: titleScore * 0.6 + artistScore * 0.4 - compilationPenalty }
    })

    scored.sort((a, b) => b.score - a.score)

    // Only accept if the best match has a reasonable score
    if (scored[0].score >= 0.3) {
        return scored[0].track
    }

    return null
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Multi-strategy Deezer search with sanitation and fuzzy fallback.
 *
 * Strategy 1: Strict — artist:"X" track:"Y"
 * Strategy 2: Combined plain — "artist title" as free text
 * Strategy 3: Title only — search by song title, filter by artist similarity
 * Strategy 4: Artist only — search by artist, filter by title similarity
 */
export async function searchDeezer(
    judul: string,
    penyanyi: string
): Promise<DeezerTrack | null> {

    const cleanTitle = sanitizeQuery(judul)
    const cleanArtist = sanitizeQuery(penyanyi)

    // Strategy 1: Strict structured query
    const strictQuery = `artist:"${cleanArtist}" track:"${cleanTitle}"`
    const strictResults = await deezerSearch(strictQuery, 5)
    const strictMatch = pickBest(strictResults, cleanTitle, cleanArtist)
    if (strictMatch) return strictMatch

    // Strategy 2: Combined free text (handles cases where Deezer's structured search is picky)
    const combinedQuery = `${cleanArtist} ${cleanTitle}`
    const combinedResults = await deezerSearch(combinedQuery, 10)
    const combinedMatch = pickBest(combinedResults, cleanTitle, cleanArtist)
    if (combinedMatch) return combinedMatch

    // Strategy 3: Title only — broader net, filter by artist
    const titleResults = await deezerSearch(cleanTitle, 15)
    const titleMatch = pickBest(titleResults, cleanTitle, cleanArtist)
    if (titleMatch) return titleMatch

    // Strategy 4: Artist only — last resort, filter by title
    const artistResults = await deezerSearch(cleanArtist, 15)
    const artistMatch = pickBest(artistResults, cleanTitle, cleanArtist)
    if (artistMatch) return artistMatch

    return null
}

export async function getDeezerTrackById(
    trackId: number
): Promise<DeezerTrack | null> {

    const response = await fetch(
        `https://api.deezer.com/track/${trackId}`,
        { signal: AbortSignal.timeout(8000) }
    )

    if (!response.ok) return null

    const data = await response.json()

    if (!data.preview) return null

    return data as DeezerTrack
}