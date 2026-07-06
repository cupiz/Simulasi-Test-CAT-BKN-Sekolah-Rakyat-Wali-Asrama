import { Question } from '../types';
import { REFERENCE_QUESTIONS } from '../data/questions';

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

// Seeded random generator helper
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
// DYNAMIC COMPONENT POOLS FOR HIGH-QUALITY DETAILED SCENARIOS
// ═══════════════════════════════════════════════════════════════

const TEKNIS_PROBLEMS = [
  "sering terlambat mengikuti apel pagi dan ibadah bersama karena mengalami kesulitan tidur di malam hari",
  "tertangkap tangan menyembunyikan gawai (smartphone) di bawah kasur di luar jam yang diperbolehkan oleh pengelola",
  "menolak berpartisipasi dalam kerja bakti asrama dengan alasan ingin fokus belajar mempersiapkan kompetisi akademik",
  "melakukan tindakan ejekan verbal (cyberbullying) kepada junior melalui grup percakapan media sosial asrama",
  "mengalami kecemasan hebat akibat rindu rumah (homesick) sehingga sering menangis dan mengurung diri di kamar",
  "mengabaikan kebersihan area kasur dan lemarinya hingga menimbulkan bau tidak sedap di dalam kamar",
  "ketahuan menulis surat atau pesan bernada kurang sopan kepada pengurus asrama saat menegurnya",
  "sering menyelinap keluar area asrama tanpa izin melewati pagar pembatas pada jam istirahat malam",
  "menghabiskan uang sakunya dalam waktu singkat lalu meminjam uang teman-temannya tanpa pernah mengembalikan",
  "mengalami penurunan motivasi belajar secara drastis, sering melamun, dan menarik diri dari aktivitas sosial"
];

const TEKNIS_COMPLICATIONS = [
  "karena merasa tertekan oleh tuntutan akademik yang tinggi dari keluarganya yang menuntut prestasi sempurna",
  "akibat terpengaruh oleh pola pergaulan bebas dari teman di luar sekolah rakyat yang sering dihubunginya secara sembunyi-sembunyi",
  "karena merasa tidak nyaman dengan perbedaan latar belakang budaya dan dialek komunikasi teman sekamarnya",
  "karena meluapkan emosi kekesalan akibat kurangnya perhatian dari orang tuanya yang sibuk bekerja di luar kota",
  "akibat kurangnya pemahaman tentang pentingnya nilai kedisiplinan dan tanggung jawab bersama dalam kehidupan berasrama",
  "karena merasa diperlakukan tidak adil oleh salah satu pengurus siswa senior dalam pembagian tugas harian",
  "karena melarikan diri dari konflik pribadi yang sedang dialaminya dengan salah satu anggota keluarganya",
  "karena ingin membuktikan eksistensi dirinya di mata teman-teman sebayanya agar dianggap pemberani",
  "karena mengalami kesulitan beradaptasi dengan iklim lingkungan asrama yang baru dimasuki beberapa minggu lalu",
  "akibat kurangnya keterampilan manajemen waktu dan ketahanan mental dalam menghadapi padatnya jadwal asrama"
];

const TEKNIS_REACTIONS = [
  "Hal ini membuat rekan sekamarnya merasa sangat terganggu karena kenyamanan istirahat mereka berkurang dan poin kedisiplinan kamar mereka menurun akibat keterlambatan yang berulang.",
  "Teman-teman sebayanya mulai menggerutu secara terang-terangan dan suasana di dalam kamar menjadi tegang serta kurang kondusif untuk belajar bersama.",
  "Anggota kamar lainnya mulai memprotes pengurus asrama karena merasa beban tanggung jawab harian asrama menjadi tidak merata dan menimbulkan ketidakadilan sosial.",
  "Tindakan ini memicu bisik-bisik negatif di kalangan siswa lainnya dan berpotensi menurunkan wibawa kedisiplinan yang selama ini ditegakkan di lingkungan asrama.",
  "Suasana kebersamaan di kamar mulai renggang, bahkan beberapa siswa mulai mengucilkan yang bersangkutan dari aktivitas diskusi kelompok dan makan bersama.",
  "Beberapa wali murid lain yang mengetahui hal ini mulai menyampaikan kecemasan mereka kepada pengelola asrama terkait iklim pergaulan anak-anak mereka.",
  "Hal ini memicu ketegangan interpersonal di lingkungan asrama dan mengganggu kelancaran program pembinaan karakter yang sedang berjalan.",
  "Pengurus siswa asrama merasa kewalahan dalam menegakkan tata tertib karena adanya perlawanan pasif yang ditunjukkan oleh siswa tersebut.",
  "Hal ini memicu kecemburuan sosial di kalangan siswa lain yang selalu disiplin mematuhi seluruh peraturan operasional asrama.",
  "Atmosfer kekeluargaan di asrama mulai terganggu dan beberapa siswa junior merasa cemas dengan ketidakpastian situasi tersebut."
];

