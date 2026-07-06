# Simulator CAT BKN Sekolah Rakyat - Wali Asrama

Aplikasi Simulasi CAT BKN Sekolah Rakyat kualitas produksi siap latihan intensif bagi Wali Asrama. Dibangun dengan standar keandalan tinggi dan visual estetik premium yang terinspirasi oleh Stripe dan Linear.

---

## 🌟 FITUR UTAMA

1. **Login Kredensial & Pilihan Set Soal**: Registrasi nama, nomor peserta, instansi, dan pemilihan mode pengerjaan, lengkap dengan **Dropdown Pilihan Tanggal Set Ujian CAT**.
2. **Sistem CAT BKN Standar**:
   - 145 Soal per Hari/Set (90 Teknis, 25 Manajerial, 20 Sosial, 10 Wawancara).
   - Hard timer 130 menit dengan auto-submit ketika waktu habis.
   - Autosave real-time menggunakan IndexedDB (Dexie.js), sehingga jawaban tidak hilang jika halaman direfresh.
3. **Pilihan Ujian Berdasarkan Tanggal (Daily Sets)**:
   - Pengguna dapat memilih untuk menguji kompetensinya pada bank soal tanggal tertentu.
   - Database menyimpan riwayat bank soal per tanggal secara independen sehingga data tidak saling menimpa.
4. **Generator Soal Harian 145 Soal**:
   - **Melalui Web App**: Klik tombol "Update Soal Harian" di Admin Panel, masukkan tanggal target, dan sistem akan men-generate set 145 soal baru yang unik secara instan ke IndexedDB.
   - **Melalui CLI**: Jalankan command line generator untuk membuat file bank soal JSON mandiri sesuai tanggal hari ini.
5. **Analisis AI & Psikologi**: Menampilkan radar kompetensi psikologi (Leadership, Empathy, Integrity, dll.) serta rekomendasi materi belajar mingguan berdasarkan tingkat kesalahan pengerjaan.
6. **PWA & Offline Mode**: Dapat diinstal di desktop atau ponsel dan berjalan sepenuhnya secara lokal offline.
7. **Admin CRUD Panel**: Memungkinkan penambahan, penyuntingan, dan penghapusan soal secara real-time tanpa mengubah source code. Mendukung ekspor/impor bank soal via berkas JSON.
8. **Statistik Interaktif**: Grafis Recharts lengkap (Radar, Line, Bar, Pie) dan Heatmap Latihan Harian mirip visual kontribusi GitHub.
9. **Pencapaian (Achievements) & Leaderboard Lokal**: Gamifikasi pencapaian lencana dan persaingan ketat dengan rival simulasi lokal.

---

## 🛠️ TECH STACK

- **Framework**: Next.js 15 (Next 16.2 App Router) + React 19 + TypeScript
- **State & Database**: Zustand + Dexie.js (IndexedDB)
- **Styling & Motion**: Tailwind CSS v4 + Framer Motion
- **Form & Validation**: React Hook Form + Zod
- **Charts & Utilities**: Recharts + date-fns + sonner + Lucide Icons
- **Testing**: Vitest + Playwright

---

## 🚀 MEMULAI PROYEK

### Prasyarat
Pastikan Anda memiliki **Node.js (LTS)** terinstal di sistem Anda.

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Jalankan Mode Development
Jalankan server pengembangan lokal di `http://localhost:3000`:
```bash
npm run dev
```

### 3. Kompilasi & Build Produksi
Untuk melakukan kompilasi bundel optimasi produksi:
```bash
npm run build
npm run start
```

---

## 📅 PEMBARUAN & GENERATE BANK SOAL HARIAN (145 SOAL)

### Metode 1: Satu-Klik via Dashboard Admin (Web App)
1. Jalankan aplikasi dan masuk ke **Admin Panel** (klik tab Admin di Dashboard).
2. Klik tombol **Update Soal Harian** (ikon bintang/sparkles).
3. Masukkan tanggal yang diinginkan dengan format `YYYY-MM-DD` (default adalah tanggal hari ini).
4. Klik **OK** dan sistem akan otomatis menginjeksikan **145 soal baru** yang unik untuk tanggal tersebut ke IndexedDB lokal Anda.
5. Kembali ke halaman login, dropdown **Pilih Tanggal Soal CAT** akan langsung menampilkan tanggal baru tersebut.

### Metode 2: via Antigravity CLI (Terminal)
Gunakan perintah CLI berikut untuk men-generate file JSON set soal harian secara otomatis:
```bash
npm run generate-daily
```
Perintah ini akan membuat berkas JSON bernama `daily_questions_YYYY-MM-DD.json` di direktori utama proyek. Anda kemudian dapat memuat berkas ini ke dalam database menggunakan tombol **Impor JSON** di Admin Panel.

---

## 🧪 PENGUJIAN (TESTING)

### Unit & Integration Tests (Vitest)
Jalankan tes logika scoring, database seeder, dan pembagian kategori soal:
```bash
npx vitest run
```

### E2E Tests (Playwright)
Jalankan otomatisasi pengetesan integrasi browser:
```bash
# Instalasi browser Playwright jika pertama kali
npx playwright install

# Jalankan tes
npx playwright test
```

---

## 📦 DEPLOYMENT

### Deploy ke Vercel (Rekomendasi)
Proyek ini sepenuhnya kompatibel dengan infrastruktur Vercel. Untuk mendeploy melalui Vercel CLI:
```bash
npm install -g vercel
vercel
```

### Deploy menggunakan Docker
Kami menyediakan konfigurasi `Dockerfile` untuk deployment berbasis kontainer.

#### 1. Bangun Image Docker
```bash
docker build -t cat-sekolah-rakyat .
```

#### 2. Jalankan Kontainer
```bash
docker run -p 3000:3000 cat-sekolah-rakyat
```

---

## 📄 SKEMA IMPOR BANK SOAL (JSON)
Berikut adalah format JSON yang kompatibel untuk ditambahkan melalui Admin Panel:
```json
[
  {
    "id": 1,
    "dateStr": "2026-07-06",
    "number": 1,
    "category": "teknis",
    "topic": "Homesick",
    "questionText": "Pertanyaan studi kasus Anda...",
    "options": [
      { "key": "A", "text": "Opsi A", "score": 2 },
      { "key": "B", "text": "Opsi B", "score": 3 },
      { "key": "C", "text": "Opsi C", "score": 1 },
      { "key": "D", "text": "Opsi D", "score": 5 },
      { "key": "E", "text": "Opsi E", "score": 4 }
    ],
    "correctAnswer": "D",
    "explanation": "Pembahasan lengkap minimal 300 kata...",
    "competency": "Kategori kompetensi",
    "berakhlak": "Nilai BerAKHLAK terkait",
    "psychologyBasis": "Landasan psikologis",
    "catTips": "Tips CAT khusus"
  }
]
```
Jika berkas JSON Anda tidak menyertakan skema ini secara persis, Admin Panel akan menolak impor demi mencegah kerusakan data.
