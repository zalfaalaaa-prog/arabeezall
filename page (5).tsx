import { redirect } from "next/navigation";
import { BookOpen, Headphones, MessageCircle, Mic, PenLine } from "lucide-react";
import AppShell from "@/components/AppShell";
import { createClient } from "@/lib/supabase/server";

const outcomes = [
  { title: "Menyimak", icon: Headphones, detail: "Mengidentifikasi informasi tersurat dan tersirat dari wacana lisan tentang perkenalan." },
  { title: "Berbicara", icon: Mic, detail: "Menerapkan ungkapan salam dan perkenalan sederhana dalam konteks sehari-hari." },
  { title: "Membaca dan memirsa", icon: BookOpen, detail: "Menganalisis kosakata, gramatika, serta teks visual atau multimodal tentang At-Ta‘āruf." },
  { title: "Menulis dan mempresentasikan", icon: PenLine, detail: "Memproduksi gagasan secara tertulis dan/atau lisan menggunakan kosakata serta susunan gramatika yang dipelajari." },
  { title: "Interaksi percakapan", icon: MessageCircle, detail: "Menggunakan kata tanya dasar dan kata ganti untuk membangun dialog perkenalan." }
];

export default async function OutcomesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return (
    <AppShell active="/outcomes" role={profile?.role || "student"} stats={{ streak: profile?.streak_count || 0, diamonds: profile?.diamonds || 0, hearts: profile?.hearts || 0 }}>
      <div className="mb-7"><p className="text-xs font-black tracking-[.16em] text-[#2e8b62]">TARGET PEMBELAJARAN</p><h1 className="mt-1 text-3xl font-black">Capaian pembelajaran</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[#718078]">Acuan capaian pembelajaran Bahasa Arab pada akhir Fase E. Materi awal Arabee berfokus pada tema At-Ta‘āruf.</p></div>
      <div className="surface p-6"><p className="arabic text-right text-2xl font-bold">التَّعَارُفُ</p><h2 className="mt-2 text-xl font-black">At-Ta‘āruf · Perkenalan</h2><p className="mt-2 text-sm leading-7 text-[#718078]">Peserta didik mampu menganalisis kosakata, gramatika, dan wacana tentang At-Ta‘āruf dengan gramatika أَدَوَاتُ الِاسْتِفْهَامِ (kata tanya) dan الضَّمَائِرُ (kata ganti), serta menerapkan keterampilan berbahasa dalam konteks yang sesuai.</p></div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {outcomes.map((item) => { const Icon = item.icon; return <article key={item.title} className="surface flex gap-4 p-5"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eaf7ef] text-[#2e8b62]"><Icon size={21}/></div><div><h3 className="font-black">{item.title}</h3><p className="mt-1 text-sm leading-6 text-[#718078]">{item.detail}</p></div></article>; })}
      </div>
      <div className="mt-6 rounded-2xl bg-[#fff4e5] p-5"><h3 className="font-black">Submateri</h3><p className="mt-2 text-sm leading-7 text-[#806a4f]">Kosakata dasar perkenalan · Ungkapan salam · Kata tanya مَا، مَنْ، أَيْنَ، كَيْفَ، كَمْ · Kata ganti أَنَا، أَنْتَ، أَنْتِ، هُوَ، هِيَ · Dialog perkenalan sederhana.</p></div>
    </AppShell>
  );
}