const MANAGERIAL_PROBLEMS = [
  "terjadi ketidakjelasan pembagian jadwal piket malam dan patroli keamanan asrama Sekolah Rakyat",
  "ditemukan adanya ketidaksesuaian laporan inventaris logistik makanan dengan kondisi riil di gudang dapur asrama",
  "beberapa staf wali asrama menolak menggunakan aplikasi digital baru untuk pelacakan perkembangan karakter siswa",
  "terjadi konflik internal antara staf dapur dan staf kebersihan asrama mengenai kebersihan ruang aula makan",
  "staf wali asrama senior sering datang terlambat saat rapat koordinasi bulanan dan menolak memberikan masukan"
];

const MANAGERIAL_COMPLICATIONS = [
  "akibat kurangnya komunikasi dua arah dan perbedaan persepsi tentang standar operasional prosedur kerja",
  "karena adanya indikasi kelalaian administratif serta kurangnya pengawasan berlapis dari koordinator lapangan",
  "karena merasa kesulitan beradaptasi dengan sistem teknologi informasi yang dinilai rumit bagi generasi senior",
  "akibat akumulasi rasa lelah dan pembagian beban kerja shift malam yang dinilai kurang adil oleh sebagian staf",
  "karena merasa gaya kepemimpinan koordinator asrama yang baru terlalu menuntut perubahan instan tanpa diskusi"
];

const MANAGERIAL_REACTIONS = [
  "Hal ini menyebabkan suasana kerja menjadi kurang kondusif, beberapa tugas penting terabaikan, dan produktivitas tim menurun.",
  "Staf lainnya mulai mengeluh secara pasif dan tingkat ketidakdisiplinan tim secara umum mulai meningkat di mata pimpinan.",
  "Program pembinaan asrama menjadi terhambat dan pimpinan sekolah mulai menyoroti kinerja manajerial unit asrama secara khusus.",
  "Terjadi keterlambatan pelayanan makan siswa yang memicu komplain dari pengurus organisasi siswa asrama.",
  "Terjadi miskomunikasi operasional berulang yang membingungkan staf junior dalam mengambil tindakan di lapangan."
];

const SOCIAL_PROBLEMS = [
  "beberapa siswa dari kelompok suku mayoritas sering berkumpul eksklusif dan enggan berbaur dengan siswa minoritas",
  "terjadi perdebatan sengit mengenai penentuan menu makanan khas daerah untuk acara festival budaya asrama",
  "seorang siswa junior diejek oleh teman-temannya karena logat bicaranya yang dinilai aneh dan kasar",
  "terjadi friksi antar-siswa mengenai pembagian jam ibadah di ruang serbaguna bersama asrama",
  "beberapa siswa menunjukkan sikap enggan bekerja sama dengan teman sekamar yang memiliki keterbatasan fisik ringan"
];

const SOCIAL_COMPLICATIONS = [
  "karena kuatnya prasangka sosial dan kurangnya ruang interaksi inklusif di antara mereka di asrama",
  "akibat ego kedaerahan yang tinggi dan keinginan menonjolkan budaya daerah sendiri secara berlebihan",
  "karena kurangnya pemahaman tentang keberagaman dialek nusantara dan etika pergaulan kebangsaan",
  "akibat perbedaan tata cara peribadatan dan kurangnya jadwal kesepakatan tertulis yang adil bagi minoritas",
  "karena ketakutan salah berinteraksi dan minimnya edukasi mengenai empati terhadap penyandang disabilitas"
];

