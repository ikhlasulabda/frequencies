import { Question } from '@/types'

export const Q2_BRANCHES: Record<
    string,
    { text: string; choices: { label: string; display: string }[] }
> = {
    'solitary, peaceful, isolated by choice': {
        text: 'Lagi dengerin apa emang, kok sampe gamau diganggu?',
        choices: [
            { label: 'sad indie tunes for overthinking', display: 'Lagu galau peneman overthink' },
            { label: 'spooky podcast or weird theories', display: 'Podcast misteri / konspirasi aneh' },
            { label: 'lofi beats for chill vibe', display: 'Lofi beats biar otak adem' }
        ]
    },
    'extroverted, highly social, seeking company': {
        text: 'Sirkel lo kalo nongkrong biasanya ngomongin apaan?',
        choices: [
            { label: 'spilling hot gossip and tea', display: 'Ghibah hot terbaru yang lagi viral' },
            { label: 'existential talk about future and finance', display: 'Deep talk masa depan & krisis finansial' },
            { label: 'shitposting and brainrot humor live', display: 'Cuma ketawa ketiwi gak jelas, jokes bapack-bapack' }
        ]
    },
    'romantically infatuated, deep bonding with partner': {
        text: 'Emang kenapa tuh? Ceritain dong...',
        choices: [
            { label: 'honeymoon phase, newly in love', display: 'Baru jadian hehe, lagi anget-angetnya' },
            { label: 'dragged by partner, slightly annoyed but compliant', display: 'Ya ayang gua maksa mulu sii' },
            { label: 'fixing a rocky relationship', display: 'Lagi benerin hubungan aja yg udah mau renggang' }
        ]
    },
    'escapist, avoidant, media binging comfort': {
        text: 'Genrenya apa nih? Biar tau tingkat pelarian lo...',
        choices: [
            { label: 'hype anime for escapism', display: 'Anime shonen/action biar dapet asupan semangat' },
            { label: 'cheesy romance K-drama', display: 'Drakor romantis biar dapet asupan keuwuan' },
            { label: 'thriller detective show to distract brain', display: 'Thriller/detektif biar mikir keras daripada mikirin hidup' }
        ]
    },
    'highly focused, career-driven, highly productive': {
        text: 'Grinding apaan nih? Calon CEO masa depan?',
        choices: [
            { label: 'side hustle for early retirement', display: 'Ngerjain side hustle biar cepet pensiun dini' },
            { label: 'learning skills to escape minimum wage', display: 'Belajar skill baru demi lepas dari jeratan umr' },
            { label: 'desperate panic work right before deadline', display: 'Nugas/projekan H-1 deadline yang mepet parah' }
        ]
    },
    'existentially lonely despite being around friends': {
        text: 'Kok bisa? Lagi mikirin apa emangnya?',
        choices: [
            { label: 'out of sync with friends conversations', display: 'Ngerasa ga se-frekuensi aja sama obrolan mereka' },
            { label: 'anxious about future blurry plans', display: 'Mikirin masa depan yang masih blur abu-abu' },
            { label: 'missing someone quietly', display: 'Kangen seseorang tapi gabisa bilang' }
        ]
    },
    'anxious, overthinking, paralyzed by doomscrolling': {
        text: 'Algoritma sosmed lo lagi ngeracunin apa nih?',
        choices: [
            { label: 'insecure from others accomplishments', display: 'Postingan pencapaian orang lain yang bikin insecure' },
            { label: 'endless internet drama and gossip', display: 'Berita drama sosmed/influencer tak berujung' },
            { label: 'brainrot memes or cute cats', display: 'Kucing lucu / meme brainrot penunda tidur' }
        ]
    },
    'burnout, heavily exhausted but unable to rest properly': {
        text: 'Jompo bagian mana nih yang paling berasa?',
        choices: [
            { label: 'back pain and stiff neck, physical jompo', display: 'Punggung encok dan leher kaku, butuh koyo' },
            { label: 'noisy brain simulating fake scenarios', display: 'Otak berisik mikirin skenario yang gak bakal terjadi' },
            { label: 'chest tightness from school or work stress', display: 'Overwhelmed ama kerjaan/kuliah sampe sesek dada' }
        ]
    },
    'nostalgic, longing for past memories or persons': {
        text: 'Masa lalu yang mana nih? Spill dikit dong...',
        choices: [
            { label: 'school days when life was simple', display: 'Zaman sekolah/kuliah pas beban hidup cuma PR matematika' },
            { label: 'the one that got away, ex partner', display: 'Mantan terindah yang udah bahagia sama yang lain' },
            { label: 'old home vibes and childhood nostalgia', display: 'Suasana rumah lama yang sekarang udah beda banget' }
        ]
    },
    'impulsive, chaotic energy, seeking immediate dopamine': {
        text: 'Keputusan impulsif apa yang baru aja lo lakuin?',
        choices: [
            { label: 'buying useless stuff for quick dopamine', display: 'Checkout barang gak penting demi dopamine hit' },
            { label: 'texting ex or random person at 2 AM', display: 'Nge-chat mantan / orang random jam 2 pagi' },
            { label: 'cutting bangs or extreme hair makeover', display: 'Potong poni sendiri / ganti gaya rambut ekstrem' }
        ]
    }
}

