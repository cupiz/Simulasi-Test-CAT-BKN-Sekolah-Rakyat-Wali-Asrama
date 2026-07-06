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

// Seeded random helper
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
// HIGH-FIDELITY DETAILED TEMPLATE POOLS
// ═══════════════════════════════════════════════════════════════

interface CaseTemplate {
  topic: string;
  text: string;
  options: { text: string; score: number }[];
  explanation: string;
  competency: string;
  berakhlak: string;
  psychologyBasis: string;
  catTips: string;
}

const TEKNIS_TEMPLATES: CaseTemplate[] = [
  {
    topic: 'Homesick & Peer Support',
    text: 'Sebagai Wali Asrama Sekolah Rakyat di asrama {dorm}, Anda mendapati bahwa {student} di {room} sering terlambat mengikuti apel pagi karena ia kerap terjaga hingga larut malam demi menemani dan menenangkan teman sekamarnya yang sedang mengalami kecemasan hebat akibat rindu rumah (homesick). Di sisi lain, anggota kamar yang lain mulai merasa kurang nyaman karena poin kedisiplinan kamar mereka menurun akibat keterlambatan {student} yang berulang. Langkah pembinaan karakter dan penataan operasional yang paling bijaksana untuk menyelesaikan dinamika tersebut adalah...',
    options: [
      { text: 'Memfasilitasi diskusi kamar untuk mengapresiasi empati {student}, sekaligus merancang bersama sistem dukungan bergantian (peer-support) bagi siswa yang cemas agar tanggung jawab kepedulian dipikul bersama.', score: 5 },
      { text: 'Menjadwalkan sesi konseling personal bagi {student} dan siswa yang cemas tersebut guna menguatkan ketahanan mental serta kemandirian mereka selama di asrama.', score: 4 },
      { text: 'Mengadakan kelas manajemen waktu dan regulasi emosi bagi seluruh penghuni asrama agar setiap individu mampu menyeimbangkan empati dan kedisiplinan.', score: 3 },
      { text: 'Memberikan penghargaan kepada kamar lain yang selalu tepat waktu agar menjadi contoh nyata bagi {student} dan teman kamarnya untuk memperbaiki manajemen waktu.', score: 2 },
      { text: 'Melakukan pemindahan {student} ke kamar khusus yang diisi oleh para pengurus asrama agar ia mendapatkan bimbingan intensif mengenai pembagian skala prioritas.', score: 1 }
    ],
    explanation: 'Melibatkan seluruh anggota kamar dalam sistem peer-support membantu membagi beban kepedulian, memulihkan kedisiplinan kamar, dan menanamkan nilai gotong royong tanpa mengorbankan kesejahteraan mental siswa yang sedang cemas.',
    competency: 'SOP Asrama, Resolusi Konflik, dan Karakter Kebangsaan (Gotong Royong).',
    berakhlak: 'Harmonis (Saling Peduli) & Kolaboratif (Kerjasama Sinergis)',
    psychologyBasis: 'Social Support Theory dan Peer-Assisted Learning/Support Systems.',
    catTips: 'Pilih opsi yang memberdayakan ekosistem asrama untuk menyelesaikan masalah secara bersama-sama, bukan sekadar menerapkan sanksi reaktif.'
  },
  {
    topic: 'Disiplin & Kontribusi Sosial',
    text: 'Pada saat kegiatan kerja bakti berkala membersihkan lingkungan asrama {dorm}, Anda melihat {student} sedang membaca buku di sudut gazebo yang tenang. Ketika Anda mendekatinya, {student} menjelaskan dengan sangat sopan bahwa ia ingin memaksimalkan waktu luangnya untuk mempersiapkan diri menghadapi kompetisi sains tingkat nasional yang akan berlangsung minggu depan. Teman-teman sebayanya mulai menggerutu, namun mereka tetap melanjutkan pekerjaan mereka. Tindakan pembinaan yang paling tepat untuk mengarahkan perilaku {student} adalah...',
    options: [
      { text: 'Mengajak {student} berdialog mengenai esensi keseimbangan antara prestasi akademis dan kontribusi sosial, lalu membimbingnya meluangkan waktu sejenak untuk membantu teman-temannya.', score: 5 },
      { text: 'Mengarahkan {student} untuk mengganti kontribusi fisiknya dengan membuat rangkuman materi pelajaran yang bermanfaat bagi seluruh penghuni asrama.', score: 4 },
      { text: 'Memfasilitasi forum musyawarah asrama untuk merumuskan dispensasi khusus yang legal bagi siswa yang sedang bersiap menghadapi kompetisi penting.', score: 3 },
      { text: 'Meminta {student} untuk memimpin doa dan memberikan evaluasi di akhir kegiatan kerja bakti sebagai wujud kontribusi kepemimpinan bagi asrama.', score: 2 },
      { text: 'Memberikan apresiasi atas kegigihan belajar {student} di depan umum, serta memotivasi siswa lain untuk meniru semangat belajarnya di waktu yang tepat.', score: 1 }
    ],
    explanation: 'Mengajak {student} berdialog membantu membangun kesadaran moral mengenai pentingnya menyeimbangkan prestasi akademik individu dengan tanggung jawab sosial kemasyarakatan di asrama.',
    competency: 'Budaya Sekolah, Pembinaan Karakter Disiplin, dan Manajemen Konflik.',
    berakhlak: 'Harmonis (Kedamaian Komunitas) & Akuntabel (Tanggung Jawab Sosial)',
    psychologyBasis: 'Teori perkembangan moral Kohlberg pada tahap pasca-konvensional (kontrak sosial).',
    catTips: 'Pilih opsi yang mendidik karakter siswa secara personal melalui dialog dua arah, bukan hukuman langsung atau toleransi berlebih.'
  },
  {
    topic: 'Kepemimpinan & Gaya Komunikasi',
    text: '{student} adalah seorang ketua organisasi siswa di asrama {dorm} yang dikenal sangat disiplin. Namun, Anda memperhatikan bahwa dalam beberapa minggu terakhir, {student} cenderung menggunakan intonasi suara yang tinggi dan instruksi yang kaku saat menegakkan tata krama makan di aula asrama kepada para siswa junior. Meskipun para junior patuh, suasana makan menjadi tegang. Rekan sesama pengurus menyatakan bahwa metode {student} efektif untuk menjaga keteraturan. Sikap Anda sebagai Wali Asrama untuk membina karakter kepemimpinan {student} adalah...',
    options: [
      { text: 'Membimbing {student} melalui bimbingan personal mengenai konsep kepemimpinan yang mengayomi, serta mengajaknya merancang metode penegakan tata krama berbasis keteladanan bersama.', score: 5 },
      { text: 'Memberikan pujian kepada {student} atas kedisiplinannya, disertai saran tertulis mengenai variasi metode penegakan aturan yang lebih persuasif.', score: 4 },
      { text: 'Mengadakan pelatihan etika komunikasi publik bagi seluruh pengurus asrama guna meningkatkan kompetensi berbicara mereka.', score: 3 },
      { text: 'Melakukan rotasi berkala posisi pengurus asrama agar terjadi penyegaran gaya komunikasi di lingkungan ruang makan.', score: 2 },
      { text: 'Menghadiri setiap sesi makan malam secara langsung untuk memberikan teladan nyata mengenai cara menegur yang ramah dan menyejukkan.', score: 1 }
    ],
    explanation: 'Bimbingan personal (coaching) mengajarkan konsep servant leadership kepada {student}, membantunya menyadari bahwa kepatuhan sejati lahir dari rasa hormat dan teladan, bukan intimidasi.',
    competency: 'Kepemimpinan (Leadership), Etika Komunikasi, dan Pembinaan Karakter.',
    berakhlak: 'Berorientasi Pelayanan (Pengayoman) & Harmonis (Kenyamanan Bersama)',
    psychologyBasis: 'Servant Leadership Theory (Greenleaf) dan Transformational Leadership.',
    catTips: 'Carilah opsi yang memberikan bimbingan langsung (coaching) kepada pelaku agar terjadi perubahan metode dari kaku menjadi persuasif.'
  },
  {
    topic: 'Pelanggaran Aturan & Faktor Ekonomi',
    text: 'Anda memergoki {student} sedang menyelinap keluar dari pagar belakang asrama {dorm} pada malam hari setelah jam malam diberlakukan. Ketika diajak berbicara secara privat di kantor asrama, {student} sambil menangis mengaku bahwa ia bekerja paruh waktu di sebuah kedai kelontong dekat asrama untuk membantu mengirimkan uang obat ibunya di desa yang sedang sakit keras. Hal ini ia sembunyikan karena takut dikeluarkan. Tindakan yang paling tepat dan solutif sebagai Wali Asrama adalah...',
    options: [
      { text: 'Mendengarkan kondisi ekonominya dengan empati, menegaskan pentingnya aturan keselamatan malam hari, lalu membantu menghubungkannya dengan program beasiswa asrama atau bantuan sosial sekolah rakyat.', score: 5 },
      { text: 'Mengizinkan {student} melanjutkan kerjanya hanya pada akhir pekan saja, serta memintanya melapor setiap kali sebelum pergi.', score: 4 },
      { text: 'Membantu {student} dengan memberikan uang kas pribadi Anda saat itu juga agar ia tidak perlu bekerja di malam hari lagi.', score: 3 },
      { text: 'Memberikan peringatan tertulis keras sesuai SOP asrama agar ia tidak mengulangi pelanggaran keselamatan malam hari tersebut.', score: 2 },
      { text: 'Melaporkan pelanggaran jam malam ini kepada kepala sekolah agar {student} segera diberikan sanksi skorsing sesuai aturan kedisiplinan.', score: 1 }
    ],
    explanation: 'Empati harus dibarengi dengan penegakan aturan keselamatan serta pencarian solusi jangka panjang (beasiswa/bantuan sosial) agar hak pendidikan dan keselamatan siswa tetap terjamin.',
    competency: 'Konseling Masalah Ekonomi, Manajemen Keselamatan, dan Kebijakan Sosial.',
    berakhlak: 'Harmonis (Saling Peduli) & Berorientasi Pelayanan (Solutif)',
    psychologyBasis: 'Maslow\'s Hierarchy of Needs (Kebutuhan Fisiologis/Keamanan) dan Konseling Kognitif Perilaku.',
    catTips: 'Pilih opsi yang menegakkan aturan keselamatan namun aktif memberikan solusi bantuan ekonomi legal bagi siswa.'
  },
  {
    topic: 'Kecanduan Game & Pelanggaran Gadget',
    text: 'Beberapa siswa di {room} asrama {dorm} melaporkan secara rahasia bahwa {student} kerap memainkan gawai penyelundupan hingga pukul 03.00 dini hari untuk bermain game online. Hal ini menyebabkan teman-teman sekamarnya tidak bisa tidur karena pancaran cahaya layar dan suara bisikan {student}. Keesokan harinya, {student} tampak tertidur pulas saat jam pelajaran kepemimpinan di kelas. Sikap Anda selaku Wali Asrama untuk menangani hal ini adalah...',
    options: [
      { text: 'Menyita gawai ilegal tersebut secara baik-baik, membimbing {student} secara personal mengenai regulasi diri dan kecanduan digital, serta mengadakan refleksi kamar tentang hak istirahat bersama.', score: 5 },
      { text: 'Mengharuskan {student} mengumpulkan seluruh perangkatnya setiap malam pukul 21.00 di meja piket asrama dan memintanya membuat surat pernyataan tidak mengulangi.', score: 4 },
      { text: 'Melakukan razia mendadak (sidak) ke seluruh kamar asrama tanpa pemberitahuan untuk menyita semua gawai ilegal yang disimpan siswa.', score: 3 },
      { text: 'Memberikan hukuman kepada {student} berupa tugas piket membersihkan aula makan selama satu minggu agar ia tidak mengantuk lagi di kelas.', score: 2 },
      { text: 'Mengembalikan gawai tersebut langsung kepada orang tua {student} dan meminta mereka mengawasi anak mereka di rumah selama masa skorsing.', score: 1 }
    ],
    explanation: 'Penyitaan barang aturan dibarengi pembinaan regulasi diri (self-regulation) mengajarkan kedewasaan penggunaan teknologi serta menanamkan empati terhadap kenyamanan tidur teman sekamar.',
    competency: 'Manajemen Gadget, Pembinaan Kedisiplinan Mandiri, dan Hak Komunitas.',
    berakhlak: 'Akuntabel (Tanggung Jawab) & Kompeten (Solutif)',
    psychologyBasis: 'Self-Regulation Theory dan Token Economy / Operant Conditioning.',
    catTips: 'Pilih jawaban yang menggabungkan tindakan penegakan SOP (penyitaan) dengan konseling edukasi kecanduan digital.'
  },
  {
    topic: 'Bullying & Konflik Senior-Junior',
    text: 'Anda menerima laporan bahwa {student}, seorang siswa senior di asrama {dorm}, sering menyuruh siswa junior untuk membersihkan sepatu dan merapikan tempat tidurnya dengan ancaman akan dipersulit saat pemilihan pengurus asrama. Para junior merasa tertekan namun tidak berani melawan karena pengaruh kekuasaan {student}. Langkah pembinaan karakter kepemimpinan yang harus Anda lakukan adalah...',
    options: [
      { text: 'Memanggil {student} ke ruang pembinaan untuk refleksi personal mengenai integritas pemimpin, melarang tindakan perpeloncoan, serta mengaktifkan sistem pelaporan anonim ramah anak di asrama.', score: 5 },
      { text: 'Mengadakan pertemuan khusus antara {student} dan perwakilan junior untuk saling berdamai dan meminta maaf di depan pengurus asrama.', score: 4 },
      { text: 'Membatalkan hak pencalonan {student} sebagai pengurus asrama secara sepihak tanpa memberikan ruang penjelasan.', score: 3 },
      { text: 'Mengumumkan tindakan {student} pada apel pagi asrama agar seluruh siswa mengetahui konsekuensi dari perilaku intimidasi.', score: 2 },
      { text: 'Memindahkan siswa junior yang mengeluh ke gedung asrama lain agar mereka terhindar dari interaksi dengan {student}.', score: 1 }
    ],
    explanation: 'Membina senior tentang esensi integritas pemimpin (servant leadership) dan menghentikan perpeloncoan secara sistemik melindungi hak junior sekaligus mendidik karakter kepemimpinan yang sehat.',
    competency: 'Pemberantasan Perpeloncoan, Hak Perlindungan Anak, dan Budaya Sekolah.',
    berakhlak: 'Harmonis (Keadilan) & Akuntabel (Integritas ASN)',
    psychologyBasis: 'Power-Coercion Theory dan Restorative Justice Framework.',
    catTips: 'Pilih jawaban yang berani menolak intimidasi senioritas dan mengutamakan sistem perlindungan siswa lemah.'
  },
  {
    topic: 'Kecemasan Akademik & Depresi',
    text: 'Siswa bernama {student} di asrama {dorm} akhir-akhir ini tampak sangat murung, menarik diri dari pergaulan sosial, dan sering melewatkan waktu makan bersama. Ketika diajak berdialog di gazebo asrama, {student} menangis dan mengaku sangat depresi karena merasa tidak mampu memenuhi target nilai beasiswa yang dipersyaratkan oleh orang tuanya. Langkah penanganan psikologis awal yang paling tepat adalah...',
    options: [
      { text: 'Mendengarkan keluh kesah {student} secara hangat, memberikan dukungan moral, menyusun jadwal belajar yang lebih rileks, serta memfasilitasi komunikasi persuasif dengan orang tuanya.', score: 5 },
      { text: 'Menyarankan {student} untuk fokus belajar lebih keras lagi dan membelikannya suplemen vitamin agar staminanya tetap terjaga.', score: 4 },
      { text: 'Menghubungi orang tua {student} secara langsung dan meminta mereka menurunkan ekspektasi nilai agar anak mereka tidak stres.', score: 3 },
      { text: 'Meminta bantuan teman-teman sekamarnya untuk selalu mengajak {student} bercanda dan menghiburnya setiap waktu di kamar.', score: 2 },
      { text: 'Mengusulkan kepada pimpinan sekolah rakyat agar {student} diberikan dispensasi kelulusan nilai tanpa perlu mengikuti ujian susulan.', score: 1 }
    ],
    explanation: 'Mendengarkan dengan hangat (active listening) meredakan beban emosional siswa, sementara bantuan penyusunan jadwal belajar rileks dan mediasi dengan orang tua menyelesaikan akar kecemasan akademik.',
    competency: 'Konseling Krisis Psikologis, Mediasi Orang Tua, dan Manajemen Pembelajaran.',
    berakhlak: 'Harmonis (Saling Peduli) & Berorientasi Pelayanan (Empati)',
    psychologyBasis: 'Teori Konseling Humanistik (Carl Rogers) dan Teori Stres-Koping Lazarus.',
    catTips: 'Pilih jawaban yang mengedepankan dukungan emosional personal dan mediasi persuasif, bukan sekadar memacu belajar atau membiarkan.'
  },
  {
    topic: 'Kasus Pencurian & Menjaga Asas Keadilan',
    text: 'Terjadi kehilangan uang tunai sebesar Rp500.000 milik salah satu siswa di asrama {dorm}. Beberapa siswa senior menuduh {student} sebagai pencurinya karena {student} kedapatan masuk ke kamar korban saat kamar kosong. Siswa senior menuntut Anda untuk melakukan penggeledahan paksa lemari {student} di depan seluruh siswa agar pelaku segera terungkap. Tindakan Anda sebagai Wali Asrama adalah...',
    options: [
      { text: 'Menolak tuntutan penggeledahan publik, memanggil {student} secara privat untuk klarifikasi persuasif, serta berkoordinasi dengan pengurus asrama untuk penyelidikan tertutup berdasarkan bukti.', score: 5 },
      { text: 'Melakukan penggeledahan lemari {student} secara privat di kantor asrama dengan didampingi perwakilan pengurus siswa guna mencari bukti fisik.', score: 4 },
      { text: 'Memenuhi tuntutan siswa senior untuk menggeledah lemari {student} secara terbuka demi meredakan ketegangan massa asrama.', score: 3 },
      { text: 'Mengganti uang yang hilang tersebut menggunakan kas asrama dan menganggap kasus selesai tanpa penyelidikan lebih lanjut.', score: 2 },
      { text: 'Melaporkan kejadian ini langsung ke polsek terdekat agar dilakukan penyelidikan hukum secara formal terhadap {student}.', score: 1 }
    ],
    explanation: 'Klarifikasi privat melindungi hak praduga tak bersalah siswa dan mencegah persekusi sosial, sementara penyelidikan tertutup menjaga keadilan tanpa menciptakan iklim penuh kecurigaan di asrama.',
    competency: 'Perlindungan Hak Siswa, Investigasi Kasus, dan Asas Praduga Tak Bersalah.',
    berakhlak: 'Akuntabel (Objektif) & Harmonis (Menjaga Keharmonisan)',
    psychologyBasis: 'Social Justice in Education dan Presumption of Innocence Theory.',
    catTips: 'Hindari opsi yang melanggar privasi siswa secara terbuka atau mengambil tindakan represif tanpa bukti awal yang kuat.'
  }
];

