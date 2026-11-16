# ARABEEZA — Bahan Ajar Bahasa Arab Interaktif

ARABEEZA adalah bahan ajar Bahasa Arab inklusif berbasis website untuk siswa kelas X Madrasah Aliyah (Fase E). Paket awal berfokus pada **Materi 1: التَّعَارُفُ (At-Ta‘āruf / Perkenalan)** sesuai dokumen rancangan yang diberikan.

Project ini menggunakan Next.js App Router, React, TypeScript, Tailwind CSS, dan Supabase (Auth + PostgreSQL). Struktur ZIP ini sengaja dibuat **langsung di root project**: folder `app/` dan file `package.json` berada sejajar. Karena itu, ketika diunggah ke GitHub, unggah **isi ZIP**, bukan folder pembungkusnya.

## Pembaruan pada revisi ini

- Navigasi mobile menampilkan label Beranda, Capaian, Toko, dan Profil.
- Maskot kucing Arabeeza tampil di beranda dan selama latihan; logo SVG juga diganti menjadi kucing.
- Dashboard menampilkan jalur visual 10 level dengan label kesulitan.
- Jawaban tidak langsung dikoreksi saat dipilih. Siswa harus menekan tombol **Periksa jawaban**.
- Soal yang meminta arti kosakata tidak menampilkan ulang teks Arab yang merupakan petunjuk jawaban.
- Isi ulang 5 nyawa diturunkan menjadi 25 berlian; jalankan migration 002 pada database yang sudah ada.
- Avatar mendapat opsi karakter laki-laki/perempuan, model rambut, kerudung, dan ekspresi wajah.
- Capaian At-Ta‘āruf dilengkapi tujuh target pembelajaran sesuai dokumen revisi.

**Catatan bank soal:** ZIP sumber hanya menyediakan 15 butir soal untuk Materi 1. Karena itu 10 bulatan level sudah disediakan pada tampilan, tetapi bank soal unik 15 butir untuk masing-masing level (150 butir) belum tersedia dan belum boleh dianggap sudah dibuat. Saat ini level-level tersebut masih mengarah ke bank soal 15 butir yang sama. Materi 2–5 pada dokumen sudah ditampilkan sebagai cakupan panduan/capaian, tetapi belum dibuat menjadi sesi bank soal terpisah.

## Fitur pada paket awal

- Landing page ARABEEZA, registrasi, login, dan logout.
- Dashboard siswa: XP, berlian, 5 nyawa, streak harian, dan jalur materi.
- Materi 1 At-Ta‘āruf: kosakata berharakat, transliterasi, terjemahan, contoh kalimat, kata tanya, kata ganti, dan dialog.
- Empat pilihan latihan: campuran 4 maharah, menyimak, membaca/pelafalan, dan percakapan.
- Sesi latihan maksimal 15 soal, umpan balik benar/salah, serta pengulangan soal yang belum benar.
- Hadiah XP dan berlian berdasarkan skor; toko untuk menukar 25 berlian menjadi 5 nyawa.
- Profil dan pengaturan avatar dasar.
- Halaman capaian pembelajaran Fase E.
- Dashboard guru untuk melihat siswa dan menulis catatan pembelajaran.
- Supabase Row Level Security (RLS), migration, seed materi, dan fungsi database untuk menyimpan hasil sesi.
- Tampilan responsif dan struktur navigasi mobile.

> Catatan cakupan: katalog avatar lanjutan, fitur mengikuti teman, animasi video streak, serta editor bank soal visual belum termasuk pada paket tahap awal. Struktur database dan aplikasi dapat dikembangkan untuk fitur tersebut.

## Teknologi dan versi runtime

- Node.js 20.9+ (disarankan Node.js 22)
- Next.js 15 App Router
- React 19
- TypeScript 5
- Tailwind CSS 3
- Supabase Auth + PostgreSQL
- Vercel untuk deployment

## 1. Struktur project

