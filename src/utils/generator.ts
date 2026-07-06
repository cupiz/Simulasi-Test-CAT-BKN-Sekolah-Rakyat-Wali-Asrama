import { Question } from '../types';
import { REFERENCE_QUESTIONS } from '../data/questions';

// Lists of variables to inject for high-fidelity uniqueness
const DORM_NAMES = ['Ahmad Dahlan', 'Hasyim Asyari', 'Ki Hajar Dewantara', 'Sudirman', 'Kartini', 'Dewi Sartika'];
const STUDENT_NAMES = [
  'Danis', 'Galih', 'Panji', 'Satria', 'Rian', 'Bayu', 'Fajar', 'Bintang', 
  'Aji', 'Fahri', 'Dimas', 'Adit', 'Roni', 'Gibran', 'Hafiz', 'Zaki', 
  'Hendra', 'Tegar', 'Farhan', 'Rendra', 'Yusuf', 'Arif', 'Bagus', 'Irfan'
];
const ROOMS = ['Kamar 101', 'Kamar 105', 'Kamar 202', 'Kamar 208', 'Kamar 303', 'Kamar 310'];
const STAFF_NAMES = ['Pak Eko', 'Bu Retno', 'Pak Bambang', 'Bu Sri', 'Pak Gunawan', 'Bu Yuli'];

// Seeded random number generator
function getSeededRandom(seedStr: string) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return () => {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
}

