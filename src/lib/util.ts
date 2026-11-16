export const uid = (p = "") => p + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
export const DAY = 86_400_000;
export const dayKey = (ts: number) => { const d = new Date(ts); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
export const startOfDay = (ts = Date.now()) => { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); };
export const startOfWeek = (ts = Date.now()) => { const d = new Date(startOfDay(ts)); const wd = (d.getDay() + 6) % 7; return d.getTime() - wd * DAY; };
export function shuffle<T>(arr: T[], seed?: number): T[] {
  const a = [...arr];
  let s = seed ?? Math.floor(Math.random() * 1e9);
  const rnd = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
export const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);
export const fmtDate = (ts: number) => new Date(ts).toLocaleDateString("ms-MY", { day: "numeric", month: "short", year: "numeric" });
export const fmtDateTime = (ts: number) => new Date(ts).toLocaleString("ms-MY", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
export const timeAgo = (ts: number) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "baru sahaja"; if (s < 3600) return `${Math.floor(s / 60)} minit lalu`;
  if (s < 86400) return `${Math.floor(s / 3600)} jam lalu`; return `${Math.floor(s / 86400)} hari lalu`;
};
/** Normalisasi teks untuk perbandingan jawapan isian (buang baris/harakat Arab & huruf besar). */
export const norm = (t: string) => t.normalize("NFKD").replace(/[ً-ٰٟۖ-ۭـ]/g, "").replace(/[ًٌٍَُِّْٰ]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
export async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
export function download(filename: string, content: string, type = "text/plain") {
  const blob = new Blob([content], { type });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
export function toCSV(rows: (string | number)[][]) {
  return "﻿" + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
}
export const ARABIC_RE = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
