import type { DB, Question, ReviewItem } from "../types";
import { getDB, update, allQuestions } from "./store";
import { BADGES, XP_RULES, chapterStats } from "./gamification";
import { DAY, norm, uid } from "./util";
import { CHAPTERS } from "../data";
import { pushScore } from "./scoreboard";

// ---------- Murajaah automatik (Leitner / ulang kaji berjarak) ----------
// Setiap soalan yang dijawab SALAH masuk barisan murajaah secara automatik.
export const SRS_INTERVALS = [0, 1, 2, 4, 7, 15, 30]; // hari
export function srsUpdate(d: DB, userId: string, questionId: string, correct: boolean, now = Date.now()) {
  let it = d.review.find((r) => r.userId === userId && r.questionId === questionId);
  if (!it) {
    if (correct) return; // hanya soalan salah / disimpan yang masuk barisan
    it = { userId, questionId, box: 0, due: now, lapses: 0, lastTs: now };
    d.review.push(it);
  }
  if (correct) { it.box = Math.min(it.box + 1, SRS_INTERVALS.length - 1); it.due = now + SRS_INTERVALS[it.box] * DAY; }
  else { it.box = 0; it.lapses += 1; it.due = now + 10 * 60_000; }
  it.lastTs = now;
}
export const reviewQueue = (d: DB, userId: string) => d.review.filter((r) => r.userId === userId && r.box < SRS_INTERVALS.length - 1);
export const dueReviews = (d: DB, userId: string, now = Date.now()) => reviewQueue(d, userId).filter((r) => r.due <= now);

function addXp(d: DB, userId: string, amount: number, reason: string) { if (amount) d.xp.push({ id: uid("x"), userId, amount, reason, ts: Date.now() }); }
function log(d: DB, userId: string, type: string, text: string, link?: string) { d.activity.push({ id: uid("act"), userId, type, text, ts: Date.now(), link }); }

/** Lencana baharu yang diperoleh (untuk paparan sambutan). */
let newBadgeListener: ((ids: string[]) => void) | null = null;
export const onNewBadges = (fn: (ids: string[]) => void) => { newBadgeListener = fn; return () => { newBadgeListener = null; }; };

function awardBadges(d: DB, userId: string) {
  const qs = allQuestions();
  const have = new Set(d.badges.filter((b) => b.userId === userId).map((b) => b.badgeId));
  const fresh: string[] = [];
  for (const b of BADGES) {
    if (have.has(b.id)) continue;
    if (b.check(d, userId, qs)) { d.badges.push({ userId, badgeId: b.id, ts: Date.now() }); fresh.push(b.id); log(d, userId, "lencana", `Memperoleh lencana "${b.name}" ${b.icon}`); }
  }
  if (fresh.length) setTimeout(() => newBadgeListener?.(fresh), 0);
}
const masteredSet = (d: DB, userId: string) => new Set(chapterStats(d, userId).filter((s) => s.mastered).map((s) => s.chapterId));
function checkMastery(d: DB, userId: string, before: Set<string>) {
  chapterStats(d, userId).forEach((s) => {
    if (s.mastered && !before.has(s.chapterId) && !d.xp.some((x) => x.userId === userId && x.reason === `Kuasai bab ${s.chapterId}`)) {
      addXp(d, userId, XP_RULES.chapterMastered, `Kuasai bab ${s.chapterId}`);
      log(d, userId, "penguasaan", `Menguasai ${CHAPTERS.find((c) => c.id === s.chapterId)?.title}`);
    }
  });
}

