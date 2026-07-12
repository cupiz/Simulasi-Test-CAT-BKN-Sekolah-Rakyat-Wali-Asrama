const fs = require('fs');
const path = require('path');
const { execSync, execFileSync, exec, execFile } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const execFilePromise = util.promisify(execFile);
const { createClient } = require('@supabase/supabase-js');

// Load env variables
function loadEnv() {
  const envPaths = [
    path.join(__dirname, '..', '.env.local'),
    path.join(__dirname, '..', '.env')
  ];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.trim().startsWith('"') && value.trim().endsWith('"')) {
            value = value.trim().slice(1, -1);
          } else if (value.trim().startsWith("'") && value.trim().endsWith("'")) {
            value = value.trim().slice(1, -1);
          }
          process.env[key] = value.trim();
        }
      });
      break;
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

const DORM_NAMES = [
  'Ahmad Dahlan', 'Hasyim Asyari', 'Ki Hajar Dewantara', 'Sudirman', 'Kartini', 
  'Dewi Sartika', 'Teuku Umar', 'Diponegoro', 'Cut Nyak Dhien', 'Bung Tomo'
];

const STUDENT_NAMES = [
  'Danis', 'Galih', 'Panji', 'Satria', 'Rian', 'Bayu', 'Fajar', 'Bintang', 
  'Aji', 'Fahri', 'Dimas', 'Adit', 'Roni', 'Gibran', 'Hafiz', 'Zaki', 
  'Hendra', 'Tegar', 'Farhan', 'Rendra', 'Yusuf', 'Arif', 'Bagus', 'Irfan',
  'Rizky', 'Fian', 'Reza', 'Taufik', 'Iqbal', 'Wahyu', 'Alif', 'Wildan'
];

const ROOMS = [
  'Kamar 101', 'Kamar 105', 'Kamar 202', 'Kamar 208', 'Kamar 303', 'Kamar 310',
  'Kamar 401', 'Kamar 405', 'Kamar 502', 'Kamar 508'
];

const STAFF_NAMES = [
  'Pak Eko', 'Bu Retno', 'Pak Bambang', 'Bu Sri', 'Pak Gunawan', 'Bu Yuli',
  'Pak Budi', 'Bu Ningsih', 'Pak Rudi', 'Bu Sarah', 'Pak Yudi', 'Bu Irma'
];

// Seeded random helper
function getSeededRandom(seedStr) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return () => {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
}
const parsedQuestionsPath = path.join(__dirname, '..', 'PDF', 'parsed_questions.json');
const extraTeknisPath = path.join(__dirname, '..', 'src', 'data', 'extra_teknis.json');
const parsedQuestions = JSON.parse(fs.readFileSync(parsedQuestionsPath, 'utf8'));
const extraTechnicalQuestions = JSON.parse(fs.readFileSync(extraTeknisPath, 'utf8'));

const teknisRefs = parsedQuestions.filter(q => q.category === 'teknis');
const allTeknisRefs = [...teknisRefs, ...extraTechnicalQuestions];
const manajerialRefs = parsedQuestions.filter(q => q.category === 'manajerial');
const sosialRefs = parsedQuestions.filter(q => q.category === 'sosial');
const wawancaraRefs = parsedQuestions.filter(q => q.category === 'wawancara');

