import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Bookmark, Check, Dumbbell, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { useDb, useMe } from "../lib/store";
import { markSectionRead, toggleBookmark } from "../lib/actions";
import { CHAPTERS, chapterById } from "../data";
import { Arabic, Card, PageHeader, Progress, RichText, Tabs, cx, toast, Empty } from "../components/ui";
import { refLabel } from "../data/refs";
import type { NoteSection } from "../types";

type View = "mendalam" | "ringkas" | "flashcard" | "jadual" | "peta" | "rujukan";

function SectionView({ s, chId, read, onRead }: { s: NoteSection; chId: string; read: boolean; onRead: () => void }) {
  const me = useMe()!; const d = useDb();
  const bm = d.bookmarks.some((b) => b.userId === me.id && b.chapterId === chId && b.sectionId === s.id);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el || read) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { const t = setTimeout(onRead, 6000); (el as any)._t = t; } else clearTimeout((el as any)._t); }, { threshold: 0.6 });
    const end = el.querySelector("[data-end]"); if (end) io.observe(end);
    return () => io.disconnect();
  }, [read, onRead]);
  const H = ({ n, children }: { n: string; children: React.ReactNode }) => <div className="mt-4"><div className="mb-1 text-xs font-bold uppercase tracking-wide text-emas-700 dark:text-emas-300">{n}</div>{children}</div>;
  return (
    <div id={s.id} ref={ref} className="card scroll-mt-20 p-4 sm:p-6">
      <div className="flex items-start gap-2">
        <h2 className="flex-1 text-lg font-extrabold text-hutan-900 dark:text-white">{s.title}</h2>
        <button title="Penanda" className={cx("rounded-lg p-2 no-print", bm ? "text-zamrud-600" : "text-slate-400")} onClick={() => toggleBookmark(me.id, chId, s.id, s.title)}><Bookmark size={18} fill={bm ? "currentColor" : "none"} /></button>
      </div>
      {s.takrif && <H n="Takrif"><RichText text={s.takrif} /></H>}
      {s.takrifArab && <H n="Takrif Arab"><Arabic>{s.takrifArab}</Arabic></H>}
      {s.maksud && <H n="Maksud"><p>{s.maksud}</p></H>}
      <H n="Huraian">{s.huraian.map((h, i) => <RichText key={i} text={h} className="mb-2" />)}</H>
      {s.dhobit?.length ? <H n="Dhobit / kaedah mengingat"><div className="space-y-2">{s.dhobit.map((x, i) => <div key={i} className="rounded-2xl bg-emas-50 p-3 dark:bg-emas-500/10">{x.arab && <div className="arab-block text-hutan-900 dark:text-emas-100">{x.arab}</div>}<div className="text-sm font-semibold">🔑 {x.teks}</div></div>)}</div></H> : null}
      {s.pembahagian?.length ? <H n="Pembahagian"><ul className="space-y-1">{s.pembahagian.map((p) => <li key={p.nama}><b>{p.nama}</b> – <RichText text={p.ket} className="inline" /></li>)}</ul></H> : null}
      {s.jadual && <H n={s.jadual.caption ?? "Jadual ringkasan"}><div className="overflow-x-auto rounded-xl ring-1 ring-slate-100 dark:ring-white/10"><table className="tbl"><thead><tr>{s.jadual.head.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{s.jadual.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><RichText text={c} /></td>)}</tr>)}</tbody></table></div></H>}
      {s.contoh?.length ? <H n="Contoh ayat al-Quran"><div className="grid gap-2 sm:grid-cols-2">{s.contoh.map((c, i) => <div key={i} className="rounded-2xl bg-krim-50 p-3 ring-1 ring-emas-200 dark:bg-white/5 dark:ring-emas-500/20"><div className="arab-block text-xl">{c.arab}</div><div className="text-xs">{c.hukum && <b>{c.hukum}: </b>}{c.huraian}{c.ref && <span className="text-emas-700"> ({c.ref})</span>}</div></div>)}</div></H> : null}
      {s.caraBaca && <H n="Cara membaca"><RichText text={s.caraBaca} /></H>}
      {s.kesalahan?.length ? <H n="Kesalahan lazim"><ul className="list-disc space-y-1 pl-5 text-merah-700 dark:text-merah-300">{s.kesalahan.map((k) => <li key={k}>{k}</li>)}</ul></H> : null}
      {s.perbandingan?.length ? <H n="Perbandingan dengan hukum lain">{s.perbandingan.map((p) => <RichText key={p} text={p} className="mb-1" />)}</H> : null}
      {s.pengukuhan?.length ? <H n="Soalan pengukuhan"><ol className="list-decimal space-y-1 pl-5">{s.pengukuhan.map((p) => <li key={p}>{p}</li>)}</ol></H> : null}
      <div data-end className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 no-print dark:border-white/10">
        {read ? <span className="chip bg-zamrud-100 text-zamrud-800 dark:bg-zamrud-500/20 dark:text-zamrud-200"><Check size={12} /> Telah dibaca</span> : <button className="btn btn-primary !py-1.5 text-xs" onClick={onRead}><Check size={14} /> Tandakan dibaca (+5 XP)</button>}
      </div>
    </div>
  );
}

