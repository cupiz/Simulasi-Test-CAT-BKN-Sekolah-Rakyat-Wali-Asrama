import { NextResponse } from 'next/server';
import { exec, execFile } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { promisify } from 'util';

const execPromise = promisify(exec);
const execFilePromise = promisify(execFile);

export const maxDuration = 300;

export async function POST(request: Request) {
  let tempPath = '';
  try {
    const { draftQuestion, model } = await request.json();

    const optionCount = (draftQuestion.category === 'manajerial' || draftQuestion.category === 'wawancara') ? 4 : 5;
    const maxScore = (draftQuestion.category === 'manajerial' || draftQuestion.category === 'wawancara') ? 4 : 5;
    const optionsKeys = ['A', 'B', 'C', 'D', 'E'].slice(0, optionCount);

    const systemInstruction = `Anda adalah AI Master Question Designer untuk ujian CAT BKN (Computer Assisted Test Badan Kepegawaian Negara) khusus formasi PPPK Tenaga Kependidikan.

Tugas Anda adalah memodifikasi dan mengembangkan draf soal yang diberikan menjadi soal berkualitas tinggi yang sesuai dengan standar kategori dan format aslinya (SJT atau Konseptual/Wawancara), realistis, formal, mendalam, dilematis, serta memiliki bobot pilihan jawaban dan analisis teori yang komprehensif.

ATURAN GAYA BAHASA & KONTRAK KATEGORI SOAL (MANDATORI):

1. KOMPETENSI TEKNIS (Wali Asrama):
   - **Gaya Bahasa:** Formal, teoritis-prosedural, objektif, dan profesional (sama seperti format SoalTeknis.txt).
   - **Aturan Tokoh:** DILARANG KERAS menggunakan nama murid fiktif (seperti Tegar, Yusuf, Danis, Galih) atau detail informal/spesifik (seperti Kamar 105, Asrama Ahmad Dahlan). Gunakan kata ganti umum/formal seperti "seorang siswa", "beberapa siswa", "siswa senior", "asrama", "kamar asrama".
   - **Materi:** Fokus pada tindakan operasional asrama, perencanaan program pembinaan, keselamatan asrama, sanitasi, data inventaris, pelaporan kejadian, dan penanganan kedisiplinan asrama.
   - **Opsi Jawaban:** Opsi tindakan operasional/prosedural yang logis dan ringkas (5-15 kata).

2. KOMPETENSI MANAJERIL:
   - **Gaya Bahasa:** Profesional organisasi dan lingkungan kerja ASN.
   - **Konteks:** Situasi kerja kantoran/sekolah secara umum. Fokus pada hubungan kerja dengan rekan sejawat, atasan, bawahan, pimpinan, atau koordinasi tugas dinas. DILARANG membahas tentang kehidupan asrama siswa atau pembinaan murid.
   - **Fokus Pengujian:** Integritas kerja, kerjasama tim, komunikasi kedinasan, orientasi hasil, pelayanan publik, pengembangan diri, mengelola perubahan, pengambilan keputusan kerja.
   - **Opsi Jawaban:** Solusi manajerial, pendelegasian tugas, koordinasi profesional, atau tindakan kepemimpinan kerja tim (5-15 kata).

3. KOMPETENSI SOSIAL KULTURAL:
   - **Gaya Bahasa:** Inklusif, toleran, empati, dan berperan sebagai perekat bangsa.
   - **Konteks:** Interaksi sosial di tengah masyarakat majemuk (perbedaan suku, ras, agama, budaya, adat istiadat, atau latar belakang sosial ekonomi).
   - **Materi:** Cara menanggapi prasangka, memediasi perselisihan sosial, menghormati keyakinan orang lain, mengelola keberagaman di sekolah/lingkungan tugas. DILARANG melokalisir soal menjadi use case asrama siswa.
   - **Opsi Jawaban:** Tindakan mediasi netral, sikap menghormati perbedaan, tindakan inklusif untuk merawat kebersamaan (5-15 kata).

4. WAWANCARA (CBT):
   - **Gaya Bahasa:** Kalimat wawancara/tanya-jawab personal langsung (menguji integritas personal).
   - **Format Soal:** Gunakan format tanya-jawab langsung (contoh: "Bagaimana sikap Anda apabila...", "Apakah Anda bersedia...", "Apabila terpilih menjadi ASN, apa komitmen Anda terhadap...").
   - **Fokus Pengujian:** Integritas pribadi, kejujuran, loyalitas pengabdian, moralitas, kepatuhan hukum, dan motivasi kerja ASN.
   - **Opsi Jawaban:** Pernyataan komitmen pribadi atau prinsip hidup/kerja profesional (5-15 kata).

SOP EKSEKUSI TINDAKAN & STANDARD HOTS JAWABAN (MANDATORI):
- SEMUA PILIHAN JAWABAN HARUS BERNADA POSITIF, PROFESIONAL, DAN LAYAK (PLAUSIBLE). Tidak boleh ada pilihan jawaban yang bersifat menghukum secara fisik/sosial (seperti push-up berlebih, menjemur di terik matahari, mempermalukan di depan umum), bersikap pasrah/mengabaikan masalah (negligent), melanggar aturan hukum/SOP, atau melakukan penyuapan. Semua opsi harus berupa tindakan profesional Wali Asrama yang berniat baik.
- TINGKAT KESULITAN TINGGI (HOTS): Pilihan jawaban dipersulit dengan membuat semua opsi bernilai positif, namun memiliki derajat keefektifan, kolaborasi, dan kedalaman solusi yang berbeda-beda. Penentuan skor didasarkan pada hal ini:
  * Skor Tertinggi (5 untuk Teknis/Sosial, 4 untuk Manajerial/Wawancara): Tindakan restoratif mendalam, penyelesaian dua arah (dialog/coaching/peer-support), bersifat solutif-sistemik (mencegah terulang), dan memberdayakan ekosistem asrama.
  * Skor 4 (Teknis/Sosial) / 3 (Manajerial/Wawancara): Tindakan bimbingan personal atau prosedural standar yang profesional langsung, namun kurang melibatkan kolaborasi aktif dengan siswa lain atau belum menyentuh aspek pencegahan sistemik jangka panjang.
  * Skor 3 (Teknis/Sosial) / 2 (Manajerial/Wawancara): Tindakan formal/administratif (seperti rapat koordinasi umum, merujuk langsung ke BK/pihak lain, atau mengadakan kelas umum) yang baik dan profesional, namun kurang fokus pada penyelesaian personal/spesifik untuk individu yang bermasalah.
  * Skor 2 (Teknis/Sosial) / 1 (Manajerial/Wawancara): Tindakan penegakan aturan secara sepihak/kaku atau solusi jangka pendek (seperti memindahkan kamar, memodifikasi shift sepihak, memberikan dispensasi sepihak) yang secara prosedural aman tetapi tidak membangun karakter atau empati.
  * Skor 1 (Teknis/Sosial) - Khusus Teknis bernilai 0: Tindakan minimal/reaktif yang hanya meredakan masalah sesaat, atau langsung menyerahkan tanggung jawab sepenuhnya ke pimpinan/pihak luar tanpa upaya penanganan mandiri terlebih dahulu, yang meskipun tampak profesional tetapi menghindari peran in-loco-parentis Wali Asrama.
- PANJANG & GAYA BAHASA SEIMBANG: Seluruh opsi pilihan harus ditulis dengan panjang kata yang ringkas dan relatif seimbang (sekitar 5-15 kata per opsi) dan gaya bahasa profesional yang serupa, sehingga kunci jawaban terbaik tidak mudah ditebak hanya dari panjangnya teks.

ATURAN FORMULASI SOAL & PENILAIAN BERDASARKAN KATEGORI:
1. KATEGORI TEKNIS:
   - Wajib memiliki 5 pilihan jawaban (A, B, C, D, E).
   - Menggunakan skema biner: satu opsi terbaik bernilai 5. Empat opsi lainnya harus memiliki nilai 0 (BKN PPPK Teknis standard, namun distraktor berbobot 0 harus tetap ditulis sebagai tindakan profesional yang plausible/positif-sounding seperti definisi tier skor di atas).
2. KATEGORI MANAJERIAL:
   - Wajib memiliki 4 pilihan jawaban (A, B, C, D).
   - Menggunakan bobot skor bertingkat dari 1 s/d 4 (tidak boleh ada skor 0).
3. KATEGORI SOSIAL KULTURAL:
   - Wajib memiliki 5 pilihan jawaban (A, B, C, D, E).
   - Menggunakan bobot skor bertingkat dari 1 s/d 5 (tidak boleh ada skor 0).
4. KATEGORI WAWANCARA:
   - Wajib memiliki 4 pilihan jawaban (A, B, C, D).
   - Menggunakan bobot skor bertingkat dari 1 s/d 4 (tidak boleh ada skor 0).

Output harus berupa objek JSON valid tanpa penjelasan tambahan di luar JSON.

CRITICAL INSTRUCTION: You are running in a restricted API mode. You MUST NOT write any files to the filesystem, and you MUST NOT create or run any scripts (such as .ps1 or .js files) in the workspace. Simply generate the JSON object in memory and print it directly to standard output. Do not attempt to validate using external scripts.`;

    const prompt = `Buatlah soal ujian CAT BKN kategori "${draftQuestion.category}" bertema "${draftQuestion.topic}" nomor soal ${draftQuestion.number} yang unik dan orisinil.
    
    Berikut adalah Draf Acuan (HANYA sebagai inspirasi topik dan panduan struktur kompetensi, Anda TIDAK BOLEH meniru cerita/use case ini):
    Draf Cerita Acuan: "${draftQuestion.questionText}"
    Draf Opsi Acuan:
    ${draftQuestion.options.slice(0, optionCount).map((o: any) => `- [Skor ${o.score}]: ${o.text}`).join('\n')}
    
    ATURAN CRITICAL DIVERSIFIKASI (ANTI-REPETISI & FORMAT SEARAH):
    1. LAKUKAN ANALISIS TIPE SOAL: Identifikasi apakah draf acuan bertipe Situasional (SJT) atau Konseptual/Analitis. Soal baru yang Anda buat WAJIB mengikuti tipe format tersebut secara konsisten (jangan mengubah soal konseptual menjadi cerita fiksi, dan sebaliknya).
    2. Jika kategori soal adalah "teknis":
       - WAJIB menggunakan gaya formal dan objektif seperti draf acuan dan berkas SoalTeknis.txt.
       - DILARANG KERAS menggunakan nama murid fiktif (Tegar, Danis, dll.) atau nomor kamar spesifik. Gunakan istilah "seorang siswa", "beberapa siswa", dll.
       - Jika SJT teknis: buat cerita/kasus asrama formal (40-70 kata). Jika konseptual: buat pertanyaan manajemen asrama langsung tanpa cerita fiksi.
    3. Jika kategori soal adalah "manajerial":
       - Fokus pada lingkungan kerja umum ASN/kantor sekolah (misal: kerjasama tim, membagi tugas, menghadapi deadline, melayani keluhan wali murid).
       - DILARANG menggunakan use case asrama murid atau nama murid.
    4. Jika kategori soal adalah "sosial":
       - Fokus pada masyarakat majemuk, kebhinekaan, toleransi beragama/berbudaya, penanganan konflik warga/siswa dari berbagai suku.
       - DILARANG melokalisir soal menjadi use case asrama murid atau nama murid.
    5. Jika kategori soal adalah "wawancara":
       - Gunakan format wawancara langsung/tanya-jawab personal mengenai integritas dan moralitas (misal: "Jika Anda dihadapkan pada...", "Apakah Anda bersedia...").
    6. Seluruh pilihan jawaban wajib memiliki panjang kalimat yang setara dan seimbang (kisaran 5-15 kata per opsi).
    7. Tentukan bobot skor opsi jawaban sesuai aturan kategori:
       - Kategori ${draftQuestion.category}: ${draftQuestion.category === 'teknis' ? 'Hanya satu opsi terbaik bernilai 5, opsi lainnya bernilai 0 (namun opsi bernilai 0 harus tetap ditulis sebagai tindakan profesional yang plausible/layak).' : `Gunakan skor bertingkat dari 1 s/d ${maxScore}.`}
    8. Tulis pembahasan (explanation) ringkas (sekitar 20-40 kata) yang membedah keunggulan opsi terbaik dibanding opsi lainnya.
    9. Lengkapi field competency, berakhlak, psychologyBasis (harus landasan teori psikologi/manajemen yang konkret dan diakui secara akademis, misal: Servant Leadership, Kohlberg's Moral Development, dll.), dan catTips (satu baris tips taktis).
 
Format JSON output harus persis seperti struktur berikut:
{
  "dateStr": "${draftQuestion.dateStr}",
  "number": ${draftQuestion.number},
  "category": "${draftQuestion.category}",
  "topic": "${draftQuestion.topic}",
  "questionText": "(Tulis soal hasil pengembangan Anda di sini. Gunakan format sesuai aturan kategori: formal tanpa nama murid untuk Teknis, situasi kerja umum untuk Manajerial, keberagaman untuk Sosial, format wawancara langsung untuk Wawancara)",
  "options": [
    ${optionsKeys.map(key => `{ "key": "${key}", "text": "(Tulis pilihan jawaban ${key} hasil pengembangan Anda, buat panjangnya seimbang 5-15 kata)", "score": (skor) }`).join(',\n    ')}
  ],
  "correctAnswer": "(Key yang memiliki skor ${maxScore})",
  "explanation": "(Tulis pembahasan hasil analisis Anda, sekitar 20-40 kata)",
  "competency": "${draftQuestion.competency || 'Kompetensi Wali Asrama'}",
  "berakhlak": "${draftQuestion.berakhlak || 'Harmonis'}",
  "psychologyBasis": "${draftQuestion.psychologyBasis || 'General Psychology'}",
  "catTips": "${draftQuestion.catTips || 'Pilih opsi yang paling profesional.'}"
}`;

    let currentModel = model || null;
    let attempt = 0;
    const maxRetries = 4;
    let lastError: any = null;
    let questionObj: any = null;
    let selectedCli = 'agy';

    while (attempt < maxRetries) {
      try {
        const fullPrompt = `${systemInstruction}\n\n${prompt}`;
        const promptLength = fullPrompt.length;
        console.log(`🤖 [API Generate Soal #${draftQuestion.number}] Mengirim prompt (${promptLength} karakter) via CLI: ${selectedCli}${currentModel ? ` (${currentModel})` : ''} (Attempt ${attempt + 1}/${maxRetries})...`);

        let stdout = '';
        if (selectedCli === 'agy') {
          const agyArgs = ['--dangerously-skip-permissions'];
          if (currentModel) {
            agyArgs.push('--model', currentModel);
          }
          agyArgs.push('--print', fullPrompt);

          const res = await execFilePromise('agy', agyArgs, {
            maxBuffer: 15 * 1024 * 1024,
            timeout: 45000 // 45 seconds for agy
          });
          stdout = res.stdout;
        } else {
          tempPath = path.join(os.tmpdir(), `temp_prompt_api_${draftQuestion.number}.txt`);
          fs.writeFileSync(tempPath, fullPrompt, 'utf8');
          const cmd = `opencode run --auto "Process the following input file and generate the requested JSON question:" -f "${tempPath}"`;
          const res = await execPromise(cmd, { 
            maxBuffer: 15 * 1024 * 1024,
            shell: 'cmd.exe',
            timeout: 90000 // 90 seconds for opencode
          });
          stdout = res.stdout;
        }

        // Clean JSON response
        let cleaned = stdout.trim();
        const jsonStart = cleaned.indexOf('```json');
        if (jsonStart !== -1) {
          const start = jsonStart + 7;
          const end = cleaned.lastIndexOf('```');
          cleaned = cleaned.substring(start, end);
        } else {
          const codeStart = cleaned.indexOf('```');
          if (codeStart !== -1) {
            const start = codeStart + 3;
            const end = cleaned.lastIndexOf('```');
            cleaned = cleaned.substring(start, end);
          }
        }

        const cleanedTrimmed = cleaned.trim();
        // Check if output indicates a quota limit error disguised as plain text
        if (cleanedTrimmed.toLowerCase().includes('quota') || cleanedTrimmed.toLowerCase().includes('subscription')) {
          throw new Error(`Individual quota reached: ${cleanedTrimmed}`);
        }

        questionObj = JSON.parse(cleanedTrimmed);
        break; // Success
      } catch (err: any) {
        const errMsg = ((err.message || '') + ' ' + (err.stderr || '')).toLowerCase();
        const isQuotaLimit = errMsg.includes('quota reached') || errMsg.includes('quota limit exceeded') || errMsg.includes('quota exceeded');

        // If we were using agy and it failed with a quota error, switch to Claude Sonnet fallback
        if (selectedCli === 'agy') {
          if (isQuotaLimit && currentModel !== 'Claude Sonnet 4.6 (Thinking)') {
            console.warn(`⚠️ [API Generate] Terdeteksi kuota model habis. Beralih ke model fallback Claude Sonnet 4.6 (Thinking)...`);
            currentModel = 'Claude Sonnet 4.6 (Thinking)';
            continue;
          } else {
            console.warn(`[API Generate] agy CLI failed on question #${draftQuestion.number}, trying opencode fallback...`);
            selectedCli = 'opencode';
            continue;
          }
        }

        attempt++;
        lastError = err;

        const isRateLimit = errMsg.includes('429') || 
                            errMsg.includes('rate limit') || 
                            errMsg.includes('resourceexhausted') || 
                            errMsg.includes('resource has been exhausted') ||
                            errMsg.includes('queries per minute') ||
                            isQuotaLimit;

        // Detect permanent errors to fail-fast (billing, invalid api key, etc.)
        const isPermanent = errMsg.includes('billing disabled') || 
                            errMsg.includes('invalid api key') || 
                            errMsg.includes('key is invalid') ||
                            errMsg.includes('subscription ended');
        if (isPermanent) {
          attempt = maxRetries; // Skip remaining retries
        }

        if (attempt < maxRetries) {
          if (isRateLimit) {
            console.warn(`⚠️ [API] Terdeteksi rate limit atau kuota habis. Menunggu 15 detik sebelum mencoba kembali...`);
            await new Promise(resolve => setTimeout(resolve, 15000));
          } else {
            const delay = attempt * 3000 + Math.random() * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      } finally {
        try {
          if (tempPath && fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
          }
        } catch (e) {}
      }
    }

    if (!questionObj) {
      throw lastError || new Error("Failed to generate question with AI after multiple attempts.");
    }

    // Post-processing to enforce CAT BKN rules strictly
    if (draftQuestion.category === 'teknis') {
      questionObj.options = questionObj.options.map((o: any) => ({
        ...o,
        score: o.score === 5 ? 5 : 0
      }));
      const hasFive = questionObj.options.some((o: any) => o.score === 5);
      if (!hasFive) {
        const correctKey = questionObj.correctAnswer || 'A';
        questionObj.options = questionObj.options.map((o: any) => ({
          ...o,
          score: o.key === correctKey ? 5 : 0
        }));
      }
    } else {
      // Ensure graded scores are valid
      questionObj.options = questionObj.options.map((o: any) => ({
        ...o,
        score: Math.max(1, Math.min(maxScore, o.score))
      }));
    }

    return NextResponse.json({ 
      success: true, 
      question: questionObj,
      cliUsed: selectedCli,
      attempts: attempt + 1
    });
  } catch (err: any) {
    // Attempt clean up of temp file
    try {
      if (tempPath && fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    } catch (e) {}

    console.error('[API Generate Single] Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