// ═══════════════════════════════════════════════════════════════
// PROCEDURAL POOL: TEKNIS (90 QUESTIONS)
// ═══════════════════════════════════════════════════════════════
const TEKNIS_SCENARIOS = [
  {
    topic: 'Homesick',
    text: 'Siswa bernama {student} di {room} asrama {dorm} terus menangis dan menolak makan karena rindu rumah (homesick). Hal ini mulai mengganggu konsentrasi belajar rekan sekamarnya. Sebagai Wali Asrama, langkah restoratif Anda adalah...',
    options: [
      { text: 'Melaporkan kondisi {student} ke kepala sekolah agar segera diizinkan pulang ke rumah tanpa syarat.', score: 2 },
      { text: 'Mengajjak {student} berdialog empatik secara privat, lalu melibatkan rekan sekamarnya untuk menyusun jadwal piket hiburan bersama (peer support).', score: 5 },
      { text: 'Membiarkan {student} sendirian di kamar agar belajar mandiri mengatasi kesedihannya.', score: 1 },
      { text: 'Memindahkan {student} ke kamar isolasi agar tidak mengganggu ketenangan siswa lainnya.', score: 3 },
      { text: 'Menghubungi orang tua {student} untuk datang menemani anaknya menginap di asrama.', score: 4 }
    ],
    correctAnswer: 'B',
    explanation: 'Konseling individual yang dikombinasikan dengan pembentukan sistem peer support (dukungan sebaya) melatih resiliensi mental siswa sekaligus membangun ikatan kekeluargaan di asrama.',
    competency: 'SOP Asrama & Pembinaan Resiliensi Remaja',
    berakhlak: 'Harmonis & Kolaboratif',
    psychologyBasis: 'Social Support Theory dan Client-Centered Therapy (Carl Rogers).',
    catTips: 'Pilih opsi yang menyeimbangkan empati individual dengan pelibatan komunitas asrama secara produktif.'
  },
  {
    topic: 'Bullying',
    text: 'Anda mendengar laporan bahwa {student} menjadi korban ejekan verbal berulang (cyberbullying) oleh beberapa siswa di grup media sosial internal asrama {dorm}. Tindakan awal Anda adalah...',
    options: [
      { text: 'Menyita seluruh gadget siswa secara permanen di asrama {dorm}.', score: 2 },
      { text: 'Memanggil korban dan para pelaku untuk mediasi restoratif, menegakkan sanksi tata tertib, serta memberikan edukasi etika berkomunikasi digital.', score: 5 },
      { text: 'Mengabaikan karena menganggap candaan grup chat adalah hal biasa bagi anak remaja.', score: 1 },
      { text: 'Langsung mengeluarkan pelaku bullying dari asrama tanpa klarifikasi.', score: 3 },
      { text: 'Mengumumkan nama-nama pelaku pada apel pagi agar mereka jera secara sosial.', score: 4 }
    ],
    correctAnswer: 'B',
    explanation: 'Mediasi restoratif yang dibarengi penegakan disiplin mengajarkan tanggung jawab moral kepada pelaku tanpa merusak integritas sosial asrama.',
    competency: 'Resolusi Konflik & Perlindungan Siswa',
    berakhlak: 'Akuntabel & Harmonis',
    psychologyBasis: 'Restorative Justice Framework dan Teori Kognitif Sosial Bandura.',
    catTips: 'Pilihlah jawaban yang menindak tegas perundungan namun tetap mengedepankan aspek edukasi dan pemulihan psikologis.'
  },
  {
    topic: 'SOP Asrama',
    text: 'Siswa bernama {student} kedapatan menyimpan barang terlarang (seperti rokok atau gadget di luar jam ketentuan) di dalam lemari pakaiannya di asrama {dorm}. Langkah pembinaan Anda adalah...',
    options: [
      { text: 'Menyita barang tersebut, memanggil {student} ke ruang pembinaan untuk refleksi personal, dan memberinya tugas menyusun rangkuman SOP asrama.', score: 5 },
      { text: 'Langsung membuang barang tersebut ke tempat sampah di hadapan {student} tanpa penjelasan.', score: 2 },
      { text: 'Membiarkannya saja karena lemari adalah privasi pribadi siswa.', score: 1 },
      { text: 'Melaporkan langsung ke kepolisian daerah untuk penegakan hukum pidana.', score: 3 },
      { text: 'Menempelkan foto {student} di mading utama sebagai pelaku pelanggaran berat.', score: 4 }
    ],
    correctAnswer: 'A',
    explanation: 'Penyitaan barang yang diikuti bimbingan reflektif membantu siswa memahami pentingnya aturan asrama untuk keselamatan bersama.',
    competency: 'Penerapan SOP & Kedisiplinan Kognitif',
    berakhlak: 'Akuntabel & Kompeten',
    psychologyBasis: 'Operant Conditioning (Skinner) melalui konsekuensi logis positif.',
    catTips: 'Carilah jawaban yang menegakkan SOP melalui konsekuensi edukatif, bukan hukuman fisik atau penghinaan publik.'
  },
  {
    topic: 'NAPZA / Kesehatan',
    text: 'Ada laporan kecurigaan bahwa salah satu siswa di asrama {dorm} mulai bergaul dengan lingkungan luar yang mengonsumsi zat terlarang (NAPZA). Langkah preventif Anda sebagai Wali Asrama adalah...',
    options: [
      { text: 'Menuduh langsung siswa tersebut di depan kelas dan menuntutnya melakukan tes urine mendadak.', score: 2 },
      { text: 'Mengadakan sosialisasi pencegahan NAPZA secara komprehensif, melakukan pendekatan personal empatik, dan berkoordinasi dengan tim medis sekolah.', score: 5 },
      { text: 'Membiarkan laporan tersebut karena belum ada bukti fisik yang nyata.', score: 1 },
      { text: 'Segera mengusir siswa tersebut dari asrama demi keselamatan nama baik sekolah.', score: 3 },
      { text: 'Membagikan pamflet bahaya narkoba tanpa melakukan investigasi lebih lanjut.', score: 4 }
    ],
    correctAnswer: 'B',
    explanation: 'Pendekatan preventif komprehensif dan deteksi dini melalui konseling personal menjamin perlindungan siswa sebelum jatuh ke dalam bahaya ketergantungan.',
    competency: 'Mitigasi Risiko & Kesehatan Anak',
    berakhlak: 'Loyal & Kolaboratif',
    psychologyBasis: 'Health Belief Model dan Preventive Intervention Paradigm.',
    catTips: 'Pilih jawaban yang mengedepankan tindakan preventif edukatif, kerahasiaan medis, dan rehabilitasi terarah.'
  },
  {
    topic: 'Keamanan / Kebakaran',
    text: 'Terjadi korsleting listrik kecil di dapur asrama {dorm} yang memicu asap tebal. Beberapa siswa mulai panik berlarian. Tindakan darurat pertama Anda adalah...',
    options: [
      { text: 'Ikut berlari menyelamatkan diri terlebih dahulu agar bisa meminta bantuan dari luar.', score: 2 },
      { text: 'Memutuskan aliran listrik utama, mengaktifkan APAR (Alat Pemadam Api Ringan), dan mengarahkan siswa ke titik kumpul aman sesuai jalur evakuasi.', score: 5 },
      { text: 'Menenangkan siswa dengan berteriak keras dari lantai atas asrama.', score: 3 },
      { text: 'Membiarkan siswa berinisiatif memadamkan api menggunakan ember air biasa.', score: 1 },
      { text: 'Menghubungi pemadam kebakaran dan menunggu mereka tiba tanpa melakukan tindakan evakuasi.', score: 4 }
    ],
    correctAnswer: 'B',
    explanation: 'Pemutusan daya, penanganan api mula-mula dengan APAR, dan panduan evakuasi terstruktur adalah prosedur baku keselamatan kebakaran (K3).',
    competency: 'Mitigasi Bencana & SOP Keselamatan Kerja',
    berakhlak: 'Kompeten & Akuntabel',
    psychologyBasis: 'Crisis Management and Disaster response protocol.',
    catTips: 'Pilihlah jawaban yang menunjukkan tindakan taktis-prosedural, menenangkan massa, dan mengutamakan keselamatan jiwa.'
  }
];

