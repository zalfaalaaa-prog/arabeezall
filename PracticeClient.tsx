"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Gem, Heart, Headphones, Mic, Volume2, XCircle, Sparkles } from "lucide-react";
import { buyHearts, saveQuizResult } from "@/app/actions";
import { normalizeArabic } from "@/lib/utils";
import type { Question } from "@/lib/types";

type Feedback = { correct: boolean; message: string; answer: string };

function speakArabic(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA";
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
  return true;
}

export default function PracticeClient({
  lessonSlug,
  lessonTitle,
  mode,
  questions,
  initialHearts,
  initialDiamonds
}: {
  lessonSlug: string;
  lessonTitle: string;
  mode: string;
  questions: Question[];
  initialHearts: number;
  initialDiamonds: number;
}) {
  const [queue, setQueue] = useState<Question[]>(questions);
  const [index, setIndex] = useState(0);
  const [hearts, setHearts] = useState(initialHearts);
  const [diamonds, setDiamonds] = useState(initialDiamonds);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [buyMessage, setBuyMessage] = useState("");
  const [recording, setRecording] = useState(false);

  const question = queue[index];
  const isReading = mode === "reading" || question?.question_type === "reading_aloud";
  const isListening = mode === "listening" || question?.question_type === "listen_choose";
  const progress = Math.min(100, Math.round(((index + (feedback ? 1 : 0)) / Math.max(queue.length, 1)) * 100));
  const score = useMemo(() => Math.round((firstTryCorrect / Math.max(questions.length, 1)) * 100), [firstTryCorrect, questions.length]);
  const modeLabel = mode === "listening" ? "Menyimak" : mode === "reading" ? "Membaca" : mode === "conversation" ? "Percakapan" : "Campuran 4 Maharah";

  function checkAnswer(answer: string) {
    if (!question || feedback) return;
    setSelected(answer);
    const correct = normalizeArabic(answer) === normalizeArabic(question.correct_answer);
    if (correct) {
      if (!wrongIds.includes(question.id)) setFirstTryCorrect((value) => value + 1);
      setWrongIds((items) => items.filter((id) => id !== question.id));
      setFeedback({ correct: true, message: "Benar! Bagus sekali.", answer: question.correct_answer });
    } else {
      if (!wrongIds.includes(question.id)) {
        setWrongIds((items) => [...items, question.id]);
        setHearts((value) => Math.max(0, value - 1));
      }
      setFeedback({ correct: false, message: "Belum tepat. Perhatikan jawaban yang benar, lalu coba lagi.", answer: question.correct_answer });
    }
  }

  async function nextQuestion() {
    setSelected(null);
    setFeedback(null);
    if (index + 1 < queue.length) {
      setIndex((value) => value + 1);
      return;
    }

    const pending = questions.filter((item) => wrongIds.includes(item.id));
    if (pending.length > 0) {
      setQueue(pending);
      setIndex(0);
      if (hearts <= 0) setGameOver(true);
      return;
    }

    setSaving(true);
    setFinished(true);
    const finalScore = Math.round((firstTryCorrect / Math.max(questions.length, 1)) * 100);
    const diamondsEarned = Math.max(1, Math.round(finalScore / 10));
    const xpEarned = questions.length * 10 + Math.round(finalScore / 5);
    const result = await saveQuizResult({
      lessonSlug,
      score: finalScore,
      correctCount: questions.length,
      questionCount: questions.length,
      xpEarned,
      diamondsEarned
    });
    setSavedMessage(result.ok ? `Progres tersimpan. +${xpEarned} XP dan +${diamondsEarned} berlian.` : (result.error || "Sesi selesai. Progres belum tersimpan."));
    setSaving(false);
  }

  async function refillHearts() {
    setBuyMessage("");
    const result = await buyHearts();
    if (result.ok) {
      setHearts(result.hearts ?? 5);
      setDiamonds(result.diamonds ?? diamonds);
      setGameOver(false);
      setBuyMessage("Nyawa berhasil diisi. Lanjutkan latihan!");
    } else {
      setBuyMessage(result.error || "Berlian belum cukup untuk mengisi nyawa.");
    }
  }

  function startReading() {
    const browserWindow = window as Window & { SpeechRecognition?: any; webkitSpeechRecognition?: any };
    const Recognition = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;
    if (!Recognition) {
      checkAnswer(question?.correct_answer || "");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "ar-SA";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setRecording(true);
    recognition.onend = () => setRecording(false);
    recognition.onerror = () => setRecording(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      checkAnswer(transcript);
    };
    recognition.start();
  }

  if (finished) {
    const diamondsEarned = Math.max(1, Math.round(score / 10));
    const xpEarned = questions.length * 10 + Math.round(score / 5);
    return (
      <div className="mx-auto max-w-xl surface p-7 text-center md:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff4e5] text-[#f39a32]"><Sparkles size={40} /></div>
        <p className="mt-5 text-xs font-black uppercase tracking-[.18em] text-[#2e8b62]">Sesi selesai</p>
        <h1 className="mt-2 text-3xl font-black">مُمْتَازٌ! Hebat!</h1>
        <p className="mt-2 text-sm text-[#718078]">Kamu telah menyelesaikan {questions.length} soal pada materi {lessonTitle}.</p>
        <div className="my-7 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-[#f7faf6] p-4"><div className="text-2xl font-black">{score}</div><div className="text-xs font-bold text-[#718078]">Skor / 100</div></div>
          <div className="rounded-2xl bg-[#f7faf6] p-4"><div className="flex items-center justify-center gap-1 text-2xl font-black text-sky-600"><Gem size={19}/>{diamondsEarned}</div><div className="text-xs font-bold text-[#718078]">Berlian</div></div>
          <div className="rounded-2xl bg-[#f7faf6] p-4"><div className="text-2xl font-black text-amber-500">+{xpEarned}</div><div className="text-xs font-bold text-[#718078]">XP</div></div>
        </div>
        <p className="rounded-xl bg-[#eaf7ef] p-3 text-sm font-bold text-[#2e8b62]">{saving ? "Menyimpan progres..." : savedMessage}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="btn-primary" href={`/practice/${lessonSlug}?mode=${mode}`}>Ulangi latihan</Link>
          <Link className="btn-secondary" href="/dashboard">Kembali ke beranda</Link>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="mx-auto max-w-xl surface p-7 text-center md:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0f0] text-[#f06b75]"><Heart size={40} fill="currentColor" /></div>
        <h1 className="mt-5 text-2xl font-black">Nyawamu habis!</h1>
        <p className="mt-2 text-sm leading-6 text-[#718078]">Gunakan berlian untuk mengisi kembali 5 nyawa. Soal yang belum benar akan tetap menunggu untuk diulang.</p>
        <div className="my-5 flex items-center justify-center gap-2 text-lg font-black text-sky-600"><Gem size={20}/>{diamonds} berlian tersedia</div>
        <button className="btn-primary w-full" onClick={refillHearts}>Isi 5 nyawa · 100 berlian</button>
        {buyMessage && <p className="mt-3 text-sm font-bold text-[#718078]">{buyMessage}</p>}
        <Link href="/shop" className="mt-4 inline-block text-sm font-bold text-[#2e8b62]">Lihat toko Arabee</Link>
      </div>
    );
  }

  if (!question) return <div className="surface p-8 text-center">Soal belum tersedia. Jalankan seed database terlebih dahulu.</div>;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard" aria-label="Kembali" className="rounded-full p-2 text-[#718078] hover:bg-white"><ArrowLeft size={22}/></Link>
        <div className="progress-track flex-1"><div className="progress-fill" style={{ width: `${progress}%` }}/></div>
        <span className="flex items-center gap-1 font-black text-rose-500"><Heart size={19} fill="currentColor"/>{hearts}</span>
      </div>

      <div className="surface p-5 md:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-[#eaf7ef] px-3 py-1.5 text-xs font-black text-[#2e8b62]">{modeLabel}</span>
          <span className="text-xs font-bold text-[#8a9890]">Soal {Math.min(index + 1, questions.length)} dari {questions.length} · {wrongIds.length} perlu diulang</span>
        </div>
        <h1 className="text-xl font-black leading-8 md:text-2xl">{question.prompt}</h1>
        {question.prompt_arabic && <p className="arabic mt-5 rounded-2xl bg-[#fffdf7] px-4 py-5 text-center text-3xl font-bold">{question.prompt_arabic}</p>}

        {(isListening || mode === "conversation") && question.audio_text && (
          <button onClick={() => speakArabic(question.audio_text || question.prompt_arabic || "")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#dce9df] bg-[#f7fcf8] px-4 py-3 font-bold text-[#2e8b62]">
            <Volume2 size={19}/> Dengarkan audio Bahasa Arab
          </button>
        )}

        {isReading ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#b9d9c3] bg-[#f7fcf8] p-5 text-center">
            <p className="mb-3 text-sm font-bold text-[#718078]">Bacalah kalimat Arab dengan suara jelas.</p>
            <button onClick={startReading} disabled={recording || !!feedback} className="btn-primary mx-auto">
              <Mic size={18}/>{recording ? "Sedang mendengarkan..." : "Mulai membaca"}
            </button>
            <p className="mt-3 text-xs text-[#8a9890]">Membutuhkan browser yang mendukung pengenalan suara. Jika tidak tersedia, Arabee menggunakan konfirmasi latihan.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-3">
            {(question.options || []).map((option) => {
              const isCorrect = feedback && normalizeArabic(option) === normalizeArabic(question.correct_answer);
              const isWrong = feedback && selected === option && !feedback.correct;
              return (
                <button key={option} disabled={!!feedback} onClick={() => checkAnswer(option)} className={`choice ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}>
                  <span className="flex items-center justify-between gap-3"><span>{option}</span>{isCorrect ? <CheckCircle2 size={19}/> : isWrong ? <XCircle size={19}/> : null}</span>
                </button>
              );
            })}
          </div>
        )}

        {feedback && (
          <div className={`mt-5 rounded-2xl p-4 ${feedback.correct ? "bg-[#e9f9ef] text-[#216b43]" : "bg-[#fff0f0] text-[#a33c45]"}`}>
            <div className="flex items-center gap-2 font-black">{feedback.correct ? <CheckCircle2 size={19}/> : <XCircle size={19} />}{feedback.message}</div>
            {!feedback.correct && <p className="mt-2 text-sm">Jawaban benar: <strong>{feedback.answer}</strong></p>}
            {question.explanation && <p className="mt-2 text-sm leading-6">{question.explanation}</p>}
            <button onClick={nextQuestion} className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-black text-white ${feedback.correct ? "bg-[#2e8b62]" : "bg-[#df626c]"}`}>
              Lanjutkan <ArrowRight size={17}/>
            </button>
          </div>
        )}
        {!feedback && <div className="mt-6 flex items-center justify-between text-xs font-bold text-[#8a9890]"><span>Jawab dengan teliti ya!</span><span className="flex items-center gap-1"><Gem size={14} className="text-sky-500"/>{diamonds}</span></div>}
      </div>
      <div className="mt-4 text-center text-xs text-[#89968f]">Materi: {lessonTitle} · Satu sesi terdiri dari 15 soal</div>
    </div>
  );
}
