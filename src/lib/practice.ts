import type { DB, Question, QType, QSource } from "../types";
import { objectiveQuestions, questionById, allQuestions } from "./store";
import { chapterStats } from "./gamification";
import { dueReviews } from "./actions";
import { chapterById, PAPERS } from "../data";
import { dayKey, shuffle } from "./util";

export interface PracticeConfig {
  mode: "rawak" | "murajaah" | "tahun" | "lemah" | "serupa" | "harian";
  bab?: string; // id bab atau kosong (semua)
  jenis?: QType | ""; // kosong = semua jenis objektif
  sumber?: Exclude<QSource, "tauliah"> | "";
  n?: number; // 0 = maraton (semua)
  tahun?: number;
  ex?: string; // soalan dikecualikan (serupa)
}

export const TYPE_LABEL: Record<string, string> = { "": "Semua jenis", mcq: "Objektif (ABCD)", tf: "Benar / Salah", match: "Padanan", fill: "Isi tempat kosong" };
export const SOURCE_LABEL: Record<string, string> = { "": "Semua sumber", latihan: "Soalan latihan", jana: "Dijana daripada nota" };

export function toParams(c: PracticeConfig) {
  const p = new URLSearchParams();
  Object.entries(c).forEach(([k, v]) => { if (v !== undefined && v !== "") p.set(k, String(v)); });
  return p.toString();
}
export function fromParams(p: URLSearchParams): PracticeConfig {
  return { mode: (p.get("mode") as PracticeConfig["mode"]) || "rawak", bab: p.get("bab") || "", jenis: (p.get("jenis") as QType) || "", sumber: (p.get("sumber") as PracticeConfig["sumber"]) || "", n: p.has("n") ? Number(p.get("n")) : 10, tahun: Number(p.get("tahun")) || undefined, ex: p.get("ex") || undefined };
}

/** Penapis asas (bab/jenis/sumber) — untuk kiraan & pembinaan set. */
export function filterPool(d: DB, c: Pick<PracticeConfig, "bab" | "jenis" | "sumber">) {
  return objectiveQuestions(d).filter((q) => (!c.bab || q.chapterId === c.bab) && (!c.jenis || q.type === c.jenis) && (!c.sumber || q.source === c.sumber));
}

/**
 * Susun soalan supaya soalan yang belum pernah dijawab / kerap salah didahulukan,
 * kemudian rawakkan dalam setiap kumpulan. Memaksimumkan liputan bank soalan yang besar.
 */
function prioritise(d: DB, userId: string, qs: Question[]) {
  const seen = new Map<string, { n: number; ok: number }>();
  d.attempts.forEach((a) => { if (a.userId !== userId) return; const s = seen.get(a.questionId) ?? { n: 0, ok: 0 }; s.n++; s.ok += a.score; seen.set(a.questionId, s); });
  const fresh = qs.filter((q) => !seen.has(q.id));
  const weak = qs.filter((q) => { const s = seen.get(q.id); return s && s.ok / s.n < 0.7; });
  const rest = qs.filter((q) => { const s = seen.get(q.id); return s && s.ok / s.n >= 0.7; });
  return [...shuffle(fresh), ...shuffle(weak), ...shuffle(rest)];
}

export function buildSet(d: DB, userId: string, c: PracticeConfig): { title: string; qs: Question[] } {
  const n = c.n === 0 ? Infinity : c.n || 10;
  const ch = c.bab ? chapterById(c.bab) : undefined;
  switch (c.mode) {
    case "murajaah": {
      const qs = dueReviews(d, userId).sort((a, b) => a.due - b.due).map((r) => questionById(r.questionId)).filter((q): q is Question => !!q);
      return { title: "Murajaah Automatik", qs: qs.slice(0, c.n === 0 ? undefined : Math.max(n, 15)) };
    }
    case "tahun": {
      const paper = PAPERS.find((p) => p.year === c.tahun);
      return { title: `Rujukan dari Soalan Tauliah ${c.tahun ?? ""}`, qs: paper ? allQuestions().filter((q) => q.source === "tauliah" && q.year === c.tahun) : [] };
    }
    case "lemah": {
      const weak = chapterStats(d, userId).filter((s) => s.attempts >= 3).sort((a, b) => a.acc - b.acc).slice(0, 3).map((s) => s.chapterId);
      const pool = objectiveQuestions(d).filter((q) => weak.includes(q.chapterId));
      return { title: "Fokus Kelemahan", qs: prioritise(d, userId, pool).slice(0, n) };
    }
    case "harian": {
      const seed = Number(dayKey(Date.now()).replace(/-/g, ""));
      return { title: `Cabaran Harian ${dayKey(Date.now())}`, qs: shuffle(objectiveQuestions(d), seed).slice(0, 10) };
    }
    case "serupa": {
      const base = c.ex ? questionById(c.ex) : undefined;
      const pool = objectiveQuestions(d).filter((q) => q.chapterId === c.bab && q.id !== c.ex && (!base?.sectionId || !q.sectionId || q.sectionId === base.sectionId || q.kind === base.kind));
      return { title: "Soalan Serupa", qs: shuffle(pool).slice(0, 5) };
    }
    default: {
      const pool = filterPool(d, c);
      const bits = [ch ? `Bab ${ch.no}: ${ch.title}` : "Semua bab", c.jenis ? TYPE_LABEL[c.jenis] : "", c.sumber ? SOURCE_LABEL[c.sumber] : ""].filter(Boolean);
      return { title: `${c.n === 0 ? "Maraton" : "Latih Tubi"} · ${bits.join(" · ")}`, qs: prioritise(d, userId, pool).slice(0, n) };
    }
  }
}
