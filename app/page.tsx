import Link from "next/link";
import { BookOpen, Flame, Gem, Headphones, Mic, ShieldCheck, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#fffdf7]">
      <header className="page-wrap flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eaf7ef] text-xl font-black text-[#2e8b62]">ع</span><span className="text-2xl font-black">arabee<span className="text-[#f39a32]">.</span></span></Link>
        <div className="flex items-center gap-3"><Link href="/login" className="text-sm font-extrabold text-[#50645a]">Masuk</Link><Link href="/register" className="btn-primary">Mulai belajar</Link></div>
      </header>
      <main>
        <section className="page-wrap grid items-center gap-10 py-12 md:grid-cols-[1.1fr_.9fr] md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf7ef] px-4 py-2 text-xs font-black text-[#2e8b62]"><Sparkles size={15}/> BELAJAR BAHASA ARAB LEBIH SERU</span>
            <h1 className="mt-6 text-5xl font-black leading-[1.08] tracking-tight md:text-6xl">Bahasa Arab jadi lebih <span className="text-[#2e8b62]">mudah</span> setiap hari.</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#718078]">Kenali kosakata, pahami percakapan, dan latih empat maharah melalui pengalaman belajar yang menyenangkan untuk siswa kelas X Madrasah Aliyah.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/register" className="btn-primary px-6 py-4">Mulai perjalanan <span>→</span></Link><Link href="/login" className="btn-secondary px-6 py-4">Saya sudah punya akun</Link></div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm font-bold text-[#718078]"><span className="flex items-center gap-2"><BookOpen size={17} className="text-[#2e8b62]"/> Materi berharakat</span><span className="flex items-center gap-2"><Headphones size={17} className="text-[#2e8b62]"/> Audio Arab</span><span className="flex items-center gap-2"><Mic size={17} className="text-[#2e8b62]"/> Latihan membaca</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -right-5 -top-5 h-36 w-36 rounded-full bg-[#ffedcf] blur-2xl"/>
            <div className="surface relative rotate-1 p-6">
              <div className="flex items-center justify-between"><span className="rounded-full bg-[#fff4e5] px-3 py-1 text-xs font-black text-[#bd741b]">MATERI 1</span><span className="flex items-center gap-1 font-black text-orange-500"><Flame size={18} fill="currentColor"/> 7</span></div>
              <div className="my-8 rounded-3xl bg-[#eaf7ef] px-5 py-8 text-center"><p className="arabic text-5xl font-bold">اَلسَّلَامُ عَلَيْكُمْ</p><p className="mt-3 font-bold text-[#2e8b62]">As-salāmu ‘alaikum</p><p className="mt-1 text-sm text-[#718078]">Semoga keselamatan tercurah kepadamu</p></div>
              <div className="grid grid-cols-3 gap-3"><div className="rounded-2xl bg-[#f7faf6] p-3 text-center"><Gem className="mx-auto text-sky-500"/><b className="mt-1 block">Berlian</b></div><div className="rounded-2xl bg-[#f7faf6] p-3 text-center"><Flame className="mx-auto text-orange-500"/><b className="mt-1 block">Streak</b></div><div className="rounded-2xl bg-[#f7faf6] p-3 text-center"><ShieldCheck className="mx-auto text-[#2e8b62]"/><b className="mt-1 block">Progres</b></div></div>
            </div>
            <div className="absolute -bottom-5 -left-5 rounded-2xl bg-[#2e8b62] px-4 py-3 text-sm font-black text-white shadow-soft">يَلَّا نَتَعَلَّمُ! ✨</div>
          </div>
        </section>
        <section className="bg-white py-14">
          <div className="page-wrap"><div className="text-center"><p className="text-xs font-black tracking-[.2em] text-[#2e8b62]">FITUR ARABEE</p><h2 className="mt-2 text-3xl font-black">Belajar, berlatih, dan berkembang</h2></div>
            <div className="mt-9 grid gap-4 md:grid-cols-4">
              {[["01","Menyimak","Dengarkan kosakata dan kalimat Bahasa Arab."],["02","Berbicara","Latih pengucapan dengan fitur mikrofon."],["03","Membaca","Pahami teks Arab yang dilengkapi harakat."],["04","Menulis","Pilih dan susun jawaban sesuai konteks."]].map(([n,t,d])=><div key={n} className="surface p-5"><span className="text-sm font-black text-[#f39a32]">{n}</span><h3 className="mt-3 text-lg font-black">{t}</h3><p className="mt-2 text-sm leading-6 text-[#718078]">{d}</p></div>)}
            </div>
          </div>
        </section>
      </main>
      <footer className="page-wrap py-7 text-center text-xs text-[#89968f]">Arabee · Bahan Ajar Bahasa Arab Inklusif Berbasis Website · 2026</footer>
    </div>
  );
}