const MANAGERIAL_TEMPLATES: CaseTemplate[] = [
  {
    topic: 'Manajemen Konflik & Pembagian Tugas Staf',
    text: 'Sebagai Koordinator Wali Asrama di asrama {dorm}, Anda dihadapkan pada situasi di mana dua staf pengasuh senior sering berselisih paham mengenai pembagian shift jaga malam. Akibatnya, salah satu pos penjagaan gerbang asrama sering kosong pada jam-jam rawan, sehingga memicu kekhawatiran mengenai keselamatan siswa. Langkah manajerial yang paling tepat untuk menyelesaikan konflik tersebut adalah...',
    options: [
      { text: 'Memanggil kedua staf secara bersamaan, memfasilitasi dialog penyelesaian masalah secara objektif, merancang jadwal piket baru secara partisipatif dengan RACI matrix, dan memantau kinerjanya.', score: 5 },
      { text: 'Menyusun jadwal piket baru secara mandiri tanpa melibatkan kedua staf tersebut, lalu mewajibkan mereka mematuhinya secara mutlak.', score: 4 },
      { text: 'Melaporkan perselisihan kedua staf tersebut kepada kepala komite sekolah rakyat agar segera diberikan sanksi administrasi.', score: 3 },
      { text: 'Mengambil alih seluruh shift jaga malam kedua staf tersebut untuk membuktikan dedikasi Anda sebagai pemimpin asrama.', score: 2 },
      { text: 'Membiarkan perselisihan tersebut mereda sendiri dengan anggapan staf senior akan mampu bersikap dewasa seiring waktu.', score: 1 }
    ],
    explanation: 'Dialog mediasi yang dilanjutkan dengan penyusunan pembagian peran secara terstruktur (RACI Matrix) menyelesaikan akar konflik operasional secara berkelanjutan dan membangun tanggung jawab kerja bersama.',
    competency: 'Manajemen Konflik Staf, Perencanaan Jadwal Kerja, dan Kepemimpinan Tim.',
    berakhlak: 'Akuntabel (Profesional) & Kolaboratif (Membangun Kerja Sama Sinergis)',
    psychologyBasis: 'Conflict Resolution Theory (Thomas-Kilmann Model) dan Path-Goal Leadership Theory.',
    catTips: 'Pilih tindakan pemimpin yang solutif-sistemik melalui mediasi dan kejelasan alur peran kerja tim.'
  },
  {
    topic: 'Manajemen Perubahan & Penolakan Teknologi Staf',
    text: 'Sekolah Rakyat menerapkan aplikasi pemantauan karakter siswa berbasis mobile yang baru untuk mencatat perkembangan harian siswa asrama secara realtime. Namun, staf senior {staff} menolak menggunakannya karena merasa kesulitan beradaptasi dengan teknologi baru dan memilih tetap menulis di buku besar manual. Hal ini menghambat sinkronisasi data asrama pusat. Sikap manajerial Anda adalah...',
    options: [
      { text: 'Memberikan pelatihan asistensi personal (one-on-one mentoring) secara sabar kepada {staff}, menjelaskan efisiensi kerja aplikasi tersebut, serta memantau perkembangannya secara berkala.', score: 5 },
      { text: 'Menugaskan salah satu wali asrama junior untuk mengetikkan seluruh catatan manual milik {staff} ke dalam aplikasi setiap hari.', score: 4 },
      { text: 'Menegur {staff} dalam rapat staf mingguan agar ia merasa termotivasi untuk segera mempelajari sistem teknologi yang baru.', score: 3 },
      { text: 'Mengizinkan {staff} tetap menggunakan metode manual secara permanen demi menghormati status senioritasnya di asrama.', score: 2 },
      { text: 'Mengusulkan kepada pimpinan sekolah untuk memutasi {staff} ke bagian lain yang tidak memerlukan penggunaan sistem digital.', score: 1 }
    ],
    explanation: 'Pendekatan mentoring personal memberikan rasa aman psikologis bagi staf senior untuk belajar menguasai teknologi baru tanpa merasa dihakimi, mempercepat adopsi inovasi digital secara inklusif.',
    competency: 'Manajemen Perubahan (Change Management), Kepemimpinan Digital, dan Pengembangan Kapasitas.',
    berakhlak: 'Adaptif (Menghadapi Perubahan) & Kompeten (Mengembangkan Orang Lain)',
    psychologyBasis: 'Technology Acceptance Model (TAM) dan Teori Difusi Inovasi Rogers.',
    catTips: 'Pilih opsi yang memadukan keharusan transformasi sistem dengan kepedulian pengembangan kapasitas staf secara persuasif.'
  }
];

