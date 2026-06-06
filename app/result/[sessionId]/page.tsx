// app/result/[sessionId]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SessionResult } from '@/types'
import ResultCard from '@/components/ResultCard'
import LoadingScreen from '@/components/LoadingScreen'

interface ResultData extends SessionResult {
    preview_url: string | null
}

export default function ResultPage() {
    const { sessionId } = useParams<{ sessionId: string }>()
    const router = useRouter()
    const [result, setResult] = useState<ResultData | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!sessionId) return

        async function fetchResult() {
            try {
                const res = await fetch(`/api/result/${sessionId}`)

                if (res.status === 404) {
                    setError('Sesi tidak ditemukan atau sudah expired.')
                    return
                }

                if (!res.ok) {
                    setError('Gagal memuat hasil. Coba lagi.')
                    return
                }

                const data = await res.json()
                setResult(data)

            } catch {
                setError('Gagal konek ke server.')
            }
        }

        fetchResult()
    }, [sessionId])

    if (error) {
        return (
            <main className="min-h-screen bg-black text-white flex flex-col
        items-center justify-center px-6 gap-4">
                <p className="text-gray-400 text-sm">{error}</p>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-3 border border-white text-white text-sm
            hover:bg-white hover:text-black transition-colors"
                >
                    Coba Lagi
                </button>
            </main>
        )
    }

    if (!result) return <LoadingScreen />

    return (
        <main className="min-h-screen bg-black text-white flex flex-col
      items-center justify-center px-6 py-12">

            <ResultCard
                result={result}
                previewUrl={result.preview_url}
            />

            <button
                onClick={() => router.push('/')}
                className="mt-8 text-sm text-gray-500 hover:text-white transition-colors"
            >
                ← mulai lagi
            </button>
        </main>
    )
}