const SOCIAL_REACTIONS = [
  "Hal ini menciptakan sekat-sekat eksklusivitas sosial (silo) di asrama dan merusak semangat persatuan Sekolah Rakyat.",
  "Suasana rapat asrama menjadi tegang dan persiapan festival budaya terancam tertunda akibat kebuntuan diskusi.",
  "Siswa korban ejekan menjadi minder, menarik diri dari pergaulan, dan sering menyendiri di sudut gazebo asrama.",
  "Terjadi ketidaknyamanan beribadah secara bersamaan yang berpotensi memicu perselisihan terbuka jika didiamkan.",
  "Siswa penyandang disabilitas tersebut merasa tersisih dan suasana kekeluargaan di dalam kamar menjadi renggang."
];

const INTERVIEW_PROBLEMS = [
  "seorang wali murid menawarkan bingkisan mewah dan sejumlah uang saku tambahan agar anaknya ditempatkan di kamar berfasilitas terbaik",
  "rekan sejawat sesama wali asrama kedapatan membagikan kisi-kisi lembar penilaian asrama kepada siswa bimbingannya agar mendapat nilai tertinggi",
  "staf asrama menggunakan mobil operasional jemputan siswa untuk keperluan bisnis pengantaran barang pribadinya",
  "pimpinan meminta Anda membuat laporan fiktif mengenai penggunaan dana kegiatan asrama untuk menutupi defisit anggaran unit lain",
  "Anda dituntut tetap bekerja mendampingi siswa yang sakit darurat saat hari raya keagamaan besar di mana Anda seharusnya berkumpul bersama keluarga"
];

const INTERVIEW_COMPLICATIONS = [
  "dengan dalih ingin membantu operasional asrama dan menjalin hubungan kekeluargaan yang erat",
  "karena ingin membantu siswa tersebut mempertahankan beasiswa prestasinya di Sekolah Rakyat",
  "dengan alasan memanfaatkan fasilitas negara yang sedang menganggur di garasi asrama saat hari libur",
  "atas dasar loyalitas buta kepada rekan sejawat demi menyelamatkan nama baik instansi sekolah rakyat",
  "karena keterbatasan jumlah personel wali asrama yang siaga dan tingginya urgensi keselamatan jiwa siswa"
];

const INTERVIEW_REACTIONS = [
  "Tindakan ini jika dibiarkan akan merusak integritas sistem seleksi dan keadilan sosial di lingkungan asrama.",
  "Hal ini menciptakan persaingan nilai yang tidak sehat dan mencederai kejujuran akademik siswa lainnya secara sistematis.",
  "Hal ini berpotensi merugikan keuangan negara dan menurunkan tingkat kepercayaan publik terhadap kedisiplinan staf.",
  "Hal ini melanggar akuntabilitas publik dan berisiko menyeret institusi ke dalam ranah pelanggaran hukum berat.",
  "Dedikasi pelayanan publik Anda diuji dalam menyeimbangkan kewajiban profesi dengan komitmen keluarga."
];

