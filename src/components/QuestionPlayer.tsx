import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, XCircle, BookOpen, KeyRound, ListChecks, Bookmark, Shuffle, ChevronDown, ScrollText } from "lucide-react";
import type { Question } from "../types";
import { grade, recordAnswer, saveForReview } from "../lib/actions";
import { useMe } from "../lib/store";
import { chapterById } from "../data";
import { Arabic, Celebrate, RichText, cx, toast } from "./ui";
import { shuffle } from "../lib/util";

export interface PlayResult { correct: boolean; score: number }

function Section({ icon, title, children, open: o = false, tone = "default" }: { icon: React.ReactNode; title: string; children: React.ReactNode; open?: boolean; tone?: "default" | "rose" | "emas" }) {
  const [open, setOpen] = useState(o);
  const t = tone === "rose" ? "bg-rose-50 dark:bg-rose-500/10" : tone === "emas" ? "bg-emas-50 dark:bg-emas-500/10" : "bg-zamrud-50/70 dark:bg-white/5";
  return (
    <div className={cx("rounded-2xl", t)}>
      <button className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-bold" onClick={() => setOpen(!open)}>{icon}<span className="flex-1">{title}</span><ChevronDown size={16} className={cx("transition", open && "rotate-180")} /></button>
      {open && <div className="px-4 pb-4 text-sm">{children}</div>}
    </div>
  );
}

