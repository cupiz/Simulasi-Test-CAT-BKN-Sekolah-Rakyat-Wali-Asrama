# Simulator CAT BKN Sekolah Rakyat - Wali Asrama

Aplikasi Simulasi CAT BKN Sekolah Rakyat kualitas produksi siap latihan intensif bagi Wali Asrama. Dibangun dengan standar keandalan tinggi dan visual estetik premium menggunakan tema khas **Merah, Putih, dan Hitam** yang terinspirasi oleh Stripe dan Linear.

---

## 🌟 FITUR UTAMA

1. **Sistem Login & Daftar Cloud (Supabase)**:
   - Halaman depan dilengkapi dengan form **Masuk (Login)** dan **Daftar Akun Baru (Register)**.
   - Akun peserta dienkripsi secara aman dan disinkronkan ke cloud database sehingga dapat diakses di perangkat mana pun.
   - Mendukung **Mode Demo Lokal (IndexedDB)** secara otomatis sebagai fallback jika kredensial cloud belum dikonfigurasi, menjamin aplikasi tetap berjalan 100%.
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
- **Auth & Database Cloud**: Supabase (Auth & PostgreSQL DB)
- **Local Storage / Offline Cache**: Dexie.js (IndexedDB)
- **Styling & Motion**: Tailwind CSS v4 + Framer Motion (Tema Merah, Putih, Hitam)
- **Form & Validation**: React Hook Form + Zod
- **Charts & Utilities**: Recharts + date-fns + sonner + Lucide Icons
- **Testing**: Vitest + Playwright

---

## 🚀 MEMULAI PROYEK

### Prasyarat
Pastikan Anda memiliki **Node.js (LTS)** terinstal di sistem Anda.

### 1. Konfigurasi Variabel Lingkungan (Env Variables)
Buat file bernama `.env.local` di direktori utama proyek Anda dan isi dengan kunci API Supabase Anda (buat proyek gratis di [supabase.com](https://supabase.com)):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```
*Catatan: Jika variabel ini kosong, aplikasi akan otomatis berjalan dalam **Mode Demo Lokal** menggunakan IndexedDB lokal.*

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Jalankan Mode Development
Jalankan server pengembangan lokal di `http://localhost:3000`:
```bash
npm run dev
```

### 4. Kompilasi & Build Produksi
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

## 🏛️ SKEMA DATABASE CLOUD SUPABASE (SQL)
Jalankan perintah SQL berikut di dalam **SQL Editor** pada dashboard Supabase Anda untuk membuat tabel penyimpanan riwayat nilai ujian:

```sql
-- Membuat tabel riwayat nilai ujian
create table public.exam_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date bigint not null,
  mode text not null,
  scores jsonb not null,
  max_scores jsonb not null,
  percentage integer not null,
  is_passed boolean not null,
  time_spent integer not null,
  answers jsonb not null,
  ai_analysis jsonb not null
);

-- Mengaktifkan Row Level Security (RLS) demi keamanan data
alter table public.exam_history enable row level security;

-- Membuat policy agar user hanya bisa membaca data miliknya
create policy "Users can read own history"
  on public.exam_history for select
  using ( auth.uid() = user_id );

-- Membuat policy agar user hanya bisa memasukkan data miliknya
create policy "Users can insert own history"
  on public.exam_history for insert
  with check ( auth.uid() = user_id );
```

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
1. Pastikan Anda sudah login ke Vercel CLI (`vercel login`).
2. Masukkan perintah berikut di terminal:
   ```bash
   vercel
   ```
3. Setel variabel lingkungan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` di dashboard Vercel Anda, lalu lakukan re-deploy.