const SOCIAL_TEMPLATES: CaseTemplate[] = [
  {
    topic: 'Toleransi & Integrasi Budaya Siswa',
    text: 'Di ruang makan asrama {dorm} Sekolah Rakyat, Anda memperhatikan adanya pengelompokan meja makan yang eksklusif berdasarkan asal daerah asal siswa. Kelompok siswa asal Sumatera, Jawa, dan Sulawesi enggan berbaur. Terkadang terdengar ejekan bernada stereotip daerah yang memicu ketegangan kecil saat makan malam. Langkah Anda selaku Wali Asrama untuk menyatukan perbedaan kultural tersebut adalah...',
    options: [
      { text: 'Merancang proyek pertunjukan drama musikal cerita rakyat nusantara kolaboratif yang mengharuskan pencampuran anggota kelompok daerah, didampingi diskusi kebangsaan berkala.', score: 5 },
      { text: 'Mengatur posisi duduk siswa secara paksa di ruang makan dengan mencantumkan nama daerah asal pada label meja makan mereka.', score: 4 },
      { text: 'Mengadakan forum evaluasi umum asrama untuk melarang segala bentuk diskusi kedaerahan di lingkungan ruang makan asrama.', score: 3 },
      { text: 'Mengundang budayawan lokal untuk memberikan ceramah intensif mengenai indahnya Bhinneka Tunggal Ika kepada seluruh siswa.', score: 2 },
      { text: 'Membiarkan situasi tersebut karena menganggap pengelompokan berdasarkan daerah asal adalah hak kenyamanan masing-masing siswa.', score: 1 }
    ],
    explanation: 'Drama kolaboratif memaksa siswa berinteraksi secara erat dan setara demi mencapai tujuan bersama, secara efektif meruntuhkan prasangka kultural (Contact Hypothesis).',
    competency: 'Manajemen Keragaman Budaya, Penanaman Karakter Kultural, dan Perekat Bangsa.',
    berakhlak: 'Harmonis (Saling Menghargai) & Kolaboratif (Kerjasama Sinergis)',
    psychologyBasis: 'Allport\'s Contact Hypothesis (Prasangka runtuh melalui kerja sama setara dalam tujuan yang disepakati).',
    catTips: 'Pilih jawaban yang melebur perbedaan melalui wadah kolaborasi aktif bersama, bukan asimilasi paksa.'
  },
  {
    topic: 'Inklusi Sosial & Pembinaan Empati',
    text: 'Di asrama {dorm}, terdapat siswa bernama {student} yang memiliki keterbatasan fisik ringan (berjalan menggunakan alat bantu). Beberapa siswa mayoritas enggan mengajaknya bergabung dalam proyek tim asrama atau kegiatan rekreasi karena takut performa tim menurun. {student} mulai merasa dikucilkan dan sering menyendiri. Tindakan pembinaan karakter sosial yang harus Anda lakukan adalah...',
    options: [
      { text: 'Membimbing kelompok siswa untuk merancang kegiatan rekreasi dan penugasan tim yang adaptif-inklusif, di mana setiap siswa termasuk {student} dapat berkontribusi maksimal.', score: 5 },
      { text: 'Menasehati kelompok siswa mayoritas agar menunjukkan rasa iba kepada {student} dengan mengajaknya bermain tanpa perlu memberikan peran penting.', score: 4 },
      { text: 'Memberikan penugasan mandiri khusus kepada {student} di perpustakaan agar ia tidak merasa tertekan oleh penolakan teman-temannya.', score: 3 },
      { text: 'Menegur keras siswa mayoritas di depan umum karena tidak menunjukkan sikap solidaritas terhadap sesama teman di asrama.', score: 2 },
      { text: 'Menyarankan orang tua {student} untuk memindahkan anaknya ke sekolah khusus disabilitas demi kenyamanan psikologisnya.', score: 1 }
    ],
    explanation: 'Mengajarkan kolaboratif adaptif mendidik siswa mayoritas berempati nyata dan merancang solusi inklusif, sementara {student} tetap merasa berdaya sebagai bagian dari komunitas.',
    competency: 'Pemberdayaan Disabilitas, Pendidikan Inklusif, dan Penanaman Nilai Kemanusiaan.',
    berakhlak: 'Harmonis (Menghargai Perbedaan) & Berorientasi Pelayanan (Inklusif)',
    psychologyBasis: 'Social Exchange Theory dan Inclusive Pedagogical Framework.',
    catTips: 'Pilih jawaban yang mendorong adaptasi aktivitas agar semua pihak dapat terlibat aktif, bukan mengisolasi anak berkebutuhan khusus.'
  }
];