// Helper to generate dynamic option sentences
function generateOptions(category: string, student: string, problem: string) {
  if (category === 'teknis') {
    return [
      { text: `Memanggil ${student} secara khusus untuk dialog konseling dua arah secara empatik guna menggali akar masalahnya, lalu bersama seluruh anggota kamar merancang sistem peer support (dukungan bergantian) untuk menyeimbangkan empati dan kedisiplinan bersama.`, score: 5 },
      { text: `Menjadwalkan sesi bimbingan psikologis berkala bagi ${student} untuk menguatkan kemandiriannya, serta berkoordinasi dengan wali kelas dan orang tuanya agar proses pembinaan karakter di asrama selaras.`, score: 4 },
      { text: `Mengadakan pertemuan tertutup dengan seluruh penghuni kamar untuk menegaskan aturan tata tertib asrama secara tegas, memberikan teguran formal kepada ${student}, serta mencatat poin kedisiplinan secara administratif.`, score: 3 },
      { text: `Menginstruksikan ketua kamar untuk memberikan pengawasan ketat terhadap kegiatan harian ${student} serta menegurnya secara langsung saat terjadi keterlambatan atau pelanggaran demi menjaga wibawa tata tertib.`, score: 2 },
      { text: `Memindahkan ${student} ke kamar lain atau kamar khusus isolasi agar tidak memicu gesekan sosial lanjutan di dalam kamar lamanya dan membiarkannya mandiri menyelesaikan masalah pribadinya.`, score: 1 }
    ];
  } else if (category === 'manajerial') {
    return [
      { text: `Mengadakan forum dialog terstruktur bersama seluruh staf piket, merumuskan kembali jadwal dan pembagian tugas secara partisipatif (RACI Matrix), menetapkan indikator kinerja (KPI) transparan, dan melakukan evaluasi realtime.`, score: 5 },
      { text: `Menyusun panduan tata laksana piket yang baru, mengedarkan surat edaran instruksi tertulis wajib bagi seluruh staf asrama, serta mewajibkan pengumpulan laporan mingguan secara tepat waktu.`, score: 4 },
      { text: `Mengajukan teguran resmi dan usulan sanksi pemotongan tunjangan kinerja bagi staf yang lalai atau tidak patuh kepada pimpinan komite sekolah rakyat agar disiplin kerja tegak.`, score: 3 },
      { text: `Mengambil alih seluruh koordinasi tugas piket malam secara mandiri untuk sementara waktu demi menjamin operasional asrama tidak terganggu sambil mencari staf pengganti dari luar.`, score: 2 },
      { text: `Membiarkan alur kerja berjalan sesuai kebiasaan lama sambil menunggu staf beradaptasi secara natural seiring bertambahnya pengalaman kerja mereka di asrama.`, score: 1 }
    ];
  } else if (category === 'sosial') {
    return [
      { text: `Merancang proyek kolaboratif kreatif (seperti pertunjukan drama kebangsaan lintas budaya) yang mengharuskan seluruh siswa terlibat aktif bekerja sama, dipadukan dengan sesi refleksi toleransi berkala.`, score: 5 },
      { text: `Mengadakan forum mediasi khusus antara kelompok siswa yang terlibat, memberikan arahan persuasif tentang pentingnya persatuan nasional, dan membimbing mereka untuk saling meminta maaf secara tertulis.`, score: 4 },
      { text: `Menetapkan kebijakan resmi asrama yang melarang segala bentuk pembahasan adat, budaya, suku, atau agama di area publik asrama demi menjaga perdamaian dan stabilitas keamanan.`, score: 3 },
      { text: `Melakukan rotasi atau pemindahan penempatan kamar siswa secara acak untuk memecah konsentrasi kelompok eksklusif tersebut tanpa perlu mengintervensi dinamika hubungan mereka secara mendalam.`, score: 2 },
      { text: `Menyerahkan sepenuhnya wewenang penyelesaian friksi sosial tersebut kepada pengurus organisasi siswa asrama agar mereka belajar mandiri menyelesaikan masalah konflik sosial.`, score: 1 }
    ];
  } else { // Wawancara (Wawancara)
    return [
      { text: `Menolak keterlibatan tersebut secara tegas, mengingatkan rekan sejawat akan sumpah jabatan dan nilai integritas Core Values ASN BerAKHLAK, serta melaporkannya secara resmi kepada pimpinan disertai bukti objektif.`, score: 5 },
      { text: `Mengajak rekan sejawat berdiskusi secara personal, memberikan nasihat persuasif mengenai konsekuensi hukum dan moral dari tindakan tersebut, serta memintanya menghentikan pelanggaran tersebut secara sukarela.`, score: 4 },
      { text: `Memilih bersikap netral dengan menolak tawaran tersebut demi keselamatan karir pribadi, namun tidak melaporkan temuan tersebut kepada pimpinan untuk menjaga solidaritas kerja.`, score: 3 },
      { text: `Menceritakan kejadian tersebut kepada rekan kerja lainnya atau pengurus komite sekolah secara informal agar menjadi bahan evaluasi sosial tidak resmi di lingkungan kerja.`, score: 2 },
      { text: `Menerima hal tersebut secara kompromistis dengan syarat hasil kontribusi tersebut dialokasikan sepenuhnya untuk peningkatan fasilitas umum asrama siswa yang membutuhkan bantuan finansial.`, score: 1 }
    ];
  }
}

