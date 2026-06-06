// lib/questions.ts

import { Question } from '@/types'

export const QUESTIONS: Question[] = [
    {
        id: 1,
        type: 'choice',
        text: 'Sabtu malem, lo paling mungkin ngapain?',
        choices: [
            { label: 'sendiri dan tenang', display: 'Rebahan gelap-gelapan, earphone' },
            { label: 'ceria dan sosial', display: 'Nongkrong sama bestie' },
            { label: 'jalan sama ayang', display: 'Jalan berdua tengah malem' },
            { label: 'escapist dan santai', display: 'Main game / nonton series' },
            { label: 'fokus dan kreatif', display: 'Produktif: bikin sesuatu' },
            { label: 'lonely in a crowd', display: 'Hangout tapi ngerasa sendirian' },
            { label: 'energik dan aktif', display: 'Olahraga atau aktivitas fisik' },
            { label: 'overthinking dan restless', display: 'Scroll sosmed sampe galau' },
        ]
    },
    {
        id: 2,
        type: 'choice',
        text: 'Kalau hidup lo sekarang dijadiin film, genrenya apa?',
        choices: [
            { label: 'mencari jati diri', display: 'Coming-of-age drama' },
            { label: 'chaos tapi keep moving', display: 'Action — terus bergerak' },
            { label: 'jatuh cinta parah', display: 'Romance yang bikin mual' },
            { label: 'melawan pikiran sendiri', display: 'Psychological thriller' },
            { label: 'ngerasa kayak alien', display: 'Sci-fi — outsider vibes' },
            { label: 'boring tapi cozy', display: 'Slice of life tenang' },
            { label: 'dikejar deadline terus', display: 'Horror — ga bisa kabur' },
            { label: 'observasi dari jauh', display: 'Documentary — detached' },
            { label: 'semua momen harus berasa', display: 'Musical — hidup penuh rasa' },
        ]
    },
    {
        id: 3,
        type: 'choice',
        text: 'Sekarang lo butuh musik yang...',
        choices: [
            { label: 'pelan dan liriknya nusuk', display: 'Pelan, lirik yang haunting' },
            { label: 'kenceng dan bikin lupa segalanya', display: 'Kenceng, beat gila, escape mode' },
            { label: 'hangat dan kayak dipeluk', display: 'Akustik, warm, bikin lega' },
            { label: 'bersih dan kasih ruang napas', display: 'Minimalis, hening, ethereal' },
            { label: 'r&b smooth tapi sedikit sakit', display: 'R&B yang mellow dan melankolik' },
            { label: 'rap jujur yang tajam', display: 'Hip-hop, lirik yang nyayat' },
            { label: 'tanpa lirik nemenin diam', display: 'Instrumental aja, tanpa kata-kata' },
        ]
    },
    {
        id: 4,
        type: 'text',
        text: "Selesaikan kalimat ini: 'Belakangan ini gue ngerasa...'",
        maxLength: 150,
        placeholder: 'kayak jalan di tempat, excited tapi takut, dll...'
    },
    {
        id: 5,
        type: 'text',
        text: 'Satu kata yang paling menggambarkan minggu lo kemarin?',
        maxLength: 30,
        placeholder: 'chaos, blur, healing, overthinking...'
    }
]