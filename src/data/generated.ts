import type { Chapter, Explanation, NoteSection, PracticeKind, QOption, Question } from "../types";

/**
 * SOALAN OBJEKTIF DIJANA DARIPADA NOTA
 * ------------------------------------
 * Soalan di sini dijana secara automatik (deterministik) daripada kandungan nota 12 bab:
 * jadual, takrif, nota ringkas, contoh ayat, dhobit, pembahagian dan kad imbas.
 *
 * Prinsip keselamatan kandungan:
 *  1. Jawapan betul SENTIASA diambil verbatim daripada nota — tiada hukum baharu direka.
 *  2. Pilihan salah (distraktor) ialah teks nota bagi baris/seksyen LAIN, dan penerangannya
 *     menyatakan milik siapa teks tersebut (cth. "Ini Huruf bagi Tengah lidah").
 *  3. Mana-mana item yang menyentuh perkara khilaf (pendapat ulama berbeza, dua wajah,
 *     "diutamakan", "rujuk guru" dsb.) TIDAK dijadikan soalan.
 *  4. Semua soalan berstatus "belum_disemak" sehingga disahkan guru penyemak.
 */

const KHILAF = /ٱلِٱسْمُ|لِسْمُ|khilaf|ikhtilaf|pendapat|sebahagian ulama|ada yang|rujuk guru|dua wajah|diutamakan|diperselisih|qaul|atau raum|\bharus\s+[^\s/]+\s*\/|isu semasa/i;
const EXCLUDED_SECTIONS = new Set(["b12-isu"]);
const L = ["a", "b", "c", "d"];
const ARAB = /[؀-ۿ]/;

/** PRESTASI: fungsi tulen yang dipanggil berulang kali ke atas teks yang sama (O(n²) calon pilihan) — dimemo. */
const memo = <R,>(fn: (t: string) => R) => { const m = new Map<string, R>(); return (t: string) => { let v = m.get(t); if (v === undefined) { v = fn(t); m.set(t, v); } return v; }; };
const norm = memo((t: string) => t.normalize("NFKD").replace(/[ً-ٰٟۖ-ۭـ]/g, "").replace(/\s+/g, " ").trim().toLowerCase());
const khilafOne = memo((x: string) => KHILAF.test(x));
const isKhilaf = (...t: (string | undefined)[]) => t.some((x) => !!x && khilafOne(x));
const blank = (t?: string) => !t || !t.trim() || /^[–—-]$/.test(t.trim());
/** Dua nilai "bertindih" jika sama atau salah satu ialah awalan yang lain selepas buang kurungan & ruang
 *  (cth. "4/5" dan "4/5 (6 waqaf)") — tidak boleh dijadikan kenyataan Salah kerana boleh dianggap betul. */
const core = memo((t: string) => norm(t).replace(/\(.*?\)/g, "").replace(/[\s.]/g, ""));
const opts = (t: string) => core(t).split(/[\/,،]/).filter(Boolean);
const overlaps = (a: string, b: string) => {
  const x = core(a), y = core(b);
  if (!x || !y || x === y || x.startsWith(y) || y.startsWith(x)) return true;
  const ox = new Set(opts(a)); return opts(b).some((o) => ox.has(o)); // cth. "6" vs "2 / 4 / 6", "4 / 6" vs "4 / 5"
};
/** Kenyataan Benar/Salah yang maknanya bertindih walaupun teksnya berbeza (disemak manual). */
const AMBIGUOUS_TF = new Set(["J-b10-simbol-0-1-tf", "J-b10-simbol-6-1-tf", "J-b10-jenis-3-3-tf", "J-b10-jenis-2-3-tf"]);

