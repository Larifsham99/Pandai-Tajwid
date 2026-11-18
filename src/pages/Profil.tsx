import { useState } from "react";
import { Pencil, Download, Upload, Trash2, UserPlus, Check, RotateCcw } from "lucide-react";
import { useDb, useMe, editProfile, switchProfile, deleteProfile, updateSettings, exportJSON, importJSON, resetAll } from "../lib/store";
import { BADGES, LEVELS, summary } from "../lib/gamification";
import { reviewQueue, dueReviews } from "../lib/actions";
import { CHAPTERS } from "../data";
import { BarChart, Card, Modal, Stat, Tabs, cx, toast } from "../components/ui";
import { AVATARS, ProfileForm } from "./Welcome";
import { APP_NAME, CREDIT, VERSION } from "../components/brand";
import { download, fmtDate, timeAgo } from "../lib/util";
import { cloudEnabled } from "../lib/scoreboard";
import { sfx } from "../lib/sound";
import { useActivation, formatCode } from "../lib/activation";

type Tab = "pencapaian" | "kemajuan" | "tetapan";

export default function Profil() {
  const me = useMe()!; const d = useDb(); const act = useActivation();
  const s = summary(d, me.id);
  const [tab, setTab] = useState<Tab>("pencapaian");
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState(me.name);
  const [avatar, setAvatar] = useState(me.avatar);
  const mine = new Map(d.badges.filter((b) => b.userId === me.id).map((b) => [b.badgeId, b.ts]));
  const acts = d.activity.filter((a) => a.userId === me.id).slice(-8).reverse();

  return (
    <div className="space-y-4">
      {/* ---------- Kad profil ---------- */}
      <section className="hero relative overflow-hidden rounded-3xl p-5 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/15 text-4xl ring-2 ring-white/20">{me.avatar}</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2"><h1 className="truncate text-xl font-extrabold">{me.name}</h1><button className="rounded-full p-1.5 hover:bg-white/10" onClick={() => { setName(me.name); setAvatar(me.avatar); setEditing(true); }} aria-label="Sunting profil"><Pencil size={15} /></button></div>
            <div className="text-sm text-emas-200">{s.lvl.level.name} · <span className="font-arab">{s.lvl.level.arab}</span></div>
            <div className="text-xs text-zamrud-100">Ahli sejak {fmtDate(me.createdAt)}</div>
          </div>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-gradient-to-r from-emas-300 to-emas-400" style={{ width: `${s.lvl.progress}%` }} /></div>
        <div className="mt-1 text-[11px] text-zamrud-100">{s.lvl.next ? `${s.lvl.progress}% ke ${s.lvl.next.name} — ${s.lvl.next.desc}` : "Tahap tertinggi dicapai. Masya-Allah!"}</div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Jumlah XP" value={s.xp} icon="⚡" tone="emas" />
        <Stat label="Ketepatan" value={`${s.acc}%`} icon="🎯" hint={`${s.answered} dijawab`} />
        <Stat label="Istiqamah" value={`${s.streak} hari`} icon="🔥" tone="rose" />
        <Stat label="Murajaah" value={reviewQueue(d, me.id).length} icon="🔁" hint={`${dueReviews(d, me.id).length} perlu diulang sekarang`} tone="violet" />
      </div>

      <Card id="profil" className="p-4">
        <div className="mb-2 flex items-center justify-between"><div className="font-bold">Profil pada peranti ini <span className="text-xs font-normal text-slate-500">({d.profiles.length})</span></div><button className="btn btn-primary !py-1.5 text-xs" onClick={() => setAdding(true)}><UserPlus size={14} /> Tambah profil</button></div>
        <div className="space-y-1">
          {d.profiles.map((p) => (
            <div key={p.id} className={cx("flex items-center gap-3 rounded-xl px-2 py-2", p.id === me.id && "bg-zamrud-50 dark:bg-zamrud-500/10")}>
              <span className="text-2xl">{p.avatar}</span><span className="min-w-0 flex-1 truncate font-semibold">{p.name}</span>
              {p.id === me.id ? <span className="chip bg-zamrud-100 text-zamrud-800"><Check size={12} /> Aktif</span> : <button className="btn btn-outline !py-1 text-xs" onClick={() => { switchProfile(p.id); toast(`Bertukar ke ${p.name}`); }}>Guna</button>}
              {d.profiles.length > 1 && <button className="rounded-lg p-1.5 text-slate-400 hover:text-merah-600" aria-label={`Padam ${p.name}`} onClick={() => { if (confirm(`Padam profil "${p.name}" dan semua rekodnya?`)) deleteProfile(p.id); }}><Trash2 size={16} /></button>}
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">Tiada had bilangan profil. Tukar profil pantas dengan menekan avatar di bahagian atas skrin.</p>
      </Card>

      <Tabs value={tab} onChange={setTab} tabs={[{ id: "pencapaian", label: "Lencana" }, { id: "kemajuan", label: "Kemajuan" }, { id: "tetapan", label: "Tetapan" }]} />

      {tab === "pencapaian" && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {BADGES.map((b) => { const ts = mine.get(b.id); return (
              <Card key={b.id} className={cx("p-4 text-center", !ts && "opacity-55 grayscale")}>
                <div className={cx("mx-auto grid h-14 w-14 place-items-center rounded-full text-3xl", ts ? "bg-gradient-to-br from-emas-200 to-emas-400 shadow-md shadow-emas-400/30" : "bg-slate-100 dark:bg-white/10")}>{b.icon}</div>
                <div className="mt-2 text-sm font-bold">{b.name}</div>
                <div className="text-[11px] text-slate-500">{b.desc}</div>
                {ts && <div className="mt-1 text-[10px] font-semibold text-zamrud-700 dark:text-zamrud-300">✓ {fmtDate(ts)}</div>}
              </Card>
            ); })}
          </div>
          <Card className="p-4">
            <div className="mb-2 font-bold">Tahap pembelajaran</div>
            <div className="space-y-2">{LEVELS.map((l, i) => <div key={l.id} className={cx("flex items-center gap-3 rounded-xl p-2", i === s.lvl.idx && "bg-zamrud-50 ring-1 ring-zamrud-200 dark:bg-zamrud-500/10 dark:ring-zamrud-800")}><span className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold", i <= s.lvl.idx ? "bg-zamrud-600 text-white" : "bg-slate-100 text-slate-500 dark:bg-white/10")}>{i + 1}</span><div className="min-w-0"><div className="text-sm font-semibold">{l.name} <span className="font-arab text-emas-600">{l.arab}</span></div><div className="text-xs text-slate-500">{l.desc}</div></div></div>)}</div>
          </Card>
        </>
      )}

      {tab === "kemajuan" && (
        <>
          <Card className="p-4"><div className="mb-3 font-bold">Ketepatan mengikut bab <span className="text-xs font-normal text-slate-500">(20 cubaan terkini)</span></div><BarChart data={CHAPTERS.map((c, i) => ({ label: `${c.no}. ${c.title}`, value: s.stats[i].acc }))} /></Card>
          <Card className="p-4"><div className="mb-3 font-bold">Bacaan nota</div><BarChart data={CHAPTERS.map((c, i) => ({ label: `${c.no}. ${c.title}`, value: s.stats[i].readPct, tone: "bg-biru-500" }))} /><p className="mt-3 text-xs text-slate-500">Bab dikuasai: baca semua seksyen nota, ≥ 8 cubaan dan ketepatan ≥ 80%. Dikuasai: <b>{s.mastered}/12</b>.</p></Card>
          <Card className="p-4"><div className="mb-2 font-bold">Aktiviti terkini</div>{acts.length ? acts.map((a) => <div key={a.id} className="flex justify-between gap-3 border-t border-slate-100 py-2 text-sm first:border-0 dark:border-white/5"><span>{a.text}</span><span className="shrink-0 text-xs text-slate-400">{timeAgo(a.ts)}</span></div>) : <p className="text-sm text-slate-500">Belum ada aktiviti.</p>}</Card>
        </>
      )}

      {tab === "tetapan" && (
        <>
          <Card className="space-y-4 p-4">
            <div>
              <div className="label">Tema</div>
              <div className="flex gap-2">{(["system", "light", "dark"] as const).map((t) => <button key={t} onClick={() => updateSettings({ theme: t })} className={cx("btn flex-1", d.settings.theme === t ? "btn-primary" : "btn-ghost")}>{t === "system" ? "Ikut peranti" : t === "light" ? "Cerah" : "Gelap"}</button>)}</div>
            </div>
            <div>
              <div className="label">Saiz tulisan Arab ({d.settings.arabicSize}px)</div>
              <input type="range" min={20} max={40} value={d.settings.arabicSize} onChange={(e) => updateSettings({ arabicSize: Number(e.target.value) })} className="w-full accent-zamrud-600" />
              <div className="arab-block">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
            </div>
            <div>
              <div className="label">Sasaran harian</div>
              <div className="flex flex-wrap gap-2">{[10, 20, 30, 50].map((n) => <button key={n} onClick={() => updateSettings({ dailyGoal: n })} className={cx("btn", d.settings.dailyGoal === n ? "btn-primary" : "btn-ghost")}>{n} soalan</button>)}</div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <input id="bunyi" type="checkbox" className="mt-1 h-4 w-4 accent-zamrud-600" checked={d.settings.sound} onChange={(e) => { updateSettings({ sound: e.target.checked }); if (e.target.checked) setTimeout(() => sfx.correct(), 50); }} />
              <label htmlFor="bunyi" className="flex-1"><b>Kesan bunyi</b><br /><span className="text-xs text-slate-500">Bunyi loceng lembut ketika mengetik, menjawab betul/salah, mendapat lencana & tamat sesi.</span></label>
              {d.settings.sound && <span data-nosound className="flex gap-1"><button className="btn btn-ghost !px-2 !py-1 text-xs" onClick={() => sfx.correct()}>✓ Betul</button><button className="btn btn-ghost !px-2 !py-1 text-xs" onClick={() => sfx.wrong()}>✗ Salah</button></span>}
            </div>
            <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1 h-4 w-4 accent-zamrud-600" checked={d.settings.includeGenerated} onChange={(e) => updateSettings({ includeGenerated: e.target.checked })} /><span><b>Sertakan soalan dijana daripada nota</b><br /><span className="text-xs text-slate-500">Soalan objektif tambahan berlabel “belum disemak”. Jawapan diambil terus daripada nota.</span></span></label>
          </Card>

          <Card className="space-y-3 p-4">
            <div className="font-bold">Data & sandaran</div>
            <p className="text-xs text-slate-500">Semua rekod disimpan <b>dalam pelayar peranti ini</b>{cloudEnabled ? "; ringkasan skor turut dihantar ke papan skor dalam talian" : ""}. Simpan sandaran untuk berpindah peranti.</p>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-outline" onClick={() => download(`pandai-tajwid-${new Date().toISOString().slice(0, 10)}.json`, exportJSON(), "application/json")}><Download size={16} /> Eksport sandaran</button>
              <label className="btn btn-outline cursor-pointer"><Upload size={16} /> Import sandaran<input type="file" accept="application/json" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const err = importJSON(await f.text()); toast(err ?? "Sandaran dipulihkan", err ? "err" : "ok"); }} /></label>
              <button className="btn btn-danger" onClick={() => { if (confirm("Padam SEMUA data aplikasi pada peranti ini? Tindakan ini tidak boleh dibatalkan.")) resetAll(); }}><RotateCcw size={16} /> Set semula</button>
            </div>
          </Card>

          <Card className="p-4 text-center text-sm">
            <div className="font-bold">{APP_NAME} <span className="text-xs font-normal text-slate-400">v{VERSION}</span></div>
            <div className="text-slate-500">Aplikasi ini dibangunkan oleh <b>{CREDIT}</b>.</div>
            {act.code && <div className="mt-2 font-mono text-xs text-zamrud-700 dark:text-zamrud-300">✅ Diaktifkan · {formatCode(act.code).slice(0, 8)}-••••-••••</div>}
            <div className="mt-2 text-xs text-slate-400">Kandungan nota & soalan latihan berstatus “belum disemak” sehingga disahkan guru penyemak. Rujukan kitab dinyatakan tanpa nombor halaman kerana belum disahkan.</div>
          </Card>
        </>
      )}

      <Modal open={editing} onClose={() => setEditing(false)} title="Sunting profil">
        <div className="space-y-4">
          <div><label className="label" htmlFor="ename">Nama paparan</label><input id="ename" className="input text-base" maxLength={40} value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="grid grid-cols-8 gap-2">{AVATARS.map((a) => <button key={a} onClick={() => setAvatar(a)} className={cx("grid aspect-square place-items-center rounded-xl text-2xl ring-1", a === avatar ? "bg-zamrud-100 ring-2 ring-zamrud-600" : "ring-slate-200 dark:ring-white/10")}>{a}</button>)}</div>
          <button className="btn btn-primary w-full" disabled={!name.trim()} onClick={() => { editProfile(me.id, { name: name.trim(), avatar }); setEditing(false); toast("Profil dikemas kini"); }}>Simpan</button>
        </div>
      </Modal>
      <Modal open={adding} onClose={() => setAdding(false)} title="Tambah profil baharu"><ProfileForm submitLabel="Cipta & guna profil" onDone={() => { setAdding(false); toast("Profil baharu dicipta"); }} /></Modal>
    </div>
  );
}
