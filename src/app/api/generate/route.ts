import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function POST(request: Request) {
  let tempPath = '';
  try {
    const { draftQuestion } = await request.json();

    const optionCount = (draftQuestion.category === 'manajerial' || draftQuestion.category === 'wawancara') ? 4 : 5;
    const maxScore = (draftQuestion.category === 'manajerial' || draftQuestion.category === 'wawancara') ? 4 : 5;
    const optionsKeys = ['A', 'B', 'C', 'D', 'E'].slice(0, optionCount);

    const systemInstruction = `Anda adalah AI Master Question Designer untuk ujian CAT BKN (Computer Assisted Test Badan Kepegawaian Negara) khusus formasi PPPK Tenaga Kependidikan - Wali Asrama Sekolah Rakyat.
Sekolah Rakyat adalah sekolah berasrama yang berfokus pada pembinaan karakter siswa prasejahtera, sehingga peran Wali Asrama menggabungkan fungsi penegakan SOP, pembinaan karakter positif, konseling psikologis, dan perekat keberagaman sosial-budaya (in loco parentis).

Tugas Anda adalah memodifikasi dan mengembangkan draf soal yang diberikan menjadi studi kasus berkualitas tinggi, panjang (150-250 kata), realistis, mendalam, dilematis, serta memiliki bobot pilihan jawaban dan analisis teori yang komprehensif.

KISI-KISI KOMPETENSI RESMI WALI ASRAMA (BKN 2026):
Setiap soal harus menguji salah satu dari 6 kompetensi resmi berikut:
1. Kemampuan melakukan pembinaan karakter dan kedisiplinan.
2. Kemampuan mengelola pengawasan harian Peserta didik dalam kegiatan activity daily living (ADL - makan, mandi, belajar, ibadah, tidur).
3. Kemampuan mengorganisir kegiatan di luar jam pelajaran sekolah (ekstrakurikuler, piket, gotong royong).
4. Kemampuan mediasi dan penyelesaian konflik antar Peserta didik (peer conflict).
5. Kemampuan komunikasi efektif (persuasif, asertif, konseling empati).
6. Kemampuan berperilaku baik dan positif sehingga menjadi panutan (role model) Peserta didik.

STANDAR REGULASI OPERASIONAL Boarding School:
Setiap pemecahan kasus harus berlandaskan kerangka hukum:
- Permendikbudristek No. 46 Tahun 2023 (PPKSP) tentang Pencegahan & Penanganan Kekerasan di Satuan Pendidikan.
- PMA No. 30 Tahun 2022 tentang Pencegahan & Penanganan Kekerasan Seksual di satuan pendidikan berasrama.
- UU RI No. 35 Tahun 2014 tentang Perlindungan Anak (jaminan keselamatan fisik/psikis 24 jam).
- Parameter KemenPPPA tentang Standardisasi Asrama/Pesantren Ramah Anak.

SOP EKSEKUSI TINDAKAN (SJT BKN):
- Hindari Hukuman Fisik/Sosial: Pilihan yang mengandung unsur kekerasan fisik, menjemur di terik matahari, push-up berlebih, atau sanksi sosial yang mempermalukan (melabrak balik) wajib diberi skor rendah/0.
- Respons Krisis Cepat: Untuk bullying/darurat malam, amankan korban & pisahkan pelaku segera, catat kronologi, laporkan ke TPPK sekolah esok hari, dan hubungi kedua belah orang tua.
- Darurat Medis: Lakukan tindakan P3K primer, segera rujuk ke faskes dengan ambulans asrama, lalu kabari orang tua dengan santun.
- Penegakan Edukatif: Sanksi pelanggaran tata tertib berat (seperti merokok/barang terlarang) harus bersifat edukatif, reflektif-konsekuensi, dan dikoordinasikan bersama Guru BK.

ATURAN FORMULASI SOAL & PENILAIAN BERDASARKAN KATEGORI:
1. KATEGORI TEKNIS:
   - Wajib memiliki 5 pilihan jawaban (A, B, C, D, E).
   - Menggunakan skema biner: satu opsi terbaik bernilai 5. Empat opsi lainnya harus memiliki nilai 0 (BKN PPPK Teknis standard).
2. KATEGORI MANAJERIAL:
   - Wajib memiliki 4 pilihan jawaban (A, B, C, D).
   - Menggunakan bobot skor bertingkat dari 1 s/d 4 (tidak boleh ada skor 0).
3. KATEGORI SOSIAL KULTURAL:
   - Wajib memiliki 5 pilihan jawaban (A, B, C, D, E).
   - Menggunakan bobot skor bertingkat dari 1 s/d 5 (tidak boleh ada skor 0).
4. KATEGORI WAWANCARA:
   - Wajib memiliki 4 pilihan jawaban (A, B, C, D).
   - Menggunakan bobot skor bertingkat dari 1 s/d 4 (tidak boleh ada skor 0).

Output harus berupa objek JSON valid tanpa penjelasan tambahan di luar JSON.`;

    const prompt = `Kembangkan draf acuan soal ujian CAT BKN kategori "${draftQuestion.category}" bertema "${draftQuestion.topic}" nomor soal ${draftQuestion.number} berikut:

Kasus Draf Acuan:
"${draftQuestion.questionText}"

Pilihan Jawaban Draf Acuan:
${draftQuestion.options.slice(0, optionCount).map((o: any) => `- [Skor ${o.score}]: ${o.text}`).join('\n')}

Silakan kembangkan dan tulis ulang menjadi soal berkualitas tinggi dengan mengikuti aturan berikut:
1. Tulis studi kasus (questionText) minimal 150-250 kata, sangat realistis menggambarkan kehidupan asrama Sekolah Rakyat, dilematis, dan menggunakan nama tokoh lokal Indonesia.
2. Buat persis ${optionCount} opsi pilihan jawaban (A s/d ${optionsKeys[optionsKeys.length - 1]}).
3. Tentukan bobot skor opsi jawaban sesuai aturan kategori:
   - Kategori ${draftQuestion.category}: ${draftQuestion.category === 'teknis' ? 'Hanya satu opsi terbaik bernilai 5, opsi lainnya bernilai 0.' : `Gunakan skor bertingkat dari 1 s/d ${maxScore}.`}
4. Tulis pembahasan (explanation) minimal 80-120 kata yang membedah keunggulan opsi terbaik dibanding opsi lainnya.
5. Lengkapi field competency, berakhlak, psychologyBasis (harus landasan teori psikologi/manajemen yang konkret dan diakui secara akademis, misal: Servant Leadership, Kohlberg's Moral Development, dll.), dan catTips (satu baris tips taktis).

Format JSON output harus persis seperti struktur berikut:
{
  "dateStr": "${draftQuestion.dateStr}",
  "number": ${draftQuestion.number},
  "category": "${draftQuestion.category}",
  "topic": "${draftQuestion.topic}",
  "questionText": "[SKB CAT BKN Wali Asrama] (Tulis kasus hasil pengembangan Anda di sini, minimal 150 kata)",
  "options": [
    ${optionsKeys.map(key => `{ "key": "${key}", "text": "(Tulis pilihan jawaban ${key} hasil pengembangan Anda)", "score": (skor) }`).join(',\n    ')}
  ],
  "correctAnswer": "(Key yang memiliki skor ${maxScore})",
  "explanation": "(Tulis pembahasan hasil analisis Anda, minimal 80 kata)",
  "competency": "${draftQuestion.competency || 'Kompetensi Wali Asrama'}",
  "berakhlak": "${draftQuestion.berakhlak || 'Harmonis'}",
  "psychologyBasis": "${draftQuestion.psychologyBasis || 'General Psychology'}",
  "catTips": "${draftQuestion.catTips || 'Pilih opsi yang paling profesional.'}"
}`;

    let attempt = 0;
    const maxRetries = 4;
    let lastError: any = null;
    let questionObj: any = null;

    while (attempt < maxRetries) {
      try {
        tempPath = path.join(process.cwd(), 'scripts', `temp_prompt_api_${draftQuestion.number}.txt`);
        fs.writeFileSync(tempPath, `${systemInstruction}\n\n${prompt}`, 'utf8');

        // Run agy command
        const cmd = `agy --dangerously-skip-permissions --print "Process the following input:" < "${tempPath}"`;
        const { stdout } = await execPromise(cmd, { 
          maxBuffer: 15 * 1024 * 1024,
          shell: 'cmd.exe'
        });

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

        questionObj = JSON.parse(cleaned.trim());
        break; // Success
      } catch (err: any) {
        attempt++;
        lastError = err;
        if (attempt < maxRetries) {
          const delay = attempt * 3000 + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
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

    return NextResponse.json({ success: true, question: questionObj });
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
