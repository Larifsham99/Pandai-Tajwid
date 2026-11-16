import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, RotateCcw, Target, CalendarDays, Sparkles, ScrollText, ChevronRight, Flame } from "lucide-react";
import { useDb, useMe, updateSettings } from "../lib/store";
import { answeredToday, summary } from "../lib/gamification";
import { dueReviews, reviewQueue } from "../lib/actions";
import { filterPool, toParams, TYPE_LABEL, SOURCE_LABEL, type PracticeConfig } from "../lib/practice";
import { CHAPTERS, PAPERS, SEED_QUESTIONS } from "../data";
import { Card, Progress, cx, TONES, CHAPTER_TONES } from "../components/ui";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={cx("whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold ring-1 transition", active ? "bg-zamrud-600 text-white ring-zamrud-600 shadow" : "bg-white text-slate-600 ring-slate-200 hover:bg-zamrud-50 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10")}>{children}</button>;
}

function Ring({ value, max, children }: { value: number; max: number; children: React.ReactNode }) {
  const r = 30; const c = 2 * Math.PI * r; const p = Math.min(1, value / Math.max(1, max));
  return (
    <div className="relative grid h-20 w-20 shrink-0 place-items-center">
      <svg viewBox="0 0 72 72" className="absolute inset-0 -rotate-90"><circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" strokeOpacity=".18" strokeWidth="7" /><circle cx="36" cy="36" r={r} fill="none" stroke="#fcd34d" strokeWidth="7" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p)} className="transition-all duration-700" /></svg>
      <div className="text-center leading-none">{children}</div>
    </div>
  );
}

