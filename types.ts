export type Profile = {
  id: string;
  display_name: string;
  role: "student" | "teacher" | "admin";
  xp: number;
  diamonds: number;
  hearts: number;
  streak_count: number;
  last_active_date: string | null;
  avatar_skin: string;
  avatar_outfit: string;
};

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  title_ar: string;
  description: string;
  color: string;
  level_no: number;
  sort_order: number;
};

export type Question = {
  id: string;
  mode: string;
  skill: string;
  question_type: string;
  prompt: string;
  prompt_arabic: string | null;
  options: string[];
  correct_answer: string;
  explanation: string | null;
  audio_text: string | null;
  sort_order: number;
};