const INTERVIEW_TEMPLATES: CaseTemplate[] = [
  {
    topic: 'Integritas ASN & Tolak Gratifikasi',
    text: 'Dalam proses wawancara seleksi ASN Wali Asrama, Anda ditanya: "Bagaimana sikap Anda jika ada salah satu orang tua siswa yang berlatar belakang pejabat tinggi menawarkan paket liburan mewah dan dana hibah pribadi untuk asrama {dorm} dengan syarat anak mereka diberikan dispensasi khusus bebas dari tugas piket malam asrama?" Jawaban terbaik Anda adalah...',
    options: [
      { text: 'Menolak tawaran tersebut secara sopan namun tegas, menjelaskan asas keadilan aturan asrama, serta melaporkan kejadian gratifikasi ini kepada komite etik sekolah rakyat.', score: 5 },
      { text: 'Menolak tawaran tersebut secara personal dan mengabaikannya tanpa perlu membuat laporan ke pimpinan demi menghindari konflik dengan pejabat.', score: 4 },
      { text: 'Menerima tawaran dana hibah tersebut hanya untuk perbaikan fasilitas umum asrama, namun menolak memberikan dispensasi khusus kepada anak pejabat tersebut.', score: 3 },
      { text: 'Mengarahkan orang tua tersebut untuk mengajukan usulan dana hibah secara resmi melalui pengurus asrama agar dispensasi piket dapat dibahas di rapat pleno.', score: 2 },
      { text: 'Menerima seluruh tawaran tersebut demi kelancaran pembangunan fasilitas asrama dan memberikan tugas piket ringan di siang hari sebagai pengganti.', score: 1 }
    ],
    explanation: 'Menolak gratifikasi secara tegas dan melaporkannya sesuai prosedur merupakan wujud integritas moral tertinggi pegawai ASN untuk menjaga marwah keadilan publik.',
    competency: 'Integritas Profesional, Anti-Gratifikasi, dan Keadilan Pelayanan Publik.',
    berakhlak: 'Akuntabel (Jujur dan Bertanggung Jawab) & Loyal (Menjaga Nama Baik ASN)',
    psychologyBasis: 'Moral Development Theory Kohlberg (Universal Ethical Principle Stage).',
    catTips: 'Pilih tanggapan yang menolak keras korupsi, gratifikasi, atau kolusi secara tegas, berintegritas, dan prosedural.'
  },
  {
    topic: 'Dedikasi & Loyalitas Pelayanan Publik',
    text: 'Dalam wawancara seleksi, Anda ditanya: "Jika terjadi situasi darurat di mana beberapa siswa di asrama {dorm} mengalami keracunan makanan pada malam hari raya besar keagamaan di saat Anda sedang libur nasional bersama keluarga besar, dan pimpinan asrama meminta Anda segera datang siaga ke asrama karena keterbatasan personel. Sikap Anda adalah..."',
    options: [
      { text: 'Merespons panggilan darurat tersebut dengan penuh tanggung jawab, segera berangkat ke asrama untuk menyelamatkan siswa, serta mengomunikasikan penundaan acara keluarga secara persuasif.', score: 5 },
      { text: 'Menghubungi rekan kerja terdekat yang tidak merayakan hari raya keagamaan tersebut untuk menggantikan posisi Anda bertugas di asrama.', score: 4 },
      { text: 'Menerima tugas tersebut namun meminta pimpinan asrama untuk menyediakan kendaraan antar-jemput dan kompensasi lembur ganda terlebih dahulu.', score: 3 },
      { text: 'Menolak panggilan darurat tersebut secara sopan dengan alasan hak libur nasional bersama keluarga sudah dilindungi oleh aturan ketenagakerjaan.', score: 2 },
      { text: 'Mematikan telepon genggam Anda selama liburan keluarga agar tidak terganggu oleh urusan kedaruratan pekerjaan asrama.', score: 1 }
    ],
    explanation: 'Menempatkan tugas pengabdian kemanusiaan dan keselamatan jiwa siswa di atas kepentingan pribadi mencerminkan nilai loyalitas dan dedikasi prima aparatur negara.',
    competency: 'Loyalitas Profesi, Manajemen Kedaruratan (Crisis Management), dan Keselamatan Anak.',
    berakhlak: 'Loyal (Dedikasi) & Berorientasi Pelayanan (Tanggap Solutif)',
    psychologyBasis: 'Public Service Motivation (PSM) Framework dan Teori Tanggung Jawab Moral.',
    catTips: 'Pilih jawaban yang menunjukkan kesiapan pengorbanan profesi demi keselamatan kemanusiaan secara ikhlas.'
  }
];

