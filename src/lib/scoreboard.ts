import type { SupabaseClient } from "@supabase/supabase-js";
import { getDB } from "./store";
import { type Board, type BoardRow, boardValue, leaderboard, rankRows, scoreSnapshot } from "./gamification";

/**
 * SCOREBOARD — dua mod:
 *  • TEMPATAN (lalai): kedudukan semua profil pada peranti ini (localStorage).
 *  • DALAM TALIAN (Supabase): aktif automatik apabila VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY diisi.
 *    Setiap peranti log masuk secara tanpa nama (anonymous sign-in) dan hanya boleh mengemas kini
 *    baris skornya sendiri (RLS). Lihat supabase/schema.sql.
 */
const URL = (import.meta.env?.VITE_SUPABASE_URL as string | undefined) || "";
const KEY = (import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined) || "";
export const cloudEnabled = !!(URL && KEY);

let clientP: Promise<SupabaseClient | null> | null = null;
function client() {
  if (!cloudEnabled) return Promise.resolve(null);
  return (clientP ??= import("@supabase/supabase-js").then(async ({ createClient }) => {
    const c = createClient(URL, KEY, { auth: { persistSession: true, storageKey: "pandai-tajwid:auth" } });
    const { data } = await c.auth.getSession();
    if (!data.session) { const { error } = await c.auth.signInAnonymously(); if (error) { console.warn("Supabase:", error.message); return null; } }
    return c;
  }).catch((e) => { console.warn("Supabase tidak dapat dimuatkan", e); return null; }));
}

const COLUMN: Record<Board, string> = { keseluruhan: "xp", mingguan: "weekly_xp", ketepatan: "accuracy", istiqamah: "streak" };

/** Hantar skor profil aktif ke awan (tiada kesan dalam mod tempatan). */
export async function pushScore() {
  const c = await client(); if (!c) return;
  const d = getDB(); const p = d.profiles.find((x) => x.id === d.activeProfileId); if (!p) return;
  const { data: u } = await c.auth.getUser(); if (!u.user) return;
  const s = scoreSnapshot(d, p.id);
  const { error } = await c.from("pandai_scores").upsert({
    owner: u.user.id, profile_id: p.id, name: p.name, avatar: p.avatar,
    xp: s.xp, weekly_xp: s.weeklyXp, week_start: weekStartISO(), answered: s.answered, accuracy: s.accuracy, streak: s.streak, updated_at: new Date().toISOString(),
  }, { onConflict: "owner,profile_id" });
  if (error) console.warn("Gagal hantar skor:", error.message);
}

const weekStartISO = () => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.toISOString().slice(0, 10); };

export async function fetchBoard(board: Board): Promise<{ rows: BoardRow[]; source: "tempatan" | "awan" }> {
  const local = leaderboard(getDB(), board);
  const c = await client();
  if (!c) return { rows: local, source: "tempatan" };
  let q = c.from("pandai_scores").select("profile_id,name,avatar,xp,weekly_xp,week_start,answered,accuracy,streak").order(COLUMN[board], { ascending: false }).limit(100);
  if (board === "mingguan") q = q.eq("week_start", weekStartISO());
  if (board === "ketepatan") q = q.gte("answered", 10);
  const { data, error } = await q;
  if (error || !data) return { rows: local, source: "tempatan" };
  const active = getDB().activeProfileId;
  return {
    source: "awan",
    rows: rankRows(data.map((r) => ({
      id: r.profile_id as string, name: r.name as string, avatar: r.avatar as string, me: r.profile_id === active, cloud: true,
      ...boardValue({ xp: r.xp, weeklyXp: r.weekly_xp, answered: r.answered, accuracy: r.accuracy, streak: r.streak }, board),
    }))),
  };
}
