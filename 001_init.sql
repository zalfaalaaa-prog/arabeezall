-- ARABEE database schema for Supabase / PostgreSQL
-- Run this file in Supabase SQL Editor or through Supabase CLI.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Teman Arabee',
  role text not null default 'student' check (role in ('student', 'teacher', 'admin')),
  xp integer not null default 0 check (xp >= 0),
  diamonds integer not null default 0 check (diamonds >= 0),
  hearts integer not null default 5 check (hearts between 0 and 5),
  streak_count integer not null default 0 check (streak_count >= 0),
  last_active_date date,
  avatar_skin text not null default 'sawo-matang',
  avatar_outfit text not null default 'hijau',
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  title_ar text not null,
  description text not null default '',
  color text not null default '#F39A32',
  level_no integer not null default 1,
  sort_order integer not null default 1,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.vocabulary (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  arabic text not null,
  transliteration text,
  meaning text not null,
  example_arabic text,
  example_meaning text,
  sort_order integer not null default 1
);

create table if not exists public.dialogues (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  title text not null,
  arabic_text text not null,
  translation text not null,
  sort_order integer not null default 1
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  mode text not null default 'mixed' check (mode in ('mixed', 'listening', 'reading', 'conversation')),
  skill text not null default 'mixed',
  question_type text not null default 'multiple_choice',
  prompt text not null,
  prompt_arabic text,
  options jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  explanation text,
  audio_text text,
  sort_order integer not null default 1,
  is_published boolean not null default true,
  unique (lesson_id, mode, sort_order)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_sessions integer not null default 0,
  best_score integer not null default 0,
  total_xp integer not null default 0,
  last_completed_at timestamptz,
  unique (user_id, lesson_id)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  score integer not null default 0,
  correct_count integer not null default 0,
  question_count integer not null default 15,
  xp_earned integer not null default 0,
  diamonds_earned integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.teacher_notes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_questions_lesson_mode on public.questions(lesson_id, mode, sort_order);
create index if not exists idx_progress_user on public.lesson_progress(user_id);
create index if not exists idx_attempts_user on public.quiz_attempts(user_id, created_at desc);
create index if not exists idx_teacher_notes_student on public.teacher_notes(student_id, created_at desc);

-- Create a student profile automatically when an auth account is registered.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), split_part(new.email, '@', 1), 'Teman Arabee')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Security-definer helper avoids recursive RLS checks on profiles.
create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('teacher', 'admin')
  );
$$;

alter table public.profiles enable row level security;
alter table public.lessons enable row level security;
alter table public.vocabulary enable row level security;
alter table public.dialogues enable row level security;
alter table public.questions enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.teacher_notes enable row level security;

drop policy if exists "profiles_select_own_or_teacher" on public.profiles;
create policy "profiles_select_own_or_teacher" on public.profiles
for select to authenticated using (id = auth.uid() or public.is_teacher());

-- Profile updates are restricted to a server-side avatar RPC so a student
-- cannot promote their own role or alter XP, diamonds, and hearts directly.

drop policy if exists "lessons_read_published" on public.lessons;
create policy "lessons_read_published" on public.lessons
for select to authenticated using (is_published or public.is_teacher());

drop policy if exists "lessons_teacher_manage" on public.lessons;
create policy "lessons_teacher_manage" on public.lessons
for all to authenticated using (public.is_teacher()) with check (public.is_teacher());

drop policy if exists "vocabulary_read_authenticated" on public.vocabulary;
create policy "vocabulary_read_authenticated" on public.vocabulary
for select to authenticated using (exists (select 1 from public.lessons l where l.id = lesson_id and l.is_published));

drop policy if exists "vocabulary_teacher_manage" on public.vocabulary;
create policy "vocabulary_teacher_manage" on public.vocabulary
for all to authenticated using (public.is_teacher()) with check (public.is_teacher());

drop policy if exists "dialogues_read_authenticated" on public.dialogues;
create policy "dialogues_read_authenticated" on public.dialogues
for select to authenticated using (exists (select 1 from public.lessons l where l.id = lesson_id and l.is_published));

drop policy if exists "dialogues_teacher_manage" on public.dialogues;
create policy "dialogues_teacher_manage" on public.dialogues
for all to authenticated using (public.is_teacher()) with check (public.is_teacher());

drop policy if exists "questions_read_published" on public.questions;
create policy "questions_read_published" on public.questions
for select to authenticated using (is_published or public.is_teacher());

drop policy if exists "questions_teacher_manage" on public.questions;
create policy "questions_teacher_manage" on public.questions
for all to authenticated using (public.is_teacher()) with check (public.is_teacher());

drop policy if exists "progress_read_own_or_teacher" on public.lesson_progress;
create policy "progress_read_own_or_teacher" on public.lesson_progress
for select to authenticated using (user_id = auth.uid() or public.is_teacher());

drop policy if exists "progress_write_own" on public.lesson_progress;
create policy "progress_write_own" on public.lesson_progress
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "attempts_read_own_or_teacher" on public.quiz_attempts;
create policy "attempts_read_own_or_teacher" on public.quiz_attempts
for select to authenticated using (user_id = auth.uid() or public.is_teacher());

