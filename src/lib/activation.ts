import { useSyncExternalStore } from "react";
import HASHES from "../data/activation-hashes.json";

/**
 * KOD PENGAKTIFAN (versi penuh)
 * -----------------------------
 * • Aplikasi memerlukan kod yang sah sebelum boleh digunakan (demo hanya di halaman jualan /jualan/).
 * • Aplikasi hanya menyimpan HASH kod (src/data/activation-hashes.json) — kod sebenar tidak ada dalam repo.
 *   Jana kod baharu dengan:  node scripts/jana-kod.mjs 100
 * • Pengaktifan disimpan per peranti (semua profil), dan disahkan semula setiap kali aplikasi dibuka.
 * • Semakan berlaku dalam peranti (tanpa pelayan). Untuk had "satu kod satu peranti", naik taraf ke Supabase kemudian.
 */
const KEY = "pandai-tajwid:aktif";
const SALT = "pandai-tajwid|v1|";
const ALPHA = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // tanpa 0/O/1/I yang mengelirukan

/** Normalisasi input: huruf besar, buang ruang/sengkang, buang awalan PT. Mengembalikan 12 aksara atau "". */
export function normalizeCode(input: string): string {
  let s = input.toUpperCase().replace(/[^0-9A-Z]/g, "");
  if (s.startsWith("PT") && s.length === 14) s = s.slice(2);
  return s.length === 12 && [...s].every((c) => ALPHA.includes(c)) ? s : "";
}
export const formatCode = (n: string) => `PT-${n.slice(0, 4)}-${n.slice(4, 8)}-${n.slice(8, 12)}`;

export async function hashCode(normalized: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(SALT + normalized));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 24);
}

const HASH_SET = new Set(HASHES as string[]);
export async function verifyAgainst(input: string, hashes: Set<string>): Promise<string | null> {
  const n = normalizeCode(input);
  if (!n) return null;
  return hashes.has(await hashCode(n)) ? n : null;
}
export const verifyCode = (input: string) => verifyAgainst(input, HASH_SET);

// ---------- Keadaan (dikongsi seluruh aplikasi) ----------
type State = { active: boolean; code: string | null; ready: boolean };
let state: State = { active: false, code: null, ready: false };
const listeners = new Set<() => void>();
const set = (s: State) => { state = s; listeners.forEach((l) => l()); };
const storage = () => (typeof localStorage !== "undefined" ? localStorage : null);

export const isActive = () => state.active;
export function useActivation(): State { return useSyncExternalStore((l) => { listeners.add(l); return () => { listeners.delete(l); }; }, () => state); }

/** Sahkan semula kod tersimpan ketika aplikasi dibuka. */
export async function initActivation() {
  let saved: string | null = null;
  try { saved = storage()?.getItem(KEY) ?? null; } catch { /* abaikan */ }
  const ok = saved ? await verifyCode(saved) : null;
  set({ active: !!ok, code: ok, ready: true });
}

/** Cuba aktifkan dengan kod. Mengembalikan null jika berjaya, atau mesej ralat. */
export async function activate(input: string): Promise<string | null> {
  if (!normalizeCode(input)) return "Format kod tidak sah. Contoh: PT-7K3M-Q9XA-2HDF";
  const ok = await verifyCode(input);
  if (!ok) return "Kod tidak sah. Semak semula ejaan kod, atau hubungi penjual.";
  try { storage()?.setItem(KEY, ok); } catch { /* abaikan */ }
  set({ active: true, code: ok, ready: true });
  return null;
}
/** Untuk ujian/sokongan sahaja. */
export function deactivate() { try { storage()?.removeItem(KEY); } catch { /* abaikan */ } set({ active: false, code: null, ready: true }); }
