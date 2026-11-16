import { redirect } from "next/navigation";
import { Gem, Flame, Heart, UserRound } from "lucide-react";
import AppShell from "@/components/AppShell";
import AvatarEditor from "@/components/AvatarEditor";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";


export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ updated?: string; error?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: profile }, { data: teacherNotes }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("teacher_notes").select("*, lesson:lessons(title)").eq("student_id", user.id).order("created_at", { ascending: false }).limit(10)
  ]);
  const p = profile || { display_name: user.user_metadata?.display_name || "Teman Arabeeza", role: "student", xp: 0, diamonds: 0, hearts: 5, streak_count: 0, avatar_skin: "sawo-matang", avatar_outfit: "hijau" };

  return (
    <AppShell active="/profile" role={p.role} stats={{ streak: p.streak_count, diamonds: p.diamonds, hearts: p.hearts }}>
      <div className="mb-6"><p className="text-xs font-black tracking-[.16em] text-[#2e8b62]">AKUN SAYA</p><h1 className="mt-1 text-3xl font-black">Profil siswa</h1></div>
      {params.updated && <p className="mb-4 rounded-xl bg-[#eaf7ef] p-3 text-sm font-bold text-[#2e8b62]">Avatar berhasil diperbarui.</p>}
      {params.error && <p className="mb-4 rounded-xl bg-[#fff0f0] p-3 text-sm text-[#a33c45]">{params.error}</p>}
      <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <section className="surface p-6">
          <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-[30px] bg-gradient-to-br from-[#fff1d8] to-[#eaf7ef] text-6xl">{p.avatar_hijab === "ya" ? "🧕" : p.avatar_gender === "laki-laki" ? "👨🏻‍🎓" : "👩🏻‍🎓"}</div>
          <h2 className="mt-4 text-center text-2xl font-black">{p.display_name}</h2>
          <p className="text-center text-sm text-[#89968f]">{user.email}</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#f7faf6] p-4"><div className="flex items-center gap-2 text-orange-500"><Flame size={17}/><b>{p.streak_count}</b></div><p className="mt-1 text-xs text-[#718078]">Hari streak</p></div>
            <div className="rounded-2xl bg-[#f7faf6] p-4"><div className="flex items-center gap-2 text-sky-500"><Gem size={17}/><b>{p.diamonds}</b></div><p className="mt-1 text-xs text-[#718078]">Total berlian</p></div>
            <div className="rounded-2xl bg-[#f7faf6] p-4"><div className="flex items-center gap-2 text-rose-500"><Heart size={17}/><b>{p.hearts}/5</b></div><p className="mt-1 text-xs text-[#718078]">Nyawa tersedia</p></div>
            <div className="rounded-2xl bg-[#f7faf6] p-4"><div className="flex items-center gap-2 text-[#2e8b62]"><UserRound size={17}/><b>{p.xp}</b></div><p className="mt-1 text-xs text-[#718078]">Total XP</p></div>
          </div>
        </section>
        <section><div className="mb-3"><h2 className="text-xl font-black">Edit karakter Arabeeza</h2><p className="mt-1 text-sm text-[#718078]">Atur warna karakter dan pakaian yang akan tampil di profil.</p></div><AvatarEditor skin={p.avatar_skin || "sawo-matang"} outfit={p.avatar_outfit || "hijau"} gender={p.avatar_gender || "perempuan"} hair={p.avatar_hair || "panjang"} hijab={p.avatar_hijab || "tidak"} expression={p.avatar_expression || "senyum"}/></section>
      </div>
      <section className="surface mt-6 p-5">
        <h2 className="text-xl font-black">Catatan dari guru</h2>
        <p className="mt-1 text-sm text-[#718078]">Umpan balik pembelajaran yang diberikan guru untuk akunmu.</p>
        <div className="mt-4 space-y-3">
          {(teacherNotes || []).length === 0 ? <p className="rounded-xl bg-[#f7faf6] p-4 text-sm text-[#718078]">Belum ada catatan dari guru.</p> : (teacherNotes || []).map((note: any) => <article key={note.id} className="rounded-xl bg-[#f7faf6] p-4"><p className="text-xs font-black text-[#2e8b62]">{note.lesson?.title || "Catatan pembelajaran"}</p><p className="mt-2 text-sm leading-6 text-[#50645a]">{note.note}</p><p className="mt-2 text-right text-[11px] text-[#89968f]">{new Date(note.created_at).toLocaleDateString("id-ID")}</p></article>)}
        </div>
      </section>
    </AppShell>
  );
}
