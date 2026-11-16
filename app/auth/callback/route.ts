import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const requestedNext = requestUrl.searchParams.get("next") || "/dashboard";
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//")
    ? requestedNext
    : "/dashboard";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=Link%20verifikasi%20tidak%20valid%20atau%20sudah%20kedaluwarsa.", requestUrl.origin));
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, requestUrl.origin));

    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent("Verifikasi gagal: " + error.message)}`, requestUrl.origin)
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Tidak dapat memverifikasi akun.";
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(message)}`, requestUrl.origin)
    );
  }
}
