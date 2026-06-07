// lib/fallback.ts
// Pool lagu terverifikasi — dicocokkan berdasarkan kombinasi Q1 dan Q3.
// 100 entri, diurutkan: baris = Q1 index (0–9), kolom = Q3 index (0–9).
// Dipakai kalau Gemini + Deezer retry 3x masih gagal.

export interface FallbackSong {
    judul: string
    penyanyi: string
    mood_tag: string
    punchline: string
}

const Q1_LABELS = [
    'solitary, peaceful, isolated by choice',
    'extroverted, highly social, seeking company',
    'romantically infatuated, deep bonding with partner',
    'escapist, avoidant, media binging comfort',
    'highly focused, career-driven, highly productive',
    'existentially lonely despite being around friends',
    'anxious, overthinking, paralyzed by doomscrolling',
    'burnout, heavily exhausted but unable to rest properly',
    'nostalgic, longing for past memories or persons',
    'impulsive, chaotic energy, seeking immediate dopamine'
]

const Q3_LABELS = [
    'identity crisis, figuring out life purpose',
    'resilient through structural chaos and stress',
    'hopelessly romantic, blindly in love, down bad',
    'self-sabotaging, fighting inner negative thoughts',
    'alienated, misunderstood, feeling out of place',
    'monotonous but comfortable and low-stakes life',
    'overwhelmed by academic or professional deadlines',
    'healing from past trauma, recovering emotionally',
    'ambitious transition, stepping into a completely new chapter',
    'hedonistic, living in the moment, high intensity lifestyle'
]

