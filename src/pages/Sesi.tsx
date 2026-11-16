import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import { getDB, useMe } from "../lib/store";
import { completeExercise } from "../lib/actions";
import { buildSet, fromParams, toParams } from "../lib/practice";
import { XP_RULES } from "../lib/gamification";
import { chapterById } from "../data";
import QuestionPlayer, { type PlayResult } from "../components/QuestionPlayer";
import { Card, Empty, Progress, RichText } from "../components/ui";

export default function Sesi() { const [p] = useSearchParams(); return <SesiInner key={p.toString()} />; }

function SesiInner() {
  const me = useMe()!; const [p] = useSearchParams(); const nav = useNavigate();
  const cfg = useMemo(() => fromParams(p), []); // eslint-disable-line react-hooks/exhaustive-deps
  const set = useMemo(() => buildSet(getDB(), me.id, cfg), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [res, setRes] = useState<Record<string, PlayResult>>({});
  const [done, setDone] = useState(false);
  const q = set.qs[i];
  const answered = Object.keys(res).length;
  const score = Object.values(res).reduce((s, r) => s + r.score, 0);
  const correctN = Object.values(res).filter((r) => r.correct).length;
  const xpEarned = Object.values(res).reduce((s, r) => s + (cfg.mode === "tahun" ? XP_RULES.tauliahSelf + Math.round(r.score * 6) : XP_RULES.answer + (r.correct ? XP_RULES.correct : 0)), 0);

  if (!set.qs.length) return (
    <Empty title={cfg.mode === "murajaah" ? "Tiada soalan untuk diulang kaji sekarang" : "Tiada soalan tersedia"} icon="🌿">
      {cfg.mode === "murajaah" ? "Soalan yang anda jawab salah akan muncul di sini secara automatik mengikut jadual ulang kaji." : "Cuba pilihan lain."}
      <div className="mt-3"><Link className="btn btn-primary" to="/">Kembali ke Latih Tubi</Link></div>
    </Empty>
  );

  function finish() {
    setDone(true);
    if (answered) completeExercise(me.id, set.title, answered, score);
  }

  if (done) {
    const wrong = set.qs.filter((x) => res[x.id] && !res[x.id].correct);
    const pct = answered ? Math.round((score / answered) * 100) : 0;
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Card className="motif relative overflow-hidden p-6 text-center">
          <div className="text-5xl">{pct >= 80 ? "🏆" : pct >= 60 ? "🌟" : "🌱"}</div>
          <div className="mt-2 text-5xl font-extrabold text-zamrud-700 dark:text-emas-300">{pct}%</div>
          <div className="text-sm text-slate-500">{correctN} betul daripada {answered} dijawab · {set.title}</div>
          {answered > 0 && <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">+{xpEarned + XP_RULES.exercise} XP</div>}
          <div className="mt-3 text-sm font-semibold">{pct >= 80 ? "Mumtaz! Teruskan istiqamah." : pct >= 60 ? "Jayyid. Ulang soalan yang salah untuk menguasai." : "Jangan putus asa — baca semula nota dan cuba lagi."}</div>
          <div className="mt-4 grid gap-2 sm:flex sm:justify-center">
            <button className="btn btn-primary" onClick={() => nav(`/latih/sesi?${toParams(cfg)}&r=${Date.now()}`)}>Set baharu</button>
            {wrong.length > 0 && <button className="btn btn-ghost" onClick={() => nav(`/latih/sesi?${toParams({ mode: "murajaah", n: 15 })}`)}>Murajaah sekarang</button>}
            <Link to="/" className="btn btn-outline">Kembali</Link>
          </div>
        </Card>
        {wrong.length > 0 && (
          <Card className="p-5">
            <div className="mb-2 font-bold">🔁 {wrong.length} soalan dimasukkan ke murajaah automatik</div>
            {wrong.map((w) => <div key={w.id} className="border-t border-slate-100 py-2 text-sm dark:border-white/5"><RichText text={w.prompt} />{w.arabic && <div className="arab-block !text-xl">{w.arabic}</div>}<Link className="text-xs font-semibold text-zamrud-700 dark:text-zamrud-300" to={`/nota/${w.chapterId}${w.sectionId ? "#" + w.sectionId : ""}`}>Baca nota: {chapterById(w.chapterId)?.title} →</Link></div>)}
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="sticky top-14 z-30 -mx-4 mb-4 border-b border-zamrud-900/5 bg-[#f4fbf7] px-4 pb-3 pt-2 shadow-sm dark:border-white/5 dark:bg-hutan-950">
        <div className="flex items-center gap-3">
          <button className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10" onClick={finish} aria-label="Tamatkan sesi"><X size={18} /></button>
          <Progress value={((i + (res[q.id] ? 1 : 0)) / set.qs.length) * 100} className="!h-3" />
          <span className="whitespace-nowrap text-sm font-bold tabular-nums text-slate-500">{i + 1}/{set.qs.length}</span>
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] font-semibold text-slate-500"><span className="truncate">{set.title}</span><span className="shrink-0 text-emerald-600">✓ {correctN}</span></div>
      </div>
      <QuestionPlayer key={q.id} q={q} mode={cfg.mode}
        onAnswered={(r) => setRes((s) => ({ ...s, [q.id]: r }))}
        onNext={() => (i < set.qs.length - 1 ? setI(i + 1) : finish())}
        onSimilar={q.source !== "tauliah" ? () => nav(`/latih/sesi?${toParams({ mode: "serupa", bab: q.chapterId, ex: q.id })}`) : undefined} />
    </div>
  );
}