// ═══════════════════════════════════════════════════════════════
// MAIN PROCEDURAL GENERATOR
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
    const qRand = getSeededRandom(`${dateStr}-teknis-high-${num}`);
    
    // Pick one of the detailed base templates
    const baseTemplate = TEKNIS_TEMPLATES[(num + dateStr.charCodeAt(0)) % TEKNIS_TEMPLATES.length];
    
    const student = STUDENT_NAMES[(num + dateStr.charCodeAt(1)) % STUDENT_NAMES.length];
    const room = ROOMS[(num + dateStr.charCodeAt(2)) % ROOMS.length];
    const dorm = DORM_NAMES[(num + dateStr.charCodeAt(3)) % DORM_NAMES.length];
    const staff = STAFF_NAMES[(num + dateStr.charCodeAt(0)) % STAFF_NAMES.length];

    // Inject variable details into the case study paragraph
    const questionText = baseTemplate.text
      .replace(/{student}/g, student)
      .replace(/{room}/g, room)
      .replace(/{dorm}/g, dorm)
      .replace(/{staff}/g, staff);

    // Dynamic Options: replace placeholders and shuffle/assign keys deterministically
    const keys: ('A'|'B'|'C'|'D'|'E')[] = ['A', 'B', 'C', 'D', 'E'];
    const formattedOptions = baseTemplate.options.map((opt, oIdx) => {
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
      topic: baseTemplate.topic,
      questionText: `[SKB CAT BKN Wali Asrama] ${questionText}`,
      options: formattedOptions,
      correctAnswer: 'A', // For grading system
      explanation: baseTemplate.explanation.replace(/{student}/g, student).replace(/{dorm}/g, dorm),
      competency: baseTemplate.competency,
      berakhlak: baseTemplate.berakhlak,
      psychologyBasis: baseTemplate.psychologyBasis,
      catTips: baseTemplate.catTips
    });
  }

  // 2. Managerial: 25 Soal (Numbers 91 to 115)
  for (let num = 91; num <= 115; num++) {
    const qRand = getSeededRandom(`${dateStr}-manajerial-high-${num}`);
    
    const baseTemplate = MANAGERIAL_TEMPLATES[(num + dateStr.charCodeAt(0)) % MANAGERIAL_TEMPLATES.length];
    
    const student = STUDENT_NAMES[(num + dateStr.charCodeAt(1)) % STUDENT_NAMES.length];
    const room = ROOMS[(num + dateStr.charCodeAt(2)) % ROOMS.length];
    const dorm = DORM_NAMES[(num + dateStr.charCodeAt(3)) % DORM_NAMES.length];
    const staff = STAFF_NAMES[(num + dateStr.charCodeAt(0)) % STAFF_NAMES.length];

    const questionText = baseTemplate.text
      .replace(/{student}/g, student)
      .replace(/{room}/g, room)
      .replace(/{dorm}/g, dorm)
      .replace(/{staff}/g, staff);

    const keys: ('A'|'B'|'C'|'D'|'E')[] = ['A', 'B', 'C', 'D', 'E'];
    const formattedOptions = baseTemplate.options.map((opt, oIdx) => {
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
      topic: baseTemplate.topic,
      questionText: `[SKB CAT BKN Wali Asrama] ${questionText}`,
      options: formattedOptions,
      correctAnswer: 'A',
      explanation: baseTemplate.explanation.replace(/{staff}/g, staff).replace(/{dorm}/g, dorm),
      competency: baseTemplate.competency,
      berakhlak: baseTemplate.berakhlak,
      psychologyBasis: baseTemplate.psychologyBasis,
      catTips: baseTemplate.catTips
    });
  }

  // 3. Sosial: 20 Soal (Numbers 116 to 135)
  result.push(ref4);

  for (let num = 117; num <= 135; num++) {
    const qRand = getSeededRandom(`${dateStr}-sosial-high-${num}`);
    
    const baseTemplate = SOCIAL_TEMPLATES[(num + dateStr.charCodeAt(0)) % SOCIAL_TEMPLATES.length];
    
    const student = STUDENT_NAMES[(num + dateStr.charCodeAt(1)) % STUDENT_NAMES.length];
    const room = ROOMS[(num + dateStr.charCodeAt(2)) % ROOMS.length];
    const dorm = DORM_NAMES[(num + dateStr.charCodeAt(3)) % DORM_NAMES.length];
    const staff = STAFF_NAMES[(num + dateStr.charCodeAt(0)) % STAFF_NAMES.length];

    const questionText = baseTemplate.text
      .replace(/{student}/g, student)
      .replace(/{room}/g, room)
      .replace(/{dorm}/g, dorm)
      .replace(/{staff}/g, staff);

    const keys: ('A'|'B'|'C'|'D'|'E')[] = ['A', 'B', 'C', 'D', 'E'];
    const formattedOptions = baseTemplate.options.map((opt, oIdx) => {
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
      topic: baseTemplate.topic,
      questionText: `[SKB CAT BKN Wali Asrama] ${questionText}`,
      options: formattedOptions,
      correctAnswer: 'A',
      explanation: baseTemplate.explanation.replace(/{student}/g, student).replace(/{dorm}/g, dorm),
      competency: baseTemplate.competency,
      berakhlak: baseTemplate.berakhlak,
      psychologyBasis: baseTemplate.psychologyBasis,
      catTips: baseTemplate.catTips
    });
  }

  // 4. Wawancara: 10 Soal (Numbers 136 to 145)
  result.push(ref5);

  for (let num = 137; num <= 145; num++) {
    const qRand = getSeededRandom(`${dateStr}-wawancara-high-${num}`);
    
    const baseTemplate = INTERVIEW_TEMPLATES[(num + dateStr.charCodeAt(0)) % INTERVIEW_TEMPLATES.length];
    
    const student = STUDENT_NAMES[(num + dateStr.charCodeAt(1)) % STUDENT_NAMES.length];
    const room = ROOMS[(num + dateStr.charCodeAt(2)) % ROOMS.length];
    const dorm = DORM_NAMES[(num + dateStr.charCodeAt(3)) % DORM_NAMES.length];
    const staff = STAFF_NAMES[(num + dateStr.charCodeAt(0)) % STAFF_NAMES.length];

    const questionText = baseTemplate.text
      .replace(/{student}/g, student)
      .replace(/{room}/g, room)
      .replace(/{dorm}/g, dorm)
      .replace(/{staff}/g, staff);

    const keys: ('A'|'B'|'C'|'D'|'E')[] = ['A', 'B', 'C', 'D', 'E'];
    const formattedOptions = baseTemplate.options.map((opt, oIdx) => {
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
      topic: baseTemplate.topic,
      questionText: `[SKB CAT BKN Wali Asrama] ${questionText}`,
      options: formattedOptions,
      correctAnswer: 'A',
      explanation: baseTemplate.explanation.replace(/{staff}/g, staff).replace(/{dorm}/g, dorm),
      competency: baseTemplate.competency,
      berakhlak: baseTemplate.berakhlak,
      psychologyBasis: baseTemplate.psychologyBasis,
      catTips: baseTemplate.catTips
    });
  }

  // Sort by number asc before returning
  return result.sort((a, b) => (a.number || 0) - (b.number || 0));
}
