import { Question } from '../types';

// The 5 reference questions from images transcribed exactly
export const REFERENCE_QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'teknis',
    topic: 'Homesick',
    questionText: 'Sebagai Wali Asrama Sekolah Rakyat, Anda mendapati bahwa Danis sering terlambat mengikuti apel pagi karena ia kerap terjaga hingga larut malam demi menemani dan menenangkan teman sekamarnya yang sedang mengalami kecemasan hebat akibat rindu rumah (homesick). Di sisi lain, anggota kamar yang lain mulai merasa kurang nyaman karena poin kedisiplinan kamar mereka menurun akibat keterlambatan Danis yang berulang. Langkah pembinaan karakter dan penataan operasional yang paling bijaksana untuk menyelesaikan dinamika tersebut adalah...',
    options: [
      { key: 'A', text: 'Memberikan penghargaan kepada kamar lain yang selalu tepat waktu agar menjadi contoh nyata bagi Danis dan teman kamarnya untuk memperbaiki manajemen waktu.', score: 2 },
      { key: 'B', text: 'Mengadakan kelas manajemen waktu dan regulasi emosi bagi seluruh penghuni asrama agar setiap individu mampu menyeimbangkan empati dan kedisiplinan.', score: 3 },
      { key: 'C', text: 'Melakukan pemindahan Danis ke kamar khusus yang diisi oleh para pengurus asrama agar ia mendapatkan bimbingan intensif mengenai pembagian skala prioritas.', score: 1 },
      { key: 'D', text: 'Memfasilitasi diskusi kamar untuk mengapresiasi empati Danis, sekaligus merancang bersama sistem dukungan bergantian bagi siswa yang cemas agar tanggung jawab kepedulian dipikul bersama.', score: 5 },
      { key: 'E', text: 'Menjadwalkan sesi konseling personal bagi Danis dan siswa yang cemas tersebut guna menguatkan ketahanan mental serta kemandirian mereka selama di asrama.', score: 4 }
    ],
    correctAnswer: 'D',
    explanation: 'Pilihan D adalah solusi terbaik karena mengedepankan pendekatan kolaboratif dan gotong royong yang menjadi ciri khas Sekolah Rakyat. Di asrama, kebersamaan dan empati adalah nilai luhur yang perlu ditumbuhkan, namun tidak boleh mengorbankan kedisiplinan kelompok. Dengan memfasilitasi diskusi kamar untuk mengapresiasi empati Danis, asisten/wali asrama mengakui tindakan baik tersebut, sekaligus memberdayakan anggota kamar lainnya untuk ikut peduli dengan membuat jadwal dukungan bergantian (peer-support system). Hal ini memecah beban agar tidak menumpuk di Danis saja, mengembalikan kedisiplinan kamar, dan mengajarkan tanggung jawab sosial kepada semua siswa.\n\nMengapa A kurang tepat: Memberikan penghargaan ke kamar lain tidak menyelesaikan masalah kecemasan homesick siswa tersebut dan berisiko menciptakan kecemburuan sosial tanpa menyelesaikan konflik internal kamar Danis.\n\nMengapa B kurang tepat: Terlalu umum dan tidak langsung menyasar akar konflik operasional dan kecemasan spesifik yang terjadi saat itu di kamar tersebut.\n\nMengapa C kurang tepat: Pemindahan Danis bersifat memisahkan/mengisolasi masalah (reaktif) dan tidak mendidik anggota kamar lainnya untuk memiliki empati, serta bisa memberi kesan hukuman kepada Danis yang berniat baik.\n\nMengapa E kurang tepat: Sesi konseling personal sangat baik untuk aspek psikologis individu, namun belum menyelesaikan konflik operasional poin kedisiplinan kamar yang menurun akibat beban empati yang tidak merata.',
    competency: 'SOP Asrama, Resolusi Konflik, dan Karakter Kebangsaan (Gotong Royong).',
    berakhlak: 'Harmonis (saling peduli dan menghargai perbedaan) & Kolaboratif (membangun kerja sama yang sinergis).',
    psychologyBasis: 'Social Support Theory (Teori Dukungan Sosial) dan Peer-Assisted Learning/Support Systems. Tekanan emosional homesick diatasi secara komunal guna membangun resiliensi kelompok.',
    catTips: 'Cari jawaban yang tidak sekadar menerapkan sanksi atau memisahkan siswa, melainkan jawaban yang memberdayakan ekosistem asrama untuk menyelesaikan masalah secara bersama-sama.'
  },
  {
    id: 2,
    category: 'teknis',
    topic: 'SOP Asrama',
    questionText: 'Pada saat kegiatan kerja bakti berkala membersihkan lingkungan asrama Sekolah Rakyat, Anda melihat Galih sedang membaca buku di sudut gazebo yang tenang. Ketika Anda mendekatinya, Galih menjelaskan dengan sangat sopan bahwa ia ingin memaksimalkan waktu luangnya untuk mempersiapkan diri menghadapi kompetisi sains tingkat nasional yang akan berlangsung minggu depan. Teman-teman sebayanya mulai menggerutu, namun mereka tetap melanjutkan pekerjaan mereka. Tindakan pembinaan yang paling tepat untuk mengarahkan perilaku Galih adalah...',
    options: [
      { key: 'A', text: 'Meminta Galih untuk memimpin doa dan memberikan evaluasi di akhir kegiatan kerja bakti sebagai wujud kontribusi kepemimpinan bagi asrama.', score: 2 },
      { key: 'B', text: 'Mengajak Galih berdialog mengenai esensi keseimbangan antara prestasi akademis dan kontribusi sosial, lalu membimbingnya meluangkan waktu sejenak untuk membantu teman-temannya.', score: 5 },
      { key: 'C', text: 'Memfasilitasi forum musyawarah asrama untuk merumuskan dispensasi khusus yang legal bagi siswa yang sedang bersiap menghadapi kompetisi penting.', score: 3 },
      { key: 'D', text: 'Memberikan apresiasi atas kegigihan belajar Galih di depan umum, serta memotivasi siswa lain untuk meniru semangat belajarnya di waktu yang tepat.', score: 1 },
      { key: 'E', text: 'Mengarahkan Galih untuk mengganti kontribusi fisiknya dengan membuat rangkuman materi pelajaran yang bermanfaat bagi seluruh penghuni asrama.', score: 4 }
    ],
    correctAnswer: 'B',
    explanation: 'Pilihan B adalah yang terbaik karena menyentuh ranah kognitif dan afektif melalui dialog empatik. Sebagai Wali Asrama, penting untuk membina pemahaman Galih tentang pentingnya keseimbangan (balance) antara kesuksesan akademik individu dan kepedulian terhadap lingkungan sosial (komunitas asrama). Dengan mengajaknya berdialog, Galih dibimbing menyadari bahwa kebersamaan dan kerja bakti adalah nilai integritas sosial, lalu ia secara sadar didorong untuk meluangkan sedikit waktu guna membantu temannya. Ini menjaga harmoni asrama dan mencegah kecemburuan sosial.\n\nMengapa A kurang tepat: Memberikan tugas memimpin doa di akhir tidak memecahkan masalah kemalasan/penghindaran kerja fisik Galih di mata teman-temannya, dan terkesan manipulatif.\n\nMengapa C kurang tepat: Membuat kebijakan dispensasi asrama adalah langkah operasional formal yang baik untuk jangka panjang, namun tidak menyelesaikan masalah pembinaan karakter Galih secara personal saat kegiatan berlangsung.\n\nMengapa D kurang tepat: Mengapresiasi Galih yang membolos kerja bakti di depan umum justru akan memicu kemarahan siswa lain yang bekerja keras, dan merusak nilai keadilan asrama.\n\nMengapa E kurang tepat: Mengganti kerja fisik dengan tugas akademik (rangkuman) bisa menjadi kompromi, tetapi kurang menanamkan nilai kebersamaan fisik dan gotong-royong secara langsung kepada Galih.',
    competency: 'Budaya Sekolah, Pembinaan Karakter Disiplin, dan Manajemen Konflik.',
    berakhlak: 'Harmonis (menjaga kedamaian komunitas) & Akuntabel (bertanggung jawab atas kewajiban sosial).',
    psychologyBasis: 'Social Identity Theory (Teori Identitas Sosial) dan perkembangan moral Kohlberg pada tahap pasca-konvensional, di mana individu menyadari pentingnya kontrak sosial dan kontribusi bagi kesejahteraan bersama.',
    catTips: 'Pilihlah opsi yang mendidik karakter siswa secara personal melalui dialog dua arah, bukan dengan hukuman langsung atau dispensasi yang merusak kebersamaan kelompok.'
  },
  {
    id: 3,
    category: 'teknis',
    topic: 'Leadership',
    questionText: 'Panji adalah seorang ketua organisasi siswa di asrama Sekolah Rakyat yang dikenal sangat disiplin. Namun, Anda memperhatikan bahwa dalam beberapa minggu terakhir, Panji cenderung menggunakan intonasi suara yang tinggi dan instruksi yang kaku saat menegakkan tata krama makan di aula asrama kepada para siswa junior. Meskipun para junior patuh, suasana makan menjadi tegang. Rekan sesama pengurus menyatakan bahwa metode Panji efektif untuk menjaga keteraturan. Sikap Anda sebagai Wali Asrama untuk membina karakter kepemimpinan Panji adalah...',
    options: [
      { key: 'A', text: 'Melakukan rotasi berkala posisi pengurus asrama agar terjadi penyegaran gaya komunikasi di lingkungan ruang makan.', score: 2 },
      { key: 'B', text: 'Mengadakan pelatihan etika komunikasi publik bagi seluruh pengurus asrama guna meningkatkan kompetensi berbicara mereka.', score: 3 },
      { key: 'C', text: 'Memberikan pujian kepada Panji atas kedisplinannya, disertai saran tertulis mengenai variasi metode penegakan aturan yang lebih persuasif.', score: 4 },
      { key: 'D', text: 'Menghadiri setiap sesi makan malam secara langsung untuk memberikan teladan nyata mengenai cara menegur yang ramah dan menyejukkan.', score: 1 },
      { key: 'E', text: 'Membimbing Panji melalui bimbingan personal mengenai konsep kepemimpinan yang mengayomi, serta mengajaknya merancang metode penegakan tata krama berbasis keteladan bersama.', score: 5 }
    ],
    correctAnswer: 'E',
    explanation: 'Pilihan E adalah solusi pembinaan kepemimpinan yang paling utuh. Panji memiliki niat baik (disiplin) tetapi menggunakan metode kepemimpinan yang otoriter dan menciptakan atmosfer ketakutan. Sebagai Wali Asrama, pembinaan kepemimpinan terbaik dilakukan lewat bimbingan personal (one-on-one coaching) untuk menanamkan esensi kepemimpinan yang mengayomi (servant leadership). Mengajak Panji merancang tata krama asrama berbasis keteladanan (role modeling) mengajarkannya bahwa kepatuhan sejati lahir dari rasa hormat dan inspirasi, bukan intimidasi.\n\nMengapa A kurang tepat: Melakukan rotasi mendadak tanpa pembinaan personal tidak menyelesaikan akar masalah gaya komunikasi Panji, dan bisa mendemotivasi dirinya sebagai pengurus.\n\nMengapa B kurang tepat: Pelatihan umum berguna tetapi terlalu luas dan tidak menyasar kasus perilaku spesifik Panji secara mendalam.\n\nMengapa C kurang tepat: Saran tertulis kurang efektif dibandingkan dialog tatap muka interaktif dalam membentuk karakter kepemimpinan seorang remaja.\n\nMengapa D kurang tepat: Wali Asrama hadir di setiap sesi makan malam sebagai teladan adalah hal baik, tetapi itu memindahkan tanggung jawab penegakan aturan dari tangan pengurus siswa ke pengelola, yang mengurangi kemandirian kepemimpinan siswa.',
    competency: 'Kepemimpinan (Leadership), Etika Komunikasi, dan Pembinaan Karakter.',
    berakhlak: 'Berorientasi Pelayanan (memberikan pengayoman kepada junior) & Harmonis (menciptakan suasana nyaman).',
    psychologyBasis: 'Servant Leadership Theory (Greenleaf) dan Transformational Leadership, di mana pemimpin menginspirasi pengikut untuk mencapai tujuan bersama dalam suasana saling menghargai.',
    catTips: 'Carilah opsi yang memberikan bimbingan langsung kepada pelaku (coaching) serta berfokus pada kolaborasi jangka panjang untuk mengubah metode penegakan aturan yang kaku menjadi persuasif.'
  },
  {
    id: 4,
    category: 'sosial',
    topic: 'Budaya',
    questionText: 'Dalam rapat persiapan festival budaya asrama Sekolah Rakyat, suasana menjadi hangat dan menjurus pada perdebatan sengit. Kelompok siswa yang berasal dari wilayah Sumatera, Jawa, dan Indonesia Timur bersikeras bahwa kebudayaan asli daerah merekalah yang harus menjadi tema utama dan pementasan pembuka festival. Masing-masing pihak merasa daerahnya memiliki nilai filosofis yang paling tinggi. Langkah Anda selaku Wali Asrama untuk menanamkan karakter kebangsaan dan menghargai sesama adalah...',
    options: [
      { key: 'A', text: 'Merancang kolaborasi pertunjukan drama musikal yang memadukan unsur-unsur cerita rakyat dari seluruh daerah tersebut ke dalam satu kesatuan pentas yang utuh.', score: 5 },
      { key: 'B', text: 'Menetapkan tema festival secara mandiri dari pihak pengelola asrama untuk menjaga netralitas dan kedamaian di antara kelompok siswa.', score: 2 },
      { key: 'C', text: 'Memberikan waktu tambahan bagi setiap kelompok untuk berlatih secara terpisah demi menampilkan performa terbaik mereka masing-masing.', score: 3 },
      { key: 'D', text: 'Mengundang tokoh budayawan nasional untuk memberikan ceramah intensif mengenai indahnya keberagaman dan persatuan bangsa kepada seluruh siswa.', score: 4 },
      { key: 'E', text: 'Menyediakan panggung yang sama luas dan durasi yang sama persis bagi setiap daerah agar asas keadilan terpenuhi secara nyata.', score: 1 }
    ],
    correctAnswer: 'A',
    explanation: 'Pilihan A adalah manifestasi nyata dari integrasi nasional dan kebinekaan global. Di Sekolah Rakyat yang mengusung nilai persatuan, kompetisi kedaerahan yang berlebihan harus diubah menjadi kolaborasi yang harmonis. Melalui drama musikal kolaboratif yang menggabungkan kisah Sumatera, Jawa, dan Indonesia Timur, siswa didorong untuk bekerja sama secara erat, mempelajari budaya rekan mereka, dan menyadari bahwa keindahan sejati Indonesia terletak pada perpaduan budaya tersebut (Bhineka Tunggal Ika), bukan keunggulan satu daerah atas daerah lain.\n\nMengapa B kurang tepat: Keputusan sepihak dari asrama memang meredakan debat, tetapi merampas kesempatan siswa untuk belajar memecahkan konflik perbedaan pendapat dan berkolaborasi secara inklusif.\n\nMengapa C kurang tepat: Membiarkan mereka berlatih terpisah justru mempertebal sekat-sekat eksklusivitas kedaerahan (siloing) di asrama.\n\nMengapa D kurang tepat: Ceramah budayawan nasional memberikan wawasan teoretis yang sangat baik, namun tindakan nyata berkolaborasi (opsi A) jauh lebih berbekas dalam membentuk karakter gotong royong.\n\nMengapa E kurang tepat: Memberikan panggung terpisah yang adil secara durasi/luas sekadar memenuhi aspek teknis keadilan administratif, namun gagal menyatukan interaksi sosial dan emosional antarkelompok siswa.',
    competency: 'Keberagaman (Diversity), Inklusivitas, dan Kerja Sama (Collaboration).',
    berakhlak: 'Harmonis (menghargai setiap orang apapun latar belakangnya) & Kolaboratif (membangun kerja sama yang sinergis).',
    psychologyBasis: 'Contact Hypothesis (Allport) yang menyatakan bahwa prasangka dan konflik antar-kelompok dapat direduksi melalui kerja sama yang setara demi mencapai tujuan bersama.',
    catTips: 'Pilih solusi yang melebur perbedaan menjadi satu karya kolaboratif bersama (integrasi), bukan membagi panggung secara terpisah (segregasi) sekalipun terlihat adil.'
  },
  {
    id: 5,
    category: 'wawancara',
    topic: 'Integritas',
    questionText: 'Satria menemukan sebuah dompet berisi uang tunai dalam jumlah cukup besar di koridor asrama. Berdasarkan kartu identitas di dalamnya, dompet tersebut milik salah satu petugas kebersihan dapur asrama yang dikenal sedang kesulitan membiayai sekolah anaknya. Satria mengamankan dompet tersebut di lemarinya dan bermaksud mengembalikannya saat area dapur sepi karena ia merasa canggung. Di sisi lain, petugas kebersihan tersebut tampak sangat panik dan menangis di ruang utama. Tindakan Wali Asrama yang paling edukatif adalah...',
    options: [
      { key: 'A', text: 'Mengarahkan Satria untuk menyerahkan dompet tersebut melalui perantara pengurus asrama demi menjaga kenyamanan emosionalnya.', score: 2 },
      { key: 'B', text: 'Memberikan penghargaan atas niat baik Satria untuk mengembalikannya di hadapan seluruh penghuni asrama pada apel pagi.', score: 1 },
      { key: 'C', text: 'Mendampingi Satria secara personal untuk menyerahkan dompet itu langsung kepada pemiliknya sembari membimbingnya menyampaikan permohonan maaf atas keterlambatan pengembalian.', score: 5 },
      { key: 'D', text: 'Mengadakan forum refleksi massal mengenai pentingnya menjaga kejujuran dan kecepatan dalam mengembalikan hak milik sesama manusia.', score: 4 },
      { key: 'E', text: 'Menyimpan dompet tersebut di kantor asrama dan mengundang staf dapur untuk mengambilnya secara resmi agar suasana tetap kondusif.', score: 3 }
    ],
    correctAnswer: 'C',
    explanation: 'Pilihan C memiliki muatan edukasi karakter yang paling seimbang dan langsung menyentuh akar permasalahan. Satria memiliki nilai kejujuran (ingin mengembalikan dompet), tetapi ia kurang peka terhadap urgensi waktu dan penderitaan emosional pemilik dompet (yang menangis panik). Dengan mendampingi Satria secara personal, Wali Asrama memberikan rasa aman kepada Satria agar tidak merasa canggung, sekaligus mengajarkannya pelajaran moral penting: kejujuran harus dibarengi dengan empati yang cepat tanggap (urgency). Meminta maaf atas keterlambatan pengembalian melatih keberanian moral dan tanggung jawab atas dampak tindakannya.\n\nMengapa A kurang tepat: Menyerahkan lewat perantara pengurus menghilangkan kesempatan emas bagi Satria untuk belajar berempati langsung dan melatih tanggung jawab komunikasinya.\n\nMengapa B kurang tepat: Memberi penghargaan di apel pagi untuk tindakan pengembalian yang terlambat dan membuat orang lain menangis panik adalah langkah yang kurang bijaksana dan tidak mendidik sensitivitas sosial.\n\nMengapa D kurang tepat: Forum refleksi massal sangat baik secara umum, namun bagi kasus ini, tindakan personal mendampingi pengembalian langsung adalah prioritas mendesak untuk meredakan kepanikan korban.\n\nMengapa E kurang tepat: Penyerahan administratif di kantor asrama menyembunyikan proses moral yang bisa dipelajari Satria dan terkesan terlalu dingin tanpa muatan hubungan interpersonal.',
    competency: 'Integritas (Integrity), Empati (Empathy), dan Pengambilan Keputusan (Decision Making).',
    berakhlak: 'Akuntabel (memegang teguh kepercayaan) & Harmonis (saling menolong dan berempati).',
    psychologyBasis: 'Perspective-Taking Theory (Teori Pengambilan Perspektif) dan teori perkembangan sosial-emosional, di mana anak dilatih merasakan kecemasan orang lain dan bertindak proaktif untuk meringankannya.',
    catTips: 'Pilihlah opsi yang menggabungkan aspek kejujuran formal dengan pendidikan karakter empati dan tindakan nyata langsung kepada pihak yang membutuhkan bantuan.'
  }
];

