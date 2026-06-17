# Frequencies

Frequencies is an emotionally intelligent, personality-driven music curation web application built using Next.js. Rather than relying on traditional favorite genre selectors or artist searches, Frequencies translates a user's current emotional state, weekend vibes, and free-text reflections into a precise, context-aware song recommendation.

The application generates a highly polished, shareable 9:16 visual card (akin to Spotify Wrapped or Instagram Stories) containing the selected song's cover art, a custom mood tag, and a personalized, AI-generated punchline that validates the user's emotional state.

---

## Core Features

- **Interactive Dynamic Questionnaire**: A 5-step conversational interface utilizing branching logic (where Step 2 adapts dynamically based on the Step 1 answer) and free-text inputs for expressive responses.
- **AI-Powered Semantic Mapping**: Leverages Google Gemini 2.5 Flash to analyze text inputs and choices, translating emotional nuances and local context into curated music metadata.
- **Cascading Music Search**: Validates AI recommendations against the Deezer database using a multi-layered fallback search pipeline to ensure that suggested tracks are playable and contain preview assets.
- **Dynamic Card Export**: Generates a downloadable 9:16 visual card using browser-based HTML-to-image conversion, styled with a light/warm retro aesthetic.
- **Custom Waveform Player**: Plays a 30-second audio preview of the recommended song alongside an interactive, custom-styled SVG waveform.
- **Rate-Limiting Protection**: Enforces client- and server-side rate limits using a combination of browser fingerprinting and Upstash Redis.

---

## Technology Stack

- **Framework**: Next.js 15 (App Router, React 19)
- **Styling & Animations**: Vanilla CSS (CSS Variables, Flexbox, custom keyframe animations), Framer Motion (for page transitions and active progress indicators)
- **Language**: TypeScript
- **AI Integration**: Google Gemini 2.5 Flash API
- **Caching & Rate Limiting**: Upstash Redis
- **Third-Party APIs**: Deezer API (via search and track lookup endpoints)
- **Media Utilities**: HTML-to-Image (DOM canvas capture), custom HTML5 Audio element references

---

## Architectural & Engineering Highlights

### 1. Robust Multi-Strategy Music Verification
To prevent broken recommendation links or missing audio previews, the backend employs a **Cascading Search Strategy**:
1. **Strict Search**: Searches Deezer using structured `artist:"X" track:"Y"` filters.
2. **Combined Free-Text**: Falls back to generic text matching (`X Y`) to accommodate minor indexing discrepancies.
3. **Title-Only with Fuzzy Match**: Broadens the search to the song title and scores results based on artist name similarity (using Jaccard similarity token overlap).
4. **Artist-Only with Fuzzy Match**: As a final attempt, searches the artist's library and evaluates top tracks against the expected song title.

If all strategies fail, the track is blacklisted, and the pipeline prompts Gemini for an alternative recommendation.

### 2. Guardrailed Structured Prompting
Gemini 2.5 Flash is configured with structured XML-based instructions to enforce:
- **Strict Output Specification**: Returns a structured JSON payload (`judul`, `penyanyi`, `mood_tag`, `punchline`) with `response_mime_type: 'application/json'`.
- **Blacklist Injection**: Explicitly forbids recommendations that previously failed Deezer verification.
- **Metadata Sanitation**: Prevents the LLM from returning noisy titles containing metadata suffixes (e.g., "(Remastered)", "(Official Video)", "Feat.").
- **Thinking Token Buffer**: Configured with an 8,192 token limit, ensuring Gemini has sufficient headroom for inner monologue/chain-of-thought processing.

### 3. Matrix-Based Deterministic Fallback Pool
In the event that external APIs fail or Gemini encounters quota limits, the system switches to a local database of 100 hand-curated tracks. The selection is determined by a 10x10 matrix mapping the user's Step 1 choice (weekend vibe) against their Step 3 choice (life movie genre), ensuring a highly tailored recommendation even in offline/fallback mode.

### 4. Fingerprint-Based Rate Limiting
To prevent API abuse while allowing friction-free anonymous access, client sessions are tracked using a browser fingerprint compiled from user-agent strings, timezone offsets, and screen specifications. This fingerprint is hashed using SHA-256 and verified on the server side via Upstash Redis. Users are limited to 4 requests per 15-minute sliding window.

### 5. Server-Side Image Proxy
External album art hosted on Deezer's CDN cannot be drawn directly onto HTML5 Canvas elements due to browser Cross-Origin Resource Sharing (CORS) restrictions. Frequencies routes cover images through a Next.js API route proxy (`/api/image-proxy`) to safely allow clean visual card generation and local PNG downloads.

---

## System Workflow

```
[ Landing Page ]
       │
       ▼ (Generate SHA-256 Browser Fingerprint)
[ POST /api/session/check ] ────(Limit > 4)────► [ Access Blocked (429) ]
       │
       ▼ (Allowed)
[ Interactive Quiz (/quiz) ] ──(Answers Submitted)
       │
       ▼
[ POST /api/analyze ]
  ├── 1. Run Input Sanitation & Injection Checks
  ├── 2. Inject Context & Exclusions into Gemini Prompt
  ├── 3. Execute Gemini 2.5 Flash Analysis
  ├── 4. Run Cascading Deezer Verification Loop (Max 3 retries)
  ├── 5. Save Results to Redis Cache (TTL: 30 minutes)
  └── 6. Return Session ID
       │
       ▼ (Redirect)
[ Result Page (/result/[sessionId]) ]
  ├── 1. Fetch Session Metadata from Redis Cache
  ├── 2. Fetch fresh, active Audio Preview URL from Deezer API
  └── 3. Render Frequency Card, Audio Waveform, & Share Actions
```

---

## Installation and Setup

### Prerequisites
- Node.js 18.x or later
- An Upstash Redis account and active database
- A Google AI Studio API Key (for Gemini)

### 1. Clone the Repository
```bash
git clone https://github.com/ikhlasulabda/frequencies.git
cd frequencies
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory and define the following keys:
```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Upstash Redis Credentials
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url_here
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token_here
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application locally.

### 5. Build for Production
```bash
npm run build
npm start
```
