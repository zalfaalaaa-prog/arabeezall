import Link from "next/link";
import { register } from "@/app/actions";
import SubmitButton from "@/components/SubmitButton";

type RegisterSearchParams = {
  error?: string;
  success?: string;
  email?: string;
};

export default async function RegisterPage({
  searchParams
}: {
  searchParams: Promise<RegisterSearchParams>;
}) {
  const params = await searchParams;
  const showEmailNotice = params.success === "check-email";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7faf6] px-4 py-10">
      <div className="surface w-full max-w-md p-7 md:p-9">
        <Link href="/" className="text-2xl font-black">arabeeza<span className="text-[#f39a32]">.</span></Link>
        <p className="mt-7 text-xs font-black tracking-[.18em] text-[#2e8b62]">MULAI BELAJAR</p>
        <h1 className="mt-2 text-3xl font-black">Buat akun ARABEEZA</h1>
        <p className="mt-2 text-sm text-[#718078]">Daftar sebagai siswa untuk menyimpan XP, berlian, streak, dan progres belajarmu.</p>

        {params.error && (
          <div role="alert" className="mt-5 rounded-xl bg-[#fff0f0] p-3 text-sm text-[#a33c45]">
            <p className="font-bold">Pendaftaran belum berhasil.</p>
            <p className="mt-1">{params.error}</p>
          </div>
        )}

        {showEmailNotice && (
          <div role="status" className="mt-5 rounded-xl border border-[#b9e5c9] bg-[#eaf7ef] p-4 text-sm text-[#246b49]">
            <p className="font-bold">Pendaftaran berhasil dimulai!</p>
            <p className="mt-1">Kami mengirim tautan verifikasi ke <strong>{params.email || "alamat email yang kamu daftarkan"}</strong>. Buka email tersebut, lalu klik tautan verifikasi untuk mengaktifkan akun.</p>
            <p className="mt-2">Jika tidak terlihat, periksa folder Spam/Promosi. Setelah verifikasi, masuk menggunakan email dan kata sandimu.</p>
            <Link href="/login" className="mt-3 inline-flex font-black underline">Lanjut ke halaman masuk</Link>
          </div>
        )}

        {!showEmailNotice && (
          <form action={register} className="mt-6 space-y-4">
            <div>
              <label htmlFor="display_name" className="mb-2 block text-sm font-bold">Nama lengkap</label>
              <input id="display_name" className="input" name="display_name" autoComplete="name" required minLength={2} maxLength={80} placeholder="Nama kamu" />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-bold">Email</label>
              <input id="email" className="input" type="email" name="email" autoComplete="email" required placeholder="nama@email.com" />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-bold">Kata sandi</label>
              <input id="password" className="input" type="password" name="password" autoComplete="new-password" required minLength={8} placeholder="Minimal 8 karakter" />
              <p className="mt-1 text-xs text-[#718078]">Gunakan minimal 8 karakter.</p>
            </div>
            <SubmitButton pendingLabel="Membuat akun...">Buat akun</SubmitButton>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-[#718078]">Sudah punya akun? <Link className="font-black text-[#2e8b62]" href="/login">Masuk</Link></p>
      </div>
    </div>
  );
}
