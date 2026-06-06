// lib/fingerprint.ts
// Generates a browser fingerprint for rate limiting.
// Dijalankan di client — jangan import di server/API routes.

export async function generateFingerprint(): Promise<string> {
    const components = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        navigator.hardwareConcurrency ?? 0,
    ].join('|')

    // Hash pakai SHA-256 via Web Crypto API (built-in browser)
    const encoder = new TextEncoder()
    const data = encoder.encode(components)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    return hashHex
}