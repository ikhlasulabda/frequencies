// components/ResultCard.tsx
'use client'

import { SessionResult } from '@/types'
import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AudioPlayer from './AudioPlayer'

interface ResultCardProps {
    result: SessionResult
    previewUrl: string | null
}

// ─── Capture Card for Export ───
async function captureCard(cardEl: HTMLElement): Promise<Blob> {
    const { toPng } = await import('html-to-image')

    const cardWidth = cardEl.offsetWidth
    const cardHeight = cardEl.offsetHeight
    const exportWidth = 1080
    const scale = exportWidth / cardWidth

    const prevTransition = cardEl.style.transition
    const prevAnimation = cardEl.style.animation
    const prevBoxShadow = cardEl.style.boxShadow
    cardEl.style.transition = 'none'
    cardEl.style.animation = 'none'
    cardEl.style.boxShadow = 'none'

    await new Promise(r => setTimeout(r, 80))

    try {
        const dataUrl = await toPng(cardEl, {
            width: exportWidth,
            height: Math.round(cardHeight * scale),
            pixelRatio: 1,
            style: {
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                boxShadow: 'none',
            },
            filter: (node: Node) => {
                if (node instanceof HTMLElement || node instanceof SVGElement) {
                    node.style.outline = '0'
                    node.style.boxShadow = 'none'
                }
                return true
            },
        })

        const res = await fetch(dataUrl)
        return await res.blob()
    } finally {
        cardEl.style.transition = prevTransition
        cardEl.style.animation = prevAnimation
        cardEl.style.boxShadow = prevBoxShadow
    }
}