drop policy if exists "attempts_insert_own" on public.quiz_attempts;
create policy "attempts_insert_own" on public.quiz_attempts
for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "teacher_notes_read_student_teacher" on public.teacher_notes;
create policy "teacher_notes_read_student_teacher" on public.teacher_notes
for select to authenticated using (student_id = auth.uid() or teacher_id = auth.uid() or public.is_teacher());

drop policy if exists "teacher_notes_teacher_insert" on public.teacher_notes;
create policy "teacher_notes_teacher_insert" on public.teacher_notes
for insert to authenticated with check (teacher_id = auth.uid() and public.is_teacher());

-- Atomic score, XP, diamond, streak, attempt and progress update.
create or replace function public.record_quiz_result(
  p_lesson_slug text,
  p_score integer,
  p_correct_count integer,
  p_question_count integer,
  p_xp_earned integer,
  p_diamonds_earned integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_lesson uuid;
  v_streak integer;
  v_last date;
begin
  if v_user is null then raise exception 'Silakan login terlebih dahulu.'; end if;

  select id into v_lesson
  from public.lessons
  where slug = p_lesson_slug and is_published = true;

  if v_lesson is null then raise exception 'Materi tidak ditemukan.'; end if;

  select streak_count, last_active_date into v_streak, v_last
  from public.profiles where id = v_user for update;

  if v_last = current_date then
    v_streak := coalesce(v_streak, 0);
  elsif v_last = current_date - 1 then
    v_streak := coalesce(v_streak, 0) + 1;
  else
    v_streak := 1;
  end if;

  update public.profiles
  set xp = xp + greatest(0, least(coalesce(p_xp_earned, 0), 1000)),
      diamonds = diamonds + greatest(0, least(coalesce(p_diamonds_earned, 0), 100)),
      streak_count = v_streak,
      last_active_date = current_date
  where id = v_user;

  insert into public.quiz_attempts (user_id, lesson_id, score, correct_count, question_count, xp_earned, diamonds_earned)
  values (
    v_user, v_lesson,
    greatest(0, least(coalesce(p_score, 0), 100)),
    greatest(0, least(coalesce(p_correct_count, 0), 15)),
    greatest(1, least(coalesce(p_question_count, 15), 15)),
    greatest(0, least(coalesce(p_xp_earned, 0), 1000)),
    greatest(0, least(coalesce(p_diamonds_earned, 0), 100))
  );

  insert into public.lesson_progress (user_id, lesson_id, completed_sessions, best_score, total_xp, last_completed_at)
  values (v_user, v_lesson, 1, greatest(0, least(coalesce(p_score, 0), 100)), greatest(0, least(coalesce(p_xp_earned, 0), 1000)), now())
  on conflict (user_id, lesson_id) do update
    set completed_sessions = public.lesson_progress.completed_sessions + 1,
        best_score = greatest(public.lesson_progress.best_score, excluded.best_score),
        total_xp = public.lesson_progress.total_xp + excluded.total_xp,
        last_completed_at = now();

  return jsonb_build_object('ok', true, 'streak_count', v_streak);
end;
$$;

create or replace function public.buy_hearts(p_cost integer default 100)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_diamonds integer;
  v_hearts integer;
  v_cost integer := greatest(1, least(coalesce(p_cost, 100), 10000));
begin
  if v_user is null then raise exception 'Silakan login terlebih dahulu.'; end if;
  select diamonds, hearts into v_diamonds, v_hearts from public.profiles where id = v_user for update;
  if v_hearts >= 5 then raise exception 'Nyawa kamu sudah penuh.'; end if;
  if v_diamonds < v_cost then raise exception 'Berlian tidak cukup. Kamu membutuhkan 100 berlian.'; end if;

  update public.profiles set diamonds = diamonds - v_cost, hearts = 5 where id = v_user;
  return jsonb_build_object('ok', true, 'hearts', 5, 'diamonds', v_diamonds - v_cost);
end;
$$;


create or replace function public.update_my_avatar(
  p_avatar_skin text,
  p_avatar_outfit text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then raise exception 'Silakan login terlebih dahulu.'; end if;
  if p_avatar_skin not in ('sawo-matang', 'kuning-langsat', 'cokelat', 'cerah') then
    raise exception 'Pilihan warna karakter tidak valid.';
  end if;
  if p_avatar_outfit not in ('hijau', 'biru', 'oranye', 'ungu') then
    raise exception 'Pilihan pakaian tidak valid.';
  end if;
  update public.profiles
  set avatar_skin = p_avatar_skin, avatar_outfit = p_avatar_outfit
  where id = v_user;
  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.record_quiz_result(text, integer, integer, integer, integer, integer) to authenticated;
grant execute on function public.buy_hearts(integer) to authenticated;
grant execute on function public.is_teacher() to authenticated;
grant execute on function public.update_my_avatar(text, text) to authenticated;
