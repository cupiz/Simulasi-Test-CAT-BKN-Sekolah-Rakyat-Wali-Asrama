import { Question, QuestionOption } from '../types';
import { REFERENCE_QUESTIONS } from '../data/questions';

const TECHNICAL_TOPICS = [
  'Homesick', 'Bullying', 'Konseling', 'Perlindungan Anak', 'NAPZA', 'Kekerasan', 'Disiplin',
  'Konflik', 'Keamanan', 'Bencana', 'Etika', 'Media Sosial', 'Psikologi Remaja', 'Character Building',
  'Parenting', 'Komunikasi', 'Empati', 'Problem Solving', 'SOP Asrama', 'Budaya Sekolah'
];

const MANAGERIAL_TOPICS = [
  'Leadership', 'Planning', 'Integrity', 'Teamwork', 'Innovation', 'Decision Making', 'Service',
  'Collaboration', 'Strategic Thinking'
];

const SOCIAL_TOPICS = [
  'Budaya', 'Agama', 'Disabilitas', 'Gender', 'Inklusif', 'Moderasi', 'Pancasila', 'SARA'
];

const INTERVIEW_TOPICS = [
  'Integritas', 'Loyalitas', 'Anti Korupsi', 'Komitmen', 'ASN BerAKHLAK'
];

const CASE_SCENARIOS = [
  'Siswa melaporkan kecemasan tinggi menjelang ujian akhir tahun di Sekolah Rakyat.',
  'Ditemukan kasus perundungan verbal di lorong asrama laki-laki saat jam makan malam.',
  'Terjadi kerusakan fasilitas air bersih di gedung asrama utama secara tiba-tiba.',
  'Siswa senior memaksa junior memberikan jatah makanan tambahan mereka.',
  'Wali Asrama mendeteksi adanya penggunaan media sosial secara berlebih hingga larut malam.',
  'Seorang siswa baru mengalami stres berat akibat kesulitan beradaptasi dengan budaya lokal.',
  'Ditemukan indikasi barang terlarang disimpan di dalam lemari pakaian siswa.',
  'Siswa menolak berpartisipasi dalam kerja bakti asrama dengan alasan ingin belajar mandiri.',
  'Terjadi perbedaan pendapat tajam mengenai tema dekorasi ruang ibadah bersama.',
  'Siswa asrama ketahuan mencoret-coret fasilitas umum sekolah rakyat.'
];

