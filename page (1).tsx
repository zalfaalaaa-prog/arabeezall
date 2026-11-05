import Link from "next/link";
import { redirect } from "next/navigation";
import { Flame, Gem, Heart, Sparkles, Trophy } from "lucide-react";
import AppShell from "@/components/AppShell";
import LessonCard from "@/components/LessonCard";
import { createClient } from "@/lib/supabase/server";
import type { Lesson, Profile } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profileData }, { data: lessonsData }, { data: progressData }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("lessons").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("lesson_progress").select("*").eq("user_id", user.id)
  ]);

  const profile = (profileData || { display_name: user.user_metadata?.display_name || "Teman Arabee", role: "student", xp: 0, diamonds: 0, hearts: 5, streak_count: 0 }) as Profile;
  const lessons = (lessonsData || []) as Lesson[];
  const progress = progressData || [];
  const getProgress = (lessonId: string) => progress.find((item: any) => item.lesson_id === lessonId);

  return (
    <AppShell active="/dashboard" role={profile.role} stats={{ streak: profile.streak_count, diamonds: profile.diamonds, hearts: profile.hearts }}>
      <section className="mb-8 grid gap-5 md:grid-cols-[1.5fr_.8fr]">
        <div className="rounded-[26px] bg-[#eaf7ef] p-6 md:p-8">
          <p className="text-xs font-black tracking-[.16em] text-[#2e8b62]">MARHABAN, AHLAN WA SAHLAN!</p>
          <h1 className="mt-2 text-3xl font-black">Halo, {profile.display_name} 👋</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#60776a]">Siap belajar Bahasa Arab hari ini? Selesaikan satu sesi latihan untuk menjaga streak dan mengumpulkan XP.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="stat-pill"><Flame size={16} className="text-orange-500"/> {profile.streak_count} hari streak</span>
            <span className="stat-pill"><Gem size={16} className="text-sky-500"/> {profile.diamonds} berlian</span>
            <span className="stat-pill"><Heart size={16} className="text-rose-500" fill="currentColor"/> {profile.hearts}/5 nyawa</span>
          </div>
        </div>
        <div className="surface flex flex-col justify-between p-6">
          <div><span className="text-xs font-black tracking-[.15em] text-[#8a9890]">TOTAL PENGALAMAN</span><div className="mt-2 flex items-end gap-2"><strong className="text-4xl font-black">{profile.xp.toLocaleString("id-ID")}</strong><span className="pb-1 text-sm font-bold text-[#f39a32]">XP</span></div><div className="progress-track mt-4"><div className="progress-fill" style={{width:`${profile.xp % 500 / 5}%`}}/></div><p className="mt-2 text-xs text-[#8a9890]">Menuju target 500 XP berikutnya</p></div>
          <Link href="/outcomes" className="mt-5 flex items-center gap-2 text-sm font-extrabold text-[#2e8b62]"><Trophy size={17}/> Lihat capaian pembelajaran <span>→</span></Link>
        </div>
      </section>

      <div className="mb-5 flex items-end justify-between gap-3"><div><p className="text-xs font-black tracking-[.16em] text-[#2e8b62]">JALUR PEMBELAJARAN</p><h2 className="mt-1 text-2xl font-black">Pilih materi belajarmu</h2></div><span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-[#718078]">{lessons.length} materi tersedia</span></div>
      {lessons.length === 0 ? (
        <div className="surface p-8 text-center"><Sparkles className="mx-auto text-[#f39a32]" size={30}/><h3 className="mt-3 font-black">Materi belum tersedia</h3><p className="mt-2 text-sm text-[#718078]">Jalankan file supabase/seed.sql untuk memasukkan materi awal At-Ta‘āruf.</p></div>
      ) : <div className="grid gap-5 lg:grid-cols-2">{lessons.map((lesson) => { const item = getProgress(lesson.id); return <LessonCard key={lesson.id} lesson={lesson} completed={item?.completed_sessions || 0} bestScore={item?.best_score || 0}/>; })}</div>}
      <section className="mt-8 rounded-[24px] bg-[#fff4e5] p-5 md:p-6"><div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center"><div><p className="text-xs font-black tracking-[.16em] text-[#bd741b]">TIPS HARI INI</p><h3 className="mt-1 text-lg font-black">اِسْتَمِرَّ فِي التَّعَلُّمِ</h3><p className="mt-1 text-sm text-[#806a4f]">Teruslah belajar sedikit demi sedikit. Konsistensi lebih penting daripada terburu-buru.</p></div><span className="text-4xl">🌱</span></div></section>
    </AppShell>
  );
}
