import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_BOOKS } from '@/data/books';
import { Book } from '@/types';

// Valid consultation key patterns and official library demo keys
const OFFICIAL_DEMO_KEYS = [
  'PERPUSKITA-KONSUL-2024',
  'KONSUL-LITERASI-2024',
  'KONSUL-VIP-2024',
  'PERPUSKITA-AI-DEMO',
  'LIB-2024-KONSUL'
];

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequestBody {
  message: string;
  history?: ChatMessage[];
  consultationKey?: string;
}

// Helper to determine if a key is valid
function validateConsultationKey(key?: string): { isValid: boolean; keyType: 'demo' | 'gemini' | 'member' | 'custom' | 'invalid' } {
  if (!key || typeof key !== 'string') {
    return { isValid: false, keyType: 'invalid' };
  }

  const cleanKey = key.trim().toUpperCase();

  // 1. Official library demo keys
  if (OFFICIAL_DEMO_KEYS.includes(cleanKey)) {
    return { isValid: true, keyType: 'demo' };
  }

  // 2. Google Gemini API Key (starts with AIzaSy)
  if (key.trim().startsWith('AIzaSy') && key.trim().length >= 35) {
    return { isValid: true, keyType: 'gemini' };
  }

  // 3. Member ID consultation format (e.g., LIB-2024-001, SISWA-1234)
  if (/^(LIB|SISWA|GURU|MEMBER|KONSUL)-[A-Z0-9_-]{3,20}$/i.test(key.trim())) {
    return { isValid: true, keyType: 'member' };
  }

  // 4. Custom developer or test key (at least 8 alphanumeric/hyphen chars)
  if (/^[A-Za-z0-9_-]{8,64}$/.test(key.trim()) && key.trim().length >= 8) {
    return { isValid: true, keyType: 'custom' };
  }

  return { isValid: false, keyType: 'invalid' };
}

// Query Google Gemini API if a Gemini key is provided
async function callGeminiApi(apiKey: string, prompt: string, history: ChatMessage[] = []): Promise<string | null> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    // Prepare library catalog context
    const catalogBrief = INITIAL_BOOKS.map(b => 
      `- "${b.title}" oleh ${b.author} (Kategori: ${b.category}, Lokasi: ${b.shelfLocation}, Status: ${b.status}, Rating: ${b.rating})`
    ).join('\n');

    const systemInstruction = `Kamu adalah "Pustakawan AI PerpusKita" (KonsulBot Literasi), asisten pustakawan editorial modern yang ramah, berwawasan luas, dan ahli dalam literatur, referensi ilmiah, serta pengelolaan perpustakaan.
Koleksi buku PerpusKita yang sedang tersedia:
${catalogBrief}

Ketentuan layanan PerpusKita:
- Maksimal pinjam 3 buku sekaligus untuk anggota siswa, durasi pinjam 14 hari.
- Denda keterlambatan: Rp 1.000 / hari per buku.
- Perpanjangan peminjaman dapat dilakukan maksimal 2 kali sebelum jatuh tempo.
- Jam operasional: Senin - Jumat 08:00 - 17:00, Sabtu 09:00 - 15:00 WIB.
- Fitur E-Book Reader Digital dan Barcode Scanner tersedia di platform.

Gunakan bahasa Indonesia yang santun, apresiatif, cerdas, dan editorial. Format teks dengan rapi menggunakan markdown (tebal, daftar poin, dan kutipan jika relevan).`;

    const contents = [
      ...history.slice(-6).map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      })),
      {
        role: 'user',
        parts: [{ text: `${systemInstruction}\n\nPertanyaan Pengguna: ${prompt}` }]
      }
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API call failed with status:', response.status);
      return null;
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText || null;
  } catch (error) {
    console.warn('Error connecting to Gemini API, falling back to local engine:', error);
    return null;
  }
}

