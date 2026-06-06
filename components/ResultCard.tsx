// components/ResultCard.tsx
// Minimal dulu — design card yang shareable nanti di-polish belakangan.

import { SessionResult } from '@/types'
import AudioPlayer from './AudioPlayer'
import { useRef } from 'react'

interface ResultCardProps {
    result: SessionResult
    previewUrl: string | null
}

export default function ResultCard({ result, previewUrl }: ResultCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)

    async function handleShare() {
        if (!cardRef.current) return

        const { default: domtoimage } = await import('dom-to-image-more')

        const blob = await domtoimage.toBlob(cardRef.current, {
            width: 1080,
            height: 1920,
        })

        const file = new File([blob], 'my-frequency.png', { type: 'image/png' })

        if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: 'My Frequency' })
        } else {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'my-frequency.png'
            a.click()
            URL.revokeObjectURL(url)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">

            {/* Card area — ini yang nanti di-redesign */}
            <div
                ref={cardRef}
                className="w-full bg-black border border-gray-700 p-8 flex flex-col gap-4"
            >
                <p className="text-xs text-gray-500 tracking-widest uppercase">
                    Frequencies
                </p>

                <p className="text-2xl font-bold text-white tracking-tight">
                    {result.mood_tag}
                </p>

                <p className="text-gray-300 italic text-sm">
                    "{result.punchline}"
                </p>

                {/* Cover art */}
                <img
                    src={`/api/image-proxy?url=${encodeURIComponent(result.cover_url)}`}
                    alt={result.judul}
                    className="w-24 h-24 object-cover"
                />

                <div>
                    <p className="text-white font-semibold">{result.judul}</p>
                    <p className="text-gray-400 text-sm">{result.penyanyi}</p>
                </div>

                {result.nama && (
                    <p className="text-xs text-gray-600">for {result.nama}</p>
                )}
            </div>

            {/* Audio player di luar card — tidak ikut ke-export PNG */}
            {previewUrl && <AudioPlayer previewUrl={previewUrl} />}

            <button
                onClick={handleShare}
                className="w-full mt-6 py-3 border border-white text-white text-sm
          hover:bg-white hover:text-black transition-colors"
            >
                Share / Download
            </button>
        </div>
    )
}