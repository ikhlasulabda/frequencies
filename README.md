# Frequencies

Frequencies is an emotionally intelligent music curation app built with Next.js. Instead of genre pickers or artist search, it translates your current mood, weekend vibe, and open-ended reflections into a precise song recommendation, then wraps it in a shareable 9:16 visual card with cover art, a custom mood tag, and an AI-generated punchline.

Website access at [here](https://frequenciess.vercel.app).

---

## Features

- **Conversational Questionnaire**: A 5-step interface with branching logic and free-text inputs. Step 2 adapts dynamically based on the Step 1 answer.
- **AI Semantic Mapping**: Gemini 2.5 Flash analyzes emotional nuance and local context to produce curated music metadata.
- **Cascading Music Verification**: Multi-layered fallback pipeline against the Deezer database ensures every recommended track is playable with an audio preview.
- **Shareable Visual Card**: Downloadable 9:16 PNG generated via HTML-to-image, styled in a retro aesthetic.
- **Custom Waveform Player**: Plays a 30-second Deezer audio preview alongside an interactive SVG waveform.
- **Rate Limiting**: Browser fingerprint-based session tracking (SHA-256) enforced via Upstash Redis, capped at 4 requests per 15-minute sliding window.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, React 19) |
| Language | TypeScript |
| Styling | Vanilla CSS + Framer Motion |
| AI | Google Gemini 2.5 Flash |
| Caching / Rate Limiting | Upstash Redis |
| Music Data | Deezer API |
| Image Export | html-to-image |

---

## Engineering Highlights

### Multi-Strategy Music Verification
To prevent broken links or missing audio previews, the backend runs a cascading search:
1. **Strict Search**: Structured `artist:"X" track:"Y"` Deezer query.
2. **Free-Text Fallback**: Generic combined-term search to cover indexing discrepancies.
3. **Title + Fuzzy Artist Match**: Broadens to song title and scores results using Jaccard similarity on artist name tokens.
4. **Artist-Only Fallback**: Searches the artist's catalog and evaluates top tracks against the expected title.

If all four strategies fail, the track is blacklisted and Gemini is re-prompted for an alternative.

### Guardrailed Prompting
Gemini is configured with XML-structured instructions that enforce strict JSON output (`judul`, `penyanyi`, `mood_tag`, `punchline`), inject a blacklist of previously failed tracks, sanitize metadata suffixes (e.g. `(Remastered)`, `Feat.`), and allocate an 8,192-token thinking budget.

### Deterministic Fallback Pool
When external APIs are unavailable, the system falls back to 100 hand-curated tracks selected via a 10×10 matrix mapping Step 1 (weekend vibe) against Step 3 (life movie genre), ensuring a tailored result even in offline mode.

### CORS-Safe Image Proxy
Cover art from Deezer's CDN is routed through `/api/image-proxy` to bypass canvas CORS restrictions and enable clean local PNG exports.

---

## System Flow

```
[ Landing Page ]
       │
       ▼ (Generate SHA-256 Browser Fingerprint)
[ POST /api/session/check ] ──(Limit > 4)──► [ 429 Access Blocked ]
       │
       ▼
[ Quiz (/quiz) ] ──(Submitted)──────────────────────────────────────────┐
                                                                         │
[ POST /api/analyze ]                                                    │
  ├── Sanitize input & run injection checks                             ◄┘
  ├── Build Gemini prompt with context + exclusions
  ├── Execute Gemini 2.5 Flash
  ├── Cascading Deezer verification (max 3 retries)
  ├── Cache result in Redis (TTL: 30 min)
  └── Return session ID
       │
       ▼
[ Result Page (/result/[sessionId]) ]
  ├── Fetch session from Redis
  ├── Refresh audio preview URL from Deezer
  └── Render card, waveform, and share actions
```

---

## Setup

### Prerequisites
- Node.js 18+
- Upstash Redis instance
- Google AI Studio API key

### 1. Clone
```bash
git clone https://github.com/ikhlasulabda/frequencies.git
cd frequencies
```

### 2. Environment Variables
Create `.env.local` in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url_here
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token_here
```

### 3. Install & Run
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view locally.

### 4. Build for Production
```bash
npm run build
npm start
```
