import { redirect } from "next/navigation";
import { BookOpen, MessageSquareText } from "lucide-react";
import AppShell from "@/components/AppShell";
import { addTeacherNote } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";

export default async function TeacherPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile || !["teacher", "admin"].includes(profile.role)) redirect("/dashboard");

  const [{ data: students }, { data: lessons }, { data: notes }] = await Promise.all([
    supabase.from("profiles").select("id,display_name,xp,streak_count").eq("role", "student").order("display_name"),
    supabase.from("lessons").select("id,title").eq("is_published", true).order("sort_order"),
    supabase.from("teacher_notes").select("*, student:profiles!teacher_notes_student_id_fkey(display_name), lesson:lessons(title)").order("created_at", { ascending: false }).limit(30)
  ]);

  return (
    <AppShell active="/teacher" role={profile.role} stats={{ streak: profile.streak_count, diamonds: profile.diamonds, hearts: profile.hearts }}>
      <div className="mb-6"><p className="text-xs font-black tracking-[.16em] text-[#2e8b62]">RUANG PENGAJAR</p><h1 className="mt-1 text-3xl font-black">Dashboard guru</h1><p className="mt-2 text-sm text-[#718078]">Pantau siswa dan berikan catatan pembelajaran secara personal.</p></div>
      {params.success && <p className="mb-4 rounded-xl bg-[#eaf7ef] p-3 text-sm font-bold text-[#2e8b62]">Catatan guru berhasil disimpan.</p>}
      {params.error && <p className="mb-4 rounded-xl bg-[#fff0f0] p-3 text-sm text-[#a33c45]">{params.error}</p>}
      <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <section className="surface p-5"><div className="mb-4 flex items-center gap-2"><MessageSquareText className="text-[#2e8b62]"/><h2 className="text-lg font-black">Tambah catatan guru</h2></div>
          <form action={addTeacherNote} className="space-y-3">
            <div><label className="mb-1 block text-xs font-bold">Pilih siswa</label><select className="input" name="student_id" required defaultValue=""><option value="" disabled>Pilih siswa</option>{(students || []).map((student: any) => <option key={student.id} value={student.id}>{student.display_name}</option>)}</select></div>
            <div><label className="mb-1 block text-xs font-bold">Materi</label><select className="input" name="lesson_id" required defaultValue=""><option value="" disabled>Pilih materi</option>{(lessons || []).map((lesson: any) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}</select></div>
            <div><label className="mb-1 block text-xs font-bold">Catatan / umpan balik</label><textarea className="input min-h-28" name="note" required minLength={3} placeholder="Tuliskan apresiasi, hal yang perlu diperbaiki, atau saran belajar..."/></div>
            <button className="btn-primary w-full" type="submit">Simpan catatan</button>
          </form>
        </section>
        <section className="surface p-5"><div className="mb-4 flex items-center gap-2"><BookOpen className="text-[#2e8b62]"/><h2 className="text-lg font-black">Daftar siswa</h2></div>
          <div className="space-y-3">{(students || []).length === 0 ? <p className="text-sm text-[#718078]">Belum ada siswa terdaftar.</p> : (students || []).map((student: any) => <div key={student.id} className="flex items-center justify-between rounded-xl bg-[#f7faf6] p-3"><div><p className="font-bold">{student.display_name}</p><p className="text-xs text-[#89968f]">{student.xp} XP · {student.streak_count} hari streak</p></div><span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#2e8b62]">Siswa</span></div>)}</div>
        </section>
      </div>
      <section className="mt-5 surface p-5"><h2 className="mb-4 text-lg font-black">Catatan yang sudah diberikan</h2><div className="space-y-3">{(notes || []).length === 0 ? <p className="text-sm text-[#718078]">Belum ada catatan guru.</p> : (notes || []).map((note: any) => <article key={note.id} className="rounded-xl border border-[#edf2ee] p-4"><div className="flex flex-wrap justify-between gap-2"><b>{note.student?.display_name || "Siswa"}</b><span className="text-xs text-[#89968f]">{note.lesson?.title || "Materi"}</span></div><p className="mt-2 text-sm leading-6 text-[#60776a]">{note.note}</p></article>)}</div></section>
    </AppShell>
  );
}