export default function LatihTubi() {
  const me = useMe()!; const d = useDb(); const nav = useNavigate();
  const s = summary(d, me.id);
  const today = answeredToday(d, me.id);
  const due = dueReviews(d, me.id).length;
  const queued = reviewQueue(d, me.id).length;
  const [cfg, setCfg] = useState<PracticeConfig>({ mode: "rawak", bab: "", jenis: "", sumber: "", n: 10 });
  const avail = useMemo(() => filterPool(d, cfg).length, [d, cfg]);
  const total = useMemo(() => filterPool(d, {}).length, [d]);
  const generated = SEED_QUESTIONS.filter((q) => q.source === "jana").length;
  const go = (c: PracticeConfig) => nav(`/latih/sesi?${toParams(c)}`);
  const set = (p: Partial<PracticeConfig>) => setCfg((c) => ({ ...c, ...p }));

  return (
    <div className="space-y-5">
      {/* ---------- Hero ---------- */}
      <section className="hero relative overflow-hidden rounded-3xl p-5 text-white shadow-xl shadow-zamrud-900/20 sm:p-6 rise">
        <div className="pointer-events-none absolute -right-6 -top-8 font-arab text-[9rem] leading-none text-white/5" aria-hidden>تجويد</div>
        <div className="flex items-center gap-4">
          <Ring value={today} max={d.settings.dailyGoal}><div className="text-xl font-extrabold">{today}</div><div className="text-[10px] opacity-80">/{d.settings.dailyGoal}</div></Ring>
          <div className="min-w-0 flex-1">
            <div className="text-sm text-emerald-100">Assalamualaikum,</div>
            <div className="truncate text-xl font-extrabold sm:text-2xl">{me.name} {me.avatar}</div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="chip bg-white/15 text-emas-200">{s.lvl.level.name} <span className="font-arab">{s.lvl.level.arab}</span></span>
              <span className="chip bg-white/15"><Flame size={12} /> {s.streak} hari</span>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-[11px] text-emerald-100"><span>{s.xp} XP</span><span>{s.lvl.next ? `Seterusnya: ${s.lvl.next.name}` : "Tahap tertinggi"}</span></div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-emas-400 transition-all duration-700" style={{ width: `${s.lvl.progress}%` }} /></div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="btn btn-gold !py-3 text-base" onClick={() => go({ mode: "rawak", n: 10 })}><Play size={18} fill="currentColor" /> Mula 10 Soalan</button>
          <button className={cx("btn !py-3 text-base", due ? "bg-rose-500 text-white shadow-md shadow-rose-900/30 hover:bg-rose-600" : "bg-white/15 text-white hover:bg-white/20")} onClick={() => go({ mode: "murajaah", n: 15 })} disabled={!due}>
            <RotateCcw size={18} /> Murajaah {due ? `(${due})` : ""}
          </button>
        </div>
        <div className="mt-2 text-center text-[11px] text-emerald-100/90">{due ? `${due} soalan salah menunggu diulang kaji` : queued ? `${queued} soalan dalam barisan murajaah — akan muncul mengikut jadual` : "Soalan yang dijawab salah akan masuk murajaah secara automatik"}</div>
      </section>

      {/* ---------- Pintasan ---------- */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <button onClick={() => go({ mode: "harian" })} className="card flex items-center gap-3 p-4 text-left"><span className={cx("grid h-10 w-10 place-items-center rounded-xl", TONES.sky.bubble)}><CalendarDays size={20} /></span><div><div className="text-sm font-bold">Cabaran Harian</div><div className="text-xs text-slate-500">10 soalan hari ini</div></div></button>
        <button onClick={() => go({ mode: "lemah", n: 15 })} disabled={!s.weak.length && s.answered < 10} className="card flex items-center gap-3 p-4 text-left disabled:opacity-60"><span className={cx("grid h-10 w-10 place-items-center rounded-xl", TONES.rose.bubble)}><Target size={20} /></span><div><div className="text-sm font-bold">Fokus Kelemahan</div><div className="text-xs text-slate-500">{s.weak.length ? `${s.weak.length} bab perlu diperkukuh` : "Bab ketepatan terendah"}</div></div></button>
        <button onClick={() => go({ mode: "rawak", n: 0 })} className="card col-span-2 flex items-center gap-3 p-4 text-left sm:col-span-1"><span className={cx("grid h-10 w-10 place-items-center rounded-xl", TONES.violet.bubble)}><Sparkles size={20} /></span><div><div className="text-sm font-bold">Maraton</div><div className="text-xs text-slate-500">Jawab tanpa had — {total} soalan</div></div></button>
      </div>

      {/* ---------- Pembina latihan ---------- */}
      <Card className="p-4 sm:p-5">
        <div className="mb-3 flex items-baseline justify-between gap-2"><h2 className="text-lg font-extrabold text-hutan-900 dark:text-white">Latih Tubi Pilihan</h2><span className="text-xs text-slate-500">{avail} soalan tersedia</span></div>
        <div className="label">Bab</div>
        <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          <Chip active={!cfg.bab} onClick={() => set({ bab: "" })}>Semua bab</Chip>
          {CHAPTERS.map((c) => <Chip key={c.id} active={cfg.bab === c.id} onClick={() => set({ bab: c.id })}>{c.no}. {c.title.replace(/^Hukum /, "")}</Chip>)}
        </div>
        <div className="label">Jenis soalan</div>
        <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">{Object.entries(TYPE_LABEL).map(([k, v]) => <Chip key={k} active={(cfg.jenis ?? "") === k} onClick={() => set({ jenis: k as PracticeConfig["jenis"] })}>{v}</Chip>)}</div>
        <div className="label">Sumber</div>
        <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">{Object.entries(SOURCE_LABEL).filter(([k]) => k !== "jana" || d.settings.includeGenerated).map(([k, v]) => <Chip key={k} active={(cfg.sumber ?? "") === k} onClick={() => set({ sumber: k as PracticeConfig["sumber"] })}>{v}</Chip>)}</div>
        <div className="label">Bilangan</div>
        <div className="mb-4 flex flex-wrap gap-2">{[10, 20, 30, 50, 0].map((n) => <Chip key={n} active={cfg.n === n} onClick={() => set({ n })}>{n === 0 ? "∞ Semua" : n}</Chip>)}</div>
        <button className="btn btn-primary w-full !py-3 text-base" disabled={!avail} onClick={() => go(cfg)}><Play size={18} fill="currentColor" /> Mula Latih Tubi{avail ? ` (${cfg.n === 0 ? avail : Math.min(avail, cfg.n ?? 10)} soalan)` : ""}</button>
        {d.settings.includeGenerated ? (
          <p className="mt-3 rounded-xl bg-violet-50 p-3 text-xs text-violet-900 dark:bg-violet-500/10 dark:text-violet-200">✨ Termasuk <b>{generated}</b> soalan objektif yang <b>dijana automatik daripada nota</b> dan berlabel <b>“belum disemak”</b>. Jawapan diambil terus daripada nota; topik khilaf tidak dijadikan soalan. <button className="font-semibold underline" onClick={() => updateSettings({ includeGenerated: false })}>Sembunyikan</button></p>
        ) : (
          <p className="mt-3 text-xs text-slate-500">Soalan dijana disembunyikan. <button className="font-semibold text-zamrud-700 underline" onClick={() => updateSettings({ includeGenerated: true })}>Tunjukkan semula</button></p>
        )}
      </Card>

      {/* ---------- Mengikut bab (kemajuan) ---------- */}
      <section>
        <h2 className="mb-2 text-lg font-extrabold text-hutan-900 dark:text-white">Latihan Mengikut Bab</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {CHAPTERS.map((c, i) => {
            const st = s.stats[i]; const t = TONES[CHAPTER_TONES[i]];
            return (
              <button key={c.id} onClick={() => go({ mode: "rawak", bab: c.id, n: 10 })} className="card flex items-center gap-3 p-3 text-left">
                <div className={cx("grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg font-extrabold", t.bubble)}>{st.mastered ? "👑" : c.no}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold">{c.title}</div>
                  <div className="mt-1 flex items-center gap-2"><Progress value={st.acc} className="!h-1.5" tone={st.acc >= 80 ? "zamrud" : st.acc >= 60 ? "emas" : "rose"} /><span className="w-24 shrink-0 text-right text-[11px] text-slate-500">{st.attempts ? `${st.acc}% · ${st.attempts} cubaan` : "belum mula"}</span></div>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </button>
            );
          })}
        </div>
      </section>

      {/* ---------- Tauliah ---------- */}
      <Card className="p-4 sm:p-5">
        <div className="mb-1 flex items-center gap-2"><ScrollText size={18} className="text-emas-600" /><h2 className="text-lg font-extrabold text-hutan-900 dark:text-white">Soalan Tauliah Lepas (Kedah)</h2></div>
        <p className="mb-3 text-xs text-slate-500">Soalan subjektif sebenar dengan jawapan cadangan (belum disemak) — tulis jawapan, kemudian nilai sendiri.</p>
        <div className="flex flex-wrap gap-2">{PAPERS.map((p) => <Link key={p.year} to={`/latih/sesi?${toParams({ mode: "tahun", tahun: p.year })}`} className="btn btn-outline !px-3 !py-1.5">{p.year}</Link>)}</div>
      </Card>
    </div>
  );
}
