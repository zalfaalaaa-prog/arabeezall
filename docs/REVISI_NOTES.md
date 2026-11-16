# Catatan revisi Arabeeza

## Perubahan yang diterapkan
- Navigasi bawah untuk perangkat mobile dengan label menu.
- Maskot kucing SVG Arabeeza digunakan pada landing page, dashboard, dan sesi latihan; ikon logo SVG diperbarui.
- Dashboard memiliki jalur visual 10 level dengan label mudah, menengah, dan menantang.
- Sesi latihan memakai pola pilih jawaban -> Periksa jawaban -> tampilkan koreksi. Jawaban tidak langsung dinilai saat diklik.
- Pengurangan nyawa dilakukan ketika jawaban diperiksa dan dinyatakan salah.
- Petunjuk Arab yang menduplikasi kata target disembunyikan pada prompt yang meminta arti kata/kosakata.
- Biaya isi ulang 5 nyawa menjadi 25 berlian.
- Avatar memiliki opsi gender, rambut, kerudung, ekspresi, warna kulit, dan warna pakaian.
- Capaian At-Ta'aruf mencantumkan tujuh target pembelajaran dari dokumen revisi.

## Wajib dilakukan setelah update
1. Jalankan `supabase/migrations/002_arabeeza_revision.sql` pada Supabase SQL Editor.
2. Commit dan push isi ZIP ke root repository GitHub.
3. Redeploy project pada Vercel. Environment variable yang lama tetap digunakan.

## Batasan yang masih ada
- ZIP sumber hanya berisi 15 soal Materi 1. Sepuluh tombol level telah ditambahkan, tetapi tiap level sementara memakai bank soal 15 butir yang sama. Bank soal unik 15 butir per level (150 butir) belum tersedia.
- Materi 2–5 dalam dokumen revisi sudah dicantumkan sebagai cakupan pembelajaran/panduan, tetapi belum dibuat menjadi bank soal dan halaman materi terpisah.
- PDF revisi menampilkan contoh karakter kucing dan palet warna di dalam screenshot, bukan aset gambar terpisah beresolusi tinggi. Maskot kucing pada paket ini dibuat sebagai ilustrasi SVG baru, bukan foto kucing referensi.
- Build penuh belum dapat dijalankan di lingkungan pengerjaan karena dependensi npm tidak berhasil diunduh. Jalankan `npm install`, `npm run typecheck`, dan `npm run build` setelah ZIP diunduh pada lingkungan yang memiliki akses registry npm.
