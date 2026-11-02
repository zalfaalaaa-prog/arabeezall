import { notFound, redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import PracticeClient from "@/components/PracticeClient";
import { createClient } from "@/lib/supabase/server";
import type { Question } from "@/lib/types";

const allowedModes = ["mixed", "listening", "reading", "conversation"];

export default async function PracticePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ mode?: string }> }) {
  const { slug } = await params;
  const query = await searchParams;
  const mode = allowedModes.includes(query.mode || "") ? (query.mode || "mixed") : "mixed";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: lesson }, { data: profile }] = await Promise.all([
    supabase.from("lessons").select("*").eq("slug", slug).eq("is_published", true).single(),
    supabase.from("profiles").select("*").eq("id", user.id).single()
  ]);
  if (!lesson) notFound();

  let { data: questionData } = await supabase.from("questions").select("*").eq("lesson_id", lesson.id).eq("mode", mode).eq("is_published", true).order("sort_order").limit(15);
  if (!questionData || questionData.length === 0) {
    const fallback = await supabase.from("questions").select("*").eq("lesson_id", lesson.id).eq("mode", "mixed").eq("is_published", true).order("sort_order").limit(15);
    questionData = fallback.data;
  }
  const questions = (questionData || []) as Question[];
  if (questions.length === 0) notFound();

  return (
    <AppShell stats={{ streak: profile?.streak_count || 0, diamonds: profile?.diamonds || 0, hearts: profile?.hearts || 0 }} role={profile?.role || "student"}>
      <PracticeClient lessonSlug={slug} lessonTitle={lesson.title} mode={mode} questions={questions} initialHearts={profile?.hearts ?? 5} initialDiamonds={profile?.diamonds ?? 0}/>
    </AppShell>
  );
}
