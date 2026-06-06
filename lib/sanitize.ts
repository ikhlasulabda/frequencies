// lib/sanitize.ts

const INJECTION_PATTERNS = [
    /ignore (previous|all|above)/i,
    /forget (instructions|everything)/i,
    /you are now/i,
    /act as/i,
    /jangan ikuti/i,
    /lupakan instruksi/i,
    /\bsystem\b.*\bprompt\b/i,
    /<[^>]*>/g,
    /\{[^}]*\}/g,
]

export function sanitizeInput(raw: string, maxLength: number): string {
    if (!raw || typeof raw !== 'string') {
        throw new Error('INVALID_INPUT_TYPE')
    }

    let clean = raw.trim()

    clean = clean.slice(0, maxLength)

    clean = clean
        .replace(/[<>"'`\\]/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\s{3,}/g, ' ')

    for (const pattern of INJECTION_PATTERNS) {
        if (pattern.test(clean)) {
            throw new Error('INJECTION_DETECTED')
        }
    }

    if (clean.length === 0) {
        throw new Error('EMPTY_INPUT')
    }

    return clean
}

export function validateChoice(
    answer: string,
    validLabels: string[]
): string {
    if (!validLabels.includes(answer)) {
        throw new Error('INVALID_CHOICE')
    }
    return answer
}