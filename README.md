# ARABEE — Full-Stack Arabic Learning Platform

Arabee adalah aplikasi pembelajaran Bahasa Arab interaktif untuk siswa kelas X Madrasah Aliyah (Fase E). Versi awal berfokus pada **Materi 1: التَّعَارُفُ (At-Ta‘āruf / Perkenalan)**.

Project ini menggunakan Next.js App Router, React, TypeScript, Tailwind CSS, dan Supabase (Auth + PostgreSQL). Project disiapkan untuk dikembangkan di VS Code dan dideploy melalui GitHub + Vercel.

## Fitur yang sudah disiapkan

- Landing page, registrasi, login, dan logout.
- Dashboard siswa: XP, berlian, nyawa, streak, serta progres materi.
- Materi At-Ta‘āruf: kosakata berharakat, transliterasi, terjemahan, contoh kalimat, kata tanya, kata ganti, dan dialog.
- Empat mode latihan: campuran 4 maharah, menyimak, membaca/pelafalan, dan percakapan.
- Satu sesi berisi maksimal 15 soal.
- Umpan balik benar/salah, pengulangan soal yang salah, skor, XP, dan berlian.
- Sistem 5 nyawa; isi ulang 5 nyawa menggunakan 100 berlian.
- Profil dan pilihan avatar sederhana.
- Halaman capaian pembelajaran.
- Dashboard guru untuk melihat daftar siswa dan menulis catatan pembelajaran.
- Supabase Row Level Security (RLS), SQL migration, trigger profil, dan RPC untuk menyimpan hasil sesi secara atomik.

## Teknologi

| Bagian | Teknologi |
|---|---|
| Frontend + routing | Next.js 15 App Router |
| UI | React 19, TypeScript, Tailwind CSS |
| Backend | Next.js Server Actions + Supabase |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Audio | Web Speech API (Text-to-Speech dan Speech Recognition jika didukung browser) |
| Deployment | Vercel |

## Persyaratan

- Node.js 20.9 atau lebih baru.
- npm.
- Akun Supabase.
- VS Code atau editor kode lainnya.

## 1. Ekstrak ZIP dan buka project

```bash
cd arabee-fullstack
npm install
```

## 2. Buat project Supabase

1. Buat project baru di Supabase.
2. Buka **Project Settings → API**.
3. Salin Project URL dan anon/public key.
4. Di folder project, salin `.env.example` menjadi `.env.local`.
5. Isi nilainya:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Jangan pernah memasukkan `service_role` key ke variabel `NEXT_PUBLIC_*` atau ke source code frontend.

## 3. Buat tabel database

1. Buka Supabase → **SQL Editor**.
2. Buka file `supabase/migrations/001_init.sql`.
3. Salin seluruh isinya ke SQL Editor lalu klik **Run**.
4. Buka file `supabase/seed.sql`.
5. Jalankan seluruh isinya untuk memasukkan materi At-Ta‘āruf, kosakata, dialog, dan bank soal.

File seed dapat dijalankan ulang tanpa menggandakan materi inti dan bank soal.

## 4. Jalankan aplikasi

```bash
npm run dev
```

Buka `http://localhost:3000`.

Untuk memeriksa tipe TypeScript:

```bash
npm run typecheck
```

Untuk build production:

```bash
npm run build
npm run start
```

## 5. Buat akun guru

Registrasi normal akan membuat akun dengan role `student`. Untuk mengubah akun tertentu menjadi guru:

1. Daftarkan akun melalui halaman `/register`.
2. Buka Supabase → Authentication → Users, salin UUID akun tersebut.
3. Jalankan SQL berikut di SQL Editor:

```sql
update public.profiles
set role = 'teacher'
where id = 'UUID-AKUN-GURU';
```

4. Login ulang. Menu dan halaman `/teacher` akan tersedia.

Jangan memberikan role admin/guru kepada pengguna umum.

## 6. Deploy ke Vercel

1. Push folder project ke repository GitHub.
2. Impor repository tersebut di Vercel.
3. Tambahkan environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.
5. Pastikan URL deployment telah ditambahkan pada pengaturan URL/redirect Supabase Auth.

## Struktur project

```text
arabee-fullstack/
├── app/
│   ├── actions.ts
│   ├── dashboard/
│   ├── lessons/[slug]/
│   ├── login/
│   ├── outcomes/
│   ├── practice/[slug]/
│   ├── profile/
│   ├── register/
│   ├── shop/
│   └── teacher/
├── components/
├── lib/
│   └── supabase/
├── public/
├── supabase/
│   ├── migrations/001_init.sql
│   └── seed.sql
├── middleware.ts
└── package.json
```

## Catatan penting dan batasan versi awal

1. Audio menggunakan suara Arab yang tersedia di browser/perangkat. Ketersediaan suara dan Speech Recognition berbeda antar-browser; fitur membaca memiliki fallback konfirmasi latihan.
2. Avatar saat ini menggunakan ilustrasi bentuk sederhana dan pilihan warna/pakaian, bukan katalog karakter animasi.
3. Fitur teman/follow, animasi streak video, unggah audio guru, serta editor bank soal visual belum termasuk versi awal.
4. Bank soal awal merupakan data contoh untuk menguji alur. Guru perlu meninjau kesesuaian bahasa, harakat, tingkat kesulitan, dan kunci jawaban sebelum digunakan sebagai penilaian resmi.
5. Pengiriman hasil latihan saat ini menggunakan Server Action dan RPC Supabase. Versi awal membatasi perubahan profil melalui RPC avatar dan RLS. Sebelum digunakan sebagai produk publik/penilaian resmi, validasi jawaban perlu dipindahkan sepenuhnya ke server agar skor dan hadiah tidak dapat dimanipulasi dari browser.
6. Supabase Auth dapat meminta verifikasi email sesuai konfigurasi project. Jika verifikasi aktif, siswa harus mengonfirmasi email sebelum login.

## Rujukan rancangan konten

Konten awal mengikuti rancangan bahan ajar Arabee: kelas X/Fase E, materi At-Ta‘āruf, kosakata dasar perkenalan, ungkapan salam, kata tanya, kata ganti, dialog sederhana, teks Arab berharakat, terjemahan, serta latihan interaktif.