// ═══════════════════════════════════════════════════════════════
// PROCEDURAL POOL: MANAGERIAL (25 QUESTIONS)
// ═══════════════════════════════════════════════════════════════
const MANAGERIAL_SCENARIOS = [
  {
    topic: 'Teamwork',
    text: 'Sebagai Koordinator Wali Asrama, Anda melihat koordinasi antar-staf piket malam asrama kurang sinergis, sering terjadi kekosongan pos jaga karena salah paham. Langkah manajerial Anda adalah...',
    options: [
      { text: 'Mengambil alih seluruh piket malam secara mandiri untuk memberi contoh keteladanan.', score: 2 },
      { text: 'Mengadakan briefing koordinasi berkala, menyusun peta tanggung jawab (RACI matrix), dan menerapkan logbook digital untuk pelaporan realtime.', score: 5 },
      { text: 'Menjatuhkan denda pemotongan honor kerja kepada staf yang terlambat tanpa verifikasi.', score: 3 },
      { text: 'Mengabaikan situasi karena yakin masalah koordinasi akan membaik dengan sendirinya.', score: 1 },
      { text: 'Mengusulkan pergantian total seluruh staf piket lama dengan staf baru yang lebih muda.', score: 4 }
    ],
    correctAnswer: 'B',
    explanation: 'Briefing rutin, kejelasan pembagian peran (RACI), dan sistem pelacakan berbasis teknologi memastikan akuntabilitas kerja tim.',
    competency: 'Perencanaan Staf & Manajemen Operasional',
    berakhlak: 'Adaptif & Akuntabel',
    psychologyBasis: 'Organizational Behavior Theory dan Goal-Setting Theory.',
    catTips: 'Pilih solusi sistemik yang memberdayakan tim melalui struktur yang jelas dan pemanfaatan teknologi.'
  },
  {
    topic: 'Innovation',
    text: 'Rekan kerja Anda, {staff}, menolak menggunakan sistem pelaporan asrama berbasis aplikasi mobile yang baru karena merasa kesulitan beradaptasi dengan teknologi. Sikap Anda selaku pimpinan adalah...',
    options: [
      { text: 'Membebaskan {staff} menggunakan kertas laporan manual demi kenyamanan kerjanya.', score: 2 },
      { text: 'Memberikan bimbingan teknis tatap muka (mentoring) secara bertahap kepada {staff} dan menjelaskan efisiensi waktu yang didapat dari sistem baru.', score: 5 },
      { text: 'Melaporkan {staff} ke atasan agar diberikan sanksi mutasi atau penurunan pangkat.', score: 3 },
      { text: 'Menghapus aplikasi baru tersebut dan kembali ke metode administrasi konvensional.', score: 1 },
      { text: 'Menyuruh rekan kerja lain yang lebih muda untuk selalu mengetikkan laporan milik {staff}.', score: 4 }
    ],
    correctAnswer: 'B',
    explanation: 'Mentoring adaptif membantu mengatasi hambatan psikologis staf terhadap perubahan sistem tanpa meninggalkan prinsip pemanfaatan inovasi.',
    competency: 'Manajemen Perubahan & Kepemimpinan Digital',
    berakhlak: 'Adaptif & Kompeten',
    psychologyBasis: 'Technology Acceptance Model (TAM) dan Teori Difusi Inovasi Rogers.',
    catTips: 'Pilihlah jawaban yang menyeimbangkan empati terhadap kesulitan staf dengan keharusan transformasi inovatif.'
  }
];

