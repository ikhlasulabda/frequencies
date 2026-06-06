// app/quiz/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QUESTIONS } from '@/lib/questions'
import QuizStep from '@/components/QuizStep'
import LoadingScreen from '@/components/LoadingScreen'

export default function QuizPage() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<string[]>(['', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Kalau fingerprint tidak ada, balik ke landing
    useEffect(() => {
        const fp = sessionStorage.getItem('fp')
        if (!fp) router.push('/')
    }, [router])

    function handleChange(val: string) {
        const updated = [...answers]
        updated[step] = val
        setAnswers(updated)
    }

    function handleNext() {
        if (!answers[step]) return
        if (step < QUESTIONS.length - 1) {
            setStep(step + 1)
        }
    }

    function handleBack() {
        if (step > 0) setStep(step - 1)
    }

    async function handleSubmit() {
        if (!answers[step]) return
        setLoading(true)
        setError('')

        try {
            const fingerprint = sessionStorage.getItem('fp')
            const nama = sessionStorage.getItem('nama') ?? ''

            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fingerprint,
                    nama,
                    answers: {
                        q1: answers[0],
                        q2: answers[1],
                        q3: answers[2],
                        q4: answers[3],
                        q5: answers[4],
                    }
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                if (res.status === 429) {
                    const menit = Math.ceil(data.retryAfter / 60)
                    setError(`Limit tercapai. Coba lagi dalam ${menit} menit.`)
                } else {
                    setError('Terjadi kesalahan. Coba lagi.')
                }
                return
            }

            router.push(`/result/${data.sessionId}`)

        } catch {
            setError('Gagal konek ke server. Coba lagi.')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <LoadingScreen />

    const isLast = step === QUESTIONS.length - 1

    return (
        <main className="min-h-screen bg-black text-white flex flex-col
      items-center justify-center px-6">

            <div className="w-full max-w-md">
                <QuizStep
                    question={QUESTIONS[step]}
                    value={answers[step]}
                    onChange={handleChange}
                />

                {error && (
                    <p className="text-red-400 text-sm mt-4">{error}</p>
                )}

                <div className="flex gap-3 mt-8">
                    {step > 0 && (
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 border border-gray-600 text-gray-400
                text-sm hover:border-white hover:text-white transition-colors"
                        >
                            ← Back
                        </button>
                    )}

                    {!isLast ? (
                        <button
                            onClick={handleNext}
                            disabled={!answers[step]}
                            className="flex-1 py-3 border border-white text-white text-sm
                hover:bg-white hover:text-black transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={!answers[step]}
                            className="flex-1 py-3 border border-white text-white text-sm
                hover:bg-white hover:text-black transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Find My Frequency →
                        </button>
                    )}
                </div>
            </div>
        </main>
    )
}