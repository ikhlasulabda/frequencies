// components/AudioPlayer.tsx
'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

interface AudioPlayerProps {
    previewUrl: string
}

const N_BARS = 46
const BAR_HEIGHTS = Array.from({ length: N_BARS }, (_, i) => {
    const x = i / N_BARS
    const v = Math.abs(
        Math.sin(x * Math.PI * 4.3) * 0.42 +
        Math.sin(x * Math.PI * 9.1) * 0.28 +
        Math.sin(x * Math.PI * 2.7) * 0.30
    )
    return Math.max(0.12, Math.min(0.96, v + 0.18))
})

export default function AudioPlayer({ previewUrl }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const waveRef  = useRef<HTMLDivElement>(null)

    const [playing,     setPlaying]     = useState(false)
    const [progress,    setProgress]    = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration,    setDuration]    = useState(0)
    const [dragging,    setDragging]    = useState(false)

    function fmt(s: number) {
        if (!s || isNaN(s)) return '0:00'
        const m   = Math.floor(s / 60)
        const sec = Math.floor(s % 60).toString().padStart(2, '0')
        return `${m}:${sec}`
    }

    function toggle() {
        const a = audioRef.current
        if (!a) return
        if (playing) {
            a.pause()
        } else {
            a.play()
        }
    }

    const seekTo = useCallback((clientX: number) => {
        const wave = waveRef.current
        const a    = audioRef.current
        if (!wave || !a || !a.duration) return
        const rect  = wave.getBoundingClientRect()
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
        a.currentTime = ratio * a.duration
        setProgress(ratio * 100)
    }, [])

    const onMouseMove = useCallback((e: MouseEvent) => {
        if (dragging) seekTo(e.clientX)
    }, [dragging, seekTo])

    const onMouseUp = useCallback((e: MouseEvent) => {
        if (dragging) { seekTo(e.clientX); setDragging(false) }
    }, [dragging, seekTo])

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup',   onMouseUp)
        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup',   onMouseUp)
        }
    }, [onMouseMove, onMouseUp])

    return (
        <>
            <style>{`
                @keyframes eqA { 0%,100%{transform:scaleY(0.25)} 50%{transform:scaleY(1.0)} }
                @keyframes eqB { 0%,100%{transform:scaleY(0.9)}  50%{transform:scaleY(0.2)} }
                @keyframes eqC { 0%,100%{transform:scaleY(0.5)}  50%{transform:scaleY(0.95)} }
                @keyframes eqD { 0%,100%{transform:scaleY(1.0)}  50%{transform:scaleY(0.30)} }
                @keyframes eqE { 0%,100%{transform:scaleY(0.35)} 50%{transform:scaleY(0.85)} }
            `}</style>

            <audio
                ref={audioRef}
                src={previewUrl}
                preload="metadata"
                onPlay={()    => setPlaying(true)}
                onPause={()   => setPlaying(false)}
                onEnded={()   => { setPlaying(false); setProgress(0); setCurrentTime(0) }}
                onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 30)}
                onTimeUpdate={() => {
                    const a = audioRef.current
                    if (!a || !a.duration) return
                    setCurrentTime(a.currentTime)
                    setProgress((a.currentTime / a.duration) * 100)
                }}
            />

            <div style={{
                background:   'rgba(255, 255, 255, 0)',
                borderRadius: '16px',
                padding:      '14px 16px 16px',
                border:       '2px solid rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(2px)',
            }}>

                {/* ── Label row ───────────────────────────────────────── */}
                <div style={{
                    display:        'flex',
                    justifyContent: 'space-between',
                    alignItems:     'center',
                    marginBottom:   '12px',
                }}>
                    <span style={{
                        fontSize:      '14px',
                        letterSpacing: '0.06em',
                        color:         '#000000',
                        fontFamily:    'var(--font-display), cursive',
                        fontWeight:    500,
                    }}>
                        Slice of it
                    </span>

                    {/* EQ bouncer — only when playing */}
                    <div style={{
                        display:    'flex',
                        gap:        '2px',
                        alignItems: 'flex-end',
                        height:     '12px',
                        opacity:    playing ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                    }}>
                        {(['eqA','eqB','eqC','eqD','eqE'] as const).map((anim, i) => (
                            <div
                                key={i}
                                style={{
                                    width:           '2px',
                                    height:          '100%',
                                    background:      'var(--holi-pink)',
                                    transformOrigin: 'bottom',
                                    borderRadius:    '1px',
                                    animation:       playing
                                        ? `${anim} ${0.32 + i * 0.07}s ease-in-out infinite`
                                        : 'none',
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Waveform bars ────────────────────────────────────── */}
                <div
                    ref={waveRef}
                    onMouseDown={e => { setDragging(true); seekTo(e.clientX) }}
                    onClick={e => seekTo(e.clientX)}
                    onTouchStart={e => seekTo(e.touches[0].clientX)}
                    onTouchMove={e  => { e.preventDefault(); seekTo(e.touches[0].clientX) }}
                    style={{
                        display:      'flex',
                        gap:          '2px',
                        alignItems:   'center',
                        height:       '44px',
                        cursor:       'pointer',
                        marginBottom: '12px',
                        userSelect:   'none',
                    }}
                >
                    {BAR_HEIGHTS.map((h, i) => {
                        const barPct   = (i / N_BARS) * 100
                        const filled   = barPct <= progress

                        return (
                            <div
                                key={i}
                                style={{
                                    flex:         1,
                                    height:       `${h * 100}%`,
                                    background:   filled
                                        ? 'linear-gradient(180deg, var(--holi-pink) 0%, var(--holi-purple) 100%)'
                                        : '#a3a3a8',
                                    borderRadius: '1px',
                                    transition:   dragging ? 'none' : 'background 0.06s',
                                }}
                            />
                        )
                    })}
                </div>

                {/* ── Controls row ─────────────────────────────────────── */}
                <div style={{
                    display:    'flex',
                    alignItems: 'center',
                    gap:        '12px',
                }}>

                    {/* Play / Pause — circle */}
                    <button
                        onClick={toggle}
                        aria-label={playing ? 'Pause' : 'Play'}
                        style={{
                            width:          '44px',
                            height:         '44px',
                            flexShrink:     0,
                            background:     'linear-gradient(135deg, var(--holi-pink), var(--holi-orange))',
                            border:         'none',
                            borderRadius:   '50%',
                            display:        'flex',
                            alignItems:     'center',
                            justifyContent: 'center',
                            cursor:         'pointer',
                            color:          '#ffffff',
                            boxShadow:      playing
                                ? '0 4px 16px rgba(255,61,170,0.50), 0 0 24px rgba(255,61,170,0.30)'
                                : '0 2px 8px rgba(255,61,170,0.25)',
                            transition:     'all 0.22s ease',
                        }}
                    >
                        {playing ? (
                            <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden>
                                <rect x="0"  y="0" width="3" height="12" rx="0" />
                                <rect x="7"  y="0" width="3" height="12" rx="0" />
                            </svg>
                        ) : (
                            <svg width="11" height="13" viewBox="0 0 11 13" fill="currentColor" aria-hidden style={{ marginLeft: '2px' }}>
                                <path d="M0.5 0.5L10.5 6.5L0.5 12.5V0.5Z" />
                            </svg>
                        )}
                    </button>

                    {/* Timestamps */}
                    <div style={{
                        flex:           1,
                        display:        'flex',
                        justifyContent: 'space-between',
                        alignItems:     'center',
                    }}>
                        <span style={{
                            fontSize:      '10px',
                            color:         '#0a0a0c',
                            fontFamily:    'JetBrains Mono, monospace',
                            fontWeight:    700,
                            letterSpacing: '0.04em',
                        }}>
                            {fmt(currentTime)}
                        </span>

                        <span style={{
                            fontSize:      '10px',
                            color:         '#4a4a50',
                            fontFamily:    'JetBrains Mono, monospace',
                            fontWeight:    700,
                            letterSpacing: '0.04em',
                        }}>
                            {fmt(duration || 30)}
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}