function hash(s: string) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function seeded<T>(arr: T[], seed: string): T[] {
  const a = [...arr]; let s = hash(seed) || 1;
  const rnd = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const lc = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

/** Distraktor: teks + sebab (asal-usul teks dalam nota). */
type Cand = { text: string; why: string };

/** Pilih sehingga `max` distraktor unik yang tidak sama/bertindih dengan jawapan betul. */
function pick(correct: string, cands: Cand[], seed: string, max = 3, prefer?: (c: Cand) => number): Cand[] {
  const nc = norm(correct);
  const seen = new Set([nc]);
  const ok: Cand[] = [];
  let pool = seeded(cands, seed);
  if (prefer) pool = pool.sort((a, b) => prefer(b) - prefer(a));
  for (const c of pool) {
    const n = norm(c.text);
    if (!n || blank(c.text) || isKhilaf(c.text) || [...seen].some((x) => x.startsWith(n) || n.startsWith(x))) continue;
    seen.add(n); ok.push(c);
    if (ok.length >= max) break;
  }
  return ok;
}

function mcq(id: string, ch: Chapter, sec: NoteSection | undefined, kind: PracticeKind, difficulty: 1 | 2 | 3, prompt: string, correct: string, distract: Cand[], ex: Explanation, arabic?: string, arabicRef?: string): Question | null {
  if (distract.length < 2) return null;
  const opts = seeded([{ text: correct, why: "Betul – sepadan dengan nota." }, ...distract], id + "|o");
  const options: QOption[] = opts.map((o, i) => ({ id: L[i], text: o.text, why: o.why }));
  return {
    id, source: "jana", type: "mcq", kind, chapterId: ch.id, sectionId: sec?.id, difficulty, marks: 1, prompt, arabic, arabicRef,
    options, answer: L[opts.findIndex((o) => o.text === correct)], explanation: ex, status: "belum_disemak",
  };
}

const secRef = (ch: Chapter, s?: NoteSection) => `Nota Bab ${ch.no}: ${ch.title}${s ? ` → ${s.title}` : ""}`;
const refsOf = (ch: Chapter) => ch.refs.slice(0, 1).map((r) => `${r.kitab} – ${r.pengarang}`);

// ---------------------------------------------------------------------------
function fromTables(ch: Chapter, out: Question[]) {
  for (const s of ch.sections) {
    const t = s.jadual; if (!t || EXCLUDED_SECTIONS.has(s.id) || t.rows.length < 2) continue;
    const cap = t.caption ?? s.title;
    const compare = /^aspek$/i.test(t.head[0]);
    const kindFor = (h: string): PracticeKind => compare ? "perbandingan" : /huruf/i.test(h) ? "dhobit" : /hukum|baris/i.test(h) ? "kenal_hukum" : "kefahaman";
    const rowText = (r: string[]) => r.map((c, j) => `${t.head[j]}: ${c}`).join(" · ");

    t.rows.forEach((row, i) => {
      if (isKhilaf(...row) || blank(row[0])) return;
      for (let k = 1; k < t.head.length; k++) {
        const val = row[k]; if (blank(val)) continue;
        const base = `J-${s.id}-${i}-${k}`;
        const ex: Explanation = {
          why: compare ? `Menurut jadual «${cap}»: ${row[0]} bagi ${t.head[k]} ialah «${val}».` : `Menurut jadual «${cap}»: ${t.head[k]} bagi «${row[0]}» ialah «${val}».`,
          concept: `Baris penuh jadual – ${rowText(row)}`,
          compare: compare ? t.head.slice(1).map((h, j) => `${h}: ${row[j + 1]}`).join(" | ") : undefined,
          refs: [secRef(ch, s), ...refsOf(ch)],
        };
        // (1) MCQ hadapan
        const cands: Cand[] = compare
          ? [
              ...t.head.slice(1).map((h, j) => ({ text: row[j + 1], why: `Ini ${lc(row[0])} bagi ${h}.` })).filter((_, j) => j + 1 !== k),
              ...t.rows.filter((_, x) => x !== i).map((r) => ({ text: r[k], why: `Ini ${lc(r[0])} bagi ${t.head[k]}.` })),
            ]
          : t.rows.filter((_, x) => x !== i).map((r) => ({ text: r[k], why: `Ini ${t.head[k]} bagi «${r[0]}».` }));
        const sameRowFirst = compare ? (c: Cand) => (row.includes(c.text) ? 1 : 0) : undefined;
        const prompt = compare
          ? `Perbandingan «${cap}»: ${row[0]} bagi **${t.head[k]}** ialah…`
          : `Menurut jadual «${cap}», apakah **${lc(t.head[k])}** bagi «${row[0]}»?`;
        const q1 = mcq(base + "-f", ch, s, kindFor(t.head[k]), 2, prompt, val, pick(val, cands, base, 3, sameRowFirst), ex);
        if (q1) out.push(q1);

        // (2) MCQ songsang (bukan jadual perbandingan; nilai mesti unik dalam lajur)
        if (!compare) {
          const dup = t.rows.filter((r) => norm(r[k]) === norm(val)).length > 1;
          if (!dup) {
            const rc: Cand[] = t.rows.filter((_, x) => x !== i).map((r) => ({ text: r[0], why: `${t.head[k]} bagi «${r[0]}» ialah «${r[k]}».` }));
            const q2 = mcq(base + "-r", ch, s, kindFor(t.head[k]), 2, `Menurut jadual «${cap}», ${lc(t.head[0])} manakah yang ${lc(t.head[k])}nya «${val}»?`, row[0], pick(row[0], rc, base + "r"), ex);
            if (q2) out.push(q2);
          }
        }

        // (3) Benar / Salah
        const truthy = hash(base + "tf") % 2 === 0;
        const swapPool = compare
          ? t.head.slice(1).map((_, j) => row[j + 1]).filter((_, j) => j + 1 !== k)
          : t.rows.filter((_, x) => x !== i).map((r) => r[k]);
        const swap = seeded(swapPool.filter((v) => !blank(v) && !isKhilaf(v) && !overlaps(v, val) && !t.rows.some((r) => norm(r[0]) === norm(row[0]) && norm(r[k]) === norm(v))), base + "sw")[0];
        const useTrue = truthy || !swap;
        const shown = useTrue ? val : swap;
        out.push({
          id: base + "-tf", source: "jana", type: "tf", kind: kindFor(t.head[k]), chapterId: ch.id, sectionId: s.id, difficulty: 1, marks: 1,
          prompt: compare ? `Perbandingan «${cap}»: ${row[0]} bagi ${t.head[k]} ialah «${shown}».` : `Menurut jadual «${cap}»: ${t.head[k]} bagi «${row[0]}» ialah «${shown}».`,
          answer: useTrue ? "B" : "S",
          explanation: { ...ex, confusion: useTrue ? undefined : `«${shown}» bukan ${lc(t.head[k])} bagi ${row[0]}.` },
          status: "belum_disemak",
        });
      }
    });

    // (4) Padanan: lajur 0 ↔ lajur 1 (nilai unik), kumpulan 3–4 baris
    if (!compare && t.head.length >= 2) {
      const rows = t.rows.filter((r) => !isKhilaf(...r) && !blank(r[0]) && !blank(r[1]));
      const uniq = new Set(rows.map((r) => norm(r[1]))).size === rows.length && new Set(rows.map((r) => norm(r[0]))).size === rows.length;
      if (uniq && rows.length >= 3) {
        const groups: string[][][] = [];
        for (let x = 0; x < rows.length; x += 4) groups.push(rows.slice(x, x + 4));
        if (groups.length > 1 && groups.at(-1)!.length < 3) { const last = groups.pop()!; groups[groups.length - 1].push(...last); }
        groups.forEach((g, gi) => out.push({
          id: `J-${s.id}-m${gi}`, source: "jana", type: "match", kind: "perbandingan", chapterId: ch.id, sectionId: s.id, difficulty: 2, marks: g.length,
          prompt: `Padankan ${lc(t.head[0])} dengan ${lc(t.head[1])} (jadual «${cap}»).`,
          pairs: g.map((r) => ({ left: r[0], right: r[1] })),
          explanation: { why: g.map((r) => `${r[0]} → ${r[1]}`).join("; "), refs: [secRef(ch, s), ...refsOf(ch)] },
          status: "belum_disemak",
        }));
      }
    }
  }
}

// ---------------------------------------------------------------------------
function fromSections(ch: Chapter, all: Chapter[], out: Question[]) {
  const secs = ch.sections.filter((s) => !EXCLUDED_SECTIONS.has(s.id));
  const otherSecs = all.flatMap((c) => c.sections.filter((s) => !EXCLUDED_SECTIONS.has(s.id)).map((s) => ({ c, s }))).filter(({ c }) => c.id !== ch.id);
  const near = (c: Chapter) => -Math.abs(c.no - ch.no);

  for (const s of secs) {
    // Takrif
    if (s.takrif && !isKhilaf(s.takrif)) {
      const cands = [
        ...secs.filter((x) => x !== s && x.takrif).map((x) => ({ text: x.takrif!, why: `Ini takrif bagi «${x.title}».`, w: 10 })),
        ...otherSecs.filter(({ s: x }) => x.takrif).map(({ c, s: x }) => ({ text: x.takrif!, why: `Ini takrif bagi «${x.title}» (Bab ${c.no}).`, w: near(c) })),
      ];
      const q = mcq(`J-${s.id}-takrif`, ch, s, "kefahaman", 1, `Manakah takrif yang tepat bagi topik «${s.title}»?`, s.takrif, pick(s.takrif, cands, s.id + "tk", 3, (c) => (c as typeof cands[number]).w),
        { why: s.takrif, concept: s.maksud, refs: [secRef(ch, s), ...refsOf(ch)] }, s.takrifArab);
      if (q) out.push(q);
    }
    // Nota ringkas
    if (s.ringkas && !isKhilaf(s.ringkas)) {
      const cands = [
        ...secs.filter((x) => x !== s && x.ringkas).map((x) => ({ text: x.ringkas!, why: `Ini ringkasan «${x.title}».`, w: 10 })),
        ...otherSecs.filter(({ s: x }) => x.ringkas).map(({ c, s: x }) => ({ text: x.ringkas!, why: `Ini ringkasan «${x.title}» (Bab ${c.no}).`, w: near(c) })),
      ];
      const q = mcq(`J-${s.id}-ringkas`, ch, s, "kefahaman", 1, `Nota ringkas manakah yang tepat bagi topik «${s.title}»?`, s.ringkas, pick(s.ringkas, cands, s.id + "rk", 3, (c) => (c as typeof cands[number]).w),
        { why: s.ringkas, refs: [secRef(ch, s), ...refsOf(ch)] });
      if (q) out.push(q);
    }
    // Dhobit (syair / rangkai kata)
    s.dhobit?.forEach((d, i) => {
      if (!d.arab || isKhilaf(d.teks, d.arab)) return;
      const cands = [
        ...secs.flatMap((x) => (x.dhobit ?? []).filter((y) => y !== d).map((y) => ({ text: y.teks, why: y.arab ? `Ini maksud dhobit ${y.arab}.` : "Dhobit lain dalam bab ini.", w: 10 }))),
        ...otherSecs.flatMap(({ c, s: x }) => (x.dhobit ?? []).map((y) => ({ text: y.teks, why: `Dhobit «${x.title}» (Bab ${c.no}).`, w: near(c) }))),
      ];
      const q = mcq(`J-${s.id}-dh${i}`, ch, s, "dhobit", 2, "Dhobit / rangkai kata berikut merujuk kepada…", d.teks, pick(d.teks, cands, s.id + "dh" + i, 3, (c) => (c as typeof cands[number]).w),
        { why: `${d.arab} → ${d.teks}`, dhobit: d.teks, refs: [secRef(ch, s), ...refsOf(ch)] }, d.arab);
      if (q) out.push(q);
    });
    // Pembahagian
    if ((s.pembahagian?.length ?? 0) >= 3) s.pembahagian!.forEach((p, i) => {
      if (isKhilaf(p.nama, p.ket)) return;
      const cands = s.pembahagian!.filter((x) => x !== p).map((x) => ({ text: x.ket, why: `Ini keterangan «${x.nama}».` }));
      const q = mcq(`J-${s.id}-pb${i}`, ch, s, "kefahaman", 2, `Topik «${s.title}»: apakah keterangan bagi «${p.nama}»?`, p.ket, pick(p.ket, cands, s.id + "pb" + i), { why: `${p.nama}: ${p.ket}`, refs: [secRef(ch, s), ...refsOf(ch)] });
      if (q) out.push(q);
    });
    // Contoh ayat – penerangan
    const ctoh = s.contoh ?? [];
    if (ctoh.length >= 3) ctoh.forEach((c, i) => {
      if (isKhilaf(c.huraian, c.hukum)) return;
      const cands = ctoh.filter((x) => x !== c).map((x) => ({ text: x.huraian, why: `Ini penerangan bagi ${x.arab}.` }));
      const q = mcq(`J-${s.id}-cx${i}`, ch, s, "kenal_hukum", 2, `Topik «${s.title}»: manakah penerangan yang tepat bagi contoh berikut?`, c.huraian, pick(c.huraian, cands, s.id + "cx" + i),
        { why: `${c.arab}${c.ref ? ` (${c.ref})` : ""}: ${c.hukum ? c.hukum + " – " : ""}${c.huraian}`, refs: [secRef(ch, s), ...refsOf(ch)] }, c.arab, c.ref);
      if (q) out.push(q);
    });
  }
}

/** Nama hukum (= tajuk seksyen nota) bagi seksyen yang KESEMUA contohnya hukum yang sama. */
const SECTION_HUKUM: Record<string, string> = { "b4-izhar": "Izhar Halqi", "b4-iqlab": "Iqlab", "b4-ikhfa": "Ikhfa' Haqiqi", "b6-ghunnah": "Ghunnah Musyaddadah" };

function fromExamplesHukum(ch: Chapter, out: Question[]) {
  const items = ch.sections.flatMap((s) => (s.contoh ?? []).map((c, i) => ({ s, c, i, hukum: c.hukum ?? SECTION_HUKUM[s.id] }))).filter((x) => x.hukum && !isKhilaf(x.hukum, x.c.huraian));
  const tablePool = ch.sections.flatMap((s) => s.jadual ? s.jadual.head.flatMap((h, k) => (k > 0 && /hukum|baris/i.test(h) ? s.jadual!.rows.map((r) => r[k]) : [])) : []);
  const pool = [...new Set([...items.map((x) => x.hukum!), ...Object.entries(SECTION_HUKUM).filter(([k]) => k.startsWith(ch.id + "-")).map(([, v]) => v), ...tablePool])];
  const b11 = ch.id === "b11";
  items.forEach(({ s, c, i, hukum }) => {
    const cands = pool.map((h) => ({ text: h, why: `Bukan hukum bagi contoh ini – rujuk penerangan.` }));
    const q = mcq(`J-${s.id}-hk${i}`, ch, s, "kenal_hukum", 2, b11 ? "Ketika memulakan bacaan (ibtida'), hamzah wasal pada kalimah berikut dibaca dengan baris…" : "Apakah hukum bacaan pada kalimah berikut?", hukum!, pick(hukum!, cands, s.id + "hk" + i),
      { why: `${c.arab}: ${hukum} – ${c.huraian}`, identify: c.huraian, refs: [secRef(ch, s), ...refsOf(ch)] }, c.arab, c.ref);
    if (q) out.push(q);
  });
}

function fromFlashcards(ch: Chapter, all: Chapter[], out: Question[]) {
  const others = all.filter((c) => c.id !== ch.id).flatMap((c) => c.flashcards.map((f) => ({ c, f })));
  ch.flashcards.forEach((f, i) => {
    if (isKhilaf(f.front, f.back)) return;
    const arabBack = ARAB.test(f.back.slice(0, 12));
    const cands = [
      ...ch.flashcards.filter((x) => x !== f).map((x) => ({ text: x.back, why: `Ini jawapan bagi: ${x.front}`, w: 10 })),
      ...others.map(({ c, f: x }) => ({ text: x.back, why: `Ini jawapan bagi: ${x.front} (Bab ${c.no})`, w: -Math.abs(c.no - ch.no) })),
    ].map((c) => ({ ...c, w: c.w + (ARAB.test(c.text.slice(0, 12)) === arabBack ? 5 : 0) }))
      .filter((c, _, arr) => arr.filter((x) => x.w >= 10).length < 2 || c.w >= 10); // utamakan bab yang sama
    const frontIsArab = ARAB.test(f.front) && !/[a-z]{3}/i.test(f.front.replace(/[؀-ۿ\s?–-]/g, ""));
    const q = mcq(`J-${ch.id}-kad${i}`, ch, undefined, "umum", 1, frontIsArab ? "Kalimah / rangkai kata berikut berkaitan dengan…" : f.front, f.back, pick(f.back, cands, ch.id + "kad" + i, 3, (c) => (c as typeof cands[number]).w),
      { why: `${f.front} → ${f.back}`, refs: [secRef(ch), ...refsOf(ch)] }, frontIsArab ? f.front : undefined);
    if (q) out.push(q);
  });
}

export function generateQuestions(chapters: Chapter[]): Question[] {
  const out: Question[] = [];
  for (const ch of chapters) {
    fromTables(ch, out);
    fromSections(ch, chapters, out);
    fromExamplesHukum(ch, out);
    fromFlashcards(ch, chapters, out);
  }
  // keselamatan akhir: buang soalan yang menyentuh khilaf pada prompt/jawapan
  return out.filter((q) => !AMBIGUOUS_TF.has(q.id)).filter((q) => {
    const ans = q.type === "mcq" ? q.options!.find((o) => o.id === q.answer)!.text : "";
    return !isKhilaf(q.prompt, ans, q.arabic, ...(q.pairs?.flatMap((p) => [p.left, p.right]) ?? []));
  });
}
