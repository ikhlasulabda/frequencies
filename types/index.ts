// types/index.ts

export interface Question {
    id: number
    text: string
    type: 'choice' | 'text'
    maxLength?: number
    placeholder?: string
    choices?: {
        label: string
        display: string
    }[]
}

export interface PromptAnswers {
    q1: string
    q2: string
    q3: string
    q4: string
    q5: string
}

export interface GeminiResult {
    judul: string
    penyanyi: string
    mood_tag: string
    punchline: string
}

export interface DeezerTrack {
    id: number
    title: string
    preview: string
    artist: {
        name: string
        picture_medium: string
    }
    album: {
        title: string
        cover_medium: string
        cover_big: string
    }
}

export interface SessionResult {
    judul: string
    penyanyi: string
    mood_tag: string
    punchline: string
    deezer_id: number
    cover_url: string
    nama?: string
    created_at: number
}