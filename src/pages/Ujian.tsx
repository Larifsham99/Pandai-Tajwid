import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Timer, ChevronLeft, ChevronRight, Flag, Share2, CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import { getDB, useMe } from "../lib/store";
import { objectiveQuestions } from "../lib/store";
import { grade, recordAnswer, completeExercise } from "../lib/actions";
import { shuffle } from "../lib/util";
import { sfx } from "../lib/sound";
import { shareText } from "../lib/install";
import { CHAPTERS, chapterById } from "../data";
import { Arabic, BarChart, Card, PageHeader, RichText, cx, toast } from "../components/ui";
import type { Question } from "../types";

type Cfg = { n: number; minutes: number; bab: string };
const PRESETS: { label: string; n: number; minutes: number; desc: string }[] = [
  { label: "Ringkas", n: 20, minutes: 15, desc: "20 soalan · 15 minit" },
  { label: "Penuh", n: 40, minutes: 30, desc: "40 soalan · 30 minit" },
];
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function Ujian() {
  const [cfg, setCfg] = useState<Cfg | null>(null);
  const [run, setRun] = useState(0);
  if (!cfg) return <Setup onStart={(c) => { setCfg(c); setRun((r) => r + 1); }} />;
  return <Exam key={run} cfg={cfg} onRestart={() => setCfg(null)} />;
}

function Setup({ onStart }: { onStart: (c: Cfg) => void }) {
  const [preset, setPreset] = useState(0); const [bab, setBab] = useState("");
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Ujian Bertempoh" subtitle="Simulasi peperiksaan — jawapan dipaparkan di akhir ujian" icon={<Timer />} />
      <Card className="space-y-4 p-5">
        <div>
          <div className="label">Jenis ujian</div>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p, i) => (
              <button key={p.label} onClick={() => setPreset(i)} className={cx("rounded-2xl p-4 text-left ring-1 transition", preset === i ? "bg-zamrud-50 ring-2 ring-zamrud-600 dark:bg-zamrud-500/10" : "ring-slate-200 dark:ring-white/10")}>
                <div className="font-bold">{p.label}</div><div className="text-xs text-slate-500">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label" htmlFor="ubab">Skop</label>
          <select id="ubab" className="input" value={bab} onChange={(e) => setBab(e.target.value)}>
            <option value="">Semua bab (campuran)</option>
            {CHAPTERS.map((c) => <option key={c.id} value={c.id}>Bab {c.no}: {c.title}</option>)}
          </select>
        </div>
        <ul className="space-y-1 rounded-2xl bg-emas-50 p-3 text-sm text-hutan-900 dark:bg-emas-500/10 dark:text-emas-100">
          <li>⏱️ Masa berjalan sebaik ujian bermula; ujian dihantar automatik apabila masa tamat.</li>
          <li>🙈 Jawapan betul & penerangan hanya dipaparkan selepas ujian dihantar.</li>
          <li>🔁 Soalan yang salah masuk murajaah automatik.</li>
        </ul>
        <button className="btn btn-primary w-full !py-3.5 text-base" onClick={() => onStart({ n: PRESETS[preset].n, minutes: PRESETS[preset].minutes, bab })}><Timer size={18} /> Mula ujian</button>
      </Card>
    </div>
  );
}