function generateProceduralForDate(dateStr) {
  const result = [];

  // 1. Technical: 90 Questions (1 to 90)
  for (let num = 1; num <= 90; num++) {
    const qRand = getSeededRandom(`${dateStr}-teknis-v5-${num}`);
    const ref = allTeknisRefs[num - 1];

    const optionOrder = [0, 1, 2, 3, 4].sort(() => qRand() - 0.5);
    const keys = ['A', 'B', 'C', 'D', 'E'];

    const formattedOptions = optionOrder.map((oldIdx, newIdx) => {
      const opt = ref.options[oldIdx];
      return {
        key: keys[newIdx],
        text: opt.text,
        score: opt.score === 5 ? 5 : 0
      };
    });

    const correctOpt = formattedOptions.find(o => o.score === 5);
    const correctAnswer = correctOpt ? correctOpt.key : 'A';

    result.push({
      dateStr,
      number: num,
      category: 'teknis',
      topic: ref.topic,
      questionText: `[Ujian Set ${dateStr}] ${ref.questionText}`,
      options: formattedOptions,
      correctAnswer,
      explanation: ref.explanation,
      competency: ref.competency,
      berakhlak: ref.berakhlak,
      psychologyBasis: ref.psychologyBasis,
      catTips: ref.catTips
    });
  }

  // 2. Managerial: 25 Questions (91 to 115)
  for (let num = 91; num <= 115; num++) {
    const qRand = getSeededRandom(`${dateStr}-manajerial-v5-${num}`);
    const ref = manajerialRefs[num - 91];

    const optionOrder = [0, 1, 2, 3].sort(() => qRand() - 0.5);
    const keys = ['A', 'B', 'C', 'D'];

    const formattedOptions = optionOrder.map((oldIdx, newIdx) => {
      const opt = ref.options[oldIdx];
      return {
        key: keys[newIdx],
        text: opt.text,
        score: opt.score
      };
    });

    const correctOpt = formattedOptions.find(o => o.score === 4);
    const correctAnswer = correctOpt ? correctOpt.key : 'A';

    result.push({
      dateStr,
      number: num,
      category: 'manajerial',
      topic: ref.topic,
      questionText: `[Ujian Set ${dateStr}] ${ref.questionText}`,
      options: formattedOptions,
      correctAnswer,
      explanation: ref.explanation,
      competency: ref.competency,
      berakhlak: ref.berakhlak,
      psychologyBasis: ref.psychologyBasis,
      catTips: ref.catTips
    });
  }

  // 3. Sosial: 20 Questions (116 to 135)
  for (let num = 116; num <= 135; num++) {
    const qRand = getSeededRandom(`${dateStr}-sosial-v5-${num}`);
    const ref = sosialRefs[num - 116];

    const optionOrder = [0, 1, 2, 3, 4].sort(() => qRand() - 0.5);
    const keys = ['A', 'B', 'C', 'D', 'E'];

    const formattedOptions = optionOrder.map((oldIdx, newIdx) => {
      const opt = ref.options[oldIdx];
      return {
        key: keys[newIdx],
        text: opt.text,
        score: opt.score
      };
    });

    const correctOpt = formattedOptions.find(o => o.score === 5);
    const correctAnswer = correctOpt ? correctOpt.key : 'A';

    result.push({
      dateStr,
      number: num,
      category: 'sosial',
      topic: ref.topic,
      questionText: `[Ujian Set ${dateStr}] ${ref.questionText}`,
      options: formattedOptions,
      correctAnswer,
      explanation: ref.explanation,
      competency: ref.competency,
      berakhlak: ref.berakhlak,
      psychologyBasis: ref.psychologyBasis,
      catTips: ref.catTips
    });
  }

  // 4. Wawancara: 10 Questions (136 to 145)
  for (let num = 136; num <= 145; num++) {
    const qRand = getSeededRandom(`${dateStr}-wawancara-v5-${num}`);
    const ref = wawancaraRefs[num - 136];

    const optionOrder = [0, 1, 2, 3].sort(() => qRand() - 0.5);
    const keys = ['A', 'B', 'C', 'D'];

    const formattedOptions = optionOrder.map((oldIdx, newIdx) => {
      const opt = ref.options[oldIdx];
      return {
        key: keys[newIdx],
        text: opt.text,
        score: opt.score
      };
    });

    const correctOpt = formattedOptions.find(o => o.score === 4);
    const correctAnswer = correctOpt ? correctOpt.key : 'A';

    result.push({
      dateStr,
      number: num,
      category: 'wawancara',
      topic: ref.topic,
      questionText: `[Ujian Set ${dateStr}] ${ref.questionText}`,
      options: formattedOptions,
      correctAnswer,
      explanation: ref.explanation,
      competency: ref.competency,
      berakhlak: ref.berakhlak,
      psychologyBasis: ref.psychologyBasis,
      catTips: ref.catTips
    });
  }

  return result.sort((a, b) => a.number - b.number);
}