// ═══════════════════════════════════════════════════════════════
// PROCEDURAL POOL: SOSIAL (20 QUESTIONS)
// ═══════════════════════════════════════════════════════════════
const SOCIAL_SCENARIOS = [
  {
    topic: 'Budaya',
    text: 'Siswa asal wilayah timur di asrama {dorm} sering diejek oleh teman-temannya karena logat bicaranya yang keras dan dinilai kasar. Langkah Anda sebagai Wali Asrama untuk menanamkan toleransi adalah...',
    options: [
      { text: 'Melarang siswa daerah berbicara dengan dialek khas mereka agar bahasa asrama seragam.', score: 2 },
      { text: 'Menyelenggarakan pentas seni kebudayaan berkala (malam keakraban) dan memandu diskusi reflektif tentang keragaman dialek nusantara.', score: 5 },
      { text: 'Meminta siswa korban ejekan tersebut untuk mengubah cara bicaranya agar sesuai kebiasaan mayoritas.', score: 1 },
      { text: 'Menghukum siswa yang mengejek dengan menyuruh mereka menulis esai bertema kebangsaan.', score: 4 },
      { text: 'Memindahkan siswa-siswa seagama/suku ke blok asrama yang terpisah.', score: 3 }
    ],
    correctAnswer: 'B',
    explanation: 'Ruang kolaboratif kebudayaan mereduksi prasangka sosial antarkelompok melalui pemahaman empati kultural yang mendalam.',
    competency: 'Pemberdayaan Keberagaman & Toleransi Sosial',
    berakhlak: 'Harmonis & Loyal',
    psychologyBasis: 'Contact Hypothesis Allport dan Multicultural Education Framework.',
    catTips: 'Pilihlah jawaban yang mempromosikan persatuan tanpa menekan identitas budaya khas masing-masing siswa.'
  },
  {
    topic: 'Inklusif',
    text: 'Di asrama {dorm}, terdapat siswa penyandang disabilitas fisik ringan yang merasa minder karena tidak diajak bermain futsal oleh rekan-rekannya. Tindakan edukatif Anda adalah...',
    options: [
      { text: 'Melarang olahraga futsal di asrama agar tidak ada kecemburuan sosial.', score: 2 },
      { text: 'Mendampingi kelompok siswa untuk merancang variasi permainan olahraga inklusif yang memungkinkan semua siswa ikut berkontribusi.', score: 5 },
      { text: 'Membiarkan saja karena olahraga futsal memang membutuhkan fisik yang prima.', score: 1 },
      { text: 'Membelikan konsol game khusus untuk siswa disabilitas tersebut agar bermain di dalam kamar.', score: 3 },
      { text: 'Menegur siswa mayoritas dengan keras di depan umum agar mereka merasa bersalah.', score: 4 }
    ],
    correctAnswer: 'B',
    explanation: 'Mendorong penciptaan aktivitas inklusif melatih empati sosial siswa mayoritas serta memulihkan rasa percaya diri siswa disabilitas.',
    competency: 'Pembinaan Empati & Inklusi Sosial Kultural',
    berakhlak: 'Harmonis & Berorientasi Pelayanan',
    psychologyBasis: 'Inclusive Education Paradigm dan Social Exchange Theory.',
    catTips: 'Pilih opsi yang mendorong keterlibatan aktif semua anak secara setara tanpa mengisolasi pihak minoritas.'
  }
];

