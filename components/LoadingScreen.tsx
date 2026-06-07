// components/LoadingScreen.tsx
'use client'

import { motion } from 'framer-motion'

export default function LoadingScreen() {
    return (
        <div className="page-shell" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '28px',
        }}>
            {/* Background splats */}
            <div className="splat" style={{
                width: 200, height: 160,
                background: 'var(--holi-yellow)',
                top: '-40px', right: '-40px',
                opacity: 0.14,
            }} />
            <div className="splat" style={{
                width: 150, height: 120,
                background: 'var(--holi-cyan)',
                bottom: '60px', left: '-40px',
                opacity: 0.12,
            }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
            >

                <div
                    aria-label="Loading..."
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        gap: '6px',
                        height: '40px',
                    }}
                >
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="wave-bar"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        />
                    ))}
                </div>
            </motion.div>

            <motion.p
                className="font-body"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                style={{
                    fontSize: '14px',
                    color: 'var(--foreground-muted)',
                    fontWeight: 500,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                AI matching process (Waitt ya cintaku)
            </motion.p>
        </div>
    )
}