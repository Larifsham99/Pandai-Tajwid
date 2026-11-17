import { useSyncExternalStore } from "react";
import type { DB, Profile, Question, Settings } from "../types";
import { SEED_QUESTIONS } from "../data";
import { uid } from "./util";

/**
 * Stor data TEMPATAN (localStorage). Semua rekod pengguna disimpan dalam pelayar.
 * Untuk naik taraf ke Supabase, lihat src/lib/scoreboard.ts dan supabase/schema.sql.
 */
const KEY = "pandai-tajwid:db:v1";
export const DB_VERSION = 1;

export const DEFAULT_SETTINGS: Settings = { theme: "system", arabicSize: 28, dailyGoal: 20, includeGenerated: true, sound: true };

export function emptyDB(): DB {
  return { version: DB_VERSION, profiles: [], attempts: [], runs: [], review: [], xp: [], badges: [], notes: [], bookmarks: [], activity: [], settings: DEFAULT_SETTINGS };
}

const hasStorage = () => typeof localStorage !== "undefined";
let db: DB = load();
const listeners = new Set<() => void>();
let saveTimer: ReturnType<typeof setTimeout> | undefined;

function load(): DB {
  try {
    const raw = hasStorage() ? localStorage.getItem(KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw) as DB;
      return { ...emptyDB(), ...parsed, settings: { ...DEFAULT_SETTINGS, ...parsed.settings } };
    }
  } catch { /* abaikan */ }
  return emptyDB();
}

function persist() {
  if (!hasStorage()) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      if (db.activity.length > 500) db.activity = db.activity.slice(-500);
      localStorage.setItem(KEY, JSON.stringify(db));
    } catch (e) { console.warn("Gagal simpan data", e); }
  }, 150);
}

export function getDB() { return db; }
export function setDB(next: DB) { db = next; persist(); listeners.forEach((l) => l()); }
/**
 * Kemas kini murah: salin cetek objek akar & setiap senarai (bukan klon dalam keseluruhan DB),
 * supaya menjawab soalan kekal pantas walaupun rekod sudah beribu-ribu.
 */
export function update(fn: (d: DB) => void) {
  const next = { ...db, settings: { ...db.settings } } as DB;
  (Object.keys(next) as (keyof DB)[]).forEach((k) => { const v = next[k]; if (Array.isArray(v)) (next as unknown as Record<string, unknown>)[k] = [...v]; });
  fn(next); setDB(next);
}
export function subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; }
export function useDB<T>(sel: (d: DB) => T): T { return useSyncExternalStore(subscribe, () => sel(db)); }
export const useDb = () => useDB((d) => d);

export function resetAll() { if (hasStorage()) localStorage.removeItem(KEY); setDB(emptyDB()); }

/** Eksport / import sandaran JSON (memudahkan pindah peranti sebelum naik taraf ke awan). */
export const exportJSON = () => JSON.stringify(db, null, 1);
export function importJSON(text: string): string | null {
  try {
    const p = JSON.parse(text) as DB;
    if (!Array.isArray(p.profiles) || !Array.isArray(p.attempts)) return "Fail sandaran tidak sah.";
    setDB({ ...emptyDB(), ...p, settings: { ...DEFAULT_SETTINGS, ...p.settings } });
    return null;
  } catch { return "Fail sandaran tidak dapat dibaca."; }
}

// ---------- Profil (tanpa log masuk; boleh beberapa profil pada satu peranti) ----------
export function useMe(): Profile | undefined { return useDB((d) => d.profiles.find((p) => p.id === d.activeProfileId)); }
export const currentProfile = () => db.profiles.find((p) => p.id === db.activeProfileId);
export function createProfile(name: string, avatar: string) {
  const id = uid("p-");
  update((d) => {
    d.profiles.push({ id, name: name.trim().slice(0, 40) || "Pelajar", avatar, createdAt: Date.now() });
    d.activeProfileId = id;
    d.activity.push({ id: uid("act"), userId: id, type: "sistem", text: "Profil dicipta. Selamat datang ke Pandai Tajwid!", ts: Date.now() });
  });
  return id;
}
export function switchProfile(id: string) { update((d) => { d.activeProfileId = id; }); }
export function editProfile(id: string, patch: Partial<Pick<Profile, "name" | "avatar">>) { update((d) => { const p = d.profiles.find((x) => x.id === id); if (p) Object.assign(p, patch); }); }
export function deleteProfile(id: string) {
  update((d) => {
    d.profiles = d.profiles.filter((p) => p.id !== id);
    const keep = <T extends { userId: string }>(a: T[]) => a.filter((x) => x.userId !== id);
    d.attempts = keep(d.attempts); d.runs = keep(d.runs); d.review = keep(d.review); d.xp = keep(d.xp);
    d.badges = keep(d.badges); d.notes = keep(d.notes); d.bookmarks = keep(d.bookmarks); d.activity = keep(d.activity);
    if (d.activeProfileId === id) d.activeProfileId = d.profiles[0]?.id;
  });
}
export function updateSettings(patch: Partial<Settings>) { update((d) => { d.settings = { ...d.settings, ...patch }; }); }

// ---------- Soalan ----------
export function allQuestions(): Question[] { return SEED_QUESTIONS; }
let qMap: Map<string, Question> | null = null;
export const questionById = (id: string) => (qMap ??= new Map(SEED_QUESTIONS.map((q) => [q.id, q]))).get(id);
/** Soalan objektif yang layak untuk latih tubi (ikut tetapan soalan dijana). */
export const objectiveQuestions = (d: DB = db) => SEED_QUESTIONS.filter((q) => q.type !== "subjective" && (d.settings.includeGenerated || q.source !== "jana"));
