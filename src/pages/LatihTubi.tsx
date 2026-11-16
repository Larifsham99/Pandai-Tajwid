import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, RotateCcw, Target, CalendarDays, Infinity as InfinityIcon, ChevronDown, SlidersHorizontal, ScrollText, Flame } from "lucide-react";
import { useDb, useMe } from "../lib/store";
import { answeredToday, summary } from "../lib/gamification";
import { dueReviews, reviewQueue } from "../lib/actions";
import { filterPool, toParams, TYPE_LABEL, SOURCE_LABEL, type PracticeConfig } from "../lib/practice";
import { CHAPTERS, PAPERS } from "../data";
import { cx, TONES, CHAPTER_TONES } from "../components/ui";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={cx("whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold ring-1 transition", active ? "bg-zamrud-600 text-white ring-zamrud-600" : "bg-white text-slate-600 ring-slate-200 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10")}>{children}</button>;
}

function Ring({ value, max }: { value: number; max: number }) {
  const r = 26; const c = 2 * Math.PI * r; const p = Math.min(1, value / Math.max(1, max));
  return (
    <div className="relative grid h-16 w-16 shrink-0 place-items-center">
      <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90"><circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeOpacity=".18" strokeWidth="6" /><circle cx="32" cy="32" r={r} fill="none" stroke="#fcd34d" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p)} className="transition-all duration-700" /></svg>
      <div className="text-center leading-none"><div className="text-lg font-extrabold">{value}</div><div className="text-[9px] opacity-80">/{max}</div></div>
    </div>
  );
}