// ═══════════════════════════════════════════════════════════════
// PROCEDURAL DAILY QUESTION GENERATOR (145 SOAL UNIK & DETAIL)
// ═══════════════════════════════════════════════════════════════
export function generateDailyQuestions(dateStr: string): Question[] {
  const result: Question[] = [];
  const rand = getSeededRandom(dateStr);

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
    const qRand = getSeededRandom(`${dateStr}-teknis-${num}`);
    
    const problem = TEKNIS_PROBLEMS[Math.floor(qRand() * TEKNIS_PROBLEMS.length)];
    const complication = TEKNIS_COMPLICATIONS[Math.floor(qRand() * TEKNIS_COMPLICATIONS.length)];
    const reaction = TEKNIS_REACTIONS[Math.floor(qRand() * TEKNIS_REACTIONS.length)];
    
    const student = STUDENT_NAMES[(num + dateStr.charCodeAt(0)) % STUDENT_NAMES.length];
    const room = ROOMS[(num + dateStr.charCodeAt(1)) % ROOMS.length];
    const dorm = DORM_NAMES[(num + dateStr.charCodeAt(2)) % DORM_NAMES.length];

    const questionText = `Sebagai Wali Asrama Sekolah Rakyat di asrama putra ${dorm}, Anda mendapati bahwa ${student} di ${room} tampak ${problem}. Complication muncul ${complication}. ${reaction} Langkah pembinaan karakter, penataan operasional, serta tindakan pedagogis yang paling bijaksana untuk menyelesaikan dinamika tersebut adalah...`;

    const formattedOptions = generateOptions('teknis', student, problem).map((opt, idx) => {
      const keys: ('A'|'B'|'C'|'D'|'E')[] = ['A', 'B', 'C', 'D', 'E'];
      return {
        key: keys[idx],
        text: opt.text,
        score: opt.score
      };
    });

    result.push({
      dateStr,
      number: num,
      category: 'teknis',
      topic: 'Pembinaan Karakter & SOP Asrama',
      questionText: `[SKB CAT BKN Wali Asrama] ${questionText}`,
      options: formattedOptions,
      correctAnswer: 'A', // Graded SJT doesn't strictly require one correct key, but we set a default 'A'
      explanation: `Dalam menyelesaikan kasus ${student} di asrama ${dorm} yang ${problem}, pilihan A adalah solusi terbaik. Pendekatan konseling personal dua arah yang persuasif dikombinasikan dengan pembentukan sistem peer support (dukungan sebaya) melatih resiliensi mental siswa sekaligus membangun ikatan kekeluargaan di asrama.\n\nMengapa pilihan lain kurang tepat: Penegakan sanksi berat secara reaktif (pilihan C) atau teguran langsung di depan umum (pilihan D) berisiko memicu ketidakpercayaan siswa terhadap wali asrama serta merusak kepercayaan diri remaja. Pemindahan kamar secara reaktif (pilihan E) atau pembiaran masalah (pilihan B) juga tidak melatih keterampilan resolusi masalah siswa secara jangka panjang.`,
      competency: 'SOP Asrama, Konseling Siswa, & Karakter Kebangsaan',
      berakhlak: 'Harmonis (Saling Peduli) & Kolaboratif (Kerjasama Sinergis)',
      psychologyBasis: 'Social Support Theory (Teori Dukungan Sosial) dan Client-Centered Therapy Carl Rogers.',
      catTips: 'Pilihlah jawaban yang menghindari sanksi fisik/reaktif langsung dan berfokus pada kolaborasi, dialog dua arah, serta sistem dukungan sebaya.'
    });
  }

  // 2. Managerial: 25 Soal (Numbers 91 to 115)
  for (let num = 91; num <= 115; num++) {
    const qRand = getSeededRandom(`${dateStr}-manajerial-${num}`);
    
    const problem = MANAGERIAL_PROBLEMS[Math.floor(qRand() * MANAGERIAL_PROBLEMS.length)];
    const complication = MANAGERIAL_COMPLICATIONS[Math.floor(qRand() * MANAGERIAL_COMPLICATIONS.length)];
    const reaction = MANAGERIAL_REACTIONS[Math.floor(qRand() * MANAGERIAL_REACTIONS.length)];
    
    const staff = STAFF_NAMES[(num + dateStr.charCodeAt(0)) % STAFF_NAMES.length];
    const dorm = DORM_NAMES[(num + dateStr.charCodeAt(1)) % DORM_NAMES.length];

    const questionText = `Anda menjabat sebagai Koordinator Wali Asrama di unit asrama ${dorm}. Saat bertugas, Anda mengamati bahwa di bawah kepemimpinan operasional Anda, ${problem}. Masalah ini terjadi ${complication}. ${reaction} Langkah manajerial, penataan staf, dan keputusan organisasi yang paling tepat untuk mengoptimalkan kinerja tim Anda adalah...`;

    const formattedOptions = generateOptions('manajerial', staff, problem).map((opt, idx) => {
      const keys: ('A'|'B'|'C'|'D'|'E')[] = ['A', 'B', 'C', 'D', 'E'];
      return {
        key: keys[idx],
        text: opt.text,
        score: opt.score
      };
    });

    result.push({
      dateStr,
      number: num,
      category: 'manajerial',
      topic: 'Manajemen Staf & Operasional',
      questionText: `[SKB CAT BKN Wali Asrama] ${questionText}`,
      options: formattedOptions,
      correctAnswer: 'A',
      explanation: `Dalam menyelesaikan problematika koordinasi staf di asrama ${dorm}, pilihan A adalah tindakan manajerial yang paling tepat. Mengadakan briefing koordinasi, penyusunan RACI matrix, menetapkan KPI yang jelas, dan menggunakan instrumen pelacakan realtime memastikan akuntabilitas kerja tim secara transparan dan terukur.\n\nMengapa pilihan lain kurang tepat: Mengambil alih semua tugas secara mandiri (pilihan D) adalah wujud micromanagement yang merusak kemandirian tim. Tindakan represif langsung melapor ke manajemen HRD (pilihan C) menciptakan iklim kerja yang penuh ketakutan. Pembiaran operasional (pilihan E) membahayakan keselamatan fisik siswa di asrama.`,
      competency: 'Perencanaan Operasional, Manajemen Tim, & Akuntabilitas',
      berakhlak: 'Akuntabel (Integritas Kerja) & Kompeten (Kinerja Terbaik)',
      psychologyBasis: 'Goal-Setting Theory (Locke & Latham) dan Path-Goal Theory of Leadership.',
      catTips: 'Pilih jawaban yang menawarkan solusi sistemik, partisipatif, transparan, dan berorientasi pada pengembangan kapasitas staf.'
    });
  }

  // 3. Sosial: 20 Soal (Numbers 116 to 135)
  result.push(ref4);

  for (let num = 117; num <= 135; num++) {
    const qRand = getSeededRandom(`${dateStr}-sosial-${num}`);
    
    const problem = SOCIAL_PROBLEMS[Math.floor(qRand() * SOCIAL_PROBLEMS.length)];
    const complication = SOCIAL_COMPLICATIONS[Math.floor(qRand() * SOCIAL_COMPLICATIONS.length)];
    const reaction = SOCIAL_REACTIONS[Math.floor(qRand() * SOCIAL_REACTIONS.length)];
    
    const student = STUDENT_NAMES[(num + dateStr.charCodeAt(0)) % STUDENT_NAMES.length];
    const dorm = DORM_NAMES[(num + dateStr.charCodeAt(1)) % DORM_NAMES.length];

    const questionText = `Di lingkungan asrama putra ${dorm} Sekolah Rakyat yang majemuk, terjadi situasi di mana ${problem}. Friksi sosial ini berkembang ${complication}. ${reaction} Sikap dan tindakan sosial-kultural yang paling tepat sebagai Wali Asrama untuk menanamkan jiwa kebangsaan dan kebersamaan adalah...`;

    const formattedOptions = generateOptions('sosial', student, problem).map((opt, idx) => {
      const keys: ('A'|'B'|'C'|'D'|'E')[] = ['A', 'B', 'C', 'D', 'E'];
      return {
        key: keys[idx],
        text: opt.text,
        score: opt.score
      };
    });

    result.push({
      dateStr,
      number: num,
      category: 'sosial',
      topic: 'Sosial Kultural & Toleransi',
      questionText: `[SKB CAT BKN Wali Asrama] ${questionText}`,
      options: formattedOptions,
      correctAnswer: 'A',
      explanation: `Dalam meredakan friksi sosial budaya di asrama ${dorm}, pilihan A adalah solusi terbaik. Merancang proyek kolaboratif kreatif (seperti pertunjukan seni gabungan) yang mengharuskan interaksi lintas kelompok memaksa siswa berbaur secara inklusif dan memecah sekat prasangka.\n\nMengapa pilihan lain kurang tepat: Melarang diskusi budaya (pilihan C) hanya menekan prasangka di bawah permukaan. Asimilasi paksa atau pemindahan kamar (pilihan D) melanggar keragaman identitas dan membuang masalah tanpa menyelesaikan akar prasangka.`,
      competency: 'Perekat Bangsa, Toleransi Aktif, & Manajemen Keberagaman',
      berakhlak: 'Harmonis (Saling Menghargai) & Kolaboratif (Kerja Sama Sinergis)',
      psychologyBasis: 'Contact Hypothesis Allport (Prasangka runtuh saat kelompok bekerja sama setara untuk tujuan mulia).',
      catTips: 'Pilih opsi yang menyatukan perbedaan latar belakang dalam wadah kolaborasi aktif, bukan memisahkan atau melarang interaksi.'
    });
  }

  // 4. Wawancara: 10 Soal (Numbers 136 to 145)
  result.push(ref5);

  for (let num = 137; num <= 145; num++) {
    const qRand = getSeededRandom(`${dateStr}-wawancara-${num}`);
    
    const problem = INTERVIEW_PROBLEMS[Math.floor(qRand() * INTERVIEW_PROBLEMS.length)];
    const complication = INTERVIEW_COMPLICATIONS[Math.floor(qRand() * INTERVIEW_COMPLICATIONS.length)];
    const reaction = INTERVIEW_REACTIONS[Math.floor(qRand() * INTERVIEW_REACTIONS.length)];
    
    const staff = STAFF_NAMES[(num + dateStr.charCodeAt(0)) % STAFF_NAMES.length];
    const dorm = DORM_NAMES[(num + dateStr.charCodeAt(1)) % DORM_NAMES.length];

    const questionText = `Sebagai calon aparatur sipil negara di bawah naungan Sekolah Rakyat, Anda diuji dengan pertanyaan wawancara berikut: "Bagaimana sikap integritas profesional Anda jika Anda melihat ${problem} yang dilakukan ${complication}?" ${reaction} Tanggapan terbaik Anda adalah...`;

    const formattedOptions = generateOptions('wawancara', staff, problem).map((opt, idx) => {
      const keys: ('A'|'B'|'C'|'D'|'E')[] = ['A', 'B', 'C', 'D', 'E'];
      return {
        key: keys[idx],
        text: opt.text,
        score: opt.score
      };
    });

    result.push({
      dateStr,
      number: num,
      category: 'wawancara',
      topic: 'Integritas & Anti-Korupsi',
      questionText: `[SKB CAT BKN Wali Asrama] ${questionText}`,
      options: formattedOptions,
      correctAnswer: 'A',
      explanation: `Jawaban pilihan A menunjukkan nilai integritas tertinggi. ASN harus memiliki keberanian moral untuk menolak segala bentuk kompromi integritas, mengingatkan rekan sejawat tentang sumpah jabatan, serta melaporkan pelanggaran melalui whistleblower system resmi.\n\nMengapa pilihan lain kurang tepat: Bersikap kompromistis demi keuntungan operasional asrama (pilihan E) tetap tergolong tindakan koruptif. Bersikap pasif dan diam (pilihan C) menjadikan kita ikut bertanggung jawab atas pembiaran kejahatan. Menyebarkan desas-desus tanpa prosedur resmi (pilihan D) merusak nama baik instansi.`,
      competency: 'Integritas Moral, Loyalitas Aturan, & Etika Profesi',
      berakhlak: 'Akuntabel (Dapat Dipercaya) & Loyal (Menjaga Nama Baik ASN)',
      psychologyBasis: 'Teori Perkembangan Moral Kohlberg (Tahap Pasca-Konvensional / Etika Universal).',
      catTips: 'Pilih tanggapan yang menolak keras korupsi, gratifikasi, atau manipulasi secara tegas dan prosedural tanpa kompromi.'
    });
  }

  // Sort by number asc before returning
  return result.sort((a, b) => (a.number || 0) - (b.number || 0));
}