// Let's create generators for additional questions to fill the 145 list
// distribution: 90 Teknis, 25 Manajerial, 20 Sosial, 10 Wawancara
// We already have:
// id 1: Teknis (Homesick)
// id 2: Teknis (SOP Asrama)
// id 3: Teknis (Leadership)
// id 4: Sosial (Budaya)
// id 5: Wawancara (Integritas)

// So we need:
// 87 more Teknis questions (id 6 to 92)
// 25 more Manajerial questions (id 93 to 117)
// 19 more Sosial questions (id 118 to 136)
// 9 more Wawancara questions (id 137 to 145)

const TECHNICAL_TOPICS = [
  'Bullying', 'Konseling', 'Perlindungan Anak', 'NAPZA', 'Kekerasan', 'Disiplin',
  'Konflik', 'Leadership', 'Keamanan', 'Bencana', 'Etika', 'Media Sosial',
  'Psikologi Remaja', 'Character Building', 'Parenting', 'Komunikasi',
  'Empati', 'Problem Solving', 'Organisasi Siswa', 'SOP Asrama', 'Budaya Sekolah',
  'Sekolah Rakyat', 'Nilai ASN'
];

const MANAGERIAL_TOPICS = [
  'Leadership', 'Planning', 'Integrity', 'Teamwork', 'Innovation',
  'Decision Making', 'Service', 'Collaboration', 'Strategic Thinking'
];