export const QUESTIONS: Question[] = [
    {
        id: 1,
        type: 'choice',
        text: 'pas orang-orang pada sibuk malem mingguan, lu ngapain?',
        choices: [
            { label: 'solitary, peaceful, isolated by choice', display: 'Me time mode, earphone on, lampu mati' },
            { label: 'extroverted, highly social, seeking company', display: 'Nongkrong bareng circle terdekat, anti-ansos' },
            { label: 'romantically infatuated, deep bonding with partner', display: 'Nightwalk bareng doi, deep talk ngalor-ngidul' },
            { label: 'escapist, avoidant, media binging comfort', display: 'Marathon series/anime, mode do not disturb' },
            { label: 'highly focused, career-driven, highly productive', display: 'Grinding silently, produktif pas yang lain numpang lewat' },
            { label: 'existentially lonely despite being around friends', display: 'Di tempat rame tapi ngerasa sepi sendiri' },
            { label: 'anxious, overthinking, paralyzed by doomscrolling', display: 'Rebahan tapi otak travelling gara-gara doomscrolling' },
            { label: 'burnout, heavily exhausted but unable to rest properly', display: 'Capek mental, jompo era, pengen tidur tapi gabisa' },
            { label: 'nostalgic, longing for past memories or persons', display: 'Kangen masa lalu, dengerin playlist jadul sambil ngelamun' },
            { label: 'impulsive, chaotic energy, seeking immediate dopamine', display: 'Lagi impulsif, random checkout, emosi naik turun' }
        ]
    },
    {
        id: 2,
        type: 'choice',
        text: 'Lanjutan dari pilihan pertama...',
        choices: [] // Dinamis diisi berdasarkan Q1
    },
    {
        id: 3,
        type: 'choice',
        text: 'Ibarat hidup lu sekarang dijadiin film, genrenya apa?',
        choices: [
            { label: 'identity crisis, figuring out life purpose', display: 'Coming-of-age yang penuh krisis jati diri' },
            { label: 'resilient through structural chaos and stress', display: 'Everything is on fire tapi tetep kudu jalan terus' },
            { label: 'hopelessly romantic, blindly in love, down bad', display: 'Certified bucin parah, otak isinya dia doang' },
            { label: 'self-sabotaging, fighting inner negative thoughts', display: 'Psychological thriller: musuhnya adalah pikiran sendiri' },
            { label: 'alienated, misunderstood, feeling out of place', display: 'Sci-fi outsider: ngerasa salah tempat di mana-mana' },
            { label: 'monotonous but comfortable and low-stakes life', display: 'Slice of life: datar, flat, tapi cozy routine' },
            { label: 'overwhelmed by academic or professional deadlines', display: 'Horror: dikejar deadline tugas, kerjaan, ama tagihan' },
            { label: 'healing from past trauma, recovering emotionally', display: 'Fase rekonstruksi, healing pelan-pelan dari masa lalu' },
            { label: 'ambitious transition, stepping into a completely new chapter', display: 'Buka lembaran baru, adaptasi baru yang bikin deg-degan' },
            { label: 'hedonistic, living in the moment, high intensity lifestyle', display: 'Action full speed, gas terus, prinsip YOLO' }
        ]
    },
    {
        id: 4,
        type: 'text',
        text: "Coba lengkapin yahh: Belakangan ini gue ngerasa...",
        maxLength: 150,
        placeholder: 'apa aja pokoknya luapin emosi lu... (use english for better output)'
    },
    {
        id: 5,
        type: 'text',
        text: 'Satu/dua kata yang paling menggambarkan hari-hari lu?',
        maxLength: 30,
        placeholder: 'chaos, super gokil, sigma, overthinking...(use english for better output)'
    }
]