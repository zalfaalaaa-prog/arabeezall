import Link from "next/link";
import { register } from "@/app/actions";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7faf6] px-4 py-10">
      <div className="surface w-full max-w-md p-7 md:p-9">
        <Link href="/" className="text-2xl font-black">arabee<span className="text-[#f39a32]">.</span></Link>
        <p className="mt-7 text-xs font-black tracking-[.18em] text-[#2e8b62]">MULAI BELAJAR</p>
        <h1 className="mt-2 text-3xl font-black">Buat akun Arabee</h1>
        <p className="mt-2 text-sm text-[#718078]">Akun siswa untuk menyimpan XP, berlian, streak, dan progres belajar.</p>
        {params.error && <p className="mt-5 rounded-xl bg-[#fff0f0] p-3 text-sm text-[#a33c45]">{params.error}</p>}
        <form action={register} className="mt-6 space-y-4">
          <div><label className="mb-2 block text-sm font-bold">Nama lengkap</label><input className="input" name="display_name" required minLength={2} placeholder="Nama kamu"/></div>
          <div><label className="mb-2 block text-sm font-bold">Email</label><input className="input" type="email" name="email" required placeholder="nama@email.com"/></div>
          <div><label className="mb-2 block text-sm font-bold">Kata sandi</label><input className="input" type="password" name="password" required minLength={8} placeholder="Minimal 8 karakter"/></div>
          <button className="btn-primary w-full py-3" type="submit">Buat akun</button>
        </form>
        <p className="mt-6 text-center text-sm text-[#718078]">Sudah punya akun? <Link className="font-black text-[#2e8b62]" href="/login">Masuk</Link></p>
      </div>
    </div>
  );
}