function cleanJsonResponse(text) {
  let cleaned = text.trim();
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
  return cleaned.trim();
}

async function generateQuestionWithAI(category, topic, dateStr, num, baseTemplate) {
  const student = STUDENT_NAMES[(num + dateStr.charCodeAt(1)) % STUDENT_NAMES.length];
  const room = ROOMS[(num + dateStr.charCodeAt(2)) % ROOMS.length];
  const dorm = DORM_NAMES[(num + dateStr.charCodeAt(3)) % DORM_NAMES.length];
  const staff = STAFF_NAMES[(num + dateStr.charCodeAt(0)) % STAFF_NAMES.length];

  const optionCount = (category === 'manajerial' || category === 'wawancara') ? 4 : 5;
  const maxScore = (category === 'manajerial' || category === 'wawancara') ? 4 : 5;
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

Output harus berupa objek JSON valid tanpa penjelasan tambahan di luar JSON.

CRITICAL INSTRUCTION: You are running in a restricted API mode. You MUST NOT write any files to the filesystem, and you MUST NOT create or run any scripts (such as .ps1 or .js files) in the workspace. Simply generate the JSON object in memory and print it directly to standard output. Do not attempt to validate using external scripts.`;

  const draftText = baseTemplate.questionText || baseTemplate.text || '';
  const cleanText = draftText
    .replace(/{student}/g, student)
    .replace(/{room}/g, room)
    .replace(/{dorm}/g, dorm)
    .replace(/{staff}/g, staff);

  const formattedDraftOptions = (baseTemplate.options || []).slice(0, optionCount).map(o => {
    const text = (o.text || '').replace(/{student}/g, student).replace(/{room}/g, room).replace(/{dorm}/g, dorm).replace(/{staff}/g, staff);
    return `- [Skor ${o.score}]: ${text}`;
  }).join('\n');

  const prompt = `Buatlah soal ujian CAT BKN kategori "${category}" bertema "${topic}" nomor soal ${num} yang unik dan orisinil.
  
  Berikut adalah Draf Acuan (HANYA sebagai inspirasi topik dan panduan struktur kompetensi, Anda TIDAK BOLEH meniru cerita/use case ini):
  Draf Cerita Acuan: "${cleanText}"
  Draf Opsi Acuan:
  ${formattedDraftOptions}
  
  ATURAN CRITICAL DIVERSIFIKASI (ANTI-REPETISI):
  1. Anda WAJIB membuat studi kasus (questionText) baru yang SEPENUHNYA BERBEDA skenario ceritanya, konflik permasalahannya, nama tokohnya, dan detail ruang/kamar asrama dari Draf Cerita Acuan.
  2. Jangan pernah menyalin alur cerita dari Draf Cerita Acuan. Karanglah skenario masalah baru yang realistis terjadi di asrama Sekolah Rakyat. Contoh variasi masalah: perkelahian fisik akibat ejekan SARA, perusakan fasilitas bersama (vandalisme), masalah kecanduan rokok/vape, siswa depresi/menangis histeris di malam hari, kecurangan saat ujian sekolah, pelanggaran jam malam untuk pacaran/pergi ke warnet, pertengkaran piket kebersihan, pencurian barang berharga (jam tangan/uang), dsb.
  3. Tulis studi kasus (questionText) tersebut minimal 150-250 kata, menggunakan nama tokoh lokal Indonesia (misal: Tegar, Yusuf, Arif, Bagus, Danis, Galih, Panji, Satria, Rian, Bayu, Fajar, Bintang, dll.).
  4. Buat persis ${optionCount} opsi pilihan jawaban (A s/d ${optionsKeys[optionsKeys.length - 1]}) yang spesifik untuk skenario cerita baru Anda tersebut. Jangan gunakan opsi dari Draf Opsi Acuan.
  5. Tentukan bobot skor opsi jawaban sesuai aturan kategori:
     - Kategori ${category}: ${category === 'teknis' ? 'Hanya satu opsi terbaik bernilai 5, opsi lainnya bernilai 0.' : `Gunakan skor bertingkat dari 1 s/d ${maxScore}.`}
  6. Tulis pembahasan (explanation) minimal 80-120 kata yang membedah keunggulan opsi terbaik dibanding opsi lainnya.

{
  "dateStr": "${dateStr}",
  "number": ${num},
  "category": "${category}",
  "topic": "${topic}",
  "questionText": "[SKB CAT BKN Wali Asrama] (Tulis kasus hasil pengembangan Anda di sini, minimal 150 kata)",
  "options": [
    ${optionsKeys.map(key => `{ "key": "${key}", "text": "(Tulis pilihan jawaban ${key} hasil pengembangan Anda)", "score": (skor) }`).join(',\n    ')}
  ],
  "correctAnswer": "(Key yang memiliki skor ${maxScore})",
  "explanation": "(Tulis pembahasan hasil analisis Anda, minimal 80 kata)",
  "competency": "${baseTemplate.competency || 'Kompetensi Wali Asrama'}",
  "berakhlak": "${baseTemplate.berakhlak || 'Harmonis'}",
  "psychologyBasis": "${baseTemplate.psychologyBasis || 'General Psychology'}",
  "catTips": "${baseTemplate.catTips || 'Pilih opsi yang paling profesional.'}"
}`;

  const tempPath = path.join(__dirname, `temp_prompt_${num}.txt`);

  try {
    let selectedCli = 'agy';
    try {
      execSync('agy --version', { stdio: 'ignore', shell: 'cmd.exe' });
    } catch (e) {
      try {
        execSync('opencode --version', { stdio: 'ignore', shell: 'cmd.exe' });
        selectedCli = 'opencode';
      } catch (e2) {
        throw new Error("CLI 'agy' maupun 'opencode' tidak ditemukan.");
      }
    }

    let attempt = 0;
    const maxRetries = 4;
    let lastError = null;
    let questionObj = null;

    while (attempt < maxRetries) {
      try {
        const fullPrompt = `${systemInstruction}\n\n${prompt}`;
        const promptLength = fullPrompt.length;
        console.log(`🤖 [Soal #${num}] Mengirim prompt (${promptLength} karakter) via CLI: ${selectedCli} (Attempt ${attempt + 1}/${maxRetries})...`);

        let output = '';
        if (selectedCli === 'agy') {
          const res = await execFilePromise('agy', [
            '--dangerously-skip-permissions',
            '--print',
            fullPrompt
          ], {
            maxBuffer: 10 * 1024 * 1024,
            timeout: 45000 // 45 seconds for agy
          });
          output = res.stdout;
        } else {
          fs.writeFileSync(tempPath, fullPrompt, 'utf8');
          const cmd = `opencode run --auto "Process the following input:" < "${tempPath}"`;
          const res = await execPromise(cmd, { 
            maxBuffer: 10 * 1024 * 1024, 
            shell: 'cmd.exe',
            timeout: 90000 // 90 seconds for opencode
          });
          output = res.stdout;
        }
        
        const cleaned = cleanJsonResponse(output);
        const cleanedTrimmed = cleaned.trim();
        // Check if output indicates a quota limit error disguised as plain text
        if (cleanedTrimmed.toLowerCase().includes('quota') || cleanedTrimmed.toLowerCase().includes('subscription')) {
          throw new Error(`Individual quota reached: ${cleanedTrimmed}`);
        }

        questionObj = JSON.parse(cleanedTrimmed);
        break; // Success
      } catch (err) {
        // If we were using agy and it failed, switch to opencode fallback
        if (selectedCli === 'agy') {
          console.warn(`[Wali Asrama] agy CLI failed on question #${num}, trying opencode fallback...`);
          selectedCli = 'opencode';
          // Retry immediately using opencode without incrementing attempt count
          continue;
        }

        attempt++;
        lastError = err;

        const errMsg = ((err.message || '') + ' ' + (err.stderr || '')).toLowerCase();
        const isRateLimit = errMsg.includes('429') || 
                            errMsg.includes('rate limit') || 
                            errMsg.includes('resourceexhausted') || 
                            errMsg.includes('resource has been exhausted') ||
                            errMsg.includes('queries per minute') ||
                            errMsg.includes('quota limit exceeded') ||
                            errMsg.includes('quota exceeded') ||
                            errMsg.includes('quota reached');

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
            console.warn(`⚠️ [Wali Asrama] Terdeteksi rate limit. Menunggu 15 detik sebelum mencoba kembali...`);
            await new Promise(resolve => setTimeout(resolve, 15000));
          } else {
            const delay = attempt * 3000 + Math.random() * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      } finally {
        if (fs.existsSync(tempPath)) {
          try {
            fs.unlinkSync(tempPath);
          } catch (_) {}
        }
      }
    }

    if (!questionObj) {
      throw lastError || new Error("Failed to generate question with AI after multiple attempts.");
    }

    // Post-processing to enforce CAT BKN rules strictly
    if (category === 'teknis') {
      questionObj.options = questionObj.options.map(o => ({
        ...o,
        score: o.score === 5 ? 5 : 0
      }));
      const hasFive = questionObj.options.some(o => o.score === 5);
      if (!hasFive) {
        const correctKey = questionObj.correctAnswer || 'A';
        questionObj.options = questionObj.options.map(o => ({
          ...o,
          score: o.key === correctKey ? 5 : 0
        }));
      }
    } else {
      // Ensure graded scores are valid
      questionObj.options = questionObj.options.map(o => ({
        ...o,
        score: Math.max(1, Math.min(maxScore, o.score))
      }));
    }

    return questionObj;
  } catch (err) {
    throw err;
  } finally {
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch (_) {}
    }
  }
}