function Flashcards({ cards }: { cards: { front: string; back: string }[] }) {
  const [i, setI] = useState(0); const [flip, setFlip] = useState(false);
  if (!cards.length) return <Empty title="Tiada kad imbas" />;
  const c = cards[i];
  return (
    <div className="mx-auto max-w-lg">
      <button onClick={() => setFlip(!flip)} className={cx("card motif grid min-h-[220px] w-full place-items-center p-8 text-center transition", flip && "bg-zamrud-700 text-white")}>
        <div><div className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">{flip ? "Jawapan" : "Soalan"} · {i + 1}/{cards.length}</div><RichText text={flip ? c.back : c.front} className="text-lg font-semibold" /></div>
      </button>
      <div className="mt-3 flex justify-between"><button className="btn btn-ghost" disabled={i === 0} onClick={() => { setI(i - 1); setFlip(false); }}><ChevronLeft size={16} /> Sebelum</button><button className="btn btn-ghost" onClick={() => setFlip(!flip)}><RotateCw size={16} /> Balik</button><button className="btn btn-ghost" disabled={i === cards.length - 1} onClick={() => { setI(i + 1); setFlip(false); }}>Seterusnya <ChevronRight size={16} /></button></div>
    </div>
  );
}

export default function NotaBab() {
  const { id = "b1" } = useParams(); const loc = useLocation();
  const me = useMe()!; const d = useDb();
  const ch = chapterById(id);
  const [view, setView] = useState<View>("mendalam");
  useEffect(() => { const h = decodeURIComponent(loc.hash.slice(1)); if (h) setTimeout(() => document.getElementById(h)?.scrollIntoView({ behavior: "smooth" }), 150); }, [loc.hash, id]);
  if (!ch) return <Empty title="Bab tidak dijumpai" />;
  const np = d.notes.find((n) => n.userId === me.id && n.chapterId === ch.id);
  const read = new Set(np?.read ?? []);
  const pct = Math.round((ch.sections.filter((s) => read.has(s.id)).length / ch.sections.length) * 100);
  const idx = CHAPTERS.indexOf(ch);
  const markRead = (sid: string) => { if (!read.has(sid)) { markSectionRead(me.id, ch.id, sid); toast("Seksyen ditanda dibaca · +5 XP"); } };

  return (
    <div>
      <div className="mb-2 text-sm no-print"><Link to="/nota" className="text-zamrud-700 dark:text-zamrud-300">← Semua nota</Link></div>
      <PageHeader title={`Bab ${ch.no}: ${ch.title}`} subtitle={ch.summary} icon={<span className="font-arab">{ch.icon}</span>} actions={<>
        <Link to={`/latih/sesi?mode=rawak&bab=${ch.id}&n=10`} className="btn btn-primary"><Dumbbell size={16} /> Latih tubi bab ini</Link>
      </>} />
            <div className="mb-4 flex items-center gap-3 no-print"><div className="font-arab text-2xl text-zamrud-700 dark:text-zamrud-300" dir="rtl">{ch.arabTitle}</div><div className="flex-1"><Progress value={pct} /></div><span className="text-xs font-semibold">{pct}% dibaca</span></div>
      <Tabs value={view} onChange={setView} tabs={[{ id: "mendalam", label: "Nota mendalam" }, { id: "ringkas", label: "Nota ringkas" }, { id: "flashcard", label: "Kad imbas" }, { id: "jadual", label: "Jadual" }, { id: "peta", label: "Peta minda" }, { id: "rujukan", label: "Rujukan" }]} />
      <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
        <div className="min-w-0 space-y-4">
          {view === "mendalam" && <>
            {ch.sections.map((s) => <SectionView key={s.id} s={s} chId={ch.id} read={read.has(s.id)} onRead={() => markRead(s.id)} />)}
 
            <div className="flex justify-between gap-2">{idx > 0 ? <Link className="btn btn-ghost" to={`/nota/${CHAPTERS[idx - 1].id}`}>← Bab {idx}</Link> : <span />}{idx < CHAPTERS.length - 1 && <Link className="btn btn-ghost" to={`/nota/${CHAPTERS[idx + 1].id}`}>Bab {idx + 2} →</Link>}</div>
          </>}
          {view === "ringkas" && <Card className="p-5"><ul className="space-y-3">{ch.sections.map((s) => <li key={s.id}><div className="font-bold">{s.title}</div><RichText text={s.ringkas ?? s.huraian[0]} className="text-sm" /></li>)}</ul></Card>}
          {view === "flashcard" && <Flashcards cards={ch.flashcards} />}
          {view === "jadual" && (ch.sections.filter((s) => s.jadual).length ? ch.sections.filter((s) => s.jadual).map((s) => <Card key={s.id} className="overflow-x-auto p-4"><div className="mb-2 font-bold">{s.jadual!.caption ?? s.title}</div><table className="tbl"><thead><tr>{s.jadual!.head.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{s.jadual!.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><RichText text={c} /></td>)}</tr>)}</tbody></table></Card>) : <Empty title="Tiada jadual" />)}
          {view === "peta" && (
            <Card className="motif overflow-x-auto p-6">
              <div className="mx-auto mb-6 w-fit rounded-2xl bg-hutan-900 px-5 py-3 text-center font-bold text-emas-200">{ch.mindmap.root}</div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{ch.mindmap.branches.map((b) => <div key={b.label} className="rounded-2xl bg-white p-4 ring-2 ring-zamrud-200 dark:bg-hutan-950 dark:ring-zamrud-800"><div className="mb-2 font-bold text-zamrud-800 dark:text-zamrud-200">{b.label}</div><div className="flex flex-wrap gap-1.5">{b.leaves.map((l) => <span key={l} className="chip bg-emas-50 text-hutan-900 dark:bg-emas-500/10 dark:text-emas-100"><RichText text={l} /></span>)}</div></div>)}</div>
            </Card>
          )}
          {view === "rujukan" && <Card className="p-5"><ul className="space-y-3">{ch.refs.map((r0) => { const r = r0; return <li key={r.kitab} className="text-sm"><div className="font-semibold">{refLabel(r)}</div><div className="text-xs"><span className={cx("chip", r.status === "disahkan" ? "bg-zamrud-100 text-zamrud-800" : "bg-emas-100 text-emas-800")}>{r.status === "disahkan" ? "Disahkan" : "Belum disahkan"}</span> {r.penyemak ? `Guru penyemak: ${r.penyemak}` : "Guru penyemak: belum ditetapkan"}{!r.halaman && " · Nombor halaman tidak dinyatakan kerana belum disahkan."}</div></li>; })}</ul></Card>}
        </div>
        <aside className="hidden lg:block no-print">
          <div className="sticky top-6 card p-4 text-sm">
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Kandungan</div>
            {ch.sections.map((s) => <a key={s.id} href={`#/nota/${ch.id}#${s.id}`} onClick={(e) => { e.preventDefault(); setView("mendalam"); setTimeout(() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }), 50); }} className="flex items-center gap-2 py-1 hover:text-zamrud-700">{read.has(s.id) ? <Check size={14} className="text-zamrud-600" /> : <span className="h-3.5 w-3.5 rounded-full border border-slate-300" />}<span className="truncate">{s.title}</span></a>)}
            <div className="mt-4 flex justify-between gap-2">{idx > 0 && <Link className="btn btn-ghost !px-2 !py-1.5 text-xs" to={`/nota/${CHAPTERS[idx - 1].id}`}>← Bab {idx}</Link>}{idx < CHAPTERS.length - 1 && <Link className="btn btn-ghost ml-auto !px-2 !py-1.5 text-xs" to={`/nota/${CHAPTERS[idx + 1].id}`}>Bab {idx + 2} →</Link>}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