// ═══════════════════════════════════════════════════════════════
// PROCEDURAL POOL: WAWANCARA (10 QUESTIONS)
// ═══════════════════════════════════════════════════════════════
const INTERVIEW_SCENARIOS = [
  {
    topic: 'Integritas',
    text: 'Dalam wawancara seleksi ASN, pewawancara menanyakan sikap Anda jika mengetahui rekan sesama Wali Asrama menerima hadiah mewah dari salah satu orang tua murid agar anaknya mendapat rapor asrama yang bagus. Jawaban berintegritas Anda adalah...',
    options: [
      { text: 'Pura-pura tidak melihat demi menjaga hubungan persahabatan antar-rekan kerja.', score: 1 },
      { text: 'Mengingatkan rekan tersebut secara kekeluargaan tentang kode etik ASN, menolak pembagian gratifikasi, dan melaporkannya ke komite etik jika tidak diindahkan.', score: 5 },
      { text: 'Melaporkannya langsung ke media sosial agar viral dan segera diproses hukum.', score: 3 },
      { text: 'Meminta bagian hadiah tersebut agar asas keadilan dan kebersamaan di asrama terjaga.', score: 2 },
      { text: 'Membicarakan kejelekan rekan kerja tersebut di depan para wali murid lainnya.', score: 4 }
    ],
    correctAnswer: 'B',
    explanation: 'Komitmen menolak korupsi/gratifikasi dan melaporkannya sesuai prosedur merupakan wujud integritas moral tertinggi pegawai ASN.',
    competency: 'Pilar Integritas ASN & Anti Gratifikasi',
    berakhlak: 'Akuntabel & Loyal',
    psychologyBasis: 'Teori Perkembangan Moral Kohlberg (Universal Ethical Principle).',
    catTips: 'Pilih jawaban yang menolak keras korupsi secara tegas, prosedural, berani, dan beretika.'
  },
  {
    topic: 'Loyalitas',
    text: 'Jika Anda ditugaskan oleh pimpinan asrama {dorm} untuk bertugas darurat pada hari libur nasional guna mendampingi siswa yang sakit mendadak, padahal Anda sudah merencanakan liburan keluarga. Sikap Anda adalah...',
    options: [
      { text: 'Menolak tugas tersebut secara kasar karena hari libur adalah hak mutlak staf.', score: 1 },
      { text: 'Menerima tugas darurat dengan penuh tanggung jawab, mengatur ulang liburan keluarga, dan mendampingi siswa secara prima sebagai bentuk dedikasi.', score: 5 },
      { text: 'Menerima tugas namun melaksanakannya dengan cemberut dan setengah hati.', score: 3 },
      { text: 'Membayar orang luar secara pribadi untuk menggantikan posisi Anda tanpa izin pimpinan.', score: 2 },
      { text: 'Menghubungi pimpinan untuk bernegosiasi meminta bonus uang lembur yang berlipat ganda terlebih dahulu.', score: 4 }
    ],
    correctAnswer: 'B',
    explanation: 'Mengutamakan keselamatan siswa asrama dan menunaikan tugas pelayanan darurat di atas kepentingan pribadi mencerminkan nilai loyalitas aparatur negara.',
    competency: 'Loyalitas Profesi & Dedikasi Pelayanan Publik',
    berakhlak: 'Loyal & Berorientasi Pelayanan',
    psychologyBasis: 'Public Service Motivation (PSM) Framework.',
    catTips: 'Pilihlah jawaban yang menempatkan tugas pengabdian sosial kemanusiaan di atas kenyamanan pribadi secara ikhlas.'
  }
];