async function mapLimit(array, limit, fn) {
  const results = [];
  const executing = [];
  for (const item of array) {
    const p = Promise.resolve().then(() => fn(item));
    results.push(p);
    if (limit <= array.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(results);
}

async function main() {
  const args = process.argv.slice(2);
  let dateStr = new Date().toISOString().split('T')[0];
  let useAI = true;

  args.forEach(arg => {
    if (arg.startsWith('--date=')) {
      dateStr = arg.split('=')[1];
    } else if (arg === '--local' || arg === '--no-ai') {
      useAI = false;
    }
  });

  console.log(`📅 Men-generate 145 soal untuk tanggal: ${dateStr}`);
  
  if (useAI) {
    // Verify CLI executable presence
    try {
      execSync('agy --version', { stdio: 'ignore', shell: 'cmd.exe' });
      console.log(`🤖 Mode AI Aktif (menggunakan CLI 'agy')...`);
    } catch (e) {
      try {
        execSync('opencode --version', { stdio: 'ignore', shell: 'cmd.exe' });
        console.log(`🤖 Mode AI Aktif (menggunakan CLI 'opencode')...`);
      } catch (e2) {
        console.log(`⚠️ Peringatan: Tidak ditemukan CLI 'agy' maupun 'opencode'. Beralih ke Mode Lokal.`);
        useAI = false;
      }
    }
  }

  let finalQuestions = [];
  const fileName = `daily_questions_${dateStr}.json`;
  const filePath = path.join(__dirname, '..', fileName);

  // 1. Check offline file first and load existing questions
  if (fs.existsSync(filePath)) {
    try {
      finalQuestions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      console.log(`📄 Ditemukan berkas lokal offline dengan ${finalQuestions.length} soal.`);
    } catch (e) {
      console.warn(`⚠️ Gagal membaca berkas lokal offline, akan dimulai dari awal: ${e.message}`);
    }
  }

  // 2. Check online questions in Supabase (if credentials available)
  if (useAI && supabase) {
    try {
      console.log(`🌐 Memeriksa data online di Supabase untuk tanggal ${dateStr}...`);
      const { data: onlineQuestions, error: onlineError } = await supabase
        .from('questions')
        .select('*')
        .eq('dateStr', dateStr);

      if (onlineError) {
        console.warn(`⚠️ Gagal mengambil data online: ${onlineError.message}`);
      } else if (onlineQuestions && onlineQuestions.length > 0) {
        console.log(`🌐 Ditemukan ${onlineQuestions.length} soal online di Supabase.`);
        
        // Sync online questions into finalQuestions if missing locally
        onlineQuestions.forEach(onlineQ => {
          if (!finalQuestions.some(offQ => offQ.number === onlineQ.number)) {
            const { id, created_at, ...cleanedQ } = onlineQ;
            finalQuestions.push(cleanedQ);
          }
        });
      }
    } catch (e) {
      console.warn(`⚠️ Gagal melakukan sinkronisasi dengan Supabase: ${e.message}`);
    }
  }

  if (!useAI) {
    console.log(`⚡ Men-generate soal secara lokal (prosedural)...`);
    finalQuestions = generateProceduralForDate(dateStr);
  } else {
    // 3. Filter tasks to only generate what is missing offline and online
    const skippedNumbers = new Set(finalQuestions.map(q => q.number));

    const tasks = [];
    // Teknis: 1-90
    for (let num = 1; num <= 90; num++) {
      tasks.push({ category: 'teknis', num, ref: allTeknisRefs[num - 1] });
    }
    // Manajerial: 91-115
    for (let num = 91; num <= 115; num++) {
      tasks.push({ category: 'manajerial', num, ref: manajerialRefs[num - 91] });
    }
    // Sosial: 116-135
    for (let num = 116; num <= 135; num++) {
      tasks.push({ category: 'sosial', num, ref: sosialRefs[num - 116] });
    }
    // Wawancara: 136-145
    for (let num = 136; num <= 145; num++) {
      tasks.push({ category: 'wawancara', num, ref: wawancaraRefs[num - 136] });
    }

    const tasksToRun = tasks.filter(t => !skippedNumbers.has(t.num));
    console.log(`📊 Progress offline & online: ${finalQuestions.length} soal sudah lengkap.`);
    console.log(`🧠 Memulai brainstorming ${tasksToRun.length} sisa soal CAT BKN Wali Asrama secara Paralel...`);

    const concurrencyLimit = 5;
    let completedCount = 0;
    
    if (tasksToRun.length > 0) {
      await mapLimit(tasksToRun, concurrencyLimit, async (task) => {
        const baseTemplate = task.ref;
        const q = await generateQuestionWithAI(task.category, baseTemplate.topic, dateStr, task.num, baseTemplate);
        
        // Push to master list and increment
        finalQuestions.push(q);
        completedCount++;
        console.log(`📈 Progress: ${completedCount}/${tasksToRun.length} selesai. (Total saat ini: ${finalQuestions.length}/145)`);
        
        // Save incrementally on every successful question write
        finalQuestions.sort((a, b) => a.number - b.number);
        fs.writeFileSync(filePath, JSON.stringify(finalQuestions, null, 2), 'utf-8');

        // Auto-upload incrementally to Supabase (online) if credentials are loaded
        if (supabase) {
          try {
            const { id, created_at, ...cleanedQ } = q;
            const { error: uploadError } = await supabase
              .from('questions')
              .insert(cleanedQ);
            
            if (uploadError) {
              console.warn(`⚠️ [Online] Gagal mengunggah soal #${q.number} ke Supabase: ${uploadError.message}`);
            } else {
              console.log(`🌐 [Online] Soal #${q.number} berhasil diunggah langsung ke Supabase.`);
            }
          } catch (uploadErr) {
            console.warn(`⚠️ [Online] Error saat mengunggah soal #${q.number}: ${uploadErr.message}`);
          }
        }
      });
    } else {
      console.log(`✅ Semua soal (145/145) sudah lengkap offline & online. Tidak ada soal baru yang perlu di-generate.`);
    }
  }

  // Final sort and write output file
  finalQuestions.sort((a, b) => a.number - b.number);
  fs.writeFileSync(filePath, JSON.stringify(finalQuestions, null, 2), 'utf-8');

  console.log(`\n======================================================`);
  console.log(`🎉 SUKSES GENERATE SET UJIAN HARIAN!`);
  console.log(`Tanggal: ${dateStr}`);
  console.log(`Jumlah Soal: ${finalQuestions.length} Butir`);
  console.log(`Lokasi File: ${filePath}`);
  console.log(`Silakan unggah berkas ini melalui tombol "Impor JSON" di Admin Panel.`);
  console.log(`======================================================\n`);
}

main().catch(err => {
  console.error("❌ Terjadi kesalahan fatal:", err);
  process.exit(1);
});