export default function ResultCard({ result, previewUrl }: ResultCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const audioRef = useRef<HTMLAudioElement>(null)

    const [playing, setPlaying] = useState(false)
    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState<{ show: boolean; msg: string; sub?: string }>({ show: false, msg: '' })

    function showToast(msg: string, sub?: string) {
        setToast({ show: true, msg, sub })
        setTimeout(() => setToast(t => ({ ...t, show: false })), 3800)
    }

    function triggerDownload(blob: Blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'my-frequency.png'
        a.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
    }

    async function handleShare() {
        if (!cardRef.current || loading) return
        setLoading(true)

        try {
            const blob = await captureCard(cardRef.current)
            const file = new File([blob], 'my-frequency.png', { type: 'image/png' })

            // Try Web Share API first (mobile native share sheet)
            if (typeof navigator.share === 'function' && navigator.canShare?.({ files: [file] })) {
                try {
                    await navigator.share({ files: [file], title: 'My Frequency' })
                    return // Success
                } catch (err: unknown) {
                    if (err instanceof Error && err.name === 'AbortError') {
                        return // User cancelled
                    }
                    // Continue to fallback if Web Share fails
                }
            }

            // Fallback: download + instruction
            triggerDownload(blob)
            showToast('Gambar tersimpan!', 'Buka Instagram → Story → pilih foto ini')
        } catch (err) {
            console.error('[Share]', err)
            showToast('Gagal membuat gambar', 'Coba lagi ya')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <style>{`
                @keyframes freqSpin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

            {previewUrl && (
                <audio
                    ref={audioRef}
                    src={previewUrl}
                    preload="metadata"
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onEnded={() => setPlaying(false)}
                />
            )}

            <motion.div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    maxWidth: '380px',
                    margin: '0 auto',
                    width: '100%',
                }}
                initial={{ opacity: 0, y: 44, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* ─── CARD WITH SHADOW ─── */}
                <div
                    style={{
                        boxShadow: '0 20px 60px rgba(0,0,0,0.60), 0 8px 24px rgba(0,0,0,0.40)',
                        borderRadius: '12px',
                    }}
                >
                    {/* ─── SHAREABLE CARD ─── */}
                    <div
                        ref={cardRef}
                        style={{
                            background: '#0a0a0c',
                            borderRadius: 0,
                            overflow: 'hidden',
                            position: 'relative',
                            aspectRatio: '9 / 16',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* ─── IMAGE SECTION ─── */}
                        <div
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '52%',
                                overflow: 'hidden',
                                flexShrink: 0,
                            }}
                        >
                            <img
                                src={`/api/image-proxy?url=${encodeURIComponent(result.cover_url)}`}
                                alt={result.judul}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                    filter: 'brightness(0.75) saturate(1.2)',
                                }}
                                crossOrigin="anonymous"
                            />
                            {/* Gradient overlay */}
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    pointerEvents: 'none',
                                    background: 'linear-gradient(180deg,rgba(10,10,12,0) 0%,rgba(10,10,12,0) 25%,rgba(10,10,12,.20) 48%,rgba(10,10,12,.70) 74%,rgba(10,10,12,.95) 90%,#0a0a0c 100%)',
                                }}
                            />
                            {/* Vignette */}
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    pointerEvents: 'none',
                                    background: 'radial-gradient(ellipse 130% 100% at 50% 40%,transparent 28%,rgba(10,10,12,.50) 100%)',
                                }}
                            />
                            {/* Header */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    padding: '14px 18px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: '20px',
                                        letterSpacing: '0.01em',
                                        color: 'rgba(255,255,255,0.37)',
                                        fontWeight: 100,
                                        fontFamily: 'var(--font-display), Georgia, serif',
                                    }}
                                >
                                    {result.nama ? `${result.nama}, is it good?` : 'FREQUENCIES'}
                                </span>
                            </div>
                            {/* Mood tag */}
                            <div style={{ position: 'absolute', bottom: '16px', left: '18px' }}>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        fontSize: '12px',
                                        letterSpacing: '0.22em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(255,255,255,0.85)',
                                        background: 'rgba(0,0,0,0.62)',
                                        padding: '5px 10px',
                                        fontWeight: 600,
                                        fontFamily: 'var(--font-mono), monospace',
                                    }}
                                >
                                    {result.mood_tag}
                                </span>
                            </div>
                        </div>

                        {/* ─── BOTTOM CONTENT ─── */}
                        <div
                            style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                padding: '20px 20px 18px',
                                position: 'relative',
                            }}
                        >
                            {/* Punchline */}
                            <div>
                                <div
                                    style={{
                                        width: '32px',
                                        height: '1.5px',
                                        marginBottom: '14px',
                                        background: '#facc15', // 1. Garis kecil diubah jadi warna kuning
                                    }}
                                />
                                <p
                                    style={{
                                        fontSize: '20px',
                                        fontWeight: 400,
                                        lineHeight: 1.3,
                                        letterSpacing: '-0.02em',
                                        color: '#eeecf2',
                                        fontStyle: 'italic',
                                        margin: 0,
                                        fontFamily: 'var(--font-display), Georgia, serif',
                                    }}
                                >
                                    &ldquo;{result.punchline}&rdquo;
                                </p>
                            </div>

                            {/* Track info */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <p
                                    style={{
                                        fontSize: '11px',
                                        letterSpacing: '0.18em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(255,255,255,0.38)',
                                        margin: 0,
                                        fontFamily: 'var(--font-mono), monospace',
                                        fontWeight: 500,
                                    }}
                                >
                                    What Describes Your Vibe
                                </p>
                                <p
                                    style={{
                                        fontSize: '22px',
                                        color: '#ffffff',
                                        fontWeight: 600,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        letterSpacing: '-0.02em',
                                        lineHeight: 1.15,
                                        margin: 0,
                                        fontFamily: 'var(--font-display), Georgia, serif',
                                    }}
                                >
                                    {result.judul}
                                </p>
                                <p
                                    style={{
                                        fontSize: '12px',
                                        color: 'rgba(255,255,255,0.38)',
                                        margin: 0,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        fontWeight: 400,
                                        letterSpacing: '0.01em',
                                        fontFamily: 'var(--font-body), sans-serif',
                                    }}
                                >
                                    {result.penyanyi}
                                </p>
                            </div>

                            {/* Footer */}
                            <div
                                style={{
                                    textAlign: 'center',
                                    paddingTop: '18px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    position: 'relative',
                                    height: '55px',
                                    justifyContent: 'flex-end'
                                }}
                            >
                                {/* Nilai bottom diganti dari 28px ke 18px biar posisi logo agak turun kebawah */}
                                <img
                                    src="/logowhite.png"
                                    alt="App Logo"
                                    style={{
                                        height: '100px',
                                        width: 'auto',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 0 1px #facc15)',
                                        position: 'absolute',
                                        bottom: '-10px', // <--- UBAH DI SINI (makin kecil angkanya, makin turun logonya)
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        pointerEvents: 'none'
                                    }}
                                />

                                <span
                                    style={{
                                        fontSize: '13px',
                                        letterSpacing: '0.02em',
                                        color: '#facc15',
                                        fontFamily: 'jetbrains mono, monospace',
                                        fontWeight: 500,
                                        position: 'relative',
                                        zIndex: 10
                                    }}
                                >
                                    find yours on frequenciess.vercel.app
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── AUDIO PLAYER ─── */}
                {previewUrl && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <AudioPlayer previewUrl={previewUrl} />
                    </motion.div>
                )}

                {/* ─── SHARE BUTTON ─── */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
                    <button
                        onClick={handleShare}
                        disabled={loading}
                        className="btn-primary"
                        style={{ fontSize: '22px', padding: '2px 14px' }}
                    >
                        {loading ? 'sebentar ya...' : 'Share'}
                    </button>
                </div>

                {/* ─── TOAST NOTIFICATION ─── */}
                <AnimatePresence>
                    {toast.show && (
                        <motion.div
                            key="toast"
                            initial={{ opacity: 0, y: 6, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                                position: 'fixed',
                                bottom: '20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(0,0,0,0.88)',
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                                color: 'rgba(255,255,255,0.92)',
                                padding: '14px 20px',
                                borderRadius: '10px',
                                fontSize: '13px',
                                fontWeight: 500,
                                textAlign: 'center',
                                zIndex: 9999,
                                border: '1px solid rgba(255,255,255,0.12)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.50)',
                                maxWidth: '280px',
                                lineHeight: 1.4,
                            }}
                        >
                            <div>{toast.msg}</div>
                            {toast.sub && (
                                <div
                                    style={{
                                        fontSize: '11px',
                                        color: 'rgba(255,255,255,0.65)',
                                        marginTop: '6px',
                                        fontWeight: 400,
                                    }}
                                >
                                    {toast.sub}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    )
}