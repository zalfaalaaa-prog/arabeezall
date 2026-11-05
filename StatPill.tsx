import { Flame, Gem, Heart, Zap } from "lucide-react";

export function StatPill({ kind, value }: { kind: "streak" | "diamonds" | "hearts" | "xp"; value: number }) {
  const map = {
    streak: { icon: Flame, color: "text-orange-500" },
    diamonds: { icon: Gem, color: "text-sky-500" },
    hearts: { icon: Heart, color: "text-rose-500" },
    xp: { icon: Zap, color: "text-amber-500" }
  };
  const Icon = map[kind].icon;
  return <span className={`stat-pill ${map[kind].color}`}><Icon size={16} fill={kind === "hearts" ? "currentColor" : "none"} />{value.toLocaleString("id-ID")}</span>;
}
