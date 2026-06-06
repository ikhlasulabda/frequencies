// lib/fallback.ts
// Pool lagu terverifikasi — sudah dicek ada di Deezer dengan preview URL.
// Dipakai kalau Gemini + Deezer retry 3x masih gagal.

export interface FallbackSong {
    judul: string
    penyanyi: string
    mood_tag: string
    punchline: string
}

export const FALLBACK_POOL: FallbackSong[] = [
    { judul: 'Liability', penyanyi: 'Lorde', mood_tag: 'silent inner battle', punchline: 'too much for anyone' },
    { judul: 'Motion Sickness', penyanyi: 'Phoebe Bridgers', mood_tag: 'soft collapse', punchline: 'hate you for the summers' },
    { judul: 'Sweater Weather', penyanyi: 'The Neighbourhood', mood_tag: 'cold nostalgia', punchline: 'all i am is on your floor' },
    { judul: 'Skinny Love', penyanyi: 'Bon Iver', mood_tag: 'quiet devastation', punchline: 'staring at the sink of blood' },
    { judul: 'The Night Will Always Win', penyanyi: 'Manchester Orchestra', mood_tag: 'dark acceptance', punchline: 'i gave everything i had' },
    { judul: 'Somebody That I Used to Know', penyanyi: 'Gotye', mood_tag: 'post-love ghost', punchline: 'now you are just somebody' },
    { judul: 'Ribs', penyanyi: 'Lorde', mood_tag: 'afraid to grow up', punchline: 'you are not my future' },
    { judul: 'Holocene', penyanyi: 'Bon Iver', mood_tag: 'small in the universe', punchline: 'once i knew i was not magnificent' },
    { judul: 'Breathe (2 AM)', penyanyi: 'Anna Nalick', mood_tag: '2am spiral', punchline: 'just breathe' },
    { judul: 'The Joke', penyanyi: 'Brandi Carlile', mood_tag: 'unseen strength', punchline: 'i have all i need' },
    { judul: 'Happy', penyanyi: 'Pharrell Williams', mood_tag: 'sunshine energy', punchline: 'nothing can bring me down' },
    { judul: 'Dog Days Are Over', penyanyi: 'Florence + The Machine', mood_tag: 'run toward joy', punchline: 'happiness hit her like a train' },
    { judul: 'Shake It Out', penyanyi: 'Florence + The Machine', mood_tag: 'shake the darkness', punchline: 'it is always darkest before the dawn' },
    { judul: 'Stubborn Love', penyanyi: 'The Lumineers', mood_tag: 'keep going anyway', punchline: 'keep your head up, keep your love' },
    { judul: 'Bloom', penyanyi: 'The Paper Kites', mood_tag: 'quiet warmth', punchline: 'i bloom just for you' },
    { judul: 'Soak Up the Sun', penyanyi: 'Sheryl Crow', mood_tag: 'effortless joy', punchline: 'i got no one to blame' },
    { judul: 'Tongue Tied', penyanyi: 'Grouplove', mood_tag: 'young and reckless', punchline: 'take me to your best friend' },
    { judul: 'Yellow', penyanyi: 'Coldplay', mood_tag: 'devoted glow', punchline: 'i drew a star for you' },
    { judul: 'The Scientist', penyanyi: 'Coldplay', mood_tag: 'going back', punchline: 'nobody said it was easy' },
    { judul: 'Chasing Cars', penyanyi: 'Snow Patrol', mood_tag: 'still and together', punchline: 'if i just lay here' },
    { judul: 'Slow Burn', penyanyi: 'Kacey Musgraves', mood_tag: 'patient and becoming', punchline: 'it is a slow burn' },
    { judul: 'Rainbow', penyanyi: 'Kacey Musgraves', mood_tag: 'after the storm', punchline: 'there is always been a rainbow' },
    { judul: 'Malibu', penyanyi: 'Miley Cyrus', mood_tag: 'found peace', punchline: 'i never would have believed you' },
    { judul: 'Superstar', penyanyi: 'Sheryl Crow', mood_tag: 'bittersweet longing', punchline: 'you are a superstar' },
    { judul: 'Vienna', penyanyi: 'Billy Joel', mood_tag: 'slow down, you are fine', punchline: 'vienna waits for you' },
    { judul: 'Unwritten', penyanyi: 'Natasha Bedingfield', mood_tag: 'wide open future', punchline: 'the rest is still unwritten' },
    { judul: 'Soul Sister', penyanyi: 'Train', mood_tag: 'unexplainable pull', punchline: 'my heart is bound to beat' },
    { judul: 'Clocks', penyanyi: 'Coldplay', mood_tag: 'racing against time', punchline: 'am i part of the cure' },
    { judul: 'Fix You', penyanyi: 'Coldplay', mood_tag: 'trying to heal', punchline: 'i will try to fix you' },
    { judul: 'The Night We Met', penyanyi: 'Lord Huron', mood_tag: 'trapped in a memory', punchline: 'take me back to the night we met' },
]

export function getRandomFallback(exclude: string[] = []): FallbackSong {
    const available = FALLBACK_POOL.filter(
        song => !exclude.includes(`${song.judul} - ${song.penyanyi}`)
    )
    const pool = available.length > 0 ? available : FALLBACK_POOL
    return pool[Math.floor(Math.random() * pool.length)]
}