const SOCIAL_TOPICS = [
  'Budaya', 'Agama', 'Disabilitas', 'Gender', 'Inklusif', 'Moderasi',
  'Pancasila', 'SARA'
];

const INTERVIEW_TOPICS = [
  'Integritas', 'Loyalitas', 'Anti Korupsi', 'Komitmen', 'ASN BerAKHLAK'
];

// Seed templates
function generateDummyQuestions(): Question[] {
  const result: Question[] = [];
  
  // 1. Technical questions: id 6 to 92 (87 questions)
  for (let i = 6; i <= 92; i++) {
    const topic = TECHNICAL_TOPICS[(i - 6) % TECHNICAL_TOPICS.length];
    result.push({
      id: i,
      category: 'teknis',
      topic: topic,
      questionText: `[Studi Kasus Teknis: ${topic} - Seri ${Math.floor(i / 10) + 1}] Di asrama Sekolah Rakyat, terjadi dinamika di mana seorang siswa mengalami kendala terkait ${topic.toLowerCase()}. Sebagai Wali Asrama, langkah profesional apa yang paling sesuai dengan kaidah pembinaan karakter untuk menangani masalah ini?`,
      options: [
        { key: 'A', text: `Melaporkan langsung kepada Kepala Sekolah tanpa melakukan investigasi mendalam terlebih dahulu agar masalah cepat ditangani.`, score: 2 },
        { key: 'B', text: `Mengadakan rapat dengar pendapat umum bersama seluruh wali asrama untuk merumuskan sanksi kedisiplinan yang berat.`, score: 3 },
        { key: 'C', text: `Mengabaikan keluhan kecil karena yakin siswa akan mampu menyelesaikan masalah tersebut secara mandiri seiring waktu.`, score: 1 },
        { key: 'D', text: `Mendampingi siswa secara empatik, melakukan konseling mendalam, dan merumuskan langkah restoratif yang melibatkan pengurus asrama.`, score: 5 },
        { key: 'E', text: `Membuat pengumuman tertulis di papan buletin asrama untuk memperingatkan siswa lain agar menghindari kesalahan serupa.`, score: 4 }
      ],
      correctAnswer: 'D',
      explanation: `Dalam menangani isu ${topic.toLowerCase()} di lingkungan Sekolah Rakyat, tindakan restoratif (Pilihan D) adalah yang paling bijaksana. Wali asrama harus bertindak sebagai fasilitator pertumbuhan moral dan emosional siswa. Pendekatan persuasif dan pembinaan personal memberikan ruang bagi siswa untuk berefleksi dan bertumbuh secara dewasa.\n\nMengapa A salah: Tindakan reaktif langsung melapor tanpa investigasi merusak kepercayaan siswa terhadap wali asrama.\nMengapa B salah: Sanksi berat tanpa pembinaan personal tidak menyelesaikan akar masalah psikologis.\nMengapa C salah: Pembiaran dapat memperburuk situasi mental dan kedisiplinan asrama.\nMengapa E salah: Publikasi masalah secara terbuka dapat mempermalukan siswa dan melanggar kode etik perlindungan anak.`,
      competency: `Kompetensi Teknis Pembinaan Karakter - Topik ${topic}`,
      berakhlak: 'Berorientasi Pelayanan (Solutif) & Harmonis (Menghargai)',
      psychologyBasis: 'Teori Perkembangan Moral Piaget dan Pendekatan Konseling Restoratif.',
      catTips: 'Pilihlah jawaban yang mengedepankan pembinaan moral, konseling empatik, serta kolaborasi antar-siswa.'
    });
  }

  // 2. Managerial questions: id 93 to 117 (25 questions)
  for (let i = 93; i <= 117; i++) {
    const topic = MANAGERIAL_TOPICS[(i - 93) % MANAGERIAL_TOPICS.length];
    result.push({
      id: i,
      category: 'manajerial',
      topic: topic,
      questionText: `[Studi Kasus Manajerial: ${topic}] Anda sebagai Koordinator Wali Asrama dihadapkan pada situasi di mana koordinasi pembagian tugas jaga malam tidak berjalan optimal akibat kesibukan masing-masing staf. Tindakan manajerial yang paling tepat untuk mengoptimalkan kinerja tim adalah...`,
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
      berakhlak: 'Akuntabel (Disiplin) & Adaptif (Inovatif)',
      psychologyBasis: 'Goal-Setting Theory (Locke & Latham) dan Path-Goal Theory of Leadership.',
      catTips: 'Pilihlah jawaban yang berorientasi pada pemecahan masalah secara kolaboratif, transparansi, dan sistematis.'
    });
  }

  // 3. Social questions: id 118 to 136 (19 questions)
  for (let i = 118; i <= 136; i++) {
    const topic = SOCIAL_TOPICS[(i - 118) % SOCIAL_TOPICS.length];
    result.push({
      id: i,
      category: 'sosial',
      topic: topic,
      questionText: `[Studi Kasus Sosio-Kultural: ${topic}] Dalam pergaulan di asrama Sekolah Rakyat, terdapat perbedaan pandangan yang tajam antar-siswa mengenai isu ${topic.toLowerCase()} yang memicu ketegangan di ruang makan. Langkah preventif dan edukatif yang harus Anda ambil adalah...`,
      options: [
        { key: 'A', text: `Melarang segala bentuk diskusi yang menyinggung perbedaan latar belakang di lingkungan asrama demi stabilitas keamanan.`, score: 2 },
        { key: 'B', text: `Mengadakan forum dialog interaktif berkala (pojok kebangsaan) yang memfasilitasi pertukaran budaya secara inklusif dan aman.`, score: 5 },
        { key: 'C', text: `Meminta siswa yang memicu perdebatan untuk pindah ke asrama lain agar tidak memengaruhi keharmonisan siswa lainnya.`, score: 1 },
        { key: 'D', text: `Menyerahkan penyelesaian konflik kepada perwakilan pengurus siswa agar mereka belajar mengatasi isu sosial secara mandiri.`, score: 3 },
        { key: 'E', text: `Mengharuskan semua siswa mengikuti ritual budaya tertentu secara seragam untuk menghilangkan perbedaan identitas mereka.`, score: 4 }
      ],
      correctAnswer: 'B',
      explanation: `Pilihan B adalah yang terbaik karena mempromosikan moderasi, inklusivitas, dan dialog konstruktif mengenai ${topic.toLowerCase()}. Melarang diskusi (opsi A) hanya akan meredam konflik di permukaan, sementara melatih siswa berdialog di bawah bimbingan (opsi B) membangun kompetensi kultural mereka.\n\nMengapa A salah: Sensor ketat justru menyuburkan prasangka tersembunyi yang berisiko meledak sewaktu-waktu.\nMengapa C salah: Memindahkan siswa adalah langkah pembuangan masalah yang tidak mendidik karakter toleransi.\nMengapa D salah: Isu sensitif SARA memerlukan bimbingan orang dewasa agar tidak melebar menjadi konflik fisik.\nMengapa E salah: Asimilasi paksa melanggar hak kebebasan berekspresi dan keberagaman kebinekaan.`,
      competency: `Kompetensi Sosial Kultural - Toleransi & Inklusivitas`,
      berakhlak: 'Harmonis (Saling Menghargai) & Adaptif (Inklusif)',
      psychologyBasis: 'Teori Konstruktivisme Sosial Vygotsky dan Teori Pengurangan Prasangka (Allport).',
      catTips: 'Pilihlah jawaban yang merayakan keberagaman secara aman dan mendidik toleransi aktif, bukan homogenisasi paksa.'
    });
  }

  // 4. Interview questions: id 137 to 145 (9 questions)
  for (let i = 137; i <= 145; i++) {
    const topic = INTERVIEW_TOPICS[(i - 137) % INTERVIEW_TOPICS.length];
    result.push({
      id: i,
      category: 'wawancara',
      topic: topic,
      questionText: `[Studi Kasus Wawancara: ${topic}] Dalam wawancara seleksi ASN Wali Asrama, Anda ditanya: "Bagaimana sikap Anda jika melihat rekan kerja sesama Wali Asrama menerima komisi atau gratifikasi dari orang tua murid untuk memberikan perlakuan khusus kepada anak mereka?"`,
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
      berakhlak: 'Akuntabel (Integritas) & Loyal (Menjaga Nama Baik ASN)',
      psychologyBasis: 'Teori Perkembangan Moral Kohlberg (Tahap Prinsip Etika Universal).',
      catTips: 'Pilihlah jawaban yang menolak keras segala bentuk gratifikasi secara transparan, berintegritas, dan prosedural.'
    });
  }

  return result;
}

export const ALL_QUESTIONS: Question[] = [
  ...REFERENCE_QUESTIONS,
  ...generateDummyQuestions()
];

export const getInitialQuestions = (dateStr: string = '2026-07-06'): Question[] => {
  const sorted = [...ALL_QUESTIONS].sort((a, b) => (a.id || 0) - (b.id || 0));
  return sorted.map((q, idx) => {
    const { id, ...rest } = q;
    return {
      ...rest,
      dateStr,
      number: idx + 1
    };
  });
};
