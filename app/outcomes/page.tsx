import { redirect } from "next/navigation";
import { BookOpen, Headphones, MessageCircle, Mic, PenLine, Languages } from "lucide-react";
import AppShell from "@/components/AppShell";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const outcomes = [
  { title: "Menyimak", icon: Headphones, detail: "Mengidentifikasi informasi tersurat dan tersirat dari wacana lisan." },
  { title: "Berbicara", icon: Mic, detail: "Mengaplikasikan wacana lisan dan menyampaikan ungkapan sesuai konteks." },
  { title: "Membaca dan memirsa", icon: BookOpen, detail: "Menganalisis teks tertulis, visual, dan multimodal." },
  { title: "Menulis dan mempresentasikan", icon: PenLine, detail: "Memproduksi gagasan secara tertulis dan/atau lisan." }
];

const semesterThemes = [
  { title: "At-Ta‘āruf · Perkenalan", arabic: "التَّعَارُفُ", grammar: "أَدَوَاتُ الِاسْتِفْهَامِ dan الضَّمَائِرُ", status: "Tersedia", active: true },
  { title: "Al-Usrah · Keluarga", arabic: "الأُسْرَةُ", grammar: "الْمُذَكَّرُ وَالْمُؤَنَّثُ dan حُرُوفُ الْجَرِّ", status: "Materi berikutnya", active: false },
  { title: "Al-Madrasah · Sekolah", arabic: "الْمَدْرَسَةُ", grammar: "الْمُفْرَدُ وَالْمُثَنَّى وَالْجَمْعُ، الْعَطْفُ، dan الظَّرْفُ", status: "Materi berikutnya", active: false },
  { title: "Afrād al-Bayt · Anggota rumah", arabic: "أَفْرَادُ الْبَيْتِ", grammar: "تَقْسِيمُ الْكَلِمَةِ", status: "Materi berikutnya", active: false },
  { title: "Al-Hiwāyah · Hobi", arabic: "الْهِوَايَةُ", grammar: "الْجُمْلَةُ الاسْمِيَّةُ وَالْجُمْلَةُ الْفِعْلِيَّةُ", status: "Materi berikutnya", active: false },
  { title: "Al-Ḥayāh al-Yawmiyyah · Kehidupan sehari-hari", arabic: "الْحَيَاةُ الْيَوْمِيَّةُ", grammar: "الْعَدَدُ وَالْمَعْدُودُ", status: "Materi berikutnya", active: false }
];

export default async function OutcomesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return (
    <AppShell active="/outcomes" role={profile?.role || "student"} stats={{ streak: profile?.streak_count || 0, diamonds: profile?.diamonds || 0, hearts: profile?.hearts || 0 }}>
      <div className="mb-7">
        <p className="text-xs font-black tracking-[.16em] text-[#2e8b62]">TARGET PEMBELAJARAN</p>
        <h1 className="mt-1 text-3xl font-black">Capaian pembelajaran semester</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#718078]">Acuan pembelajaran Bahasa Arab kelas X/Fase E. Paket awal ARABEEZA membuka Materi 1, At-Ta‘āruf; tema lain ditampilkan sebagai peta materi semester.</p>
      </div>

      <section className="surface p-6">
        <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf7ef] text-[#2e8b62]"><Languages size={22}/></div><div><p className="text-xs font-black tracking-wider text-[#8a9890]">CAPAIAN AKHIR FASE E</p><h2 className="text-xl font-black">Enam tema pembelajaran</h2></div></div>
        <p className="mt-4 text-sm leading-7 text-[#718078]">Peserta didik mampu menganalisis kosakata, gramatika, dan wacana sesuai tema; mengidentifikasi informasi tersurat dan tersirat dari wacana lisan; mengaplikasikan wacana lisan; menganalisis teks visual atau multimodal; serta memproduksi gagasan secara tertulis dan/atau lisan.</p>
      </section>

      <section className="mt-6">
        <div className="mb-4"><h2 className="text-xl font-black">Peta materi satu semester</h2><p className="mt-1 text-sm text-[#718078]">Urutan tema dan fokus gramatika mengikuti rancangan bahan ajar.</p></div>
        <div className="grid gap-3 md:grid-cols-2">
          {semesterThemes.map((item, index) => (
            <article key={item.title} className={`surface p-5 ${item.active ? "border-[#9bd2ad]" : "opacity-90"}`}>
              <div className="flex items-start justify-between gap-3"><span className="rounded-full bg-[#f7faf6] px-3 py-1 text-xs font-black text-[#718078]">MATERI {index + 1}</span><span className={`rounded-full px-3 py-1 text-[11px] font-black ${item.active ? "bg-[#eaf7ef] text-[#2e8b62]" : "bg-[#f4f4f1] text-[#89968f]"}`}>{item.status}</span></div>
              <p className="arabic mt-4 text-right text-2xl font-bold">{item.arabic}</p>
              <h3 className="mt-1 font-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#718078]">Fokus gramatika: <span className="arabic font-semibold text-[#50645a]">{item.grammar}</span></p>
            </article>
          ))}
        </div>
      </section>

      <section className="surface mt-7 p-5 md:p-6">
        <div className="mb-4 flex items-center gap-3"><span className="rounded-2xl bg-[#fff0d9] p-3 text-2xl">🐱</span><div><p className="text-xs font-black tracking-[.14em] text-[#2e8b62]">TARGET PEMBELAJARAN</p><h2 className="text-xl font-black">Capaian Materi At-Ta‘āruf</h2></div></div>
        <p className="mb-4 text-sm leading-6 text-[#718078]">Bahan ajar ini berfokus pada satu tema, yaitu At-Ta‘āruf, dengan cakupan kemampuan berikut:</p>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-[#50645a]"><li>Mengidentifikasi kosakata dan ungkapan Bahasa Arab yang berkaitan dengan tema At-Ta‘āruf.</li><li>Memahami dan menggunakan kata tanya <span className="arabic font-bold">أَدَوَاتُ الِاسْتِفْهَامِ</span> sesuai konteks kalimat.</li><li>Mengidentifikasi dan menggunakan kata ganti <span className="arabic font-bold">الضَّمَائِرُ</span>.</li><li>Memahami informasi tersurat dan tersirat dari dialog perkenalan sederhana.</li><li>Membaca dan memahami teks pendek berbahasa Arab tentang perkenalan.</li><li>Melakukan percakapan sederhana menggunakan ungkapan perkenalan.</li><li>Menulis kalimat sederhana tentang identitas diri dalam Bahasa Arab.</li></ul>
      </section>
      <section className="mt-7">
        <h2 className="mb-4 text-xl font-black">Keterampilan berbahasa</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {outcomes.map((item) => { const Icon = item.icon; return <article key={item.title} className="surface flex gap-4 p-5"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eaf7ef] text-[#2e8b62]"><Icon size={21}/></div><div><h3 className="font-black">{item.title}</h3><p className="mt-1 text-sm leading-6 text-[#718078]">{item.detail}</p></div></article>; })}
        </div>
      </section>
    </AppShell>
  );
}