function Exam({ cfg, onRestart }: { cfg: Cfg; onRestart: () => void }) {
  const me = useMe()!;
  const qs = useMemo<Question[]>(() => shuffle(objectiveQuestions(getDB()).filter((q) => (q.type === "mcq" || q.type === "tf") && (!cfg.bab || q.chapterId === cfg.bab))).slice(0, cfg.n), [cfg]);
  const [ans, setAns] = useState<Record<string, string>>({});
  const [flag, setFlag] = useState<Record<string, boolean>>({});
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(cfg.minutes * 60);
  const [done, setDone] = useState(false);
  const submitted = useRef(false);
  const t0 = useRef(Date.now());

  function submit() {
    if (submitted.current) return; submitted.current = true;
    qs.forEach((q) => { const g = ans[q.id] ? grade(q, ans[q.id]) : { correct: false, score: 0 }; recordAnswer(me.id, q, g, ans[q.id] ?? "", "ujian"); });
    const score = qs.filter((q) => ans[q.id] && grade(q, ans[q.id]).correct).length;
    completeExercise(me.id, `Ujian Bertempoh (${qs.length} soalan)`, qs.length, score);
    setTimeout(() => sfx.complete(score / qs.length >= 0.6), 150);
    setDone(true); window.scrollTo({ top: 0 });
  }
  useEffect(() => {
    if (done) return;
    const id = setInterval(() => {
      const l = Math.max(0, cfg.minutes * 60 - Math.floor((Date.now() - t0.current) / 1000));
      setLeft(l);
      if (l === 0) { clearInterval(id); toast("⏰ Masa tamat — ujian dihantar", "info"); submit(); }
    }, 500);
    return () => clearInterval(id);
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!qs.length) return <Card className="p-6 text-center">Tiada soalan untuk skop ini. <button className="btn btn-primary mt-3" onClick={onRestart}>Kembali</button></Card>;
  if (done) return <Result qs={qs} ans={ans} usedSec={cfg.minutes * 60 - left} onRestart={onRestart} />;

  const q = qs[i];
  const answeredN = Object.keys(ans).length;
  const opts = q.type === "tf" ? [{ id: "B", text: "Benar" }, { id: "S", text: "Salah" }] : q.options!;
  const ch = chapterById(q.chapterId);
  return (
    <div className="mx-auto max-w-2xl pb-28">
      <div className="sticky top-14 z-30 -mx-4 mb-4 border-b border-zamrud-900/5 bg-krim-50 px-4 pb-3 pt-2 shadow-sm dark:border-white/5 dark:bg-hutan-950">
        <div className="flex items-center justify-between gap-3">
          <span className={cx("chip !text-sm tabular-nums", left <= 60 ? "bg-merah-100 text-merah-700" : "bg-zamrud-100 text-zamrud-800")}><Timer size={14} /> {fmt(left)}</span>
          <span className="text-sm font-bold text-slate-500">Soalan {i + 1}/{qs.length} · dijawab {answeredN}</span>
          <button className="btn btn-gold !px-3 !py-1.5 text-xs" onClick={() => { if (answeredN < qs.length && !confirm(`${qs.length - answeredN} soalan belum dijawab. Hantar juga?`)) return; submit(); }}>Hantar</button>
        </div>
        <div className="mt-2 flex gap-1 overflow-x-auto pb-1">
          {qs.map((x, k) => <button key={x.id} data-nosound onClick={() => setI(k)} aria-label={`Soalan ${k + 1}`} className={cx("h-7 min-w-7 shrink-0 rounded-lg px-1 text-[11px] font-bold", k === i ? "bg-zamrud-600 text-white" : ans[x.id] ? "bg-zamrud-100 text-zamrud-800" : "bg-slate-100 text-slate-500 dark:bg-white/10", flag[x.id] && "ring-2 ring-emas-400")}>{k + 1}</button>)}
        </div>
      </div>
      <div className="mb-2 text-xs font-semibold text-zamrud-700 dark:text-zamrud-300">Bab {ch?.no} · {ch?.title}</div>
      <RichText text={q.prompt} className="text-lg font-bold leading-snug text-hutan-900 dark:text-white" />
      {q.arabic && <Arabic className="mt-3" refText={q.arabicRef}>{q.arabic}</Arabic>}
      <div className={cx("mt-4 grid gap-2.5", q.type === "tf" && "grid-cols-2")}>
        {opts.map((o) => (
          <button key={o.id} onClick={() => setAns({ ...ans, [q.id]: o.id })} className={cx("flex items-center gap-3 rounded-2xl bg-white px-3.5 py-3.5 text-left text-[15px] shadow-sm ring-1 transition active:scale-[.98] dark:bg-hutan-900", q.type === "tf" && "justify-center py-5 font-bold", ans[q.id] === o.id ? "ring-2 ring-zamrud-600 bg-zamrud-50 dark:bg-zamrud-500/15" : "ring-slate-200 dark:ring-white/10")}>
            {q.type === "mcq" && <span className={cx("grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold", ans[q.id] === o.id ? "bg-zamrud-600 text-white" : "bg-slate-100 text-slate-600 dark:bg-white/10")}>{o.id.toUpperCase()}</span>}
            <RichText text={o.text} className={cx(q.type === "mcq" && "flex-1")} />
          </button>
        ))}
      </div>
      <button className={cx("btn mt-4 !py-2 text-sm", flag[q.id] ? "bg-emas-100 text-emas-800" : "btn-ghost")} onClick={() => setFlag({ ...flag, [q.id]: !flag[q.id] })}><Flag size={15} /> {flag[q.id] ? "Ditanda untuk semak semula" : "Tanda untuk semak semula"}</button>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zamrud-900/5 bg-white/95 px-4 pt-3 backdrop-blur-md dark:border-white/10 dark:bg-hutan-950/95" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <div className="mx-auto flex max-w-2xl gap-2">
          <button className="btn btn-ghost !py-3.5" disabled={i === 0} onClick={() => setI(i - 1)}><ChevronLeft size={18} /> Sebelum</button>
          {i < qs.length - 1
            ? <button className="btn btn-primary flex-1 !py-3.5 text-base" onClick={() => setI(i + 1)}>Seterusnya <ChevronRight size={18} /></button>
            : <button className="btn btn-gold flex-1 !py-3.5 text-base" onClick={() => { if (answeredN < qs.length && !confirm(`${qs.length - answeredN} soalan belum dijawab. Hantar juga?`)) return; submit(); }}>Hantar ujian</button>}
        </div>
      </div>
    </div>
  );
}

function Result({ qs, ans, usedSec, onRestart }: { qs: Question[]; ans: Record<string, string>; usedSec: number; onRestart: () => void }) {
  const right = qs.filter((q) => ans[q.id] && grade(q, ans[q.id]).correct);
  const pct = Math.round((right.length / qs.length) * 100);
  const byCh = CHAPTERS.map((c) => { const xs = qs.filter((q) => q.chapterId === c.id); return { label: `${c.no}. ${c.title}`, n: xs.length, value: xs.length ? Math.round((xs.filter((q) => right.includes(q)).length / xs.length) * 100) : 0 }; }).filter((x) => x.n);
  const [open, setOpen] = useState<string | null>(null);
  const label = (q: Question, id?: string) => !id ? "— tidak dijawab —" : q.type === "tf" ? (id === "B" ? "Benar" : "Salah") : q.options?.find((o) => o.id === id)?.text ?? id;
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Card className="motif p-6 text-center">
        <div className="text-5xl">{pct >= 80 ? "🏆" : pct >= 60 ? "🌟" : "🌱"}</div>
        <div className="mt-2 text-5xl font-extrabold text-zamrud-800 dark:text-emas-300">{pct}%</div>
        <div className="text-sm text-slate-500">{right.length} betul daripada {qs.length} · masa {fmt(usedSec)}</div>
        <div className="mt-2 text-sm font-semibold">{pct >= 80 ? "Mumtaz! Anda bersedia menghadapi peperiksaan." : pct >= 60 ? "Jayyid. Fokus pada bab yang lemah di bawah." : "Teruskan latihan — ulang kaji nota bab yang lemah."}</div>
        <div className="mt-4 grid gap-2 sm:flex sm:justify-center">
          <button className="btn btn-primary" onClick={onRestart}>Ujian baharu</button>
          <button className="btn btn-gold" onClick={() => shareText(`Alhamdulillah, saya dapat ${right.length}/${qs.length} (${pct}%) dalam Ujian Bertempoh Pandai Tajwid 🎯 Jom uji kefahaman tajwid anda!`)}><Share2 size={16} /> Kongsi keputusan</button>
          <Link to="/" className="btn btn-outline">Kembali</Link>
        </div>
      </Card>
      {byCh.length > 1 && <Card className="p-4"><div className="mb-3 font-bold">Pencapaian ikut bab</div><BarChart data={byCh} /></Card>}
      <Card className="p-4">
        <div className="mb-2 font-bold">Semakan jawapan</div>
        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {qs.map((q, k) => {
            const ok = right.includes(q);
            return (
              <div key={q.id} className="py-2">
                <button className="flex w-full items-start gap-2 text-left" onClick={() => setOpen(open === q.id ? null : q.id)}>
                  {ok ? <CheckCircle2 className="mt-0.5 shrink-0 text-zamrud-500" size={18} /> : <XCircle className="mt-0.5 shrink-0 text-merah-500" size={18} />}
                  <span className="flex-1 text-sm"><b>{k + 1}.</b> <RichText text={q.prompt} className="inline" /></span>
                  <ChevronDown size={16} className={cx("mt-0.5 shrink-0 text-slate-400 transition", open === q.id && "rotate-180")} />
                </button>
                {open === q.id && (
                  <div className="ml-7 mt-2 space-y-1 text-sm">
                    {q.arabic && <div className="arab-block !text-xl">{q.arabic}</div>}
                    <div>Jawapan anda: <b className={ok ? "text-zamrud-700" : "text-merah-600"}><RichText text={label(q, ans[q.id])} className="inline" /></b></div>
                    {!ok && <div>Jawapan betul: <b className="text-zamrud-700"><RichText text={label(q, q.answer as string)} className="inline" /></b></div>}
                    {q.explanation?.why && <div className="rounded-xl bg-zamrud-50 p-2.5 dark:bg-white/5"><RichText text={q.explanation.why} /></div>}
                    {q.status === "belum_disemak" && <div className="text-[11px] text-emas-700">Belum disemak guru penyemak.</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