```text
ARABEEZA/
├── app/
│   ├── dashboard/
│   ├── lessons/[slug]/
│   ├── login/
│   ├── outcomes/
│   ├── practice/[slug]/
│   ├── profile/
│   ├── register/
│   ├── shop/
│   ├── teacher/
│   ├── actions.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── docs/
├── lib/supabase/
├── public/
├── supabase/migrations/001_init.sql
├── supabase/seed.sql
├── middleware.ts
├── package.json
└── next.config.ts
```

## 2. Jalankan secara lokal

```bash
npm install
```

Salin `.env.example` menjadi `.env.local`, lalu isi kredensial Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLIC_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Jika project Supabase menggunakan publishable key baru, dapat digunakan sebagai alternatif:

```env
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Kemudian jalankan:

```bash
npm run dev
```

Buka `http://localhost:3000`.

## 3. Siapkan database Supabase

1. Buat project baru di Supabase.
2. Buka **Project Settings → API** untuk mengambil Project URL dan anon/public key atau publishable key.
3. Buka **SQL Editor**.
4. Jalankan seluruh isi `supabase/migrations/001_init.sql`.
5. Jalankan seluruh isi `supabase/migrations/002_arabeeza_revision.sql` untuk harga isi ulang nyawa 25 berlian dan opsi avatar lanjutan.
6. Jalankan seluruh isi `supabase/seed.sql` untuk memasukkan Materi 1, kosakata, dialog, dan bank soal.

Jalankan migration sebelum seed. File seed dapat dijalankan ulang; data inti memakai kunci unik agar tidak menggandakan baris.

## 4. Deploy ke GitHub dan Vercel

### A. Upload ke GitHub

1. Buat repository baru, misalnya `arabeeza`.
2. Ekstrak ZIP ini.
3. Masuk ke folder hasil ekstraksi.
4. Pilih seluruh isi folder (termasuk `app`, `components`, `lib`, `package.json`, dan file konfigurasi).
5. Upload ke **root repository GitHub**. Jangan membuat folder tambahan seperti `arabeeza/arabeeza/`.
6. Pastikan halaman utama repository langsung menampilkan folder `app` dan file `package.json`.

### B. Konfigurasi Vercel

