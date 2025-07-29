'use server';

/**
 * @fileOverview AI agent for generating a full thesis draft (Chapters 1-5).
 *
 * - generateDraft - A function that handles the draft generation process.
 * - DraftGeneratorInput - The input type for the generateDraft function.
 * - DraftGeneratorOutput - The return type for the generateDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DraftGeneratorInputSchema = z.object({
  topic: z.string().describe('The main topic or title of the thesis.'),
});
export type DraftGeneratorInput = z.infer<typeof DraftGeneratorInputSchema>;

const ChapterSchema = z.object({
  chapterTitle: z.string().describe("The title of the chapter (e.g., 'BAB I: PENDAHULUAN')."),
  content: z.string().describe('The full generated content for the chapter, formatted with subheadings.'),
});

const DraftGeneratorOutputSchema = z.object({
  draft: z
    .array(ChapterSchema)
    .describe('A list of chapters forming the thesis draft, including Chapters 1, 2, 3, 4, and 5, plus a bibliography.'),
});
export type DraftGeneratorOutput = z.infer<typeof DraftGeneratorOutputSchema>;

export async function generateDraft(input: DraftGeneratorInput): Promise<DraftGeneratorOutput> {
  return draftGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'draftGeneratorPrompt',
  input: {schema: DraftGeneratorInputSchema},
  output: {schema: DraftGeneratorOutputSchema},
  prompt: `Anda adalah seorang konsultan akademik AI yang sangat jenius dan handal, mampu menyusun draf penelitian skripsi atau tesis secara instan untuk semua jurusan.
Berdasarkan topik yang diberikan, buatlah draf penelitian komprehensif yang mencakup Bab 1 hingga Bab 5, serta Daftar Pustaka.

Topik Penelitian: {{{topic}}}

Susunlah draf dengan struktur dan konten berikut. Pastikan setiap paragraf diperkaya dengan sitasi numerik hipotetis (contoh: [1], [2]) untuk menunjukkan di mana referensi seharusnya ditempatkan.

**BAB I: PENDAHULUAN**
- **1.1 Latar Belakang Masalah:** Uraikan konteks masalah secara mendalam. Jelaskan fenomena yang terjadi, data pendukung, dan urgensi mengapa topik ini penting untuk diteliti. Identifikasi kesenjangan (research gap) yang ada [1].
- **1.2 Rumusan Masalah:** Berdasarkan latar belakang, buat 2-3 pertanyaan penelitian yang spesifik, jelas, dan fokus.
- **1.3 Tujuan Penelitian:** Sejajar dengan rumusan masalah, jelaskan tujuan yang ingin dicapai melalui penelitian ini.
- **1.4 Manfaat Penelitian:** Uraikan manfaat teoretis dan praktis dari penelitian ini.

**BAB II: TINJAUAN PUSTAKA**
- **2.1 Landasan Teori:** Identifikasi dan jelaskan 2-3 teori utama yang paling relevan dengan topik. Uraikan konsep-konsep kunci dari setiap teori dan bagaimana teori tersebut digunakan dalam penelitian sejenis [2].
- **2.2 Penelitian Terdahulu:** Rangkum 3-5 penelitian sebelumnya yang relevan. Jelaskan temuan utama, metode yang digunakan, dan posisi penelitian ini terhadap penelitian-penelitian tersebut [3].
- **2.3 Kerangka Pemikiran:** Sintesiskan landasan teori dan penelitian terdahulu untuk membangun alur pikir yang logis yang mengarah pada hipotesis atau proposisi penelitian.

**BAB III: METODE PENELITIAN**
- **3.1 Pendekatan Penelitian:** Tentukan apakah penelitian ini lebih cocok menggunakan pendekatan kuantitatif, kualitatif, atau campuran (mixed-methods). Berikan alasan yang kuat berdasarkan tujuan penelitian [4].
- **3.2 Subjek/Objek Penelitian:** Jelaskan populasi dan sampel (kuantitatif) atau partisipan/informan (kualitatif) serta teknik sampling yang digunakan.
- **3.3 Teknik Pengumpulan Data:** Sarankan teknik yang paling sesuai (misalnya, kuesioner, wawancara mendalam, observasi, studi dokumentasi) dan jelaskan instrumen penelitiannya.
- **3.4 Teknik Analisis Data:** Jelaskan langkah-langkah analisis data yang akan dilakukan (misalnya, analisis regresi, analisis tematik, dll.) [5].

**BAB IV: HASIL DAN PEMBAHASAN**
- **4.1 Gambaran Umum Objek Penelitian:** Berikan deskripsi singkat tentang lokasi, subjek, atau konteks di mana data dikumpulkan.
- **4.2 Deskripsi Hasil Penelitian:** Sajikan data mentah atau temuan utama secara terstruktur (misalnya, melalui tabel atau narasi deskriptif).
- **4.3 Pembahasan (Analisis):** Ini adalah bagian terpenting. Interpretasikan hasil yang disajikan. Hubungkan temuan dengan teori di Bab 2. Bandingkan hasil Anda dengan penelitian terdahulu. Jelaskan mengapa hasilnya seperti itu dan apa maknanya [1][3].

**BAB V: PENUTUP**
- **5.1 Kesimpulan:** Jawab rumusan masalah secara ringkas dan padat berdasarkan hasil pembahasan. Hindari menambahkan informasi baru.
- **5.2 Keterbatasan Penelitian:** Secara jujur, sebutkan batasan-batasan yang ada dalam penelitian Anda.
- **5.3 Saran:** Berikan saran praktis (untuk objek penelitian) dan saran akademis (untuk penelitian selanjutnya) berdasarkan temuan dan keterbatasan.

**DAFTAR PUSTAKA**
- Buat daftar pustaka hipotetis yang sesuai dengan sitasi numerik di atas. Gunakan format kutipan yang umum (misalnya, APA atau MLA). Daftar ini harus berisi 5 sumber fiktif namun relevan dengan topik.
`,
});

const draftGeneratorFlow = ai.defineFlow(
  {
    name: 'draftGeneratorFlow',
    inputSchema: DraftGeneratorInputSchema,
    outputSchema: DraftGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
