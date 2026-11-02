import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BookOpen, Volume2 } from "lucide-react";
import AppShell from "@/components/AppShell";
import { createClient } from "@/lib/supabase/server";
import { StatPill } from "@/components/StatPill";

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: lesson }, { data: vocab }, { data: dialogues }, { data: profile }] = await Promise.all([
    supabase.from("lessons").select("*").eq("slug", slug).eq("is_published", true).single(),
    supabase.from("vocabulary").select("*").order("sort_order"),
    supabase.from("dialogues").select("*").order("sort_order"),
    supabase.from("profiles").select("*").eq("id", user.id).single()
  ]);
  if (!lesson) notFound();
  const words = (vocab || []).filter((item: any) => item.lesson_id === lesson.id);
  const conversations = (dialogues || []).filter((item: any) => item.lesson_id === lesson.id);

  return (
    <AppShell role={profile?.role || "student"} stats={{ streak: profile?.streak_count || 0, diamonds: profile?.diamonds || 0, hearts: profile?.hearts || 0 }}>
      <Link href="/dashboard" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#718078]"><ArrowLeft size={17}/> Kembali ke beranda</Link>
      <div className="rounded-[26px] bg-[#fff0d9] p-6 md:p-8">
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#bd741b]">MATERI {lesson.level_no}</span>
        <p className="arabic mt-5 text-right text-4xl font-black">{lesson.title_ar}</p>
        <h1 className="mt-2 text-3xl font-black">{lesson.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#806a4f]">{lesson.description}</p>
        <div className="mt-5 flex flex-wrap gap-2"><Link href={`/practice/${slug}?mode=mixed`} className="btn-primary">Mulai latihan 15 soal →</Link><Link href={`/practice/${slug}?mode=listening`} className="btn-secondary">Latihan menyimak</Link></div>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2"><BookOpen className="text-[#2e8b62]"/><h2 className="text-xl font-black">Kosakata inti</h2></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((word: any) => <article key={word.id} className="surface p-4"><p className="arabic text-right text-2xl font-bold">{word.arabic}</p><p className="mt-2 text-sm font-black text-[#2e8b62]">{word.meaning}</p>{word.transliteration && <p className="mt-1 text-xs text-[#89968f]">{word.transliteration}</p>}{word.example_arabic && <div className="mt-3 border-t border-[#edf2ee] pt-3"><p className="arabic text-right text-lg">{word.example_arabic}</p><p className="mt-1 text-xs text-[#718078]">{word.example_meaning}</p></div>}</article>)}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2"><Volume2 className="text-[#2e8b62]"/><h2 className="text-xl font-black">Contoh dialog perkenalan</h2></div>
        <div className="grid gap-4 md:grid-cols-2">
          {conversations.map((dialogue: any) => <article key={dialogue.id} className="surface p-5"><h3 className="font-black">{dialogue.title}</h3><p className="arabic mt-4 whitespace-pre-line text-right text-xl font-bold">{dialogue.arabic_text}</p><p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#718078]">{dialogue.translation}</p></article>)}
        </div>
      </section>

      <section className="mt-8 surface p-5 md:p-6">
        <h2 className="text-xl font-black">Ringkasan gramatika</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-[#f7faf6] p-4"><h3 className="font-black">أَدَوَاتُ الِاسْتِفْهَامِ · Kata tanya</h3><ul className="mt-3 space-y-2 text-sm text-[#60776a]"><li><b>مَا</b> — apa</li><li><b>مَنْ</b> — siapa</li><li><b>أَيْنَ</b> — di mana</li><li><b>كَيْفَ</b> — bagaimana</li><li><b>كَمْ</b> — berapa</li></ul></div>
          <div className="rounded-2xl bg-[#f7faf6] p-4"><h3 className="font-black">الضَّمَائِرُ · Kata ganti</h3><ul className="mt-3 space-y-2 text-sm text-[#60776a]"><li><b>أَنَا</b> — saya</li><li><b>أَنْتَ</b> — kamu (laki-laki)</li><li><b>أَنْتِ</b> — kamu (perempuan)</li><li><b>هُوَ</b> — dia (laki-laki)</li><li><b>هِيَ</b> — dia (perempuan)</li></ul></div>
        </div>
      </section>
    </AppShell>
  );
}
