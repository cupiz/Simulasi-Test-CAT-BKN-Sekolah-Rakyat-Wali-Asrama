const fs = require('fs');
const path = require('path');

const COMPONENT_TOPICS = {
  teknis: [
    'Homesick', 'Bullying', 'Konseling', 'Perlindungan Anak', 'NAPZA', 'Kekerasan', 'Disiplin',
    'Konflik', 'Keamanan', 'Bencana', 'Etika', 'Media Sosial', 'Psikologi Remaja', 'Character Building',
    'Parenting', 'Komunikasi', 'Empati', 'Problem Solving', 'SOP Asrama', 'Budaya Sekolah'
  ],
  manajerial: [
    'Leadership', 'Planning', 'Integrity', 'Teamwork', 'Innovation', 'Decision Making', 'Service',
    'Collaboration', 'Strategic Thinking'
  ],
  sosial: [
    'Budaya', 'Agama', 'Disabilitas', 'Gender', 'Inklusif', 'Moderasi', 'Pancasila', 'SARA'
  ],
  wawancara: [
    'Integritas', 'Loyalitas', 'Anti Korupsi', 'Komitmen', 'ASN BerAKHLAK'
  ]
};

const CASE_TEMPLATES = [
  'Di lorong asrama C, seorang siswa menolak mengikuti kegiatan diskusi kelompok karena merasa pandangan politik dan kebangsaannya berbeda.',
  'Terjadi pemutusan aliran air bersih di sayap kanan asrama akibat kerusakan pipa utama. Beberapa siswa mulai mengeluhkan kebersihan toilet.',
  'Ditemukan coretan bernada provokatif di dinding aula asrama yang memicu ketegangan antargeng siswa kelas IX.',
  'Seorang siswa mengaku kehilangan buku catatan penting yang dipinjam oleh temannya secara sepihak dan tidak segera dikembalikan.',
  'Seorang siswa menunjukkan gejala kecemasan berlebih (panic attack) saat bersiap mengikuti seleksi wawancara beasiswa asrama.'
];

function generateDaily(dateStr) {
  const categories = ['teknis', 'manajerial', 'sosial', 'wawancara', 'teknis'];
  const startId = Date.now(); // pseudo-unique start id

  return categories.map((category, index) => {
    const id = startId + index;
    const topics = COMPONENT_TOPICS[category];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const baseCase = CASE_TEMPLATES[Math.floor(Math.random() * CASE_TEMPLATES.length)];

    return {
      id,
      category,
      topic,
      questionText: `[Studi Kasus CLI - ${dateStr}] ${baseCase} Bagaimana tindakan pembinaan Anda selaku Wali Asrama Sekolah Rakyat yang paling edukatif?`,
      options: [
        { key: 'A', text: 'Melaporkan kasus tersebut ke pengawas asrama utama untuk dijatuhi sanksi tertulis.', score: 2 },
        { key: 'B', text: 'Mengajak siswa berdialog secara persuasif, menguraikan esensi toleransi, dan merumuskan solusi kolaboratif.', score: 5 },
        { key: 'C', text: 'Mengabaikan kasus tersebut dan membiarkan siswa menyelesaikan masalah mereka secara alamiah.', score: 1 },
        { key: 'D', text: 'Memberikan ceramah umum tentang kedisiplinan asrama saat apel pagi hari berikutnya.', score: 3 },
        { key: 'E', text: 'Memindahkan siswa ke unit asrama lain secara sepihak demi menghindari perselisihan lanjutan.', score: 4 }
      ],
      correctAnswer: 'B',
      explanation: `Dalam menyelesaikan kasus ${topic.toLowerCase()} ini, opsi B adalah pilihan paling berintegritas dan bernilai tinggi dalam penilaian CAT BKN. Dialog persuasif menumbuhkan kematangan moral remaja.\n\nMengapa A salah: Sanksi kaku tanpa pembinaan personal tidak melatih empati.\nMengapa C salah: Pembiaran memicu eskalasi konflik.\nMengapa D salah: Ceramah umum kurang menyasar akar konflik personal siswa.\nMengapa E salah: Pemisahan fisik bersifat pemecahan sementara bukan edukasi jangka panjang.`,
      competency: `Kompetensi Harian: ${topic}`,
      berakhlak: 'Harmonis & Akuntabel',
      psychologyBasis: 'Conflict Management Model (Thomas-Kilmann) dan Teori Konseling Humanistik.',
      catTips: 'Pilihlah jawaban yang mengutamakan dialog personal empatik dan program penyelesaian masalah bersama.'
    };
  });
}

const today = new Date();
const dateStr = today.toISOString().split('T')[0];
const questions = generateDaily(dateStr);

const fileName = `daily_questions_${dateStr}.json`;
const filePath = path.join(__dirname, '..', fileName);

fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf-8');

console.log(`\n======================================================`);
console.log(`🎉 SUKSES GENERATE SOAL HARIAN VIA CLI!`);
console.log(`Tanggal: ${dateStr}`);
console.log(`Jumlah Soal: ${questions.length} Butir`);
console.log(`Lokasi File: ${filePath}`);
console.log(`Silakan unggah berkas ini melalui tombol "Impor JSON" di Admin Panel.`);
console.log(`======================================================\n`);
