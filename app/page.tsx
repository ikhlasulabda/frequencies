// app/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
        setError(`Coba lagi dalam ${menit} menit.`)
        return
      }

      // Simpan fingerprint + nama ke sessionStorage buat dipakai di /quiz
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
    <main className="min-h-screen bg-black text-white flex flex-col
      items-center justify-center px-6">

      <h1 className="text-4xl font-bold tracking-tight mb-2">
        FREQUENCIES
      </h1>
      <p className="text-gray-400 text-sm mb-12">
        Find Your Frequency.
      </p>

      <div className="w-full max-w-sm flex flex-col gap-4">
        <input
          type="text"
          placeholder="nama lo (opsional)"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          maxLength={30}
          className="w-full bg-transparent border border-gray-600 text-white
            placeholder-gray-500 px-4 py-3 text-sm
            focus:outline-none focus:border-white"
        />

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full py-3 border border-white text-white text-sm
            hover:bg-white hover:text-black transition-colors
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'checking...' : 'Tune In →'}
        </button>
      </div>
    </main>
  )
}