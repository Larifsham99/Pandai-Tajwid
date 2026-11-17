import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, XCircle, BookOpen, Bookmark, Shuffle, ChevronDown, ArrowRight } from "lucide-react";
import type { Question } from "../types";
import { grade, recordAnswer, saveForReview } from "../lib/actions";
import { useMe } from "../lib/store";
import { chapterById } from "../data";
import { Arabic, Celebrate, RichText, cx, toast } from "./ui";
import { shuffle } from "../lib/util";
import { sfx } from "../lib/sound";

export interface PlayResult { correct: boolean; score: number }

/** Bar tindakan melekat di bawah skrin (mesra ibu jari). */
function ActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zamrud-900/5 bg-white/95 px-4 pt-3 backdrop-blur-md dark:border-white/10 dark:bg-hutan-950/95 no-print" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
      <div className="mx-auto flex max-w-2xl gap-2">{children}</div>
    </div>
  );
}

/** Pemain soalan + Sistem Penerangan Jawapan */
export default function QuestionPlayer({ q, mode, onAnswered, onNext, onSimilar, recordable = true }: {
  q: Question; mode: string; onAnswered?: (r: PlayResult) => void; onNext?: () => void; onSimilar?: () => void; recordable?: boolean;
}) {
  const me = useMe()!;
  const [sel, setSel] = useState<string>("");
  const [matchSel, setMatchSel] = useState<Record<string, string>>({});
  const [text, setText] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [more, setMore] = useState(false);
  const [result, setResult] = useState<PlayResult | null>(null);
  const t0 = useRef(Date.now());
  const fbRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setSel(""); setMatchSel({}); setText(""); setRevealed(false); setMore(false); setResult(null); t0.current = Date.now(); window.scrollTo({ top: 0 }); }, [q.id]);
  useEffect(() => { if (result) setTimeout(() => fbRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60); }, [result]);
  const rights = useMemo(() => shuffle(q.pairs?.map((p) => p.right) ?? [], q.id.length * 31), [q.id, q.pairs]);
  const ch = chapterById(q.chapterId);
  const ex = q.explanation;
  const srcSec = q.sectionId ? ch?.sections.find((s) => s.id === q.sectionId) : undefined;
  const sec = srcSec ?? ch?.sections.find((s) => s.dhobit?.length) ?? ch?.sections[0];

  function finish(r: PlayResult, given: string) {
    setResult(r);
    if (r.correct) sfx.correct(); else if (r.score > 0) sfx.partial(); else { sfx.wrong(); navigator.vibrate?.(40); }
    if (recordable) recordAnswer(me.id, q, r, given, mode, Date.now() - t0.current);
    onAnswered?.(r);
  }
  const submit = (value = sel) => finish(q.type === "match" ? grade(q, matchSel) : grade(q, value), q.type === "match" ? JSON.stringify(matchSel) : value);
  const answered = !!result;
  const correctText = q.type === "mcq" ? q.options?.find((o) => o.id === q.answer)?.text : q.type === "tf" ? (q.answer === "B" ? "Benar" : "Salah") : q.type === "fill" ? (q.answer as string[])[0] : undefined;
  const chosenOpt = q.options?.find((o) => o.id === sel);
  const canCheck = q.type === "match" ? Object.keys(matchSel).length >= (q.pairs?.length ?? 0) : !!sel.trim();
  const dhobit = ex?.dhobit ?? sec?.dhobit?.map((d) => d.teks).join("\n");
  const examples = ex?.examples?.length ? ex.examples : sec?.contoh?.slice(0, 3).map((c) => `${c.arab}${c.hukum ? ` – ${c.hukum}` : ""}${c.ref ? ` (${c.ref})` : ""}`);

  return (
    <div className="pb-28">
      {/* ---------- Soalan ---------- */}
      <div className="rise">
        <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          <span className="font-semibold text-zamrud-700 dark:text-zamrud-300">Bab {ch?.no} · {ch?.title}</span>
          {q.source === "tauliah" && <span className="chip bg-emas-100 text-emas-700">Tauliah {q.year} · S{q.qNo}({q.part})</span>}
          {q.source === "jana" && <span className="chip bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-200">✨ Dijana daripada nota</span>}
          {q.status === "belum_disemak" && <span className="chip bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200">Belum disemak</span>}
        </div>
        <RichText text={q.prompt} className="text-lg font-bold leading-snug text-hutan-900 dark:text-white" />
        {q.arabic && <Arabic className="mt-3" refText={q.arabicRef}>{q.arabic}</Arabic>}
      </div>

      {/* ---------- Jawapan ---------- */}
      <div className="mt-4">
        {(q.type === "mcq" || q.type === "tf") && (
          <div className={cx("grid gap-2.5", q.type === "tf" && "grid-cols-2")}>
            {(q.type === "tf" ? [{ id: "B", text: "Benar" }, { id: "S", text: "Salah" }] : q.options!).map((o) => {
              const isAns = o.id === q.answer; const isSel = o.id === sel;
              return (
                <button key={o.id} data-nosound disabled={answered} onClick={() => { setSel(o.id); submit(o.id); }}
                  className={cx("flex items-center gap-3 rounded-2xl bg-white px-3.5 py-3.5 text-left text-[15px] shadow-sm ring-1 transition duration-150 active:scale-[.98] dark:bg-hutan-900",
                    q.type === "tf" && "justify-center py-5 text-base font-bold",
                    !answered && "ring-slate-200 hover:ring-zamrud-400 dark:ring-white/10",
                    answered && isAns && "!bg-emerald-50 ring-2 !ring-emerald-500 dark:!bg-emerald-500/15",
                    answered && isSel && !isAns && "!bg-rose-50 ring-2 !ring-rose-500 dark:!bg-rose-500/15",
                    answered && !isSel && !isAns && "opacity-50 ring-slate-200 dark:ring-white/10")}>
                  {q.type === "mcq" && <span className={cx("grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold", answered && isAns ? "bg-emerald-500 text-white" : answered && isSel ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300")}>{o.id.toUpperCase()}</span>}
                  {q.type === "tf" && <span>{o.id === "B" ? "✓" : "✗"}</span>}
                  <RichText text={o.text} className={cx(q.type === "mcq" && "flex-1")} />
                  {answered && isAns && q.type === "mcq" && <CheckCircle2 className="shrink-0 text-emerald-500" size={20} />}
                  {answered && isSel && !isAns && q.type === "mcq" && <XCircle className="shrink-0 text-rose-500" size={20} />}
                </button>
              );
            })}
          </div>
        )}
        {q.type === "fill" && <input className="input !py-3.5 text-base" placeholder="Taip jawapan anda…" value={sel} disabled={answered} onChange={(e) => setSel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && canCheck && submit()} />}
        {q.type === "match" && (
          <div className="space-y-2.5">
            {q.pairs!.map((p) => {
              const ok = answered && matchSel[p.left] === p.right;
              return (
                <div key={p.left} className={cx("rounded-2xl bg-white p-3 shadow-sm ring-1 dark:bg-hutan-900", answered ? (ok ? "ring-2 ring-emerald-500" : "ring-2 ring-rose-400") : "ring-slate-200 dark:ring-white/10")}>
                  <RichText text={p.left} className="mb-2 font-semibold" />
                  <select className="input" disabled={answered} value={matchSel[p.left] ?? ""} onChange={(e) => setMatchSel({ ...matchSel, [p.left]: e.target.value })}>
                    <option value="">— pilih padanan —</option>{rights.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {answered && !ok && <div className="mt-1 text-xs font-semibold text-rose-600">Betul: {p.right}</div>}
                </div>
              );
            })}
          </div>
        )}
        {q.type === "subjective" && (
          <textarea className="input min-h-[140px] text-base" placeholder="Tulis jawapan anda (pilihan) sebelum melihat jawapan cadangan…" value={text} onChange={(e) => setText(e.target.value)} disabled={answered} />
        )}
      </div>

      {/* ---------- Subjektif: jawapan cadangan ---------- */}
      {q.type === "subjective" && revealed && (
        <div className="mt-4 space-y-3 pop">
          <div className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">⚠️ Jawapan cadangan <b>belum disemak</b> guru penyemak — panduan ulang kaji, bukan skema rasmi.</div>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-hutan-900 dark:ring-white/10"><div className="mb-2 text-xs font-bold uppercase tracking-wide text-zamrud-700 dark:text-zamrud-300">Jawapan cadangan</div><RichText text={q.modelAnswer || "—"} className="text-sm" /></div>
          {!answered && <div className="text-sm font-semibold">Nilai jawapan anda:</div>}
          {!answered && <div data-nosound className="grid grid-cols-3 gap-2">
            <button className="btn bg-emerald-500 text-white" onClick={() => finish({ correct: true, score: 1 }, text)}>✅ Tepat</button>
            <button className="btn bg-amber-300 text-hutan-900" onClick={() => finish({ correct: false, score: 0.5 }, text)}>🟡 Separa</button>
            <button className="btn bg-rose-500 text-white" onClick={() => finish({ correct: false, score: 0 }, text)}>❌ Belum</button>
          </div>}
        </div>
      )}

      {/* ---------- Penerangan jawapan ---------- */}
      {answered && q.type !== "subjective" && (
        <div ref={fbRef} className="mt-5 scroll-mt-36 space-y-3 pop">
          <div className={cx("relative rounded-2xl p-4 text-white shadow-lg", result!.correct ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-rose-500 to-pink-600")}>
            {result!.correct && <Celebrate />}
            <div className="flex items-center gap-2 text-lg font-extrabold">{result!.correct ? <CheckCircle2 /> : <XCircle />}{result!.correct ? "Tepat! Barakallahu fik" : result!.score > 0 ? `Separa betul (${Math.round(result!.score * 100)}%)` : "Belum tepat"}</div>
            {!result!.correct && correctText && <div className="mt-1 text-sm">Jawapan: <RichText text={correctText} className="inline font-semibold" /></div>}
            {!result!.correct && recordable && <div className="mt-1 text-xs opacity-90">🔁 Dimasukkan ke murajaah automatik</div>}
          </div>

          <div className="rounded-2xl bg-white p-4 text-sm shadow-sm ring-1 ring-slate-200 dark:bg-hutan-900 dark:ring-white/10">
            <div className="mb-1 text-xs font-bold uppercase tracking-wide text-zamrud-700 dark:text-zamrud-300">Penerangan</div>
            {!result!.correct && chosenOpt?.why && <p className="mb-2 rounded-xl bg-rose-50 p-2.5 text-rose-900 dark:bg-rose-500/10 dark:text-rose-200"><b>Pilihan anda:</b> {chosenOpt.why}</p>}
            <RichText text={ex?.why ?? "—"} />
            {ex?.concept && <RichText text={ex.concept} className="mt-2 text-slate-600 dark:text-slate-300" />}
            {ex?.identify && <p className="mt-2"><b>Cara kenal pasti:</b> {ex.identify}</p>}
            {!result!.correct && ex?.confusion && <p className="mt-2"><b>Kekeliruan lazim:</b> {ex.confusion}</p>}
            {ex?.compare && <p className="mt-2"><b>Perbandingan:</b> {ex.compare}</p>}

            {(dhobit || examples?.length) && (
              <>
                <button className="mt-3 flex w-full items-center gap-1 text-left text-xs font-bold text-emas-700 dark:text-emas-300" onClick={() => setMore(!more)}>
                  <span className="flex-1">Dhobit & contoh</span><ChevronDown size={14} className={cx("transition", more && "rotate-180")} />
                </button>
                {more && <div className="mt-2 space-y-2">
                  {dhobit && <div className="rounded-xl bg-emas-50 p-2.5 dark:bg-emas-500/10">🔑 <RichText text={dhobit} className="inline" /></div>}
                  {examples?.length ? <ul className="space-y-1">{examples.map((e) => <li key={e}><RichText text={e} /></li>)}</ul> : null}
                </div>}
              </>
            )}
            {q.source === "jana" && <p className="mt-3 text-[11px] text-violet-700 dark:text-violet-300">✨ Dijana automatik daripada nota; belum disemak guru. Tiada hukum baharu ditambah.</p>}
            {ex?.refs?.[0] && <p className="mt-1 text-[11px] text-slate-400">Rujukan: {ex.refs[0]}</p>}
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <Link to={`/nota/${q.chapterId}${q.sectionId ? "#" + q.sectionId : ""}`} className="btn btn-ghost !flex-col !gap-1 !px-1 !py-2.5 text-xs"><BookOpen size={18} />Baca nota</Link>
            {onSimilar ? <button className="btn btn-ghost !flex-col !gap-1 !px-1 !py-2.5 text-xs" onClick={onSimilar}><Shuffle size={18} />Soalan serupa</button> : <span />}
            <button className="btn btn-ghost !flex-col !gap-1 !px-1 !py-2.5 text-xs" onClick={() => { saveForReview(me.id, q.id); toast("Disimpan untuk murajaah"); }}><Bookmark size={18} />Simpan</button>
          </div>
        </div>
      )}

      {/* ---------- Bar tindakan ---------- */}
      <ActionBar>
        {answered ? (
          onNext && <button className="btn btn-primary flex-1 !py-3.5 text-base" onClick={onNext}>Seterusnya <ArrowRight size={18} /></button>
        ) : q.type === "subjective" ? (
          <>{!revealed && <button className="btn btn-primary flex-1 !py-3.5 text-base" onClick={() => setRevealed(true)}>Lihat jawapan cadangan</button>}
            {onNext && <button className={cx("btn btn-ghost !py-3.5", revealed && "flex-1")} onClick={onNext}>Langkau</button>}</>
        ) : (q.type === "mcq" || q.type === "tf") ? (
          <>{onNext && <button className="btn btn-ghost flex-1 !py-3.5" onClick={onNext}>Langkau</button>}</>
        ) : (
          <>{onNext && <button className="btn btn-ghost !py-3.5" onClick={onNext}>Langkau</button>}
            <button data-nosound className="btn btn-primary flex-1 !py-3.5 text-base" disabled={!canCheck} onClick={() => submit()}>Semak jawapan</button></>
        )}
      </ActionBar>
    </div>
  );
}
