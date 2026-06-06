// lib/deezer.ts

import { DeezerTrack } from '@/types'

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

export async function searchDeezer(
    judul: string,
    penyanyi: string
): Promise<DeezerTrack | null> {

    const query = encodeURIComponent(`artist:"${penyanyi}" track:"${judul}"`)
    const url = `https://api.deezer.com/search?q=${query}&limit=5`

    const response = await fetch(url, {
        signal: AbortSignal.timeout(8000)
    })

    if (!response.ok) throw new Error('DEEZER_API_ERROR')

    const data = await response.json()

    if (!data.data || data.data.length === 0) return null

    // Prioritaskan hasil yang bukan kompilasi
    const tracks = data.data as DeezerTrack[]

    const best = tracks.find(track =>
        track.preview &&
        !isCompilationAlbum(track.album.title, track.artist.name)
    )

    // Fallback ke track pertama yang ada preview-nya
    const fallback = tracks.find(track => track.preview)

    const result = best ?? fallback ?? null

    if (!result?.preview) return null

    return result
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