/** Pemain soalan + Sistem Penerangan Jawapan */
export default function QuestionPlayer({ q, mode, onAnswered, onNext, onSimilar, recordable = true, index, total }: {
  q: Question; mode: string; onAnswered?: (r: PlayResult) => void; onNext?: () => void; onSimilar?: () => void; recordable?: boolean; index?: number; total?: number;
}) {
  const me = useMe()!;
  const [sel, setSel] = useState<string>("");
  const [matchSel, setMatchSel] = useState<Record<string, string>>({});
  const [text, setText] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<PlayResult | null>(null);
  const t0 = useRef(Date.now());
  useEffect(() => { setSel(""); setMatchSel({}); setText(""); setRevealed(false); setResult(null); t0.current = Date.now(); }, [q.id]);
  const rights = useMemo(() => shuffle(q.pairs?.map((p) => p.right) ?? [], q.id.length * 31), [q.id, q.pairs]);
  const ch = chapterById(q.chapterId);
  const ex = q.explanation;
  const srcSec = q.sectionId ? ch?.sections.find((s) => s.id === q.sectionId) : undefined;
  const fallbackSec = srcSec ?? ch?.sections.find((s) => s.dhobit?.length) ?? ch?.sections[0];

  function submit() {
    let r: PlayResult;
    if (q.type === "match") r = grade(q, matchSel); else r = grade(q, sel);
    setResult(r);
    if (recordable) recordAnswer(me.id, q, r, q.type === "match" ? JSON.stringify(matchSel) : sel, mode, Date.now() - t0.current);
    onAnswered?.(r);
  }
  function selfRate(score: number) {
    const r = { correct: score >= 0.75, score };
    setResult(r);
    if (recordable) recordAnswer(me.id, q, r, text, mode, Date.now() - t0.current);
    onAnswered?.(r);
  }
  const answered = !!result;
  const correctText = q.type === "mcq" ? q.options?.find((o) => o.id === q.answer)?.text : q.type === "tf" ? (q.answer === "B" ? "Benar" : "Salah") : q.type === "fill" ? (q.answer as string[])[0] : undefined;
  const chosenOpt = q.options?.find((o) => o.id === sel);

  return (
    <div className="card p-4 sm:p-6 rise">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        {index != null && total != null && <span className="chip bg-hutan-900 text-emas-200">Soalan {index + 1}/{total}</span>}
        <span className="chip bg-zamrud-100 text-zamrud-800 dark:bg-zamrud-500/20 dark:text-zamrud-200">Bab {ch?.no}: {ch?.title}</span>
        {q.source === "tauliah" ? <span className="chip bg-emas-100 text-emas-700">Tauliah Kedah {q.year} · S{q.qNo}({q.part})</span> : q.source === "jana" ? <span className="chip bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-200">✨ Dijana daripada nota</span> : <span className="chip bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300">Soalan latihan</span>}
        <span className="chip bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300">{"★".repeat(q.difficulty)}{"☆".repeat(3 - q.difficulty)}</span>
        {q.status === "belum_disemak" && <span className="chip bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200" title="Kandungan belum disahkan oleh guru penyemak">Belum disemak</span>}
      </div>
      <RichText text={q.prompt} className="text-[15px] font-semibold text-hutan-900 dark:text-white" />
      {q.arabic && <Arabic className="mt-3" refText={q.arabicRef}>{q.arabic}</Arabic>}

      {/* ---------- Input ---------- */}
      <div className="mt-4">
        {(q.type === "mcq" || q.type === "tf") && (
          <div className="grid gap-2">
            {(q.type === "tf" ? [{ id: "B", text: "Benar" }, { id: "S", text: "Salah" }] : q.options!).map((o) => {
              const isAns = o.id === q.answer; const isSel = o.id === sel;
              return (
                <button key={o.id} disabled={answered} onClick={() => setSel(o.id)} className={cx("flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-[15px] ring-1 transition sm:px-4",
                  !answered && (isSel ? "bg-zamrud-50 ring-2 ring-zamrud-600 dark:bg-zamrud-500/10" : "ring-slate-200 hover:bg-slate-50 dark:ring-white/10 dark:hover:bg-white/5"),
                  answered && isAns && "bg-zamrud-50 ring-2 ring-zamrud-600 dark:bg-zamrud-500/15", answered && isSel && !isAns && "bg-rose-50 ring-2 ring-rose-500 dark:bg-rose-500/15", answered && !isSel && !isAns && "opacity-60 ring-slate-200 dark:ring-white/10")}>
                  <span className={cx("grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold", isSel || (answered && isAns) ? "bg-zamrud-700 text-white" : "bg-slate-100 dark:bg-white/10")}>{q.type === "tf" ? (o.id === "B" ? "✓" : "✗") : o.id.toUpperCase()}</span>
                  <RichText text={o.text} className="flex-1" />
                  {answered && isAns && <CheckCircle2 className="text-zamrud-600" size={18} />}{answered && isSel && !isAns && <XCircle className="text-rose-500" size={18} />}
                </button>
              );
            })}
          </div>
        )}
        {q.type === "fill" && <input className="input text-base" placeholder="Taip jawapan anda…" value={sel} disabled={answered} onChange={(e) => setSel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sel && submit()} />}
        {q.type === "match" && (
          <div className="space-y-2">
            {q.pairs!.map((p) => {
              const ok = answered && matchSel[p.left] === p.right;
              return (
                <div key={p.left} className={cx("grid items-center gap-2 rounded-2xl p-2 ring-1 sm:grid-cols-2", answered ? (ok ? "ring-zamrud-500 bg-zamrud-50 dark:bg-zamrud-500/10" : "ring-rose-400 bg-rose-50 dark:bg-rose-500/10") : "ring-slate-200 dark:ring-white/10")}>
                  <RichText text={p.left} className="px-2 font-semibold" />
                  <select className="input" disabled={answered} value={matchSel[p.left] ?? ""} onChange={(e) => setMatchSel({ ...matchSel, [p.left]: e.target.value })}>
                    <option value="">— pilih padanan —</option>{rights.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {answered && !ok && <div className="text-xs text-rose-600 sm:col-span-2">Padanan betul: {p.right}</div>}
                </div>
              );
            })}
          </div>
        )}
        {q.type === "subjective" && (
          <div>
            <textarea className="input min-h-[120px]" placeholder="Tulis jawapan anda di sini (pilihan) sebelum melihat jawapan cadangan…" value={text} onChange={(e) => setText(e.target.value)} disabled={answered} />
          </div>
        )}
      </div>

      {/* ---------- Tindakan ---------- */}
      {!answered && (
        <div className="mt-4 flex flex-wrap gap-2">
          {q.type === "subjective" ? (
            !revealed ? <button className="btn btn-primary" onClick={() => setRevealed(true)}><ScrollText size={16} /> Lihat Jawapan Cadangan</button> : null
          ) : (
            <button className="btn btn-primary" disabled={q.type === "match" ? Object.keys(matchSel).length < (q.pairs?.length ?? 0) : !sel} onClick={submit}>Semak Jawapan</button>
          )}
          {onNext && <button className="btn btn-ghost" onClick={onNext}>Langkau</button>}
        </div>
      )}

      {q.type === "subjective" && revealed && (
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">⚠️ <b>Jawapan cadangan – {q.status === "diterbitkan" || q.status === "disemak" ? "telah disemak guru" : "BELUM DISEMAK guru penyemak"}.</b> Ia disediakan sebagai panduan ulang kaji dan bukan skema pemarkahan rasmi.</div>
          <div className="rounded-2xl bg-zamrud-50/70 p-4 dark:bg-white/5"><div className="mb-2 text-xs font-bold uppercase tracking-wide text-zamrud-700 dark:text-zamrud-300">Jawapan cadangan</div><RichText text={q.modelAnswer || "(Belum ada jawapan cadangan – menunggu guru.)"} className="text-sm" /></div>
          {!answered && (
            <div>
              <div className="mb-2 text-sm font-semibold">Nilai jawapan anda berbanding jawapan cadangan:</div>
              <div className="flex flex-wrap gap-2">
                <button className="btn bg-zamrud-600 text-white" onClick={() => selfRate(1)}>✅ Tepat sepenuhnya</button>
                <button className="btn bg-emas-400 text-hutan-900" onClick={() => selfRate(0.5)}>🟡 Separa tepat</button>
                <button className="btn bg-rose-500 text-white" onClick={() => selfRate(0)}>❌ Belum tepat</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------- Penerangan jawapan ---------- */}
      {answered && q.type !== "subjective" && (
        <div className="mt-5 space-y-3 pop">
          <div className={cx("relative flex items-start gap-3 rounded-2xl p-4 shadow-lg", result!.correct ? "bg-gradient-to-br from-emerald-500 to-teal-700 text-white" : "bg-gradient-to-br from-rose-500 to-pink-600 text-white")}>
            {result!.correct && result!.score === 1 && <Celebrate />}
            {result!.correct ? <CheckCircle2 className="shrink-0" /> : <XCircle className="shrink-0" />}
            <div>
              <div className="font-bold">{result!.correct ? "Tepat! Barakallahu fik 🎉" : result!.score > 0 ? `Separa betul (${Math.round(result!.score * 100)}%)` : "Belum tepat – mari fahami."}</div>
              {correctText && <div className="text-sm opacity-90">Jawapan sebenar: <RichText text={correctText} className="inline" /></div>}
              {!result!.correct && recordable && <div className="mt-1 text-xs font-semibold opacity-90">🔁 Dimasukkan ke barisan murajaah automatik.</div>}
            </div>
          </div>
          {!result!.correct && (chosenOpt?.why || ex?.confusion) && (
            <Section icon={<XCircle size={16} className="text-rose-500" />} title="Mengapa jawapan anda salah & di mana kekeliruan" open tone="rose">
              {chosenOpt?.why && <p><b>Pilihan anda:</b> {chosenOpt.why}</p>}
              {ex?.confusion && <p className="mt-1"><b>Kekeliruan lazim:</b> {ex.confusion}</p>}
              {q.type === "fill" && <p>Jawapan yang diterima: {(q.answer as string[]).join(" / ")}</p>}
            </Section>
          )}
          <Section icon={<ScrollText size={16} className="text-zamrud-600" />} title="Lihat Syarah Jawapan" open>
            <RichText text={ex?.why ?? "—"} />
            {ex?.concept && <div className="mt-2"><b>Huraian konsep:</b> <RichText text={ex.concept} className="inline" /></div>}
            {ex?.identify && <div className="mt-2"><b>Kaedah mengenal pasti:</b> {ex.identify}</div>}
            {q.options && <div className="mt-3 space-y-1">{q.options.filter((o) => o.why).map((o) => <div key={o.id} className="text-xs"><b>({o.id})</b> {o.why}</div>)}</div>}
            {(ex?.compare || fallbackSec?.perbandingan?.length) && <div className="mt-2"><b>Perbandingan:</b> {ex?.compare ?? fallbackSec!.perbandingan![0]}</div>}
          </Section>
          <Section icon={<KeyRound size={16} className="text-emas-600" />} title="Fahami Dhobit" tone="emas">
            {ex?.dhobit ? <RichText text={ex.dhobit} /> : fallbackSec?.dhobit?.length ? fallbackSec.dhobit.map((d, i) => <div key={i} className="mb-2">{d.arab && <div className="arab-block">{d.arab}</div>}<div>{d.teks}</div></div>) : <p>Tiada dhobit khusus untuk soalan ini.</p>}
          </Section>
          <Section icon={<ListChecks size={16} className="text-sky-600" />} title="Lihat Contoh">
            {ex?.examples?.length ? <ul className="list-disc pl-5">{ex.examples.map((e) => <li key={e}><RichText text={e} /></li>)}</ul> : fallbackSec?.contoh?.length ? fallbackSec.contoh.slice(0, 4).map((c, i) => <div key={i} className="mb-2"><div className="arab-block text-xl">{c.arab}</div><div className="text-xs">{c.hukum ? `${c.hukum} – ` : ""}{c.huraian}{c.ref ? ` (${c.ref})` : ""}</div></div>) : <p>Rujuk nota bab berkaitan.</p>}
          </Section>
          {fallbackSec?.pengukuhan?.length ? <Section icon={<ListChecks size={16} className="text-violet-600" />} title="Soalan pengukuhan"><ul className="list-disc pl-5">{(ch?.sections.flatMap((s) => s.pengukuhan ?? []).slice(0, 3) ?? []).map((p) => <li key={p}>{p}</li>)}</ul></Section> : null}
          {q.source === "jana" && <div className="rounded-xl bg-violet-50 p-3 text-xs text-violet-900 dark:bg-violet-500/10 dark:text-violet-200">✨ Soalan ini dijana automatik daripada nota aplikasi dan <b>belum disemak</b> oleh guru penyemak. Jawapan diambil terus daripada nota; tiada hukum baharu ditambah.</div>}
          {ex?.refs?.length ? <div className="text-xs text-slate-500">Rujukan: {ex.refs.join("; ")} <span className="italic">(nombor halaman belum disahkan)</span></div> : <div className="text-xs text-slate-500">Rujukan: {ch?.refs.map((r) => r.kitab).join("; ")} <span className="italic">(rujukan bab; belum disahkan)</span></div>}
        </div>
      )}

      {answered && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-white/10">
          <Link to={`/nota/${q.chapterId}${q.sectionId ? "#" + q.sectionId : ""}`} className="btn btn-outline"><BookOpen size={16} /> Baca Nota Berkaitan</Link>
          {onSimilar && <button className="btn btn-outline" onClick={onSimilar}><Shuffle size={16} /> Cuba Soalan Serupa</button>}
          <button className="btn btn-outline" onClick={() => { saveForReview(me.id, q.id); toast("Disimpan untuk murajaah"); }}><Bookmark size={16} /> Simpan untuk Murajaah</button>
          {onNext && <button className="btn btn-primary ml-auto" onClick={onNext}>Seterusnya →</button>}
        </div>
      )}
    </div>
  );
}
