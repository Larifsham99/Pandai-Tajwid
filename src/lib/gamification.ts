import type { DB, Question } from "../types";
import { CHAPTERS } from "../data";
import { DAY, dayKey, startOfDay, startOfWeek } from "./util";

// ================= XP =================
export const XP_RULES = { answer: 2, correct: 8, exercise: 20, noteSection: 5, chapterMastered: 100, tauliahSelf: 6 };

// ================= TAHAP =================
export const LEVELS = [
  { id: "mubtadi", name: "Mubtadi'", arab: "مُبْتَدِئ", minXp: 0, minMastered: 0, desc: "Permulaan perjalanan ilmu." },
  { id: "mutawassit", name: "Mutawassit", arab: "مُتَوَسِّط", minXp: 500, minMastered: 3, desc: "≥ 500 XP dan menguasai sekurang-kurangnya 3 bab." },
  { id: "mutaqaddim", name: "Mutaqaddim", arab: "مُتَقَدِّم", minXp: 1500, minMastered: 6, desc: "≥ 1,500 XP dan menguasai sekurang-kurangnya 6 bab." },
  { id: "mutamayyiz", name: "Mutamayyiz", arab: "مُتَمَيِّز", minXp: 3500, minMastered: 9, desc: "≥ 3,500 XP dan menguasai sekurang-kurangnya 9 bab." },
  { id: "penguasaan", name: "Penguasaan Tajwid", arab: "إِتْقَان", minXp: 6000, minMastered: 12, desc: "≥ 6,000 XP dan menguasai kesemua 12 bab." },
];

/** Syarat bab dikuasai: semua seksyen nota dibaca, ≥ 8 cubaan, ketepatan ≥ 80% (20 cubaan terkini). */
export const MASTERY = { minAttempts: 8, minAcc: 80 };

export function totalXp(d: DB, userId: string) { return d.xp.reduce((s, x) => (x.userId === userId ? s + x.amount : s), 0); }

export interface ChapterStat { chapterId: string; attempts: number; correct: number; acc: number; readPct: number; mastered: boolean; lastTs?: number }
export function chapterStats(d: DB, userId: string): ChapterStat[] {
  // satu laluan sahaja ke atas senarai cubaan (pantas walaupun ribuan rekod)
  const by = new Map<string, DB["attempts"]>();
  for (const a of d.attempts) { if (a.userId !== userId) continue; const l = by.get(a.chapterId); if (l) l.push(a); else by.set(a.chapterId, [a]); }
  return CHAPTERS.map((c) => {
    const ca = by.get(c.id) ?? []; // sudah tersusun ikut masa (ditambah secara kronologi)
    const recent = ca.slice(-20);
    const correct = recent.reduce((s, a) => s + a.score, 0);
    const acc = recent.length ? Math.round((correct / recent.length) * 100) : 0;
    const np = d.notes.find((n) => n.userId === userId && n.chapterId === c.id);
    const readPct = np ? Math.round((np.read.filter((r) => c.sections.some((s) => s.id === r)).length / c.sections.length) * 100) : 0;
    return { chapterId: c.id, attempts: ca.length, correct: ca.reduce((s, a) => s + a.score, 0), acc, readPct, mastered: readPct === 100 && ca.length >= MASTERY.minAttempts && acc >= MASTERY.minAcc, lastTs: ca.at(-1)?.ts };
  });
}

export function levelFor(xp: number, mastered: number) {
  let cur = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.minXp && mastered >= l.minMastered) cur = l;
  const idx = LEVELS.indexOf(cur);
  const next = LEVELS[idx + 1];
  const progress = next ? Math.min(100, Math.round((Math.min(1, (xp - cur.minXp) / (next.minXp - cur.minXp)) * 0.7 + Math.min(1, mastered / Math.max(1, next.minMastered)) * 0.3) * 100)) : 100;
  return { level: cur, next, progress, idx };
}

