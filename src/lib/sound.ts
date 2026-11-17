import { getDB } from "./store";

/**
 * KESAN BUNYI — dijana terus dengan Web Audio (tiada fail audio; ringan & berfungsi luar talian).
 * Gaya: nada loceng lembut yang pendek dan tenang — bukan muzik/melodi — sesuai dengan suasana
 * belajar al-Quran. Boleh dimatikan di Profil → Tetapan → Kesan bunyi.
 */
type Ctx = AudioContext;
let ctx: Ctx | null = null;
let master: GainNode | null = null;

function audio(): Ctx | null {
  if (typeof window === "undefined") return null;
  if (!getDB().settings.sound) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch { return null; }
}

/** Satu nada "loceng": asas + harmonik lembut, serangan pantas & reput eksponen. */
function bell(c: Ctx, freq: number, at: number, dur: number, gain: number, opts: { type?: OscillatorType; glideTo?: number; partial?: number } = {}) {
  const t = c.currentTime + at;
  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(gain, t + 0.008);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  env.connect(master!);
  const tones: [number, number][] = [[1, 1], [2, opts.partial ?? 0.18]]; // nada asas + oktaf halus
  for (const [mult, g] of tones) {
    if (!g) continue;
    const o = c.createOscillator(); const og = c.createGain();
    o.type = opts.type ?? "sine";
    o.frequency.setValueAtTime(freq * mult, t);
    if (opts.glideTo) o.frequency.exponentialRampToValueAtTime(opts.glideTo * mult, t + dur * 0.8);
    og.gain.value = g;
    o.connect(og); og.connect(env);
    o.start(t); o.stop(t + dur + 0.02);
  }
}

let lastTap = -Infinity;
export const sfx = {
  /** Ketikan lembut untuk butang & menu. */
  tap() {
    const c = audio(); if (!c) return;
    const now = performance.now(); if (now - lastTap < 60) return; lastTap = now;
    bell(c, 1250, 0, 0.05, 0.09, { type: "triangle", glideTo: 900, partial: 0 });
  },
  /** Jawapan betul: dua nada loceng menaik (jarak kelima). */
  correct() {
    const c = audio(); if (!c) return;
    bell(c, 659.25, 0, 0.32, 0.3);
    bell(c, 987.77, 0.09, 0.5, 0.28);
  },
  /** Jawapan salah: satu nada rendah lembut yang menurun — tidak kasar. */
  wrong() {
    const c = audio(); if (!c) return;
    bell(c, 233.08, 0, 0.38, 0.34, { glideTo: 174.61, partial: 0.08 });
  },
  /** Separa betul (padanan): nada tengah yang neutral. */
  partial() {
    const c = audio(); if (!c) return;
    bell(c, 440, 0, 0.3, 0.24, { partial: 0.1 });
  },
  /** Lencana baharu: kilauan tiga nada pendek. */
  badge() {
    const c = audio(); if (!c) return;
    [783.99, 987.77, 1318.51].forEach((f, i) => bell(c, f, i * 0.08, 0.45, 0.2));
  },
  /** Tamat sesi: naik empat nada (skor baik) atau dua nada tenang. */
  complete(good: boolean) {
    const c = audio(); if (!c) return;
    const notes = good ? [523.25, 659.25, 783.99, 1046.5] : [523.25, 659.25];
    notes.forEach((f, i) => bell(c, f, i * 0.1, i === notes.length - 1 ? 0.7 : 0.3, 0.22));
  },
};