1. Impor repository GitHub ke Vercel.
2. Framework Preset: **Next.js**.
3. Root Directory: **kosong / `./`** karena `app/` dan `package.json` berada di root repository.
4. Build Command: `npm run build` (default Next.js juga boleh).
5. Install Command: `npm install`.
6. Output Directory: biarkan default/kosong.
7. Tambahkan Environment Variables berikut untuk **Production** dan **Preview**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (atau `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
   - `NEXT_PUBLIC_SITE_URL` (isi dengan domain utama Vercel, misalnya `https://nama-project.vercel.app`)
8. Klik Deploy.

Halaman yang membutuhkan data Supabase ditandai `force-dynamic`, sehingga tidak diprerender saat build. Ini mencegah proses `next build` mencoba membaca sesi/database Supabase saat deployment. Koneksi Supabase tetap wajib tersedia saat pengguna membuka fitur login, dashboard, materi, latihan, profil, toko, atau dashboard guru.

### C. Pengaturan URL Supabase Auth dan verifikasi email

Setelah deployment berhasil, buka Supabase → Authentication → URL Configuration.

- Atur **Site URL** ke domain utama Vercel, misalnya `https://nama-project.vercel.app`.
- Tambahkan URL callback berikut ke **Redirect URLs**: `https://nama-project.vercel.app/auth/callback`.
- Pastikan provider **Email** aktif pada Authentication → Providers.
- Jika verifikasi email diaktifkan, siswa harus membuka email konfirmasi sebelum dapat login. Aplikasi akan menampilkan instruksi setelah pendaftaran.
- Pastikan `NEXT_PUBLIC_SITE_URL` di Vercel sama dengan domain utama tersebut, lalu redeploy setelah mengubah Environment Variables.

Route `/auth/callback` menukar kode verifikasi menjadi sesi login Supabase dan mengarahkan siswa ke dashboard.

## 5. Alur registrasi dan login siswa

1. Siswa membuka `/register`, mengisi nama lengkap, email, dan kata sandi minimal 8 karakter.
2. Aplikasi mengirim pendaftaran ke Supabase Auth dan menyimpan `display_name` sebagai metadata pengguna.
3. Jika Supabase mengaktifkan konfirmasi email, halaman registrasi menampilkan instruksi untuk membuka email dan mengklik tautan verifikasi. Tautan diarahkan ke `/auth/callback`, lalu sesi ditukar dan pengguna diarahkan ke dashboard.
4. Jika konfirmasi email dinonaktifkan, sesi langsung dibuat dan pengguna diarahkan ke `/dashboard`.
5. Profil siswa dibuat otomatis oleh trigger `on_auth_user_created` dari migration `001_init.sql`.

Jika tombol daftar tidak menghasilkan akun, periksa:
- Environment Variables `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` atau `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Migration `supabase/migrations/001_init.sql` sudah dijalankan pada project Supabase yang sama.
- Authentication → Providers → Email dalam keadaan aktif.
- Authentication → URL Configuration memiliki URL callback domain aplikasi.
- Authentication → Users untuk memastikan apakah user baru benar-benar tercatat.

## 6. Membuat akun guru

Registrasi normal membuat role `student`. Untuk mengubah akun tertentu menjadi guru:

1. Daftarkan akun melalui `/register`.
2. Buka Supabase → Authentication → Users dan salin UUID akun.
3. Jalankan SQL berikut:

```sql
update public.profiles
set role = 'teacher'
where id = 'UUID-AKUN-GURU';
```

4. Login ulang. Menu `/teacher` tersedia untuk role `teacher` atau `admin`.

Jangan memberikan role guru/admin kepada pengguna umum.

## 7. Pemeriksaan sebelum rilis

```bash
npm run typecheck
npm run build
```

Pastikan juga:
- Root GitHub langsung memiliki folder `app/` dan file `package.json`.
- Root Directory Vercel kosong/`./`.
- Environment Variables Supabase terisi tanpa spasi tambahan.
- Migration dan seed telah dijalankan pada project Supabase yang benar.
- URL Vercel telah dimasukkan ke konfigurasi Supabase Auth.

## Catatan fitur dan validasi

- Audio menggunakan suara Arab yang tersedia pada browser/perangkat; ketersediaan suara dan Speech Recognition berbeda antar-browser.
- Avatar pada paket awal menggunakan pilihan warna karakter dan pakaian dasar.
- Bank soal awal adalah materi contoh yang perlu ditinjau guru sebelum digunakan untuk penilaian resmi.
- Hasil latihan disimpan melalui Supabase RPC. Sebelum digunakan sebagai penilaian berisiko tinggi, validasi jawaban dan perhitungan hadiah sebaiknya dipindahkan sepenuhnya ke server/database.
- Jika verifikasi email Supabase aktif, siswa perlu mengonfirmasi email sebelum login.

## Identitas bahan ajar

- Nama bahan ajar: Bahan Ajar Bahasa Arab Inklusif Berbasis Website
- Nama produk: **ARABEEZA**
- Mata pelajaran: Bahasa Arab
- Satuan pendidikan: Madrasah Aliyah (MA)
- Kelas/Fase: X / Fase E
- Materi awal: التَّعَارُفُ (At-Ta‘āruf / Perkenalan)
- Submateri: أَدَوَاتُ الِاسْتِفْهَامِ (kata tanya) dan الضَّمَائِرُ (kata ganti)
- Pendekatan: komunikatif dan desain pembelajaran inklusif
- Penyusun: Wahda Lathifa Zalfa
- Tahun pengembangan: 2026
