import { Question, QuestionOption } from '../types';

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
  'Wali Asrama mendapati bahwa salah satu siswa di lorong B mengalami konflik interpersonal terkait pembagian jadwal kebersihan kamar mandi. Siswa tersebut menolak bekerja sama karena merasa hak privasinya terganggu.',
  'Saat razia berkala di loker siswa, ditemukan indikasi pelanggaran tata tertib asrama di mana seorang siswa senior menyimpan perangkat elektronik tanpa izin tertulis dari koordinator pengasuh.',
  'Seorang siswa junior mengadukan bahwa dirinya merasa tidak nyaman dengan gaya becandaan teman sekamarnya yang sering menyinggung logat daerah asalnya saat jam istirahat malam.',
  'Terjadi pemadaman listrik darurat di lingkungan asrama yang memicu kepanikan massal di antara para siswa baru kelas VII yang belum terbiasa dengan lingkungan gelap.',
  'Wali Asrama melihat adanya penurunan motivasi belajar secara drastis pada siswa berprestasi yang diduga kuat mengalami tekanan akademis berlebih (burnout) menjelang ujian akhir.'
];

export function generateDailyQuestions(dateStr: string, startId: number): Question[] {
  const categories: ('teknis' | 'manajerial' | 'sosial' | 'wawancara')[] = ['teknis', 'manajerial', 'sosial', 'wawancara', 'teknis'];
  
  return categories.map((category, index) => {
    const id = startId + index;
    const topics = COMPONENT_TOPICS[category];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const baseCase = CASE_TEMPLATES[Math.floor(Math.random() * CASE_TEMPLATES.length)];

    const questionText = `[Studi Kasus Harian - ${dateStr}] ${baseCase} Sebagai Wali Asrama Sekolah Rakyat, tindakan pembinaan apa yang paling tepat dan mencerminkan nilai integritas serta keadilan kelompok untuk menangani kasus ini?`;

    const options: QuestionOption[] = [
      { key: 'A', text: `Melaporkan peristiwa tersebut ke kepala pengasuh asrama untuk memberikan surat peringatan formal agar situasi segera terkendali.`, score: 2 },
      { key: 'B', text: `Melakukan pendekatan konseling personal dua arah, mendengarkan latar belakang masalah secara objektif, dan menyusun program restoratif partisipatif.`, score: 5 },
      { key: 'C', text: `Mengabaikan laporan sementara waktu untuk memberi kesempatan bagi para siswa menyelesaikan konflik secara mandiri di asrama.`, score: 1 },
      { key: 'D', text: `Membuat pengumuman umum pada apel pagi untuk mengingatkan kewajiban mematuhi aturan asrama Sekolah Rakyat secara menyeluruh.`, score: 3 },
      { key: 'E', text: `Memindahkan siswa yang berkonflik ke sayap gedung asrama yang berbeda untuk menghindari gesekan fisik lebih lanjut secara instan.`, score: 4 }
    ];

    return {
      id,
      category,
      topic,
      questionText,
      options,
      correctAnswer: 'B',
      explanation: `Dalam menyelesaikan kasus ${topic.toLowerCase()} harian ini, pilihan B adalah yang terbaik karena mengedepankan dialog konseling personal yang terarah. Menggali latar belakang masalah secara empatik menghindarkan wali asrama dari keputusan yang bias dan represif.\n\nMengapa A kurang tepat: Penegakan surat peringatan instan tanpa konfirmasi personal berisiko memicu ketidakpercayaan siswa terhadap wali asrama.\nMengapa C kurang tepat: Pembiaran masalah sensitif di asrama dapat meningkatkan ketegangan dan berujung pada tindakan bullying.\nMengapa D kurang tepat: Pengumuman massal kurang efektif dalam menyentuh akar permasalahan personal individu yang berkonflik.\nMengapa E kurang tepat: Memisahkan kamar secara reaktif menyelesaikan gejala konflik di permukaan namun tidak melatih keterampilan resolusi masalah siswa.`,
      competency: `Fokus Harian: ${topic} - Pembinaan Karakter Asrama`,
      berakhlak: category === 'wawancara' ? 'Akuntabel' : category === 'sosial' ? 'Harmonis' : 'Kolaboratif',
      psychologyBasis: 'Conflict Resolution Theory (Thomas-Kilmann) dan Teori Konseling Humanistik Carl Rogers.',
      catTips: 'Pilih jawaban yang mengedepankan pemecahan masalah dengan konseling personal, empati, dan gotong-royong.'
    };
  });
}
