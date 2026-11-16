import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Bookmark, Lock } from "lucide-react";
import { useActivation, isChapterUnlocked } from "../lib/activation";
import { DemoBanner } from "../components/Activation";
import { useDb, useMe } from "../lib/store";
import { CHAPTERS, chapterById } from "../data";
import { PageHeader, Progress, Tabs, Empty, TONES, CHAPTER_TONES } from "../components/ui";
import { norm } from "../lib/util";
import { summary } from "../lib/gamification";

export default function Nota() {
  const me = useMe()!; const d = useDb(); const act = useActivation();
  const [q, setQ] = useState(""); const [tab, setTab] = useState<"bab" | "penanda">("bab");
  const stats = summary(d, me.id).stats;
  const results = useMemo(() => {
    const t = norm(q); if (t.length < 2) return [];
    return CHAPTERS.flatMap((c) => c.sections.filter((s) => norm([s.title, s.takrif, s.takrifArab, ...s.huraian, s.ringkas, ...(s.contoh?.map((e) => e.arab + " " + e.huraian) ?? [])].join(" ")).includes(t)).map((s) => ({ c, s }))).slice(0, 30);
  }, [q]);
  const marks = d.bookmarks.filter((b) => b.userId === me.id);
  return (
    <div>
      <PageHeader title="Nota Tajwid" subtitle="12 bab · nota mendalam, ringkas, kad imbas & jadual" icon="📝" />
      <DemoBanner className="mb-4" />
      <div className="relative mb-4"><Search className="absolute left-3 top-3 text-slate-400" size={18} /><input className="input !pl-10" placeholder="Cari nota… (cth: ikhfa, mad lazim, hamzah wasal, قلقلة)" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      {q.length >= 2 ? (
        <div className="space-y-2">{results.length ? results.map(({ c, s }) => <Link key={s.id} to={`/nota/${c.id}#${s.id}`} className="card block p-4 hover:ring-zamrud-300"><div className="text-xs text-emas-700">Bab {c.no}: {c.title}</div><div className="font-semibold">{s.title}</div>{s.ringkas && <div className="text-sm text-slate-500">{s.ringkas}</div>}</Link>) : <Empty title="Tiada padanan" icon="🔍">Cuba kata kunci lain.</Empty>}</div>
      ) : (
        <>
          <Tabs value={tab} onChange={setTab} tabs={[{ id: "bab", label: "Semua bab" }, { id: "penanda", label: <span className="flex items-center gap-1"><Bookmark size={14} /> Penanda</span> }]} />
          {tab === "bab" ? (
            <div className="grid gap-3 md:grid-cols-2">
              {CHAPTERS.map((c, i) => (
                <Link key={c.id} to={`/nota/${c.id}`} className="card flex items-center gap-4 p-4 transition hover:-translate-y-0.5">
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl font-extrabold ${TONES[CHAPTER_TONES[i]].bubble}`}>{c.no}</div>
                  <div className="min-w-0 flex-1"><div className="font-bold">{c.title}</div><div className="truncate text-xs text-slate-500">{c.sections.map((s) => s.title).join(" · ")}</div><Progress value={stats[i].readPct} className="mt-2" /></div>
                  {isChapterUnlocked(c.id, act.active) ? <div className="text-xs font-semibold text-slate-500">{stats[i].readPct}%</div> : <Lock size={16} className="shrink-0 text-amber-600" />}
                </Link>
              ))}
            </div>
          ) : marks.length ? (
            <div className="space-y-2">{marks.map((b) => <Link key={b.id} to={`/nota/${b.chapterId}${b.sectionId ? "#" + b.sectionId : ""}`} className="card flex items-center gap-3 p-4"><Bookmark className="text-zamrud-600" size={18} /><div><div className="font-semibold">{b.label}</div><div className="text-xs text-slate-500">{chapterById(b.chapterId)?.title}</div></div></Link>)}</div>
          ) : <Empty title="Tiada penanda" icon="🔖">Tekan ikon penanda pada mana-mana seksyen nota.</Empty>}
        </>
      )}
    </div>
  );
}
