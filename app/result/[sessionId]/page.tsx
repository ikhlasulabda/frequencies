// app/result/[sessionId]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { SessionResult } from '@/types'
import ResultCard from '@/components/ResultCard'
import LoadingScreen from '@/components/LoadingScreen'
import styles from './ResultPage.module.css'
// AudioPlayer functionality is now integrated directly into ResultCard

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

    // Aurora blob layer — fixed, 3 div mengambang
    const auroraLayer = (
        <div className={styles.beamLayer}>
            <div className={styles.blob1} />
            <div className={styles.blob2} />
            <div className={styles.blob3} />
        </div>
    )

    if (error) {
        return (
            <main className={`page-shell ${styles.pageShell}`} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
            }}>
                {auroraLayer}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`content-col ${styles.inner}`}
                    style={{ textAlign: 'center' }}
                >
                    <p className="font-body" style={{
                        fontSize: '17px',
                        color: 'var(--foreground)',
                        marginBottom: '24px',
                        fontWeight: 500,
                    }}>
                        {error}
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="btn-primary"
                        style={{ maxWidth: '280px', margin: '0 auto' }}
                    >
                        Coba Lagi
                    </button>
                </motion.div>
            </main>
        )
    }

    if (!result) return <LoadingScreen />

    return (
        <main className={`page-shell ${styles.pageShell}`} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '36px 24px 44px',
            position: 'relative',
        }}>
            {auroraLayer}

            <div className={`page-inner content-col ${styles.inner}`}>

                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ textAlign: 'center', marginBottom: '24px' }}
                >
                    <p className="font-body" style={{
                        fontSize: '14px',
                        color: '#000000',
                        marginTop: '10px',
                        fontWeight: 500,
                    }}>
                        semoga cocok, kalo engga ya cocokin.
                    </p>
                </motion.div>

                <ResultCard
                    result={result}
                    previewUrl={result.preview_url}
                />

                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    onClick={() => router.push('/')}
                    className={styles.btnBack}
                    style={{ display: 'block', margin: '28px auto 0', textAlign: 'center' }}
                >
                    pilih lagi
                </motion.button>

            </div>
        </main>
    )
}