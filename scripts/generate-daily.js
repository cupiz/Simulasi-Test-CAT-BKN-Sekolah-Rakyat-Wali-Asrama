const fs = require('fs');
const path = require('path');

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

const TEKNIS_TEMPLATES = [
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
      { text: 'Mengajak {student} berdialog mengenai esensi keseimbangan antara prestasi akademis and kontribusi sosial, lalu membimbingnya meluangkan waktu sejenak untuk membantu teman-temannya.', score: 5 },
      { text: 'Mengarahkan {student} untuk mengganti kontribusi fisiknya dengan membuat rangkuman materi pelajaran yang bermanfaat bagi seluruh penghuni asrama.', score: 4 },
      { text: 'Memfasilitasi forum musyawarah asrama untuk merumuskan dispensasi khusus yang legal bagi siswa yang sedang bersiap menghadapi kompetisi penting.', score: 3 },
      { text: 'Meminta {student} untuk memimpin doa dan memberikan evaluasi di akhir kegiatan kerja bakti sebagai wujud kontribusi kepemimpinan bagi asrama.', score: 2 },
      { text: 'Memberikan apresiasi atas kegigihan belajar {student} di depan umum, serta memotivasi siswa lain untuk meniru semangat belajarnya di waktu yang tepat.', score: 1 }
    ],
    explanation: 'Mengajak {student} berdialog membantu membangun kesadaran moral mengenai pentingnya menyeimbangkan prestasi akademik individu dengan tanggung jawab sosial kemasyarakatan di asrama.',
    competency: 'Budaya Sekolah, Pembinaan Karakter Disiplin, dan Manajemen Konflik.',
    berakhlak: 'Harmonis (Kedamaian Komunitas) & Akuntabel (Tanggung Jawab Sosial)',
    psychologyBasis: 'Teori perkembangan moral Kohlberg pada tahap pasca-konvensional (kontrak sosial).',
    catTips: 'Pilih opsi yang mendidik karakter siswa secara personal melalui dialog dua arah, bukan hukuman langsung atau dispensasi yang merusak kebersamaan kelompok.'
  },
  {
    topic: 'Kepemimpinan & Gaya Komunikasi',
    text: '{student} adalah seorang ketua organisasi siswa di asrama {dorm} yang dikenal sangat disiplin. Namun, Anda memperhatikan bahwa dalam beberapa minggu terakhir, {student} cenderung menggunakan intonasi suara yang tinggi dan instruksi yang kaku saat menegakkan tata krama makan di aula asrama kepada para siswa junior. Meskipun para junior patuh, suasana makan menjadi tegang. Rekan sesama pengurus menyatakan bahwa metode {student} efektif untuk menjaga keteraturan. Sikap Anda sebagai Wali Asrama untuk membina karakter kepemimpinan {student} adalah...',
    options: [
      { text: 'Membimbing {student} melalui bimbingan personal mengenai konsep kepemimpinan yang mengayomi, serta mengajaknya merancang metode penegakan tata krama berbasis keteladanan bersama.', score: 5 },
      { text: 'Memberikan pujian kepada {student} atas kedisiplinannya, disertai saran tertulis mengenai variasi metode penegakan aturan yang lebih persuasif.', score: 4 },
      { text: 'Mengadakan pelatihan etika komunikasi publik bagi seluruh pengurus asrama guna meningkatkan kompetensi berbicara mereka.', score: 3 },
      { text: 'Melakukan rotasi berkala posisi pengurus asrama agar terjadi penyegaran gaya komunikasi di lingkungan ruang makan.', score: 2 },
      { text: 'Menhadiri setiap sesi makan malam secara langsung untuk memberikan teladan nyata mengenai cara menegur yang ramah dan menyejukkan.', score: 1 }
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

const MANAGERIAL_TEMPLATES = [
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

const SOCIAL_TEMPLATES = [
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

const INTERVIEW_TEMPLATES = [
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

function generateOptions(category, student, problem) {
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
  } else {
    return [
      { text: `Menolak keterlibatan tersebut secara tegas, mengingatkan rekan sejawat akan sumpah jabatan dan nilai integritas Core Values ASN BerAKHLAK, serta melaporkannya secara resmi kepada pimpinan disertai bukti objektif.`, score: 5 },
      { text: `Mengajak rekan sejawat berdiskusi secara personal, memberikan nasihat persuasif mengenai konsekuensi hukum dan moral dari tindakan tersebut, serta memintanya menghentikan pelanggaran tersebut secara sukarela.`, score: 4 },
      { text: `Memilih bersikap netral dengan menolak tawaran tersebut demi keselamatan karir pribadi, namun tidak melaporkan temuan tersebut kepada pimpinan untuk menjaga solidaritas kerja.`, score: 3 },
      { text: `Menceritakan kejadian tersebut kepada rekan kerja lainnya atau pengurus komite sekolah secara informal agar menjadi bahan evaluasi sosial tidak resmi di lingkungan kerja.`, score: 2 },
      { text: `Menerima hal tersebut secara kompromistis dengan syarat hasil kontribusi tersebut dialokasikan sepenuhnya untuk peningkatan fasilitas umum asrama siswa yang membutuhkan bantuan finansial.`, score: 1 }
    ];
  }
}

function generateDaily(dateStr) {
  const result = [];
  const rand = getSeededRandom(dateStr);

  const ref1 = {
    category: 'teknis',
    topic: 'Homesick & Peer Support',
    questionText: '[SKB CAT BKN Wali Asrama] Sebagai Wali Asrama Sekolah Rakyat, Anda mendapati bahwa Danis sering terlambat mengikuti apel pagi karena ia kerap terjaga hingga larut malam demi menemani dan menenangkan teman sekamarnya yang sedang mengalami kecemasan hebat akibat rindu rumah (homesick). Di sisi lain, anggota kamar yang lain mulai merasa kurang nyaman karena poin kedisiplinan kamar mereka menurun akibat keterlambatan Danis yang berulang. Langkah pembinaan karakter dan penataan operasional yang paling bijaksana untuk menyelesaikan dinamika tersebut adalah...',
    options: [
      { key: 'A', text: 'Memberikan penghargaan kepada kamar lain yang selalu tepat waktu agar menjadi contoh nyata bagi Danis dan teman kamarnya untuk memperbaiki manajemen waktu.', score: 2 },
      { key: 'B', text: 'Mengadakan kelas manajemen waktu dan regulasi emosi bagi seluruh penghuni asrama agar setiap individu mampu menyeimbangkan empati dan kedisiplinan.', score: 3 },
      { key: 'C', text: 'Melakukan pemindahan Danis ke kamar khusus yang diisi oleh para pengurus asrama agar ia mendapatkan bimbingan intensif mengenai pembagian skala prioritas.', score: 1 },
      { key: 'D', text: 'Memfasilitasi diskusi kamar untuk mengapresiasi empati Danis, sekaligus merancang bersama sistem dukungan bergantian bagi siswa yang cemas agar tanggung jawab kepedulian dipikul bersama.', score: 5 },
      { key: 'E', text: 'Menjadwalkan sesi konseling personal bagi Danis dan siswa yang cemas tersebut guna menguatkan ketahanan mental serta kemandirian mereka selama di asrama.', score: 4 }
    ],
    correctAnswer: 'D',
    explanation: 'Pilihan D adalah solusi terbaik karena mengedepankan pendekatan kolaboratif dan gotong royong yang menjadi ciri khas Sekolah Rakyat. Di asrama, kebersamaan dan empati adalah nilai luhur yang perlu ditumbuhkan, namun tidak boleh mengorbankan kedisiplinan kelompok. Dengan memfasilitasi diskusi kamar untuk mengapresiasi empati Danis, asisten/wali asrama mengakui tindakan baik tersebut, sekaligus memberdayakan anggota kamar lainnya untuk ikut peduli dengan membuat jadwal dukungan bergantian (peer-support system). Hal ini memecah beban agar tidak menumpuk di Danis saja, mengembalikan kedisiplinan kamar, dan mengajarkan tanggung jawab sosial kepada semua siswa.',
    competency: 'SOP Asrama, Resolusi Konflik, dan Karakter Kebangsaan (Gotong Royong).',
    berakhlak: 'Harmonis & Kolaboratif',
    psychologyBasis: 'Social Support Theory (Teori Dukungan Sosial) dan Peer-Assisted Learning/Support Systems. Tekanan emosional homesick diatasi secara komunal guna membangun resiliensi kelompok.',
    catTips: 'Cari jawaban yang tidak sekadar menerapkan sanksi atau memisahkan siswa, melainkan jawaban yang memberdayakan ekosistem asrama untuk menyelesaikan masalah secara bersama-sama.',
    dateStr,
    number: 1
  };

  const ref2 = {
    category: 'teknis',
    topic: 'SOP Asrama',
    questionText: '[SKB CAT BKN Wali Asrama] Pada saat kegiatan kerja bakti berkala membersihkan lingkungan asrama Sekolah Rakyat, Anda melihat Galih sedang membaca buku di sudut gazebo yang tenang. Ketika Anda mendekatinya, Galih menjelaskan dengan sangat sopan bahwa ia ingin memaksimalkan waktu luangnya untuk mempersiapkan diri menghadapi kompetisi sains tingkat nasional yang akan berlangsung minggu depan. Teman-teman sebayanya mulai menggerutu, namun mereka tetap melanjutkan pekerjaan mereka. Tindakan pembinaan yang paling tepat untuk mengarahkan perilaku Galih adalah...',
    options: [
      { key: 'A', text: 'Meminta Galih untuk memimpin doa dan memberikan evaluasi di akhir kegiatan kerja bakti sebagai wujud kontribusi kepemimpinan bagi asrama.', score: 2 },
      { key: 'B', text: 'Mengajak Galih berdialog mengenai esensi keseimbangan antara prestasi akademis dan kontribusi sosial, lalu membimbingnya meluangkan waktu sejenak untuk membantu teman-temannya.', score: 5 },
      { key: 'C', text: 'Memfasilitasi forum musyawarah asrama untuk merumuskan dispensasi khusus yang legal bagi siswa yang sedang bersiap menghadapi kompetisi penting.', score: 3 },
      { key: 'D', text: 'Memberikan apresiasi atas kegigihan belajar Galih di depan umum, serta memotivasi siswa lain untuk meniru semangat belajarnya di waktu yang tepat.', score: 1 },
      { key: 'E', text: 'Mengarahkan Galih untuk mengganti kontribusi fisiknya dengan membuat rangkuman materi pelajaran yang bermanfaat bagi seluruh penghuni asrama.', score: 4 }
    ],
    correctAnswer: 'B',
    explanation: 'Pilihan B adalah yang terbaik karena menyentuh ranah kognitif dan afektif melalui dialog empatik. Sebagai Wali Asrama, penting untuk membina pemahaman Galih tentang pentingnya keseimbangan (balance) antara kesuksesan akademik individu dan kepedulian terhadap lingkungan sosial (komunitas asrama). Dengan mengajaknya berdialog, Galih dibimbing menyadari bahwa kebersamaan dan kerja bakti adalah nilai integritas sosial, lalu ia secara sadar didorong untuk meluangkan sedikit waktu guna membantu temannya. Ini menjaga harmoni asrama dan mencegah kecemburuan sosial.',
    competency: 'Budaya Sekolah, Pembinaan Karakter Disiplin, dan Manajemen Konflik.',
    berakhlak: 'Harmonis & Akuntabel',
    psychologyBasis: 'Social Identity Theory (Teori Identitas Sosial) dan perkembangan moral Kohlberg pada tahap pasca-konvensional, di mana individu menyadari pentingnya kontrak sosial dan kontribusi bagi kesejahteraan bersama.',
    catTips: 'Pilihlah opsi yang mendidik karakter siswa secara personal melalui dialog dua arah, bukan dengan hukuman langsung atau dispensasi yang merusak kebersamaan kelompok.',
    dateStr,
    number: 2
  };

  const ref3 = {
    category: 'teknis',
    topic: 'Leadership',
    questionText: '[SKB CAT BKN Wali Asrama] Panji adalah seorang ketua organisasi siswa di asrama Sekolah Rakyat yang dikenal sangat disiplin. Namun, Anda memperhatikan bahwa dalam beberapa minggu terakhir, Panji cenderung menggunakan intonasi suara yang tinggi dan instruksi yang kaku saat menegakkan tata krama makan di aula asrama kepada para siswa junior. Meskipun para junior patuh, suasana makan menjadi tegang. Rekan sesama pengurus menyatakan bahwa metode Panji efektif untuk menjaga keteraturan. Sikap Anda sebagai Wali Asrama untuk membina karakter kepemimpinan Panji adalah...',
    options: [
      { key: 'A', text: 'Melakukan rotasi berkala posisi pengurus asrama agar terjadi penyegaran gaya komunikasi di lingkungan ruang makan.', score: 2 },
      { key: 'B', text: 'Mengadakan pelatihan etika komunikasi publik bagi seluruh pengurus asrama guna meningkatkan kompetensi berbicara mereka.', score: 3 },
      { key: 'C', text: 'Memberikan pujian kepada Panji atas kedisplinannya, disertai saran tertulis mengenai variasi metode penegakan aturan yang lebih persuasif.', score: 4 },
      { key: 'D', text: 'Menghadiri setiap sesi makan malam secara langsung untuk memberikan teladan nyata mengenai cara menegur yang ramah dan menyejukkan.', score: 1 },
      { key: 'E', text: 'Membimbing Panji melalui bimbingan personal mengenai konsep kepemimpinan yang mengayomi, serta mengajaknya merancang metode penegakan tata krama berbasis keteladan bersama.', score: 5 }
    ],
    correctAnswer: 'E',
    explanation: 'Pilihan E adalah solusi pembinaan kepemimpinan yang paling utuh. Panji memiliki niat baik (disiplin) tetapi menggunakan metode kepemimpinan yang otoriter dan menciptakan atmosfer ketakutan. Sebagai Wali Asrama, pembinaan kepemimpinan terbaik dilakukan lewat bimbingan personal (one-on-one coaching) untuk menanamkan esensi kepemimpinan yang mengayomi (servant leadership). Mengajak Panji merancang tata krama asrama berbasis keteladanan (role modeling) mengajarkannya bahwa kepatuhan sejati lahir dari rasa hormat dan inspirasi, bukan intimidasi.',
    competency: 'Kepemimpinan (Leadership), Etika Komunikasi, dan Pembinaan Karakter.',
    berakhlak: 'Berorientasi Pelayanan & Harmonis',
    psychologyBasis: 'Servant Leadership Theory (Greenleaf) dan Transformational Leadership, di mana pemimpin menginspirasi pengikut untuk mencapai tujuan bersama dalam suasana saling menghargai.',
    catTips: 'Carilah opsi yang memberikan bimbingan langsung kepada pelaku (coaching) serta berfokus pada kolaborasi jangka panjang untuk mengubah metode penegakan aturan yang kaku menjadi persuasif.',
    dateStr,
    number: 3
  };

  const ref4 = {
    category: 'sosial',
    topic: 'Budaya',
    questionText: '[SKB CAT BKN Wali Asrama] Dalam rapat persiapan festival budaya asrama Sekolah Rakyat, suasana menjadi hangat dan menjurus pada perdebatan sengit. Kelompok siswa yang berasal dari wilayah Sumatera, Jawa, dan Indonesia Timur bersikeras bahwa kebudayaan asli daerah merekalah yang harus menjadi tema utama dan pementasan pembuka festival. Masing-masing pihak merasa daerahnya memiliki nilai filosofis yang paling tinggi. Langkah Anda selaku Wali Asrama untuk menanamkan karakter kebangsaan dan menghargai sesama adalah...',
    options: [
      { key: 'A', text: 'Merancang kolaborasi pertunjukan drama musikal yang memadukan unsur-unsur cerita rakyat dari seluruh daerah tersebut ke dalam satu kesatuan pentas yang utuh.', score: 5 },
      { key: 'B', text: 'Menetapkan tema festival secara mandiri dari pihak pengelola asrama untuk menjaga netralitas dan kedamaian di antara kelompok siswa.', score: 2 },
      { key: 'C', text: 'Memberikan waktu tambahan bagi setiap kelompok untuk berlatih secara terpisah demi menampilkan performa terbaik mereka masing-masing.', score: 3 },
      { key: 'D', text: 'Mengundang tokoh budayawan nasional untuk memberikan ceramah intensif mengenai indahnya keberagaman dan persatuan bangsa kepada seluruh siswa.', score: 4 },
      { key: 'E', text: 'Menyediakan panggung yang sama luas dan durasi yang sama persis bagi setiap daerah agar asas keadilan terpenuhi secara nyata.', score: 1 }
    ],
    correctAnswer: 'A',
    explanation: 'Pilihan A adalah GFM dari integrasi nasional dan kebinekaan global. Di Sekolah Rakyat yang mengusung nilai persatuan, kompetisi kedaerahan yang berlebihan harus diubah menjadi kolaborasi yang harmonis. Melalui drama musikal kolaboratif yang menggabungkan kisah Sumatera, Jawa, dan Indonesia Timur, siswa didorong untuk bekerja sama secara erat, mempelajari budaya rekan mereka, dan menyadari bahwa keindahan sejati Indonesia terletak pada perpaduan budaya tersebut (Bhineka Tunggal Ika), bukan keunggulan satu daerah atas daerah lain.',
    competency: 'Keberagaman (Diversity), Inklusivitas, dan Kerja Sama (Collaboration).',
    berakhlak: 'Harmonis & Kolaboratif',
    psychologyBasis: 'Contact Hypothesis (Allport) yang menyatakan bahwa prasangka dan konflik antar-kelompok dapat direduksi melalui kerja sama yang setara demi mencapai tujuan bersama.',
    catTips: 'Pilih solusi yang melebur perbedaan menjadi satu karya kolaboratif bersama (integrasi), bukan membagi panggung secara terpisah (segregasi) sekalipun terlihat adil.',
    dateStr,
    number: 116
  };

  const ref5 = {
    category: 'wawancara',
    topic: 'Integritas',
    questionText: '[SKB CAT BKN Wali Asrama] Satria menemukan sebuah dompet berisi uang tunai dalam jumlah cukup besar di koridor asrama. Berdasarkan kartu identitas di dalamnya, dompet tersebut milik salah satu petugas kebersihan dapur asrama yang dikenal sedang kesulitan membiayai sekolah anaknya. Satria mengamankan dompet tersebut di lemarinya dan bermaksud mengembalikannya saat area dapur sepi karena ia merasa canggung. Di sisi lain, petugas kebersihan tersebut tampak sangat panik dan menangis di ruang utama. Tindakan Wali Asrama yang paling edukatif adalah...',
    options: [
      { key: 'A', text: 'Mengarahkan Satria untuk menyerahkan dompet tersebut melalui perantara pengurus asrama demi menjaga kenyamanan emosionalnya.', score: 2 },
      { key: 'B', text: 'Memberikan penghargaan atas niat baik Satria untuk mengembalikannya di hadapan seluruh penghuni asrama pada apel pagi.', score: 1 },
      { key: 'C', text: 'Mendampingi Satria secara personal untuk menyerahkan dompet itu langsung kepada pemiliknya sembari membimbingnya menyampaikan permohonan maaf atas keterlambatan pengembalian.', score: 5 },
      { key: 'D', text: 'Mengadakan forum refleksi massal mengenai pentingnya menjaga kejujuran dan kecepatan dalam mengembalikan hak milik sesama manusia.', score: 4 },
      { key: 'E', text: 'Menyimpan dompet tersebut di kantor asrama dan mengundang staf dapur untuk mengambilnya secara resmi agar suasana tetap kondusif.', score: 3 }
    ],
    correctAnswer: 'C',
    explanation: 'Pilihan C memiliki muatan edukasi karakter yang paling seimbang dan langsung menyentuh akar permasalahan. Satria memiliki nilai kejujuran (ingin mengembalikan dompet), tetapi ia kurang peka terhadap urgensi waktu dan penderitaan emosional pemilik dompet (yang menangis panik). Dengan mendampingi Satria secara personal, Wali Asrama memberikan rasa aman kepada Satria agar tidak merasa canggung, sekaligus mengajarkannya pelajaran moral penting: kejujuran harus dibarengi dengan empati yang cepat tanggap (urgency). Meminta maaf atas keterlambatan pengembalian melatih keberanian moral dan tanggung jawab atas dampak tindakannya.',
    competency: 'Integritas (Integrity), Empati (Empathy), dan Pengambilan Keputusan (Decision Making).',
    berakhlak: 'Akuntabel & Harmonis',
    psychologyBasis: 'Perspective-Taking Theory (Teori Pengambilan Perspektif) dan teori perkembangan sosial-emosional, di mana anak dilatih merasakan kecemasan orang lain dan bertindak proaktif untuk meringankannya.',
    catTips: 'Pilihlah opsi yang menggabungkan aspek kejujuran formal dengan pendidikan karakter empati dan tindakan nyata langsung kepada pihak yang membutuhkan bantuan.',
    dateStr,
    number: 136
  };

  // 1. Technical: 90 Questions
  result.push(ref1, ref2, ref3);
  for (let num = 4; num <= 90; num++) {
    const qRand = getSeededRandom(`${dateStr}-teknis-high-${num}`);
    const baseTemplate = TEKNIS_TEMPLATES[(num + dateStr.charCodeAt(0)) % TEKNIS_TEMPLATES.length];
    
    const student = STUDENT_NAMES[(num + dateStr.charCodeAt(1)) % STUDENT_NAMES.length];
    const room = ROOMS[(num + dateStr.charCodeAt(2)) % ROOMS.length];
    const dorm = DORM_NAMES[(num + dateStr.charCodeAt(3)) % DORM_NAMES.length];
    const staff = STAFF_NAMES[(num + dateStr.charCodeAt(0)) % STAFF_NAMES.length];

    const questionText = baseTemplate.text
      .replace(/{student}/g, student)
      .replace(/{room}/g, room)
      .replace(/{dorm}/g, dorm)
      .replace(/{staff}/g, staff);

    const keys = ['A', 'B', 'C', 'D', 'E'];
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
      correctAnswer: 'A',
      explanation: baseTemplate.explanation.replace(/{student}/g, student).replace(/{dorm}/g, dorm),
      competency: baseTemplate.competency,
      berakhlak: baseTemplate.berakhlak,
      psychologyBasis: baseTemplate.psychologyBasis,
      catTips: baseTemplate.catTips
    });
  }

  // 2. Managerial: 25 Questions
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

    const keys = ['A', 'B', 'C', 'D', 'E'];
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

  // 3. Sosial: 20 Questions
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

    const keys = ['A', 'B', 'C', 'D', 'E'];
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

  // 4. Wawancara: 10 Questions
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

    const keys = ['A', 'B', 'C', 'D', 'E'];
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

  return result.sort((a, b) => a.number - b.number);
}

const today = new Date();
const dateStrToday = today.toISOString().split('T')[0];
const questionsToday = generateDaily(dateStrToday);

const fileName = `daily_questions_${dateStrToday}.json`;
const filePath = path.join(__dirname, '..', fileName);

fs.writeFileSync(filePath, JSON.stringify(questionsToday, null, 2), 'utf-8');

console.log(`\n======================================================`);
console.log(`🎉 SUKSES GENERATE SET UJIAN HARIAN (145 SOAL) VIA CLI!`);
console.log(`Tanggal: ${dateStrToday}`);
console.log(`Jumlah Soal: ${questionsToday.length} Butir`);
console.log(`Lokasi File: ${filePath}`);
console.log(`Silakan unggah berkas ini melalui tombol "Impor JSON" di Admin Panel.`);
console.log(`======================================================\n`);
