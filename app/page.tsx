// app/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { generateFingerprint } from '@/lib/fingerprint'

export default function LandingPage() {
  const router = useRouter()
  const [nama, setNama] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleStart() {
    setLoading(true)
    setError('')

    try {
      const fingerprint = await generateFingerprint()

      const res = await fetch('/api/session/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fingerprint }),
      })

      const data = await res.json()

      if (!data.allowed) {
        const menit = Math.ceil(data.retryAfter / 60)
        setError(`Coba lagi dalam ${menit} menit ya.`)
        return
      }

      sessionStorage.setItem('fp', fingerprint)
      sessionStorage.setItem('nama', nama.trim())
      router.push('/quiz')

    } catch {
      setError('Gagal konek ke server. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="page-shell"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
      }}
    >

      {/* Decorative ink splats */}
      <div className="splat" style={{
        width: 320, height: 260,
        background: 'var(--holi-yellow)',
        top: '-60px', right: '-80px',
        transform: 'rotate(15deg)',
      }} />
      <div className="splat" style={{
        width: 220, height: 180,
        background: 'var(--holi-cyan)',
        bottom: '40px', left: '-60px',
        transform: 'rotate(-20deg)',
      }} />
      <div className="splat" style={{
        width: 160, height: 140,
        background: 'var(--holi-pink)',
        top: '30%', right: '-30px',
        transform: 'rotate(8deg)',
        opacity: 0.12,
      }} />
      <div className="splat" style={{
        width: 120, height: 100,
        background: 'var(--holi-orange)',
        bottom: '15%', right: '8%',
        transform: 'rotate(-10deg)',
        opacity: 0.14,
      }} />

      {/* Main content — flex: 1 biar footer kedesak ke bawah */}
      <div
        className="page-inner"
        style={{
          flex: 1,
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className="content-col" style={{ position: 'relative', paddingTop: '24px', paddingBottom: '24px' }}>

          {/* Floating badge */}
          <motion.div
            style={{
              position: 'absolute',
              top: '5px',
              right: '0px',
              zIndex: 2,
              rotate: -10,
            }}
            animate={{ scale: [0.8, 1.13, 0.8], y: [0.8, -2, 0.8] }}
            transition={{
              delay: 0.5,
              duration: 2.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <motion.div
              className="badge badge-yellow"
              style={{ fontSize: '20px', padding: '3px 12px', border: 'none' }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5, type: 'spring', stiffness: 180 }}
            >
              mood check
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-display" style={{
              fontSize: 'clamp(80px, 16vw, 80px)',
              fontWeight: 400,
              lineHeight: 0.92,
              letterSpacing: '-0.02em',
              color: 'var(--foreground)',
              marginBottom: '32px',
            }}>
              Frequencies
            </h1>

            <p className="font-body" style={{
              fontSize: 'clamp(20px, 4.5vw, 15px)',
              lineHeight: 1.25,
              color: 'var(--foreground-muted)',
              marginBottom: '60px',
              fontWeight: 400,
            }}>
              Gua bisa nebak lagu yang "lu banget" wkwk, mau nyobain??
            </p>
          </motion.div>

          <style>{`
            @keyframes waveScroll {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
          `}</style>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ paddingTop: '8px' }}>

              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  id="nama"
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && handleStart()}
                  maxLength={30}
                  placeholder="your name here"
                  className="font-display"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: 'clamp(18px, 8vw, 20px)',
                    fontWeight: 400,
                    letterSpacing: '-0.02em',
                    color: 'var(--foreground)',
                    padding: '8px 0 16px',
                    caretColor: 'var(--holi-pink)',
                  }}
                />

                {/* Wave underline */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '20px',
                  overflow: 'hidden',
                  pointerEvents: 'none',
                }}>
                  <svg
                    viewBox="0 0 1200 20"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      width: '200%',
                      height: '20px',
                      display: 'block',
                      animation: 'waveScroll 20s linear infinite',
                    }}
                  >
                    <path
                      d={`M0,10 ${Array.from({ length: 30 }, (_, i) => {
                        const x = i * 40;
                        return `C${x + 10},2 ${x + 30},18 ${x + 40},10`;
                      }).join(' ')}`}
                      stroke="var(--holi-pink)"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {error && (
                <p className="error-text" style={{ marginTop: '10px' }}>
                  {error}
                </p>
              )}

              <button
                onClick={handleStart}
                disabled={loading}
                className="btn-primary"
                style={{ marginTop: '28px', fontSize: '28px', padding: '2px 14px' }}
              >
                {loading ? 'sebentar ya...' : 'Tune In'}
              </button>

            </div>
          </motion.div>

        </div>
      </div>

      {/* Footer */}
      <footer style={{
        width: '100%',
        padding: '24px 1px -100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        opacity: 1.0,
      }}>
        <img
          src="/logoapp.png"
          alt="logo"
          style={{ height: '130px', width: 'auto' }}
        />
      </footer>

    </main>
  )
}