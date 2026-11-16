-- =====================================================================
-- PANDAI TAJWID — Scoreboard dalam talian (pilihan)
-- Jalankan dalam Supabase → SQL Editor. Kemudian:
--   1. Authentication → Sign In / Providers → aktifkan "Allow anonymous sign-ins".
--   2. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY (lihat .env.example / README).
-- Rekod belajar terperinci kekal TEMPATAN dalam pelayar; hanya ringkasan skor dihantar.
-- =====================================================================

create table if not exists public.pandai_scores (
  owner       uuid not null references auth.users (id) on delete cascade,
  profile_id  text not null,
  name        text not null check (char_length(name) between 1 and 40),
  avatar      text not null default '🙂' check (char_length(avatar) <= 8),
  xp          integer not null default 0 check (xp >= 0),
  weekly_xp   integer not null default 0 check (weekly_xp >= 0),
  week_start  date not null default current_date,
  answered    integer not null default 0 check (answered >= 0),
  accuracy    integer not null default 0 check (accuracy between 0 and 100),
  streak      integer not null default 0 check (streak >= 0),
  updated_at  timestamptz not null default now(),
  primary key (owner, profile_id)
);

create index if not exists pandai_scores_xp_idx on public.pandai_scores (xp desc);
create index if not exists pandai_scores_week_idx on public.pandai_scores (week_start, weekly_xp desc);

alter table public.pandai_scores enable row level security;

-- Semua orang (termasuk tanpa nama) boleh melihat papan skor.
drop policy if exists "baca semua" on public.pandai_scores;
create policy "baca semua" on public.pandai_scores for select using (true);

-- Hanya pemilik peranti boleh menambah / mengemas kini / memadam baris sendiri.
drop policy if exists "tulis sendiri" on public.pandai_scores;
create policy "tulis sendiri" on public.pandai_scores for insert with check (auth.uid() = owner);
drop policy if exists "kemas kini sendiri" on public.pandai_scores;
create policy "kemas kini sendiri" on public.pandai_scores for update using (auth.uid() = owner) with check (auth.uid() = owner);
drop policy if exists "padam sendiri" on public.pandai_scores;
create policy "padam sendiri" on public.pandai_scores for delete using (auth.uid() = owner);