export function activeDays(d: DB, userId: string) {
  const days = new Set<string>();
  d.attempts.forEach((a) => a.userId === userId && days.add(dayKey(a.ts)));
  d.xp.forEach((x) => x.userId === userId && days.add(dayKey(x.ts)));
  return days;
}
export function streak(d: DB, userId: string) {
  const days = activeDays(d, userId);
  let s = 0; let t = startOfDay();
  if (!days.has(dayKey(t))) t -= DAY; // streak masih hidup jika aktif semalam
  while (days.has(dayKey(t))) { s++; t -= DAY; }
  return s;
}
export const answeredToday = (d: DB, userId: string) => { const t = startOfDay(); return d.attempts.filter((a) => a.userId === userId && a.ts >= t).length; };

/** Ringkasan untuk paparan — dicache bagi setiap versi DB supaya setiap halaman tidak mengira semula. */
const summaryCache = new WeakMap<DB, Map<string, ReturnType<typeof computeSummary>>>();
export function summary(d: DB, userId: string) {
  let m = summaryCache.get(d); if (!m) { m = new Map(); summaryCache.set(d, m); }
  let v = m.get(userId); if (!v) { v = computeSummary(d, userId); m.set(userId, v); }
  return v;
}
function computeSummary(d: DB, userId: string) {
  const atts = d.attempts.filter((a) => a.userId === userId);
  const correct = atts.reduce((s, a) => s + a.score, 0);
  const stats = chapterStats(d, userId);
  const xp = totalXp(d, userId);
  const mastered = stats.filter((s) => s.mastered).length;
  return {
    xp, answered: atts.length, correct: Math.round(correct), acc: atts.length ? Math.round((correct / atts.length) * 100) : 0,
    stats, mastered, weak: stats.filter((s) => s.attempts >= 3 && s.acc < 60), streak: streak(d, userId), lvl: levelFor(xp, mastered),
  };
}

// ================= LENCANA =================
export interface BadgeDef { id: string; name: string; icon: string; desc: string; check: (d: DB, uid: string, qs: Question[]) => boolean }
const masteredOf = (d: DB, u: string, ch: string) => chapterStats(d, u).find((s) => s.chapterId === ch)?.mastered ?? false;
const correctCount = (d: DB, u: string) => d.attempts.filter((a) => a.userId === u && a.correct).length;
export const BADGES: BadgeDef[] = [
  { id: "mula", name: "Langkah Pertama", icon: "🌱", desc: "Jawab 10 soalan pertama.", check: (d, u) => d.attempts.filter((a) => a.userId === u).length >= 10 },
  { id: "asas", name: "Asas Tajwid", icon: "📗", desc: "Baca semua seksyen nota Bab 1 (Pengenalan).", check: (d, u) => chapterStats(d, u)[0].readPct === 100 },
  { id: "nun", name: "Penguasa Nun Sakinah", icon: "ن", desc: "Kuasai Bab 4: Nun Sakinah & Tanwin.", check: (d, u) => masteredOf(d, u, "b4") },
  { id: "mad", name: "Master Mad", icon: "〰️", desc: "Kuasai Bab 9: Hukum Mad.", check: (d, u) => masteredOf(d, u, "b9") },
  { id: "makharij", name: "Penguasa Makharij", icon: "👄", desc: "Kuasai Bab 2: Makharij al-Huruf.", check: (d, u) => masteredOf(d, u, "b2") },
  { id: "dhobit", name: "Ahli Dhobit", icon: "🔑", desc: "Jawab betul 20 soalan dhobit.", check: (d, u, qs) => { const ids = new Set(qs.filter((q) => q.kind === "dhobit").map((q) => q.id)); return d.attempts.filter((a) => a.userId === u && a.correct && ids.has(a.questionId)).length >= 20; } },
  { id: "seratus", name: "100 Soalan Betul", icon: "💯", desc: "Kumpul 100 jawapan betul.", check: (d, u) => correctCount(d, u) >= 100 },
  { id: "limaratus", name: "Pahlawan Latih Tubi", icon: "⚔️", desc: "Kumpul 500 jawapan betul.", check: (d, u) => correctCount(d, u) >= 500 },
  { id: "istiqamah7", name: "7 Hari Istiqamah", icon: "🔥", desc: "Belajar 7 hari berturut-turut.", check: (d, u) => streak(d, u) >= 7 },
  { id: "murajaah", name: "Murajaah Pertama", icon: "🔁", desc: "Selesaikan satu sesi murajaah.", check: (d, u) => d.runs.some((r) => r.userId === u && r.title.startsWith("Murajaah")) },
  { id: "murajaah30", name: "30 Hari Murajaah", icon: "🌙", desc: "Buat murajaah pada 30 hari yang berbeza.", check: (d, u) => new Set(d.attempts.filter((a) => a.userId === u && a.mode === "murajaah").map((a) => dayKey(a.ts))).size >= 30 },
  { id: "pembaca", name: "Pembaca Tekun", icon: "📚", desc: "Baca kesemua seksyen nota 12 bab.", check: (d, u) => chapterStats(d, u).every((s) => s.readPct === 100) },
  { id: "semua", name: "Penguasaan Semua Bab", icon: "👑", desc: "Kuasai kesemua 12 bab.", check: (d, u) => chapterStats(d, u).every((s) => s.mastered) },
  { id: "tauliah10", name: "Pejuang Tauliah", icon: "🗂️", desc: "Jawab 10 soalan rujukan dari soalan tauliah (semakan kendiri).", check: (d, u, qs) => { const ids = new Set(qs.filter((q) => q.source === "tauliah").map((q) => q.id)); return new Set(d.attempts.filter((a) => a.userId === u && ids.has(a.questionId)).map((a) => a.questionId)).size >= 10; } },
];