export function generateDailyQuestions(dateStr: string): Question[] {
  const result: Question[] = [];

  // Add the 5 reference questions as the base for numbers 1, 2, 3 (Teknis), 116 (Sosial), and 136 (Wawancara)
  // We map them to today's date Str and proper numbers
  const ref1 = { ...REFERENCE_QUESTIONS[0], dateStr, number: 1 };
  const ref2 = { ...REFERENCE_QUESTIONS[1], dateStr, number: 2 };
  const ref3 = { ...REFERENCE_QUESTIONS[2], dateStr, number: 3 };
  const ref4 = { ...REFERENCE_QUESTIONS[3], dateStr, number: 116 };
  const ref5 = { ...REFERENCE_QUESTIONS[4], dateStr, number: 136 };

  // 1. Technical: 90 Soal (Numbers 1 to 90)
  // 1, 2, 3 are reference questions
  result.push(ref1, ref2, ref3);

  for (let num = 4; num <= 90; num++) {
    const topic = TECHNICAL_TOPICS[(num + dateStr.charCodeAt(0)) % TECHNICAL_TOPICS.length];
    const scenario = CASE_SCENARIOS[(num + dateStr.charCodeAt(1)) % CASE_SCENARIOS.length];
    
    result.push({
      dateStr,
      number: num,
      category: 'teknis',
      topic,
      questionText: `[Studi Kasus Harian - ${dateStr} - Soal #${num}] ${scenario} Sebagai Wali Asrama, keputusan operasional apa yang paling mendidik karakter siswa terkait isu ${topic.toLowerCase()} ini?`,
      options: [
        { key: 'A', text: `Melaporkan peristiwa tersebut ke kepala pengasuh asrama untuk memberikan surat peringatan formal agar situasi segera kondusif.`, score: 2 },
        { key: 'B', text: `Melakukan pendekatan konseling personal dua arah, mendengarkan latar belakang masalah secara objektif, dan menyusun program restoratif partisipatif.`, score: 5 },
        { key: 'C', text: `Mengabaikan laporan sementara waktu untuk memberi kesempatan bagi para siswa menyelesaikan konflik secara mandiri di asrama.`, score: 1 },
        { key: 'D', text: `Membuat pengumuman umum pada apel pagi untuk mengingatkan kewajiban mematuhi aturan asrama Sekolah Rakyat secara menyeluruh.`, score: 3 },
        { key: 'E', text: `Memindahkan siswa yang berkonflik ke sayap gedung asrama yang berbeda untuk menghindari gesekan fisik lebih lanjut secara instan.`, score: 4 }
      ],
      correctAnswer: 'B',
      explanation: `Dalam menyelesaikan kasus ${topic.toLowerCase()} harian ini, pilihan B adalah yang terbaik karena mengedepankan dialog konseling personal yang terarah. Menggali latar belakang masalah secara empatik menghindarkan wali asrama dari keputusan yang bias dan represif.\n\nMengapa A kurang tepat: Penegakan surat peringatan instan tanpa konfirmasi personal berisiko memicu ketidakpercayaan siswa terhadap wali asrama.\nMengapa C kurang tepat: Pembiaran masalah sensitif di asrama dapat meningkatkan ketegangan dan berujung pada tindakan bullying.\nMengapa D kurang tepat: Pengumuman massal kurang efektif dalam menyentuh akar permasalahan personal individu yang berkonflik.\nMengapa E kurang tepat: Memisahkan kamar secara reaktif menyelesaikan gejala konflik di permukaan namun tidak melatih keterampilan resolusi masalah siswa.`,
      competency: `Fokus Harian: ${topic} - Pembinaan Karakter Asrama`,
      berakhlak: 'Kolaboratif',
      psychologyBasis: 'Conflict Resolution Theory (Thomas-Kilmann) dan Teori Konseling Humanistik Carl Rogers.',
      catTips: 'Pilih jawaban yang mengedepankan pemecahan masalah dengan konseling personal, empati, dan gotong-royong.'
    });
  }

  // 2. Managerial: 25 Soal (Numbers 91 to 115)
  for (let num = 91; num <= 115; num++) {
    const topic = MANAGERIAL_TOPICS[(num + dateStr.charCodeAt(0)) % MANAGERIAL_TOPICS.length];
    result.push({
      dateStr,
      number: num,
      category: 'manajerial',
      topic,
      questionText: `[Studi Kasus Harian - ${dateStr} - Soal #${num}] Anda sebagai Koordinator Wali Asrama dihadapkan pada situasi di mana koordinasi pembagian tugas jaga malam tidak berjalan optimal akibat isu ${topic.toLowerCase()}. Tindakan manajerial yang paling tepat untuk mengoptimalkan kinerja tim adalah...`,
      options: [
        { key: 'A', text: `Mengambil alih seluruh tugas jaga malam secara mandiri demi membuktikan komitmen kepemimpinan Anda kepada bawahan.`, score: 2 },
        { key: 'B', text: `Merancang ulang jadwal piket secara partisipatif bersama seluruh staf, menetapkan indikator kinerja yang jelas, dan menggunakan aplikasi pelacakan realtime.`, score: 5 },
        { key: 'C', text: `Melaporkan staf yang kurang aktif kepada manajemen HRD agar segera diberikan sanksi administratif atau pemotongan insentif.`, score: 3 },
        { key: 'D', text: `Membiarkan sistem berjalan apa adanya dan berharap kesadaran internal masing-masing staf akan tumbuh seiring berjalannya waktu.`, score: 1 },
        { key: 'E', text: `Menyewa jasa keamanan eksternal (outsourcing) untuk menggantikan peran wali asrama dalam menjaga keamanan malam hari.`, score: 4 }
      ],
      correctAnswer: 'B',
      explanation: `Pilihan B merepresentasikan aspek kepemimpinan demokratis dan perencanaan strategis (${topic}). Dengan melibatkan tim secara partisipatif, komitmen kerja akan meningkat. Penentuan Key Performance Indicators (KPI) dan digitalisasi pelacakan memastikan akuntabilitas operasional asrama secara transparan.\n\nMengapa A salah: Mengambil alih semua tugas adalah micromanagement yang merusak kemandirian tim.\nMengapa C salah: Tindakan represif langsung melapor ke HRD menciptakan iklim kerja yang tidak sehat dan penuh ketakutan.\nMengapa D salah: Pembiaran operasional membahayakan keselamatan fisik siswa di asrama.\nMengapa E salah: Mengalihkan tugas utama ke pihak ketiga menghilangkan esensi pengasuhan dan pembinaan karakter oleh wali asrama.`,
      competency: `Kompetensi Manajerial - Manajemen Tim & Perencanaan Strategis`,
      berakhlak: 'Akuntabel',
      psychologyBasis: 'Goal-Setting Theory (Locke & Latham) dan Path-Goal Theory of Leadership.',
      catTips: 'Pilihlah jawaban yang berorientasi pada pemecahan masalah secara kolaboratif, transparansi, dan sistematis.'
    });
  }

  // 3. Sosial: 20 Soal (Numbers 116 to 135)
  // 116 is reference question ref4
  result.push(ref4);

  for (let num = 117; num <= 135; num++) {
    const topic = SOCIAL_TOPICS[(num + dateStr.charCodeAt(0)) % SOCIAL_TOPICS.length];
    result.push({
      dateStr,
      number: num,
      category: 'sosial',
      topic,
      questionText: `[Studi Kasus Harian - ${dateStr} - Soal #${num}] Dalam pergaulan di asrama Sekolah Rakyat, terdapat perbedaan pandangan yang tajam antar-siswa mengenai isu ${topic.toLowerCase()} yang memicu ketegangan di ruang makan. Langkah preventif dan edukatif yang harus Anda ambil adalah...`,
      options: [
        { key: 'A', text: `Melarang segala bentuk diskusi yang menyinggung perbedaan latar belakang di lingkungan asrama demi stabilitas keamanan.`, score: 2 },
        { key: 'B', text: `Mengadaan forum dialog interaktif berkala (pojok kebangsaan) yang memfasilitasi pertukaran budaya secara inklusif dan aman.`, score: 5 },
        { key: 'C', text: `Meminta siswa yang memicu perdebatan untuk pindah ke asrama lain agar tidak memengaruhi keharmonisan siswa lainnya.`, score: 1 },
        { key: 'D', text: `Menyerahkan penyelesaian konflik kepada perwakilan pengurus siswa agar mereka belajar mengatasi isu sosial secara mandiri.`, score: 3 },
        { key: 'E', text: `Mengharuskan semua siswa mengikuti ritual budaya tertentu secara seragam untuk menghilangkan perbedaan identitas mereka.`, score: 4 }
      ],
      correctAnswer: 'B',
      explanation: `Pilihan B adalah yang terbaik karena mempromosikan moderasi, inklusivitas, dan dialog konstruktif mengenai ${topic.toLowerCase()}. Melarang diskusi (opsi A) hanya akan meredam konflik di permukaan, sementara melatih siswa berdialog di bawah bimbingan (opsi B) membangun kompetensi kultural mereka.\n\nMengapa A salah: Sensor ketat justru menyuburkan prasangka tersembunyi yang berisiko meledak sewaktu-waktu.\nMengapa C salah: Memindahkan siswa adalah langkah pembuangan masalah yang tidak mendidik karakter toleransi.\nMengapa D salah: Isu sensitif SARA memerlukan bimbingan orang dewasa agar tidak melebar menjadi konflik fisik.\nMengapa E salah: Asimilasi paksa melanggar hak kebebasan berekspresi dan keberagaman kebinekaan.`,
      competency: `Kompetensi Sosial Kultural - Toleransi & Inklusivitas`,
      berakhlak: 'Harmonis',
      psychologyBasis: 'Teori Konstruktivisme Sosial Vygotsky dan Teori Pengurangan Prasangka (Allport).',
      catTips: 'Pilihlah jawaban yang merayakan keberagaman secara aman dan mendidik toleransi aktif, bukan homogenisasi paksa.'
    });
  }

  // 4. Wawancara: 10 Soal (Numbers 136 to 145)
  // 136 is reference question ref5
  result.push(ref5);

  for (let num = 137; num <= 145; num++) {
    const topic = INTERVIEW_TOPICS[(num + dateStr.charCodeAt(0)) % INTERVIEW_TOPICS.length];
    result.push({
      dateStr,
      number: num,
      category: 'wawancara',
      topic,
      questionText: `[Studi Kasus Harian - ${dateStr} - Soal #${num}] Dalam wawancara seleksi ASN Wali Asrama, Anda ditanya: "Bagaimana sikap Anda jika dihadapkan pada konflik kepentingan terkait isu ${topic.toLowerCase()} di antara staf asrama?"`,
      options: [
        { key: 'A', text: `Mengabaikan hal tersebut karena menganggap itu adalah urusan pribadi rekan kerja dan bukan wewenang Anda.`, score: 1 },
        { key: 'B', text: `Menegur rekan kerja tersebut secara pribadi, mengingatkan komitmen integritas ASN, dan melaporkan temuan disertai bukti ke komite etik asrama.`, score: 5 },
        { key: 'C', text: `Meminta bagian dari komisi tersebut agar pembagian keuntungan dirasakan secara adil oleh seluruh staf asrama.`, score: 2 },
        { key: 'D', text: `Membicarakan perilaku rekan kerja tersebut kepada wali murid lainnya agar mereka mengetahui ketidakadilan yang terjadi.`, score: 3 },
        { key: 'E', text: `Menyarankan rekan kerja tersebut untuk menyamarkan penerimaan hadiah agar tidak diketahui oleh manajemen sekolah.`, score: 4 }
      ],
      correctAnswer: 'B',
      explanation: `Pilihan B menunjukkan integritas tinggi (${topic}) sesuai nilai Core Values ASN BerAKHLAK (Akuntabel). ASN harus berani menolak korupsi/gratifikasi dan aktif menjaga marwah institusi dengan melaporkan tindakan pelanggaran integritas melalui saluran resmi sekolah.\n\nMengapa A salah: Bersikap permisif terhadap korupsi menjadikannya complicit (terlibat secara tidak langsung).\nMengapa C salah: Ikut menerima gratifikasi adalah tindakan pelanggaran pidana korupsi yang fatal.\nMengapa D salah: Menyebarkan gosip ke wali murid merusak reputasi sekolah secara umum tanpa menyelesaikan masalah.\nMengapa E salah: Membantu menyembunyikan kejahatan melanggar kode etik kedisiplinan PNS/ASN.`,
      competency: `Kompetensi Wawancara - Integritas & Anti-Korupsi`,
      berakhlak: 'Akuntabel',
      psychologyBasis: 'Teori Perkembangan Moral Kohlberg (Tahap Prinsip Etika Universal).',
      catTips: 'Pilihlah jawaban yang menolak keras segala bentuk gratifikasi secara transparan, berintegritas, dan prosedural.'
    });
  }

  // Sort by number asc before returning
  return result.sort((a, b) => (a.number || 0) - (b.number || 0));
}
