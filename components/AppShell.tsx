import Link from "next/link";
import { BookOpen, Flame, Gem, Heart, Home, ShoppingBag, UserRound, GraduationCap } from "lucide-react";
import { signOut } from "@/app/actions";
import CatMascot from "@/components/CatMascot";

const links = [
  { href: "/dashboard", label: "Beranda", icon: Home },
  { href: "/outcomes", label: "Capaian", icon: GraduationCap },
  { href: "/shop", label: "Toko", icon: ShoppingBag },
  { href: "/profile", label: "Profil", icon: UserRound }
];

export default function AppShell({
  children,
  active,
  role = "student",
  stats
}: {
  children: React.ReactNode;
  active?: string;
  role?: string;
  stats?: { streak?: number; diamonds?: number; hearts?: number };
}) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[#e7eee8] bg-white/95 backdrop-blur">
        <div className="page-wrap flex min-h-[72px] items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <CatMascot size={48}/>
            <span className="text-xl font-black tracking-tight">arabeeza<span className="text-[#f39a32]">.</span></span>
            <span className="ml-1 rounded-lg bg-[#f7faf6] px-2 py-1 text-sm" aria-label="Bahasa Arab" title="Bahasa Arab">🇸🇦</span>
          </Link>
          <nav className="desktop-nav flex items-center gap-6">
            {links.map((item) => {
              const Icon = item.icon;
              return <Link key={item.href} href={item.href} className={`nav-link ${active === item.href ? "active" : ""}`}><Icon size={17} />{item.label}</Link>;
            })}
            {role === "teacher" || role === "admin" ? <Link href="/teacher" className={`nav-link ${active === "/teacher" ? "active" : ""}`}><BookOpen size={17} />Guru</Link> : null}
          </nav>
          <div className="flex items-center gap-2">
            {stats?.streak !== undefined && <span className="stat-pill text-orange-600"><Flame size={16} />{stats.streak}</span>}
            {stats?.diamonds !== undefined && <span className="stat-pill text-sky-600"><Gem size={16} />{stats.diamonds}</span>}
            {stats?.hearts !== undefined && <span className="stat-pill text-rose-500"><Heart size={16} fill="currentColor" />{stats.hearts}</span>}
            <form action={signOut}><button className="ml-1 rounded-xl border border-[#e7eee8] px-3 py-2 text-xs font-bold text-[#718078] hover:bg-[#f7faf6]">Keluar</button></form>
          </div>
        </div>
        <div className="flex items-center justify-around border-t border-[#edf2ee] bg-white px-2 py-2 md:hidden">
          {links.map((item) => {
            const Icon = item.icon;
            return <Link key={item.href} href={item.href} aria-label={item.label} className={`flex min-w-[62px] flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-extrabold ${active === item.href ? "bg-[#eaf7ef] text-[#2e8b62]" : "text-[#718078]"}`}><Icon size={20} /><span>{item.label}</span></Link>;
          })}
        </div>
      </header>
      <main className="page-wrap py-7 md:py-9">{children}</main>
      <footer className="page-wrap border-t border-[#e7eee8] py-6 text-center text-xs text-[#89968f]">
        Arabeeza · Belajar Bahasa Arab dengan menyenangkan
      </footer>
    </div>
  );
}
