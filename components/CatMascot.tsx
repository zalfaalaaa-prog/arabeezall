export default function CatMascot({ mood = "happy", size = 76, className = "" }: { mood?: "happy" | "thinking" | "celebrate" | "sad"; size?: number; className?: string }) {
  const mouth = mood === "sad" ? "M43 61 Q50 54 57 61" : mood === "thinking" ? "M44 60 Q50 56 56 60" : "M42 57 Q50 68 58 57";
  return <svg className={className} width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Maskot kucing Arabeeza">
    <ellipse cx="50" cy="88" rx="29" ry="6" fill="#263b35" opacity=".12"/>
    <path d="M19 38 23 10 43 26 Q51 23 59 26 L78 10 81 42 Q88 53 83 70 Q75 91 50 91 Q25 91 17 70 Q12 52 19 38Z" fill="#fff" stroke="#34423d" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M25 31 27 17 39 29Z M64 29 76 17 77 33Z" fill="#f3a4b3"/>
    <path d="M21 43 Q31 28 44 30 Q37 43 22 52Z" fill="#39413f"/><path d="M57 30 Q72 27 79 42 L78 53 Q64 44 57 30Z" fill="#39413f"/>
    <ellipse cx="37" cy="51" rx="4" ry="6" fill="#263b35"/><ellipse cx="63" cy="51" rx="4" ry="6" fill="#263b35"/>
    <circle cx="38" cy="49" r="1.5" fill="white"/><circle cx="64" cy="49" r="1.5" fill="white"/>
    <path d="M47 59 Q50 55 53 59 Q50 64 47 59Z" fill="#ef8e9e"/><path d={mouth} fill="none" stroke="#34423d" strokeWidth="2" strokeLinecap="round"/>
    <path d="M17 58 5 55 M18 64 5 66 M82 58 95 55 M82 65 95 67" stroke="#68756f" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M75 78 Q97 69 91 55 Q88 48 82 54" fill="none" stroke="#39413f" strokeWidth="8" strokeLinecap="round"/>
    {mood === "celebrate" && <path d="m13 17 3-7 3 7 7 3-7 3-3 7-3-7-7-3Z M82 15l2-5 2 5 5 2-5 2-2 5-2-5-5-2Z" fill="#f4b544"/>}
  </svg>;
}