/** Semak jawapan objektif. Mengembalikan skor 0..1 */
export function grade(q: Question, given: string | Record<string, string>): { correct: boolean; score: number } {
  if (q.type === "mcq" || q.type === "tf") { const ok = given === q.answer; return { correct: ok, score: ok ? 1 : 0 }; }
  if (q.type === "fill") { const acc = (Array.isArray(q.answer) ? q.answer : [q.answer ?? ""]).map((a) => norm(a)); const ok = acc.includes(norm(String(given))); return { correct: ok, score: ok ? 1 : 0 }; }
  if (q.type === "match" && q.pairs && typeof given === "object") { const ok = q.pairs.filter((p) => given[p.left] === p.right).length; return { correct: ok === q.pairs.length, score: ok / q.pairs.length }; }
  return { correct: false, score: 0 };
}

export function recordAnswer(userId: string, q: Question, res: { correct: boolean; score: number }, given: string, mode: string, ms?: number) {
  update((d) => {
    const before = masteredSet(d, userId);
    d.attempts.push({ id: uid("a"), userId, questionId: q.id, chapterId: q.chapterId, correct: res.correct, score: res.score, given, mode, ts: Date.now(), ms });
    const isTauliah = q.source === "tauliah";
    addXp(d, userId, isTauliah ? XP_RULES.tauliahSelf + Math.round(res.score * 6) : XP_RULES.answer + (res.correct ? XP_RULES.correct : 0), isTauliah ? "Soalan tauliah (semakan kendiri)" : res.correct ? "Jawapan betul" : "Menjawab soalan");
    srsUpdate(d, userId, q.id, res.correct);
    checkMastery(d, userId, before);
    awardBadges(d, userId);
  });
}

export function completeExercise(userId: string, title: string, total: number, score: number) {
  update((d) => {
    d.runs.push({ id: uid("r"), userId, title, total, score, ts: Date.now() });
    addXp(d, userId, XP_RULES.exercise, `Tamat latihan: ${title}`);
    log(d, userId, "latihan", `Menamatkan ${title} – ${Math.round(score * 10) / 10}/${total}`);
    awardBadges(d, userId);
  });
  pushScore();
}

export function saveForReview(userId: string, questionId: string) {
  update((d) => {
    const it = d.review.find((r) => r.userId === userId && r.questionId === questionId);
    if (it) { it.saved = true; it.box = 0; it.due = Math.min(it.due, Date.now()); }
    else d.review.push({ userId, questionId, box: 0, due: Date.now(), lapses: 0, lastTs: Date.now(), saved: true } as ReviewItem);
  });
}
export function removeFromReview(userId: string, questionId: string) { update((d) => { d.review = d.review.filter((r) => !(r.userId === userId && r.questionId === questionId)); }); }

export function markSectionRead(userId: string, chapterId: string, sectionId: string) {
  const d0 = getDB();
  const np0 = d0.notes.find((n) => n.userId === userId && n.chapterId === chapterId);
  if (np0?.read.includes(sectionId)) return;
  update((d) => {
    const before = masteredSet(d, userId);
    let np = d.notes.find((n) => n.userId === userId && n.chapterId === chapterId);
    if (!np) { np = { userId, chapterId, read: [], ts: Date.now() }; d.notes.push(np); }
    np.lastSection = sectionId; np.ts = Date.now();
    np.read.push(sectionId);
    addXp(d, userId, XP_RULES.noteSection, "Membaca nota");
    const ch = CHAPTERS.find((c) => c.id === chapterId)!;
    if (ch.sections.every((s) => np!.read.includes(s.id))) log(d, userId, "nota", `Selesai membaca nota ${ch.title}`, `/nota/${chapterId}`);
    checkMastery(d, userId, before);
    awardBadges(d, userId);
  });
}

export function toggleBookmark(userId: string, chapterId: string, sectionId: string | undefined, label: string) {
  update((d) => {
    const i = d.bookmarks.findIndex((b) => b.userId === userId && b.chapterId === chapterId && b.sectionId === sectionId);
    if (i >= 0) d.bookmarks.splice(i, 1);
    else d.bookmarks.push({ id: uid("bm"), userId, chapterId, sectionId, label, ts: Date.now() });
  });
}