// ================= SCOREBOARD (tempatan) =================
export type Board = "keseluruhan" | "mingguan" | "ketepatan" | "istiqamah";
export interface BoardRow { id: string; name: string; avatar: string; value: number; label: string; rank: number; me?: boolean; cloud?: boolean }

/** Nilai ringkas satu profil — dikongsi oleh scoreboard tempatan & dalam talian. */
export function scoreSnapshot(d: DB, userId: string) {
  const wk = startOfWeek();
  const a = d.attempts.filter((x) => x.userId === userId);
  const c = a.reduce((s, x) => s + x.score, 0);
  return {
    xp: totalXp(d, userId),
    weeklyXp: d.xp.filter((x) => x.userId === userId && x.ts >= wk).reduce((s, x) => s + x.amount, 0),
    answered: a.length,
    accuracy: a.length ? Math.round((c / a.length) * 100) : 0,
    streak: streak(d, userId),
  };
}
export type Snapshot = ReturnType<typeof scoreSnapshot>;

export function boardValue(s: Snapshot, board: Board): { value: number; label: string } {
  switch (board) {
    case "mingguan": return { value: s.weeklyXp, label: `${s.weeklyXp} XP minggu ini` };
    case "ketepatan": return s.answered >= 10 ? { value: s.accuracy, label: `${s.accuracy}% (${s.answered} soalan)` } : { value: -1, label: "perlu ≥ 10 soalan" };
    case "istiqamah": return { value: s.streak, label: `${s.streak} hari` };
    default: return { value: s.xp, label: `${s.xp} XP` };
  }
}

export function rankRows<T extends { value: number }>(rows: T[]): (T & { rank: number })[] {
  return [...rows].sort((a, b) => b.value - a.value).map((r, i) => ({ ...r, rank: i + 1 }));
}

export function leaderboard(d: DB, board: Board): BoardRow[] {
  return rankRows(d.profiles.map((p) => ({ id: p.id, name: p.name, avatar: p.avatar, me: p.id === d.activeProfileId, ...boardValue(scoreSnapshot(d, p.id), board) })));
}