// 100 lagu, index = (Q1_index * 10) + Q3_index
export const FALLBACK_SONGS: FallbackSong[] = [

    // Row 0: solitary, peaceful, isolated by choice
    // 00 - identity crisis
    { judul: 'Vienna', penyanyi: 'Billy Joel', mood_tag: 'Gentle Reminder', punchline: 'Lo gak usah buru-buru ngejar dunia, it\'s okay to pace yourself' },
    // 01 - resilient through structural chaos
    { judul: 'In the Stars', penyanyi: 'Benson Boone', mood_tag: 'Looming Absence', punchline: 'Belajar ikhlas lepasin orang yang udah beda dimensi tuh beneran se-heavy itu' },
    // 02 - hopelessly romantic
    { judul: 'Untungnya, Hidup Harus Tetap Berjalan', penyanyi: 'Bernadya', mood_tag: 'Melancholic Resilience', punchline: 'Sakitnya dapet, tapi untungnya lo sadar kalau plot armor hidup lo gak berhenti di dia' },
    // 03 - self-sabotaging
    { judul: 'Ghostin', penyanyi: 'Ariana Grande', mood_tag: 'Guilty Grief', punchline: 'Terjebak rasa bersalah karena masih nyari bayangan masa lalu di pelukan orang baru' },
    // 04 - alienated, out of place
    { judul: 'Space Oddity', penyanyi: 'David Bowie', mood_tag: 'Cosmic Detachment', punchline: 'Ngerasa disconnected sama dunia luar, jadi mending ngawang-ngawang sendirian aja' },
    // 05 - monotonous, comfortable
    { judul: 'Rumah', penyanyi: 'Salma Salsabil', mood_tag: 'Safe Haven', punchline: 'Tempat paling nyaman buat pulang emang valid di dalem diri lo sendiri' },
    // 06 - overwhelmed by deadlines
    { judul: 'Fine Line', penyanyi: 'Harry Styles', mood_tag: 'Bittersweet Balance', punchline: 'Lagi di fase pasrah aja nerima segala naik turunnya emosi yang chaotic ini' },
    // 07 - healing from trauma
    { judul: 'Free Mind', penyanyi: 'Tems', mood_tag: 'Mental Solitude', punchline: 'Cuma mau nge-silence semua isi kepala yang bising biar dapet peace of mind' },
    // 08 - ambitious transition
    { judul: 'Rivers and Roads', penyanyi: 'The Head and the Heart', mood_tag: 'Inevitable Distance', punchline: 'Paham kalau perpisahan itu mutlak pas semua orang udah milih jalannya masing-masing' },
    // 09 - hedonistic, YOLO
    { judul: 'Sua Amiga Vou Pegar', penyanyi: 'MC WM & MC Lan', mood_tag: 'Defiant Solitude', punchline: 'Lagi pengen numpahin semua energi chaotic sendirian tanpa peduli validasi orang' },

    // Row 1: extroverted, highly social, seeking company
    // 10 - identity crisis
    { judul: 'We Are Young', penyanyi: 'fun.', mood_tag: 'Fleeting Youth', punchline: 'Biar hidup lagi messy, malam ini kita bakar aja semua overthinking bareng circle' },
    // 11 - resilient through chaos
    { judul: 'I Will Survive', penyanyi: 'Gloria Gaynor', mood_tag: 'Empowered Comeback', punchline: 'Udah ngelewatin banyak hal badass, mana ada waktu buat galauin yang ninggalin' },
    // 12 - hopelessly romantic
    { judul: 'Kita Bikin Romantis', penyanyi: 'MALIQ & D\'Essentials', mood_tag: 'Collective Warmth', punchline: 'Bikin momen sederhana bareng orang tersayang jadi keliatan estetik tanpa effort' },
    // 13 - self-sabotaging
    { judul: 'Fake Friends', penyanyi: 'Joan', mood_tag: 'Social Scepticism', punchline: 'Nongkrong sih seru, tapi tetep filter mana yang tulus mana yang bermuka dua' },
    // 14 - alienated
    { judul: 'Creep', penyanyi: 'Radiohead', mood_tag: 'Crowded Misfit', punchline: 'Ada di tengah keramaian tapi tetep ngerasa jadi kepingan puzzle yang gak cocok' },
    // 15 - monotonous
    { judul: "You've Got a Friend in Me", penyanyi: 'Randy Newman', mood_tag: 'Pure Loyalty', punchline: 'Vibe-nya tuh se-cozy itu pas tahu lo punya comfort person yang selalu ready back up lo' },
    // 16 - overwhelmed by deadlines
    { judul: '9 to 5', penyanyi: 'Dolly Parton', mood_tag: 'Shared Hustle', punchline: 'Sama-sama jadi budak korporat, untung masih bisa sambat bareng temen seperjuangan' },
    // 17 - healing
    { judul: 'Scars To Your Beautiful', penyanyi: 'Alessia Cara', mood_tag: 'Collective Healing', punchline: 'Definisi saling validasi kalau kita semua berharga apa adanya tanpa standar toxic' },
    // 18 - ambitious transition
    { judul: 'Melompat Lebih Tinggi', penyanyi: 'Sheila On 7', mood_tag: 'Synergetic Leap', punchline: 'Ngedobrak batas limit bareng-bareng demi ngejar masa depan yang lebih cerah' },
    // 19 - hedonistic
    { judul: 'Cruel Summer', penyanyi: 'Taylor Swift', mood_tag: 'Desperate Infatuation', punchline: 'Nge-keep hubungan rahasia yang intens tapi penuh risiko di tengah hiruk-pikuk summer' },

    // Row 2: romantically infatuated, deep bonding with partner
    // 20 - identity crisis
    { judul: 'Double Take', penyanyi: 'dhruv', mood_tag: 'Sudden Realization', punchline: 'Sadar gak sadar, pelan-pelan boundaries pertemanan kita udah berubah jadi rasa suka' },
    // 21 - resilient through chaos
    { judul: 'Die With A Smile', penyanyi: 'Bruno Mars & Lady Gaga', mood_tag: 'Apocalyptic Devotion', punchline: 'Kalo emang dunia mau kiamat, minimal gue mau abisin detik terakhirnya sambil meluk lo' },
    // 22 - hopelessly romantic
    { judul: 'Until I Found You', penyanyi: 'Stephen Sanchez', mood_tag: 'Timeless Anchorage', punchline: 'Pencarian emosional gue resmi selesai semenjak lo hadir jadi dermaga terakhir' },
    // 23 - self-sabotaging
    { judul: 'Favorite Crime', penyanyi: 'Olivia Rodrigo', mood_tag: 'Toxic Compliance', punchline: 'Rela ngebela kesalahan lo demi nahan lo biar gak pergi, walau ujungnya gue yang hancur' },
    // 24 - alienated
    { judul: 'As It Was', penyanyi: 'Harry Styles', mood_tag: 'Irreversible Shift', punchline: 'Ada ruang kosong yang berubah di antara kita, dan rasanya gak bakal bisa sama lagi' },
    // 25 - monotonous
    { judul: 'Dari Planet Lain', penyanyi: 'Sal Priadi', mood_tag: 'Quirky Affection', punchline: 'Cara lo mencintai gue tuh aneh banget, tapi itu yang bikin hidup datar gue jadi seru' },
    // 26 - overwhelmed by deadlines
    { judul: 'Stuck with U', penyanyi: 'Ariana Grande & Justin Bieber', mood_tag: 'Cozy Confinement', punchline: 'Gak masalah kejebak rutinitas penat, asal ruang gerak gue cuma dikunci bareng lo' },
    // 27 - healing
    { judul: 'Angels Like You', penyanyi: 'Miley Cyrus', mood_tag: 'Sacrificial Love', punchline: 'Ngelepasin lo karena gue tahu vibes rusak gue cuma bakal bikin lo ikutan luka' },
    // 28 - ambitious transition
    { judul: 'Golden Hour', penyanyi: 'JVKE', mood_tag: 'Luminous Epiphany', punchline: 'Dunia yang tadinya abu-abu langsung dapet color correction instan pas lo datang' },
    // 29 - hedonistic
    { judul: 'Sore Tugu Pancoran', penyanyi: 'Iwan Fals', mood_tag: 'Grounded Romance', punchline: 'Nemu ketenangan romantis di tengah kerasnya realita pinggiran jalan kota' },

    // Row 3: escapist, avoidant, media binging comfort
    // 30 - identity crisis
    { judul: 'Scott Street', penyanyi: 'Phoebe Bridgers', mood_tag: 'Melancholic Nostalgia', punchline: 'Ngerasa asing sama orang lama yang pelan-pelan berubah jadi stranger' },
    // 31 - resilient through chaos
    { judul: 'Unstoppable', penyanyi: 'Sia', mood_tag: 'Emotional Armor', punchline: 'Masang topeng sok kuat biar gak ada satu orang pun yang bisa ngeliat kerapuhan gue' },
    // 32 - hopelessly romantic
    { judul: 'Espresso', penyanyi: 'Sabrina Carpenter', mood_tag: 'Caffeinated Obsession', punchline: 'Sengaja bikin dia kepikiran terus sampai gabisa tidur, controlling the narrative' },
    // 33 - self-sabotaging
    { judul: 'Numb', penyanyi: 'Linkin Park', mood_tag: 'Suffocating Expectations', punchline: 'Mending mati rasa sekalian daripada capek menuhin ekspektasi orang lain' },
    // 34 - alienated
    { judul: 'Secukupnya', penyanyi: 'Hindia', mood_tag: 'Stoic Acceptance', punchline: 'Ngedesensitisasi rasa sedih karena tahu besok tetep harus bangun dan survive' },
    // 35 - monotonous
    { judul: 'Remedy for a Broken Heart', penyanyi: 'XXXTENTACION', mood_tag: 'Subdued Ache', punchline: 'Ngelariin diri ke ruang hampa buat nenangin luka yang belum sepenuhnya kering' },
    // 36 - overwhelmed by deadlines
    { judul: 'Hard Times', penyanyi: 'Paramore', mood_tag: 'Cynical Optimism', punchline: 'Udah di tahap ngetawain kesialan hidup karena terlalu capek buat nangis' },
    // 37 - healing
    { judul: 'Glimpse of Us', penyanyi: 'Joji', mood_tag: 'Haunting Comparison', punchline: 'Ngelariin diri ke orang baru tapi mata tetep nyari serpihan memori masa lalu' },
    // 38 - ambitious transition
    { judul: 'New Room', penyanyi: 'Dynamic Duo', mood_tag: 'Fresh Perspective', punchline: 'Nata ulang isi kepala dan vibe baru biar gak kejebak di siklus yang lama' },
    // 39 - hedonistic
    { judul: 'Starboy', penyanyi: 'The Weeknd', mood_tag: 'Decadent Detachment', punchline: 'Nge-flex kesuksesan materialistis cuma buat nutupin kekosongan emosional di dalem' },

    // Row 4: highly focused, career-driven, highly productive
    // 40 - identity crisis
    { judul: 'Lose Yourself', penyanyi: 'Eminem', mood_tag: 'Laser Focus', punchline: 'Sadar momentumnnya cuma datang sekali, jadi gak ada ruang buat bikin blunder' },
    // 41 - resilient through chaos
    { judul: 'Badai Telah Berlalu', penyanyi: 'Diskoria & BCL', mood_tag: 'Radiant Relief', punchline: 'Fase merayakan kebebasan mental setelah sekian lama ketutup awan mendung korporat' },
    // 42 - hopelessly romantic
    { judul: 'Perfect', penyanyi: 'Ed Sheeran', mood_tag: 'Devoted Ambition', punchline: 'Kerja keras bagai kuda demi bisa ngasih masa depan yang layak buat comfort person gue' },
    // 43 - self-sabotaging
    { judul: 'Control', penyanyi: 'Halsey', mood_tag: 'Internal Friction', punchline: 'Ngedrive ambisi terlalu keras sampai gak sadar kalau mental health gue lagi dipertaruhkan' },
    // 44 - alienated
    { judul: 'The Lazy Song', penyanyi: 'Bruno Mars', mood_tag: 'Deliberate Inaction', punchline: 'Nge-shutdown semua notif kerjaan karena kewarasan gue jauh lebih mahal harganya' },
    // 45 - monotonous
    { judul: 'Coffee', penyanyi: 'beabadoobee', mood_tag: 'Domestic Serenity', punchline: 'Nemu ritme kerja yang tenang ditemani angetnya rutinitas kecil yang konstan' },
    // 46 - overwhelmed by deadlines
    { judul: 'Under Pressure', penyanyi: 'Queen', mood_tag: 'Systemic Suffocation', punchline: 'Ditekan kanan-kiri sama tuntutan hidup yang bener-bener ngetes batas sabar' },
    // 47 - healing
    { judul: 'Bunga Hati', penyanyi: 'Salma Salsabil', mood_tag: 'Optimistic Bloom', punchline: 'Energi baru buat move on dan fokus upgrade diri setelah lama kejebak ghosting' },
    // 48 - ambitious transition
    { judul: 'Hall of Fame', penyanyi: 'The Script', mood_tag: 'Ultimate Legacy', punchline: 'Terus melangkah naik ke puncak sampai semua pengorbanan lo dapet validasi mutlak' },
    // 49 - hedonistic
    { judul: 'Industry Baby', penyanyi: 'Lil Nas X', mood_tag: 'Unapologetic Triumph', punchline: 'Ngebuktiin ke para doubters kalau sukses gue sekarang itu hasil mutlak dari self-worth' },

    // Row 5: existentially lonely despite being around friends
    // 50 - identity crisis
    { judul: 'Are You Bored Yet', penyanyi: 'Wallows', mood_tag: 'Stagnant Connection', punchline: 'Takut kalau sebenernya circle kita tuh bertahan cuma karena udah terbiasa aja' },
    // 51 - resilient through chaos
    { judul: 'Heavy', penyanyi: 'Linkin Park', mood_tag: 'Mental Overload', punchline: 'Capek pura-pura fine di depan orang padahal kapasitas mental udah overload' },
    // 52 - hopelessly romantic
    { judul: 'Gala Bunga Matahari', penyanyi: 'Sal Priadi', mood_tag: 'Ethereal Longing', punchline: 'Rasa kangen ke orang yang udah berpulang duluan, dibalut doa biar dia bahagia di sana' },
    // 53 - self-sabotaging
    { judul: 'Sialan', penyanyi: 'Juicy Luicy & Adrian Khalif', mood_tag: 'Relapsed Emotion', punchline: 'Udah susah-susah ngebangun tembok move on, runtuh seketika cuma karena papasan di jalan' },
    // 54 - alienated
    { judul: 'Social Cues', penyanyi: 'Cage the Elephant', mood_tag: 'Performative Presence', punchline: 'Harus tetep pasang muka fana di depan publik padahal aslinya pengen ngilang' },
    // 55 - monotonous
    { judul: 'Seasons', penyanyi: 'Wave to Earth', mood_tag: 'Transient Devotion', punchline: 'Cinta gue bakal tetep konstan walau musim dan sifat lo terus berubah-ubah' },
    // 56 - overwhelmed by deadlines
    { judul: 'Help', penyanyi: 'The Beatles', mood_tag: 'Vulnerable S.O.S', punchline: 'Udah gak sanggup mandiri terus, kali ini beneran butuh uluran tangan seseorang' },
    // 57 - healing
    { judul: 'Too Good at Goodbyes', penyanyi: 'Sam Smith', mood_tag: 'Guarded Heart', punchline: 'Sengaja masang barier tinggi biar gak gampang hancur pas ditinggal lagi' },
    // 58 - ambitious transition
    { judul: 'Ribs', penyanyi: 'Lorde', mood_tag: 'Terrifying Maturity', punchline: 'Ada rasa ngeri tersendiri pas sadar kalau kita dipaksa tumbuh dewasa secepat ini' },
    // 59 - hedonistic
    { judul: 'Blinding Lights', penyanyi: 'The Weeknd', mood_tag: 'Manic Loneliness', punchline: 'Ngebut di jalanan malam nyari distraksi instan demi ngalihin hampa di dada' },

    // Row 6: anxious, overthinking, paralyzed by doomscrolling
    // 60 - identity crisis
    { judul: 'Sweater Weather', penyanyi: 'The Neighbourhood', mood_tag: 'Intimate Sanctuary', punchline: 'Nyari proteksi emosional dari dinginnya dunia di dalam ruang aman kita berdua' },
    // 61 - resilient through chaos
    { judul: 'Believer', penyanyi: 'Imagine Dragons', mood_tag: 'Constructive Pain', punchline: 'Mengubah semua trauma dan rasa sakit masa lalu jadi bahan bakar buat bangkit' },
    // 62 - hopelessly romantic
    { judul: 'Satu Bulan', penyanyi: 'Bernadya', mood_tag: 'Obsessive Aftermath', punchline: 'Kocak banget pas tahu lo udah dapet pengganti, sementara gue masih stuck di memori lama' },
    // 63 - self-sabotaging
    { judul: 'Bad Liar', penyanyi: 'Imagine Dragons', mood_tag: 'Internal Deception', punchline: 'Gak bisa terus-terusan bohong kalau sebenernya mental gue lagi gak baik-baik aja' },
    // 64 - alienated
    { judul: 'Boulevard of Broken Dreams', penyanyi: 'Green Day', mood_tag: 'Solitary Walk', punchline: 'Napak tilas jalanan sepi sendirian, trying to make peace sama kesepian ini' },
    // 65 - monotonous
    { judul: 'Pluto Projector', penyanyi: 'Rex Orange County', mood_tag: 'Existential Dread', punchline: 'Takut kalau diri gue yang sekarang gak bakal cukup buat menuhin ekspektasi lo' },
    // 66 - overwhelmed by deadlines
    { judul: 'Evaluasi', penyanyi: 'Hindia', mood_tag: 'Grounding Affirmation', punchline: 'Ngingetin diri sendiri kalau gak apa-apa buat rehat, lo gak harus selalu sempurna' },
    // 67 - healing
    { judul: 'Birds', penyanyi: 'Imagine Dragons', mood_tag: 'Bittersweet Flight', punchline: 'Belajar berdamai dengan kenyataan kalau ada orang yang takdirnya cuma singgah sebentar' },
    // 68 - ambitious transition
    { judul: 'Overwhelmed', penyanyi: 'Royal & the Serpent', mood_tag: 'Sensory Overload', punchline: 'Sinyal di otak udah overload, butuh space secepatnya sebelum makin panik' },
    // 69 - hedonistic
    { judul: 'Super Shy', penyanyi: 'NewJeans', mood_tag: 'Adorable Anxiety', punchline: 'Isi kepala udah full skenario bareng lo, tapi realitanya malah kaku pas tatapan' },

    // Row 7: burnout, heavily exhausted but unable to rest properly
    // 70 - identity crisis
    { judul: 'Stop This Train', penyanyi: 'John Mayer', mood_tag: 'Fleeting Time', punchline: 'Pengen nge-pause waktu bentar karena laju kedewasaan ini kerasa terlalu cepat' },
    // 71 - resilient through chaos
    { judul: 'Still Feel', penyanyi: 'half•alive', mood_tag: 'Submerged Spark', punchline: 'Walau udah burnout parah, seenggaknya gue tahu jiwa gue belum sepenuhnya mati' },
    // 72 - hopelessly romantic
    { judul: 'Die For You', penyanyi: 'The Weeknd', mood_tag: 'Obsessive Devotion', punchline: 'Kondisi mental boleh lagi berantakan, tapi komitmen gue ke lo tetep gak bakal goyah' },
    // 73 - self-sabotaging
    { judul: 'Lemas Teles', penyanyi: 'Yeni Inka', mood_tag: 'Absolute Drain', punchline: 'Udah dikasih effort maksimal tapi balesannya malah dapet kekecewaan yang bikin lemes' },
    // 74 - alienated
    { judul: 'Someday', penyanyi: 'The Strokes', mood_tag: 'Fading Idealism', punchline: 'Berharap suatu hari nanti semua rasa capek dan keterasingan ini bakal kebayar lunas' },
    // 75 - monotonous
    { judul: 'Sleep On The Floor', penyanyi: 'The Lumineers', mood_tag: 'Desperate Escape', punchline: 'Lari dari penatnya rutinitas kota tanpa rencana, yang penting cabut dulu aja' },
    // 76 - overwhelmed by deadlines
    { judul: 'Running Up That Hill', penyanyi: 'Kate Bush', mood_tag: 'Uphill Battle', punchline: 'Rela tukeran posisi sama takdir demi nyelesein masalah pelik yang gak berujung' },
    // 77 - healing
    { judul: 'Matilda', penyanyi: 'Harry Styles', mood_tag: 'Quiet Release', punchline: 'Lo gak salah kalau milih ngejauh dari keluarga toxic demi kedamaian batin lo' },
    // 78 - ambitious transition
    { judul: 'Rayuan Perempuan Gila', penyanyi: 'Nadin Amizah', mood_tag: 'Insecure Transition', punchline: 'Takut gak ada yang mau nerima trauma gue, tapi tetep nekat buka hati buat babak baru' },
    // 79 - hedonistic
    { judul: 'I Gotta Feeling', penyanyi: 'Black Eyed Peas', mood_tag: 'Forced Euphoria', punchline: 'Ngebakar sisa energi burnout buat party, maksa otak biar ngerasa happy' },

    // Row 8: nostalgic, longing for past memories or persons
    // 80 - identity crisis
    { judul: 'Night Changes', penyanyi: 'One Direction', mood_tag: 'Evolving Reality', punchline: 'Dunia boleh berubah drastis, tapi memori masa muda kita bakal tetep locked aman' },
    // 81 - resilient through chaos
    { judul: 'Lamunan', penyanyi: 'Wahyu F Giri', mood_tag: 'Haunting Reverie', punchline: 'Nyari pelarian dari realita yang chaotic lewat bayangan indah lo yang selalu singgah' },
    // 82 - hopelessly romantic
    { judul: 'All I Want', penyanyi: 'Kodaline', mood_tag: 'Desolate Yearning', punchline: 'Nahan rindu setengah mati sambil terus berharap takdir bakal bawa lo balik ke gue' },
    // 83 - self-sabotaging
    { judul: 'Happier Than Ever', penyanyi: 'Billie Eilish', mood_tag: 'Cathartic Rage', punchline: 'Baru sadar kalau selama ini energi gue abis cuma buat ngadepin toxic-nya sifat lo' },
    // 84 - alienated
    { judul: 'Somebody That I Used To Know', penyanyi: 'Gotye', mood_tag: 'Estranged Memories', punchline: 'Aneh banget pas sadar orang yang dulu tahu luar dalem gue sekarang jadi asing banget' },
    // 85 - monotonous
    { judul: 'Put Your Records On', penyanyi: 'Corinne Bailey Rae', mood_tag: 'Nostalgic Solace', punchline: 'Balik dengerin lagu lama buat nenangin diri kalau semua badai ini bakal lewat' },
    // 86 - overwhelmed by deadlines
    { judul: 'Wake Me Up When September Ends', penyanyi: 'Green Day', mood_tag: 'Grief Overload', punchline: 'Milih merem dan nge-skip realita suram ini sampai semuanya bener-bener kondusif' },
    // 87 - healing
    { judul: 'Penjaga Hati', penyanyi: 'Nadhif Basalamah', mood_tag: 'Tender Anchorage', punchline: 'Udah nemu sosok yang bikin semua trauma masa lalu gue langsung kerasa gak berarti lagi' },
    // 88 - ambitious transition
    { judul: 'Supercut', penyanyi: 'Lorde', mood_tag: 'Cinematic Flashback', punchline: 'Nge-replay semua momen indah di kepala buat dijadiin amunisi melangkah ke depan' },
    // 89 - hedonistic
    { judul: 'Safe and Sound', penyanyi: 'Capital Cities', mood_tag: 'Buoyant Nostalgia', punchline: 'Selama kita masih satu frekuensi, chaos-nya dunia gak bakal bisa nyentuh kita' },

    // Row 9: impulsive, chaotic energy, seeking immediate dopamine
    // 90 - identity crisis
    { judul: 'Cincin', penyanyi: 'Hindia', mood_tag: 'Cyclical Chaos', punchline: 'Sadar hubungan ini penuh red flags tapi kita tetep gas karena telanjur nyaman' },
    // 91 - resilient through chaos
    { judul: 'Look What You Made Me Do', penyanyi: 'Taylor Swift', mood_tag: 'Calculated Revenge', punchline: 'Gue yang dulu terlalu naif udah mati, yang sekarang siap nge-burn semua jembatan' },
    // 92 - hopelessly romantic
    { judul: 'Bad Idea Right', penyanyi: 'Olivia Rodrigo', mood_tag: 'Reckless Impulsivity', punchline: 'Bodo amat dibilang blunder, malam ini logika gue kalah total sama rasa penasaran' },
    // 93 - self-sabotaging
    { judul: 'Jealousy Jealousy', penyanyi: 'Olivia Rodrigo', mood_tag: 'Comparative Anxiety', punchline: 'Otak kesiksa karena hobi bandingin hidup flat gue sama kesempurnaan palsu feeds orang' },
    // 94 - alienated
    { judul: 'Freaks', penyanyi: 'Surf Curse', mood_tag: 'Unfiltered Oddity', punchline: 'Gak butuh fit in sama standar normis, mending ngerayain keanehan ini bareng-bareng' },
    // 95 - monotonous
    { judul: 'Sofia', penyanyi: 'Clairo', mood_tag: 'Blissful Infatuation', punchline: 'Ngebayangin skenario kasmaran random demi ngebikin hari yang monoton jadi lebih hidup' },
    // 96 - overwhelmed by deadlines
    { judul: 'Kisinan 2', penyanyi: 'Masdddho', mood_tag: 'Farcical Exhaustion', punchline: 'Udah berkorban jor-joran tapi ujungnya cuma dijadiin badut penengah doang, miris' },
    // 97 - healing
    { judul: 'Good 4 U', penyanyi: 'Olivia Rodrigo', mood_tag: 'Spiteful Recovery', punchline: 'Bagus deh kalau lo udah bahagia, seenggaknya amarah ini bikin proses move on gue makin cepet' },
    // 98 - ambitious transition
    { judul: 'Brutal', penyanyi: 'Olivia Rodrigo', mood_tag: 'Angsty Rebellion', punchline: 'Udah muak sama romantisasi masa muda, emang aslinya se-messy dan se-frustasi itu' },
    // 99 - hedonistic
    { judul: 'Cikini Ke Gondangdia', penyanyi: 'Duo Anggrek', mood_tag: 'Pure Dopamine', punchline: 'Matiin dulu fungsi otak, malam ini waktunya nge-gas tanpa rem enjoy the night!' }
];

export function getFallbackSong(
    q1: string,
    q3: string,
    exclude: string[] = []
): FallbackSong {
    const q1Index = Q1_LABELS.indexOf(q1)
    const q3Index = Q3_LABELS.indexOf(q3)

    const safeQ1Index = q1Index >= 0 ? q1Index : 0
    const safeQ3Index = q3Index >= 0 ? q3Index : 0

    const targetIndex = (safeQ1Index * 10) + safeQ3Index

    const lowerExclude = exclude.map(e => e.toLowerCase().trim())

    // Muter dari targetIndex sampai ketemu lagu yang tidak di-exclude
    for (let i = 0; i < 100; i++) {
        const checkIndex = (targetIndex + i) % 100
        const song = FALLBACK_SONGS[checkIndex]
        const str1 = `${song.judul} - ${song.penyanyi}`.toLowerCase()
        const str2 = `${song.penyanyi} - ${song.judul}`.toLowerCase()
        if (!lowerExclude.includes(str1) && !lowerExclude.includes(str2)) {
            return song
        }
    }

    // Jika semua di-exclude, kembalikan lagu target asli
    return FALLBACK_SONGS[targetIndex]
}