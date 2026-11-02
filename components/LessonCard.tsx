import Link from "next/link";
import { ArrowRight, BookOpen, Headphones, Mic, MessageCircle, Sparkles } from "lucide-react";
import type { Lesson } from "@/lib/types";

const modes = [
  { mode: "mixed", label: "Campuran 4 maharah", icon: Sparkles },
  { mode: "listening", label: "Menyimak", icon: Headphones },
  { mode: "reading", label: "Membaca", icon: Mic },
  { mode: "conversation", label: "Percakapan", icon: MessageCircle }
];

export default function LessonCard({ lesson, completed = 0, bestScore = 0 }: { lesson: Lesson; completed?: number; bestScore?: number }) {
  return (
    <article className="surface overflow-hidden">
      <div className="h-2" style={{ background: lesson.color || "#f39a32" }} />
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full bg-[#fff4e5] px-3 py-1 text-xs font-extrabold text-[#bd741b]">MATERI {lesson.level_no}</span>
          <span className="text-xs font-bold text-[#8a9890]">{completed} sesi selesai</span>
        </div>
        <p className="arabic text-right text-2xl font-bold">{lesson.title_ar}</p>
        <h3 className="mt-1 text-lg font-black">{lesson.title}</h3>
        <p className="mt-2 min-h-10 text-sm leading-6 text-[#718078]">{lesson.description}</p>
        <div className="mt-4 flex items-center justify-between text-xs font-bold text-[#718078]">
          <span>Skor terbaik</span><span>{bestScore}/100</span>
        </div>
        <div className="progress-track mt-2"><div className="progress-fill" style={{ width: `${Math.min(bestScore, 100)}%` }} /></div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {modes.map(({ mode, label, icon: Icon }) => (
            <Link key={mode} href={`/practice/${lesson.slug}?mode=${mode}`} className="flex items-center justify-between rounded-xl border border-[#e7eee8] px-3 py-2.5 text-xs font-bold text-[#50645a] hover:border-[#8fc8a5] hover:bg-[#f7fcf8]">
              <span className="flex items-center gap-2"><Icon size={15} />{label}</span><ArrowRight size={14} />
            </Link>
          ))}
        </div>
        <Link href={`/lessons/${lesson.slug}`} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#eaf7ef] px-4 py-3 text-sm font-extrabold text-[#2e8b62] hover:bg-[#dff2e5]">
          <BookOpen size={16} /> Pelajari materi
        </Link>
      </div>
    </article>
  );
}
