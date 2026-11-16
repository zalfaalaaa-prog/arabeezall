import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSupabaseCredentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !key) {
    throw new Error(
      "Konfigurasi Supabase belum lengkap. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY (atau NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) pada Environment Variables Vercel."
    );
  }

  return { url, key };
}

export async function createClient() {
  const { url, key } = getSupabaseCredentials();
  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot always write cookies; middleware refreshes the session.
        }
      }
    }
  });
}
