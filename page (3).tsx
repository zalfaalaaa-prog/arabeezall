import { redirect } from "next/navigation";
import { Gem, Heart, ShoppingBag } from "lucide-react";
import AppShell from "@/components/AppShell";
import { buyHeartsFromShop } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const p = profile || { role: "student", streak_count: 0, diamonds: 0, hearts: 5 };

  return (
    <AppShell active="/shop" role={p.role} stats={{ streak: p.streak_count, diamonds: p.diamonds, hearts: p.hearts }}>
      <div className="mb-6"><p className="text-xs font-black tracking-[.16em] text-[#2e8b62]">ARABEE STORE</p><h1 className="mt-1 text-3xl font-black">Toko hadiah</h1><p className="mt-2 text-sm text-[#718078]">Gunakan berlian yang kamu kumpulkan untuk mengisi nyawa.</p></div>
      {params.success && <p className="mb-4 rounded-xl bg-[#eaf7ef] p-3 text-sm font-bold text-[#2e8b62]">Pembelian berhasil. Nyawa sudah diisi.</p>}
      {params.error && <p className="mb-4 rounded-xl bg-[#fff0f0] p-3 text-sm text-[#a33c45]">{params.error}</p>}
      <div className="grid gap-5 md:grid-cols-2">
        <article className="surface p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0f0] text-[#f06b75]"><Heart size={30} fill="currentColor"/></div>
          <h2 className="mt-4 text-xl font-black">Isi ulang 5 nyawa</h2><p className="mt-2 text-sm leading-6 text-[#718078]">Pulihkan energi belajar agar kamu dapat melanjutkan sesi dan mengulang soal yang belum benar.</p>
          <div className="my-5 flex items-center gap-2 text-lg font-black text-sky-600"><Gem size={21}/>100 berlian</div>
          <form action={buyHeartsFromShop}><button className="btn-primary w-full" type="submit" disabled={p.hearts >= 5}> {p.hearts >= 5 ? "Nyawa sudah penuh" : "Tukar berlian"}</button></form>
        </article>
        <article className="surface flex flex-col justify-between bg-[#fff4e5] p-6">
          <div><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#f39a32]"><ShoppingBag size={28}/></div><h2 className="mt-4 text-xl font-black">Kumpulkan berlian</h2><p className="mt-2 text-sm leading-6 text-[#806a4f]">Selesaikan latihan 15 soal. Berlian diberikan berdasarkan skor sesi yang kamu peroleh.</p></div>
          <div className="mt-6 rounded-2xl bg-white/80 p-4"><p className="text-xs font-bold text-[#806a4f]">SALDO SAAT INI</p><p className="mt-1 flex items-center gap-2 text-3xl font-black text-sky-600"><Gem size={25}/>{p.diamonds}</p></div>
        </article>
      </div>
    </AppShell>
  );
}
