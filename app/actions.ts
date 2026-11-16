"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("Email dan kata sandi wajib diisi.")}`);
  }

  let errorMessage: string | null = null;
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const raw = error.message;
      const lower = raw.toLowerCase();
      if (lower.includes("email not confirmed") || lower.includes("email_not_confirmed")) {
        errorMessage = "Email belum diverifikasi. Buka email pendaftaran dan klik tautan verifikasi sebelum masuk.";
      } else if (lower.includes("invalid login credentials")) {
        errorMessage = "Email atau kata sandi tidak sesuai. Periksa kembali atau daftar jika belum memiliki akun.";
      } else {
        errorMessage = raw;
      }
    }
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Tidak dapat menghubungi layanan autentikasi.";
  }

  if (errorMessage) redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
  redirect("/dashboard");
}

export async function register(formData: FormData) {
  const displayName = String(formData.get("display_name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (displayName.length < 2) {
    redirect(`/register?error=${encodeURIComponent("Nama lengkap minimal 2 karakter.")}`);
  }
  if (!email || !email.includes("@")) {
    redirect(`/register?error=${encodeURIComponent("Masukkan alamat email yang valid.")}`);
  }
  if (password.length < 8) {
    redirect(`/register?error=${encodeURIComponent("Kata sandi minimal 8 karakter.")}`);
  }

  let errorMessage: string | null = null;
  let hasSession = false;
  try {
    const supabase = await createClient();
    const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    const vercelUrl = process.env.VERCEL_URL?.trim();
    const siteUrl = (configuredSiteUrl || (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000")).replace(/\/$/, "");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: `${siteUrl}/auth/callback?next=%2Fdashboard`
      }
    });
    if (error) errorMessage = error.message;
    hasSession = Boolean(data.session);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Pendaftaran belum dapat diproses. Periksa koneksi Supabase.";
  }

  if (errorMessage) redirect(`/register?error=${encodeURIComponent(errorMessage)}`);
  if (hasSession) redirect("/dashboard");
  redirect(`/register?success=check-email&email=${encodeURIComponent(email)}`);
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
  const { data, error } = await supabase.rpc("buy_hearts", { p_cost: 25 });
  if (error) return { ok: false, error: error.message };
  const { data: profile } = await supabase.from("profiles").select("hearts,diamonds").eq("id", user.id).single();
  return { ok: true, hearts: profile?.hearts ?? 5, diamonds: profile?.diamonds ?? 0, message: data?.message };
}

export async function buyHeartsFromShop() {
  const supabase = await createClient();
  const { error } = await supabase.rpc("buy_hearts", { p_cost: 25 });
  if (error) redirect(`/shop?error=${encodeURIComponent(error.message)}`);
  redirect("/shop?success=1");
}

export async function updateAvatar(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const avatarSkin = String(formData.get("avatar_skin") || "sawo-matang");
  const avatarOutfit = String(formData.get("avatar_outfit") || "hijau");
  const gender = String(formData.get("avatar_gender") || "perempuan");
  const hair = String(formData.get("avatar_hair") || "panjang");
  const hijab = String(formData.get("avatar_hijab") || "tidak");
  const expression = String(formData.get("avatar_expression") || "senyum");
  const valid = [
    [avatarSkin, ["sawo-matang", "kuning-langsat", "cokelat", "cerah"]],
    [avatarOutfit, ["hijau", "biru", "oranye", "ungu"]],
    [gender, ["laki-laki", "perempuan"]], [hair, ["pendek", "panjang", "keriting"]],
    [hijab, ["tidak", "ya"]], [expression, ["senyum", "ceria", "serius"]]
  ] as const;
  if (valid.some(([value, options]) => !options.includes(value as never))) redirect("/profile?error=Pilihan+avatar+tidak+valid");
  const { error } = await supabase.rpc("update_my_avatar_v2", {
    p_avatar_skin: avatarSkin, p_avatar_outfit: avatarOutfit, p_avatar_gender: gender,
    p_avatar_hair: hair, p_avatar_hijab: hijab, p_avatar_expression: expression
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
