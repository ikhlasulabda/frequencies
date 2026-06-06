// app/api/image-proxy/route.ts
// Proxy cover art dari Deezer CDN untuk bypass CORS
// saat dom-to-image generate PNG di browser.

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const imageUrl = searchParams.get('url')

    if (!imageUrl?.startsWith('https://cdn-images.dzcdn.net/')) {
        return new Response('Forbidden', { status: 403 })
    }

    try {
        const response = await fetch(imageUrl)

        if (!response.ok) {
            return new Response('Image not found', { status: 404 })
        }

        const buffer = await response.arrayBuffer()

        return new Response(buffer, {
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
                'Cache-Control': 'public, max-age=86400',
            }
        })
    } catch {
        return new Response('Failed to fetch image', { status: 500 })
    }
}