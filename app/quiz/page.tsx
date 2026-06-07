// app/quiz/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { QUESTIONS, Q2_BRANCHES } from '@/lib/questions'
import QuizStep from '@/components/QuizStep'
import LoadingScreen from '@/components/LoadingScreen'

export default function QuizPage() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<string[]>(['', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fp = sessionStorage.getItem('fp')
        if (!fp) router.push('/')
    }, [router])

    function handleChange(val: string) {
        const updated = [...answers]
        updated[step] = val

        if (step === 0 && val !== answers[0]) {
            updated[1] = ''
        }

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

    let currentQuestion = QUESTIONS[step]
    if (step === 1) {
        const q1Choice = answers[0]
        const branch = Q2_BRANCHES[q1Choice]
        if (branch) {
            currentQuestion = {
                id: 2,
                type: 'choice',
                text: branch.text,
                choices: branch.choices
            }
        }
    }

    const isLast = step === QUESTIONS.length - 1
    const hasAnswer = !!answers[step]

    /* Progress accent colors — cycle through holi palette */
    const accentColors = [
        'var(--holi-yellow)',
        'var(--holi-orange)',
        'var(--holi-pink)',
        'var(--holi-purple)',
        'var(--holi-cyan)',
    ]

    return (
        <main className="page-shell" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

            {/* Background splats */}
            <div className="splat" style={{
                width: 200, height: 160,
                background: accentColors[step],
                top: '-40px', left: '-50px',
                opacity: 0.12,
                transition: 'background 0.4s ease',
            }} />
            <div className="splat" style={{
                width: 140, height: 120,
                background: accentColors[(step + 2) % 5],
                bottom: '60px', right: '-30px',
                opacity: 0.12,
                transition: 'background 0.4s ease',
            }} />

            <div className={`page-inner content-col${step === 0 || step === 2 ? ' content-col--quiz-wide' : ''}`} style={{
                padding: '40px 24px 36px',
                minHeight: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
            }}>

                {/* Progress */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginBottom: '12px',
                    }}>
                        <span className="font-display" style={{
                            fontSize: '16px',
                            color: 'var(--foreground)',
                        }}>
                            Pertanyaan {step + 1}
                        </span>
                        <span
                            className="badge"
                            style={{
                                background: accentColors[step],
                                transform: 'rotate(1deg)',
                                fontSize: '11px',
                                padding: '3px 12px',
                                color: step === 3 || step === 4 ? '#fff' : 'var(--foreground)',
                                transition: 'background 0.4s ease',
                            }}
                        >
                            {step + 1} / {QUESTIONS.length}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        {QUESTIONS.map((_, i) => (
                            <div
                                key={i}
                                className={`progress-segment${i <= step ? ' progress-segment--active' : ''}${i === step ? ' progress-segment--current' : ''}`}
                                style={{
                                    background: i <= step
                                        ? accentColors[i]
                                        : 'rgba(13, 13, 13, 0.08)',
                                    transition: 'background 0.35s ease, transform 0.25s ease',
                                }}
                            />
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -14 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <QuizStep
                            question={currentQuestion}
                            value={answers[step]}
                            onChange={handleChange}
                        />
                    </motion.div>
                </AnimatePresence>

                {error && (
                    <p className="error-text" style={{ marginTop: '16px' }}>
                        {error}
                    </p>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '32px' }}>
                    {step > 0 && (
                        <button onClick={handleBack} className="btn-secondary">
                            Kembali
                        </button>
                    )}

                    <button
                        onClick={isLast ? handleSubmit : handleNext}
                        disabled={!hasAnswer}
                        className="btn-primary"
                        style={{ flex: 1 }}
                    >
                        {isLast ? 'Temukan Frequency Gue' : 'Lanjut'}
                    </button>
                </div>

            </div>
        </main>
    )
}