// ═══════════════════════════════════════════════════════════════
// MAIN GENERATOR FUNCTION
// ═══════════════════════════════════════════════════════════════
export function generateDailyQuestions(dateStr: string): Question[] {
  const result: Question[] = [];
  const rand = getSeededRandom(dateStr);

  // Helper to pick dynamic elements based on seeded random
  const pickRandom = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

  // Add the 5 reference questions as the base for numbers 1, 2, 3 (Teknis), 116 (Sosial), and 136 (Wawancara)
  const ref1 = { ...REFERENCE_QUESTIONS[0], dateStr, number: 1 };
  delete ref1.id;
  const ref2 = { ...REFERENCE_QUESTIONS[1], dateStr, number: 2 };
  delete ref2.id;
  const ref3 = { ...REFERENCE_QUESTIONS[2], dateStr, number: 3 };
  delete ref3.id;
  const ref4 = { ...REFERENCE_QUESTIONS[3], dateStr, number: 116 };
  delete ref4.id;
  const ref5 = { ...REFERENCE_QUESTIONS[4], dateStr, number: 136 };
  delete ref5.id;

  // 1. Technical: 90 Soal (Numbers 1 to 90)
  result.push(ref1, ref2, ref3);

  for (let num = 4; num <= 90; num++) {
    const scenarioTemplate = TEKNIS_SCENARIOS[(num + dateStr.charCodeAt(0)) % TEKNIS_SCENARIOS.length];
    
    // Inject dynamic names/rooms
    const student = STUDENT_NAMES[(num + dateStr.charCodeAt(1)) % STUDENT_NAMES.length];
    const room = ROOMS[(num + dateStr.charCodeAt(2)) % ROOMS.length];
    const dorm = DORM_NAMES[(num + dateStr.charCodeAt(3)) % DORM_NAMES.length];
    const staff = STAFF_NAMES[(num + dateStr.charCodeAt(0)) % STAFF_NAMES.length];

    const questionText = scenarioTemplate.text
      .replace(/{student}/g, student)
      .replace(/{room}/g, room)
      .replace(/{dorm}/g, dorm)
      .replace(/{staff}/g, staff);

    const formattedOptions = scenarioTemplate.options.map((opt, oIdx) => {
      const keys: ('A'|'B'|'C'|'D'|'E')[] = ['A', 'B', 'C', 'D', 'E'];
      return {
        key: keys[oIdx],
        text: opt.text.replace(/{student}/g, student).replace(/{room}/g, room).replace(/{dorm}/g, dorm).replace(/{staff}/g, staff),
        score: opt.score
      };
    });

    result.push({
      dateStr,
      number: num,
      category: 'teknis',
      topic: scenarioTemplate.topic,
      questionText: `[SKB CAT BKN - Soal #${num}] ${questionText}`,
      options: formattedOptions,
      correctAnswer: scenarioTemplate.correctAnswer as any,
      explanation: scenarioTemplate.explanation.replace(/{student}/g, student),
      competency: scenarioTemplate.competency,
      berakhlak: scenarioTemplate.berakhlak,
      psychologyBasis: scenarioTemplate.psychologyBasis,
      catTips: scenarioTemplate.catTips
    });
  }

  // 2. Managerial: 25 Soal (Numbers 91 to 115)
  for (let num = 91; num <= 115; num++) {
    const scenarioTemplate = MANAGERIAL_SCENARIOS[(num + dateStr.charCodeAt(0)) % MANAGERIAL_SCENARIOS.length];
    
    const student = STUDENT_NAMES[(num + dateStr.charCodeAt(1)) % STUDENT_NAMES.length];
    const room = ROOMS[(num + dateStr.charCodeAt(2)) % ROOMS.length];
    const dorm = DORM_NAMES[(num + dateStr.charCodeAt(3)) % DORM_NAMES.length];
    const staff = STAFF_NAMES[(num + dateStr.charCodeAt(0)) % STAFF_NAMES.length];

    const questionText = scenarioTemplate.text
      .replace(/{student}/g, student)
      .replace(/{room}/g, room)
      .replace(/{dorm}/g, dorm)
      .replace(/{staff}/g, staff);

    const formattedOptions = scenarioTemplate.options.map((opt, oIdx) => {
      const keys: ('A'|'B'|'C'|'D'|'E')[] = ['A', 'B', 'C', 'D', 'E'];
      return {
        key: keys[oIdx],
        text: opt.text.replace(/{student}/g, student).replace(/{room}/g, room).replace(/{dorm}/g, dorm).replace(/{staff}/g, staff),
        score: opt.score
      };
    });

    result.push({
      dateStr,
      number: num,
      category: 'manajerial',
      topic: scenarioTemplate.topic,
      questionText: `[SKB CAT BKN - Soal #${num}] ${questionText}`,
      options: formattedOptions,
      correctAnswer: scenarioTemplate.correctAnswer as any,
      explanation: scenarioTemplate.explanation,
      competency: scenarioTemplate.competency,
      berakhlak: scenarioTemplate.berakhlak,
      psychologyBasis: scenarioTemplate.psychologyBasis,
      catTips: scenarioTemplate.catTips
    });
  }

  // 3. Sosial: 20 Soal (Numbers 116 to 135)
  result.push(ref4);

  for (let num = 117; num <= 135; num++) {
    const scenarioTemplate = SOCIAL_SCENARIOS[(num + dateStr.charCodeAt(0)) % SOCIAL_SCENARIOS.length];
    
    const student = STUDENT_NAMES[(num + dateStr.charCodeAt(1)) % STUDENT_NAMES.length];
    const room = ROOMS[(num + dateStr.charCodeAt(2)) % ROOMS.length];
    const dorm = DORM_NAMES[(num + dateStr.charCodeAt(3)) % DORM_NAMES.length];
    const staff = STAFF_NAMES[(num + dateStr.charCodeAt(0)) % STAFF_NAMES.length];

    const questionText = scenarioTemplate.text
      .replace(/{student}/g, student)
      .replace(/{room}/g, room)
      .replace(/{dorm}/g, dorm)
      .replace(/{staff}/g, staff);

    const formattedOptions = scenarioTemplate.options.map((opt, oIdx) => {
      const keys: ('A'|'B'|'C'|'D'|'E')[] = ['A', 'B', 'C', 'D', 'E'];
      return {
        key: keys[oIdx],
        text: opt.text.replace(/{student}/g, student).replace(/{room}/g, room).replace(/{dorm}/g, dorm).replace(/{staff}/g, staff),
        score: opt.score
      };
    });

    result.push({
      dateStr,
      number: num,
      category: 'sosial',
      topic: scenarioTemplate.topic,
      questionText: `[SKB CAT BKN - Soal #${num}] ${questionText}`,
      options: formattedOptions,
      correctAnswer: scenarioTemplate.correctAnswer as any,
      explanation: scenarioTemplate.explanation,
      competency: scenarioTemplate.competency,
      berakhlak: scenarioTemplate.berakhlak,
      psychologyBasis: scenarioTemplate.psychologyBasis,
      catTips: scenarioTemplate.catTips
    });
  }

  // 4. Wawancara: 10 Soal (Numbers 136 to 145)
  result.push(ref5);

  for (let num = 137; num <= 145; num++) {
    const scenarioTemplate = INTERVIEW_SCENARIOS[(num + dateStr.charCodeAt(0)) % INTERVIEW_SCENARIOS.length];
    
    const student = STUDENT_NAMES[(num + dateStr.charCodeAt(1)) % STUDENT_NAMES.length];
    const room = ROOMS[(num + dateStr.charCodeAt(2)) % ROOMS.length];
    const dorm = DORM_NAMES[(num + dateStr.charCodeAt(3)) % DORM_NAMES.length];
    const staff = STAFF_NAMES[(num + dateStr.charCodeAt(0)) % STAFF_NAMES.length];

    const questionText = scenarioTemplate.text
      .replace(/{student}/g, student)
      .replace(/{room}/g, room)
      .replace(/{dorm}/g, dorm)
      .replace(/{staff}/g, staff);

    const formattedOptions = scenarioTemplate.options.map((opt, oIdx) => {
      const keys: ('A'|'B'|'C'|'D'|'E')[] = ['A', 'B', 'C', 'D', 'E'];
      return {
        key: keys[oIdx],
        text: opt.text.replace(/{student}/g, student).replace(/{room}/g, room).replace(/{dorm}/g, dorm).replace(/{staff}/g, staff),
        score: opt.score
      };
    });

    result.push({
      dateStr,
      number: num,
      category: 'wawancara',
      topic: scenarioTemplate.topic,
      questionText: `[SKB CAT BKN - Soal #${num}] ${questionText}`,
      options: formattedOptions,
      correctAnswer: scenarioTemplate.correctAnswer as any,
      explanation: scenarioTemplate.explanation,
      competency: scenarioTemplate.competency,
      berakhlak: scenarioTemplate.berakhlak,
      psychologyBasis: scenarioTemplate.psychologyBasis,
      catTips: scenarioTemplate.catTips
    });
  }

  // Sort by number asc before returning
  return result.sort((a, b) => (a.number || 0) - (b.number || 0));
}
