"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect("/dashboard");
}

export async function register(formData: FormData) {
  const supabase = await createClient();
  const displayName = String(formData.get("display_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (displayName.length < 2 || password.length < 8) {
    redirect("/register?error=" + encodeURIComponent("Nama minimal 2 karakter dan kata sandi minimal 8 karakter."));
  }
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } }
  });
  if (error) redirect(`/register?error=${encodeURIComponent(error.message)}`);
  redirect("/login?registered=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

type QuizResult = {
  lessonSlug: string;
  score: number;
  correctCount: number;
  questionCount: number;
  xpEarned: number;
  diamondsEarned: number;
};

export async function saveQuizResult(input: QuizResult) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sesi login berakhir. Silakan login kembali." };

  const safe = {
    p_lesson_slug: input.lessonSlug,
    p_score: Math.max(0, Math.min(100, Math.round(input.score))),
    p_correct_count: Math.max(0, Math.min(15, Math.round(input.correctCount))),
    p_question_count: Math.max(1, Math.min(15, Math.round(input.questionCount))),
    p_xp_earned: Math.max(0, Math.min(1000, Math.round(input.xpEarned))),
    p_diamonds_earned: Math.max(0, Math.min(100, Math.round(input.diamondsEarned)))
  };
  const { error } = await supabase.rpc("record_quiz_result", safe);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function buyHearts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Silakan login kembali." };
  const { data, error } = await supabase.rpc("buy_hearts", { p_cost: 100 });
  if (error) return { ok: false, error: error.message };
  const { data: profile } = await supabase.from("profiles").select("hearts,diamonds").eq("id", user.id).single();
  return { ok: true, hearts: profile?.hearts ?? 5, diamonds: profile?.diamonds ?? 0, message: data?.message };
}

export async function buyHeartsFromShop() {
  const supabase = await createClient();
  const { error } = await supabase.rpc("buy_hearts", { p_cost: 100 });
  if (error) redirect(`/shop?error=${encodeURIComponent(error.message)}`);
  redirect("/shop?success=1");
}

export async function updateAvatar(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const avatarSkin = String(formData.get("avatar_skin") || "sawo-matang");
  const avatarOutfit = String(formData.get("avatar_outfit") || "hijau");
  const allowedSkins = ["sawo-matang", "kuning-langsat", "cokelat", "cerah"];
  const allowedOutfits = ["hijau", "biru", "oranye", "ungu"];
  if (!allowedSkins.includes(avatarSkin) || !allowedOutfits.includes(avatarOutfit)) redirect("/profile?error=Pilihan+avatar+tidak+valid");
  const { error } = await supabase.rpc("update_my_avatar", {
    p_avatar_skin: avatarSkin,
    p_avatar_outfit: avatarOutfit
  });
  if (error) redirect(`/profile?error=${encodeURIComponent(error.message)}`);
  redirect("/profile?updated=1");
}

export async function addTeacherNote(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const studentId = String(formData.get("student_id") || "");
  const lessonId = String(formData.get("lesson_id") || "");
  const note = String(formData.get("note") || "").trim();
  if (!studentId || !lessonId || note.length < 3) redirect("/teacher?error=Lengkapi+catatan");
  const { error } = await supabase.from("teacher_notes").insert({
    student_id: studentId,
    teacher_id: user.id,
    lesson_id: lessonId,
    note
  });
  if (error) redirect(`/teacher?error=${encodeURIComponent(error.message)}`);
  redirect("/teacher?success=1");
}