// Built-in intelligent library knowledge engine
function generateLocalLibraryResponse(
  message: string, 
  isConsultationActive: boolean,
  consultationKey?: string
): { reply: string; matchedBooks: Book[]; intent: string } {
  const query = message.toLowerCase().trim();
  const matchedBooks: Book[] = [];

  // Intent 1: "konsul" or consultation trigger
  const isKonsulCommand = /^(konsul|konsultasi|\/konsul|kunci|key|\/key)\b/i.test(query) || query === 'konsul' || query.includes('kunci konsul') || query.includes('key konsul');

  if (isKonsulCommand) {
    if (isConsultationActive) {
      return {
        reply: `🔑 **Sesi Konsultasi AI Sedang Aktif!**\n\nKunci akses Anda (**\`${consultationKey}\`**) telah terverifikasi dengan status **Aktif**. Anda berada di dalam *Mode Konsultasi Sastra & Riset Akademik*.\n\nBeberapa topik konsultasi yang dapat saya bantu secara mendalam:\n- 📖 **Analisis & Bedah Novel/Karya Sastra** (contoh: makna simbolik *Laut Bercerita* atau *Bumi Manusia*)\n- 🎓 **Rekomendasi Referensi Karya Ilmiah & Skripsi**\n- 🎯 **Penyusunan Kurikulum Membaca Personal** (habit formation dengan *Atomic Habits*)\n- 📍 **Pengecekan Ketersediaan & Lokasi Rak Buku**\n\nSilakan ajukan pertanyaan atau sebutkan topik literatur yang ingin Anda diskusikan!`,
        matchedBooks: INITIAL_BOOKS.filter(b => b.isEditorChoice).slice(0, 3),
        intent: 'konsul_active'
      };
    } else {
      return {
        reply: `🔒 **Akses Konsultasi Memerlukan Kunci (Key)!**\n\nUntuk memulai sesi konsultasi khusus bersama **Pustakawan AI**, Anda perlu memasukkan **Kunci Konsultasi (Consultation Key)**.\n\n✨ **Ingin mencoba langsung?**\nAnda dapat menggunakan Kunci Demo resmi perpustakaan:\n\`PERPUSKITA-KONSUL-2024\`\n\nAtau gunakan kunci anggota Anda / Google Gemini API Key jika memilikinya. Silakan klik tombol **🔑 Masukkan Kunci** di sudut atas obrolan atau ketik kuncinya sekarang!`,
        matchedBooks: [],
        intent: 'konsul_locked'
      };
    }
  }

  // Check if message itself is providing a key
  const potentialKeyMatch = message.trim();
  const keyValidation = validateConsultationKey(potentialKeyMatch);
  if (keyValidation.isValid) {
    return {
      reply: `🎉 **Kunci Konsultasi Berhasil Terverifikasi!**\n\nKunci \`${potentialKeyMatch}\` telah diaktifkan untuk sesi Anda (${keyValidation.keyType.toUpperCase()} mode).\n\nSekarang Anda memiliki akses penuh ke fitur konsultasi pustakawan, rekomendasi personal, dan analisis literatur lanjutan. Apa yang ingin Anda teliti atau baca hari ini?`,
      matchedBooks: INITIAL_BOOKS.slice(0, 3),
      intent: 'key_activated'
    };
  }

  // Intent 2: Shelf location query ("di mana rak", "lokasi buku", "rak berapa", "cari rak")
  if (query.includes('rak') || query.includes('lokasi') || query.includes('di mana') || query.includes('dimana')) {
    const found = INITIAL_BOOKS.filter(b => 
      query.includes(b.title.toLowerCase()) || 
      query.includes(b.author.toLowerCase()) ||
      b.title.toLowerCase().split(' ').some(w => w.length > 3 && query.includes(w))
    );

    if (found.length > 0) {
      const book = found[0];
      matchedBooks.push(book);
      return {
        reply: `📍 **Lokasi Rak untuk "${book.title}":**\n\nBuku karya **${book.author}** ini berada di:\n🏛️ **${book.shelfLocation}**\n\n- **Status:** ${book.status === 'Tersedia' ? '🟢 Tersedia untuk dipinjam' : '🟡 Sedang dipinjam (bisa direservasi)'}\n- **Kode ISBN:** \`${book.isbn}\`\n- **Kategori:** ${book.category}\n\n*Tips Pustakawan:* Anda dapat menunjukkan kode rak ini ke petugas lantai perpustakaan atau meminjamnya langsung melalui tombol di bawah!`,
        matchedBooks,
        intent: 'shelf_location'
      };
    }
  }

  // Intent 3: Search or recommendations by title, author, or category
  const foundBooks = INITIAL_BOOKS.filter(b => {
    const titleMatch = b.title.toLowerCase().includes(query) || query.includes(b.title.toLowerCase());
    const authorMatch = b.author.toLowerCase().includes(query) || query.includes(b.author.toLowerCase());
    const catMatch = b.category.toLowerCase().includes(query) || query.includes(b.category.toLowerCase());
    const descMatch = b.description.toLowerCase().includes(query);
    return titleMatch || authorMatch || catMatch || descMatch;
  });

  if (foundBooks.length > 0) {
    matchedBooks.push(...foundBooks.slice(0, 4));
    const titlesList = matchedBooks.map(b => `- **${b.title}** oleh ${b.author} — *${b.category}* (📍 ${b.shelfLocation})`).join('\n');
    
    return {
      reply: `📚 **Pustakawan AI menemukan ${foundBooks.length} buku terkait pencarian Anda:**\n\n${titlesList}\n\n${
        isConsultationActive 
          ? `💡 *Analisis Pustakawan:* Koleksi di atas memiliki rating rata-rata ${ (matchedBooks.reduce((acc, c) => acc + c.rating, 0) / matchedBooks.length).toFixed(1) }/5.0 dan menjadi rujukan literasi terfavorit anggota PerpusKita.` 
          : `Ingin ulasan mendalam atau rekomendasi turunan? Ketik **'konsul'** untuk mengaktifkan sesi konsultasi!`
      }`,
      matchedBooks,
      intent: 'book_search'
    };
  }

  // Intent 4: Popular / Editor's Choice recommendation
  if (query.includes('rekomendasi') || query.includes('populer') || query.includes('terbaik') || query.includes('favorit') || query.includes('baca apa')) {
    const recs = INITIAL_BOOKS.filter(b => b.isEditorChoice || b.isPopular).slice(0, 3);
    matchedBooks.push(...recs);
    return {
      reply: `✨ **Rekomendasi Pilihan Editor PerpusKita:**\n\n1. **Atomic Habits** — James Clear\n   *Fokus: Pembentukan kebiasaan kecil berkesinambungan (Self-Improvement). Sangat cocok untuk memulai tahun produktif.*\n\n2. **Laut Bercerita** — Leila S. Chudori\n   *Fokus: Fiksi sejarah pergerakan mahasiswa 1998 yang mengharukan dan kaya refleksi sosial.*\n\n3. **Filosofi Teras** — Henry Manampiring\n   *Fokus: Penerapan stoisisme praktis untuk mengatasi kecemasan dan overthinking harian.*\n\nApakah Anda ingin mengetahui lokasi rak atau meminjam salah satu dari buku di atas?`,
      matchedBooks,
      intent: 'recommendations'
    };
  }

  // Intent 5: Library rules & borrowing guide
  if (query.includes('pinjam') || query.includes('aturan') || query.includes('denda') || query.includes('syarat') || query.includes('kembali') || query.includes('berapa hari')) {
    return {
      reply: `📋 **Panduan Peminjaman PerpusKita:**\n\n1. **Batas Peminjaman:** Maksimal **3 buku** sekaligus untuk setiap anggota aktif.\n2. **Durasi Pinjam:** **14 hari kalender** per transaksi.\n3. **Perpanjangan:** Dapat diperpanjang hingga **2 kali**, selama buku belum dipesan (reservasi) oleh anggota lain.\n4. **Denda Keterlambatan:** **Rp 1.000 / hari** per buku terlambat.\n5. **Reservasi & E-Book:** Anda dapat mereservasi buku yang sedang dipinjam atau membaca pratinjau digital langsung dari aplikasi web ini.\n\nAda buku tertentu yang ingin Anda periksa ketersediaannya saat ini?`,
      matchedBooks: [],
      intent: 'library_rules'
    };
  }

  // Intent 6: Operating hours and contact
  if (query.includes('jam buka') || query.includes('operasional') || query.includes('kontak') || query.includes('alamat') || query.includes('lokasi perpus')) {
    return {
      reply: `🏛️ **Jam Operasional & Layanan PerpusKita:**\n\n- **Senin – Jumat:** 08:00 – 17:00 WIB\n- **Sabtu:** 09:00 – 15:00 WIB\n- **Minggu & Hari Libur Nasional:** Tutup (Layanan Digital E-Book tetap buka 24 jam)\n\n📍 **Alamat Fisik:** Gedung Literasi Pusat, Lantai 1-3, Jl. Pendidikan No. 45\n📞 **Kontak Pustakawan:** (021) 7890-1234 | pustaka@perpuskita.id`,
      matchedBooks: [],
      intent: 'operating_hours'
    };
  }

  // Intent 7: Default greeting & guidance
  return {
    reply: `Halo! Saya **Pustakawan AI PerpusKita**. 👋\n\nSaya siap membantu Anda menjelajahi ribuan koleksi buku, mencari letak rak, memberi rekomendasi bacaan, hingga membantu riset literatur.\n\n✨ **Fitur Spesial Kunci Konsultasi:**\nKetik **\`konsul\`** untuk mengaktifkan sesi konsultasi sastra dan riset akademis dengan Kunci Konsultasi (**Consultation Key**).\n\nAnda juga dapat bertanya langsung misalnya:\n- *"Di mana letak rak buku Atomic Habits?"*\n- *"Rekomendasi novel fiksi terbaik"* \n- *"Bagaimana aturan peminjaman dan denda?"*`,
    matchedBooks: INITIAL_BOOKS.slice(0, 2),
    intent: 'general_greeting'
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const { message, history = [], consultationKey } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Pesan obrolan tidak boleh kosong.' },
        { status: 400 }
      );
    }

    // Check consultation key status
    const keyValidation = validateConsultationKey(consultationKey);
    const isConsultationActive = keyValidation.isValid;

    // Check if the user is using Google Gemini API key directly
    let geminiReply: string | null = null;
    if (keyValidation.keyType === 'gemini' && consultationKey) {
      geminiReply = await callGeminiApi(consultationKey, message, history);
    } else if (process.env.GEMINI_API_KEY && isConsultationActive) {
      // Optional fallback to server env if configured
      geminiReply = await callGeminiApi(process.env.GEMINI_API_KEY, message, history);
    }

    // If Gemini provided a reply, find any matching books mentioned in the reply to return rich cards
    if (geminiReply) {
      const lowerReply = geminiReply.toLowerCase();
      const matchedBooks = INITIAL_BOOKS.filter(b => 
        lowerReply.includes(b.title.toLowerCase()) || 
        message.toLowerCase().includes(b.title.toLowerCase())
      ).slice(0, 3);

      return NextResponse.json({
        success: true,
        reply: geminiReply,
        matchedBooks,
        isConsultationActive: true,
        keyType: keyValidation.keyType,
        source: 'gemini'
      });
    }

    // Built-in intelligent library knowledge response
    const localResult = generateLocalLibraryResponse(message, isConsultationActive, consultationKey);

    return NextResponse.json({
      success: true,
      reply: localResult.reply,
      matchedBooks: localResult.matchedBooks,
      isConsultationActive,
      keyType: keyValidation.keyType,
      intent: localResult.intent,
      source: 'local_engine'
    });
  } catch (error: any) {
    console.error('Error handling chat API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Terjadi kesalahan internal pada server chatbot.',
        details: error?.message || String(error)
      },
      { status: 500 }
    );
  }
}