function Collapsible({ title, icon, children, defaultOpen = false }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card overflow-hidden">
      <button className="flex w-full items-center gap-3 p-4 text-left" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-zamrud-50 text-zamrud-700 dark:bg-white/10 dark:text-zamrud-300">{icon}</span>
        <span className="flex-1 font-bold">{title}</span>
        <ChevronDown size={18} className={cx("text-slate-400 transition", open && "rotate-180")} />
      </button>
      {open && <div className="border-t border-slate-100 p-4 dark:border-white/5">{children}</div>}
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
  const avail = useMemo(() => filterPool(d, cfg).length, [d.settings.includeGenerated, cfg]); // eslint-disable-line react-hooks/exhaustive-deps
  const go = (c: PracticeConfig) => nav(`/latih/sesi?${toParams(c)}`);
  const set = (p: Partial<PracticeConfig>) => setCfg((c) => ({ ...c, ...p }));

  return (
    <div className="space-y-5">
      {/* ---------- Hero ---------- */}
      <section className="hero relative overflow-hidden rounded-3xl p-5 text-white shadow-xl shadow-zamrud-900/20">
        <div className="flex items-center gap-4">
          <Ring value={today} max={d.settings.dailyGoal} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-lg font-extrabold">Salam, {me.name} {me.avatar}</div>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-emerald-100">
              <span className="font-semibold text-emas-200">{s.lvl.level.name}</span>·<span className="inline-flex items-center gap-0.5"><Flame size={12} /> {s.streak} hari</span>·<span>{s.xp} XP</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-emas-400 transition-all duration-700" style={{ width: `${s.lvl.progress}%` }} /></div>
          </div>
        </div>
        <button className="btn btn-gold mt-4 w-full !py-3.5 text-base" onClick={() => go({ mode: "rawak", n: 10 })}><Play size={18} fill="currentColor" /> Mula Latih Tubi</button>
        <button className={cx("btn mt-2 w-full !py-3", due ? "bg-white text-rose-600 hover:bg-rose-50" : "bg-white/10 text-white/80")} onClick={() => go({ mode: "murajaah", n: 15 })} disabled={!due}>
          <RotateCcw size={17} /> {due ? `Murajaah ${due} soalan salah` : queued ? `Murajaah: ${queued} soalan dijadualkan` : "Murajaah: belum ada soalan salah"}
        </button>
      </section>

      {/* ---------- Mod pantas ---------- */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Harian", sub: "10 soalan", icon: <CalendarDays size={20} />, tone: TONES.sky.bubble, on: () => go({ mode: "harian" }) },
          { label: "Kelemahan", sub: s.weak.length ? `${s.weak.length} bab` : "bab terlemah", icon: <Target size={20} />, tone: TONES.rose.bubble, on: () => go({ mode: s.answered >= 10 ? "lemah" : "rawak", n: 15 }) },
          { label: "Maraton", sub: "tanpa had", icon: <InfinityIcon size={20} />, tone: TONES.violet.bubble, on: () => go({ mode: "rawak", n: 0 }) },
        ].map((m) => (
          <button key={m.label} onClick={m.on} className="card flex flex-col items-center gap-1.5 px-2 py-3 text-center active:scale-[.97]">
            <span className={cx("grid h-10 w-10 place-items-center rounded-xl", m.tone)}>{m.icon}</span>
            <span className="text-sm font-bold leading-tight">{m.label}</span>
            <span className="text-[11px] leading-tight text-slate-500">{m.sub}</span>
          </button>
        ))}
      </div>

      {/* ---------- Bab ---------- */}
      <section>
        <h2 className="mb-2 px-1 text-base font-extrabold text-hutan-900 dark:text-white">Latih ikut bab</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {CHAPTERS.map((c, i) => {
            const st = s.stats[i];
            return (
              <button key={c.id} onClick={() => go({ mode: "rawak", bab: c.id, n: 10 })} className="card flex flex-col items-start gap-1 p-3 text-left active:scale-[.97]">
                <div className="flex w-full items-center justify-between">
                  <span className={cx("grid h-7 w-7 place-items-center rounded-lg text-xs font-extrabold", TONES[CHAPTER_TONES[i]].bubble)}>{c.no}</span>
                  {st.mastered ? <span className="text-sm">👑</span> : st.attempts ? <span className={cx("text-[11px] font-bold", st.acc >= 80 ? "text-emerald-600" : st.acc >= 60 ? "text-amber-600" : "text-rose-500")}>{st.acc}%</span> : null}
                </div>
                <span className="line-clamp-2 text-[13px] font-semibold leading-tight">{c.title.replace(/^Hukum /, "")}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ---------- Latihan pilihan ---------- */}
      <Collapsible title="Latihan pilihan" icon={<SlidersHorizontal size={18} />}>
        <div className="label">Bab</div>
        <select className="input mb-3" value={cfg.bab} onChange={(e) => set({ bab: e.target.value })}>
          <option value="">Semua bab</option>{CHAPTERS.map((c) => <option key={c.id} value={c.id}>Bab {c.no}: {c.title}</option>)}
        </select>
        <div className="label">Jenis soalan</div>
        <div className="mb-3 flex flex-wrap gap-2">{Object.entries(TYPE_LABEL).map(([k, v]) => <Chip key={k} active={(cfg.jenis ?? "") === k} onClick={() => set({ jenis: k as PracticeConfig["jenis"] })}>{v}</Chip>)}</div>
        <div className="label">Sumber</div>
        <div className="mb-3 flex flex-wrap gap-2">{Object.entries(SOURCE_LABEL).filter(([k]) => k !== "jana" || d.settings.includeGenerated).map(([k, v]) => <Chip key={k} active={(cfg.sumber ?? "") === k} onClick={() => set({ sumber: k as PracticeConfig["sumber"] })}>{v}</Chip>)}</div>
        <div className="label">Bilangan</div>
        <div className="mb-4 flex flex-wrap gap-2">{[10, 20, 30, 50, 0].map((n) => <Chip key={n} active={cfg.n === n} onClick={() => set({ n })}>{n === 0 ? "Semua" : n}</Chip>)}</div>
        <button className="btn btn-primary w-full !py-3" disabled={!avail} onClick={() => go(cfg)}><Play size={17} fill="currentColor" /> Mula ({cfg.n === 0 ? avail : Math.min(avail, cfg.n ?? 10)} soalan)</button>
        {d.settings.includeGenerated && <p className="mt-3 text-xs text-slate-500">✨ Termasuk soalan dijana daripada nota (label “belum disemak”). Boleh dimatikan di Profil → Tetapan.</p>}
      </Collapsible>

      <Collapsible title="Soalan tauliah lepas (Kedah)" icon={<ScrollText size={18} />}>
        <p className="mb-3 text-xs text-slate-500">Soalan subjektif sebenar dengan jawapan cadangan (belum disemak). Tulis jawapan, kemudian nilai sendiri.</p>
        <div className="grid grid-cols-5 gap-2">{PAPERS.map((p) => <button key={p.year} onClick={() => go({ mode: "tahun", tahun: p.year })} className="btn btn-outline !px-0 !py-2 text-sm">{p.year}</button>)}</div>
      </Collapsible>
    </div>
  );
}
