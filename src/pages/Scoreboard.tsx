import { useEffect, useState } from "react";
import { Cloud, Smartphone, UserPlus } from "lucide-react";
import { useDb } from "../lib/store";
import type { Board, BoardRow } from "../lib/gamification";
import { cloudEnabled, fetchBoard, pushScore } from "../lib/scoreboard";
import { Card, Empty, PageHeader, Tabs, cx } from "../components/ui";
import { ProfileSheet } from "../components/Layout";

const BOARDS: { id: Board; label: string }[] = [
  { id: "keseluruhan", label: "Keseluruhan" },
  { id: "mingguan", label: "Minggu ini" },
  { id: "ketepatan", label: "Ketepatan" },
  { id: "istiqamah", label: "Istiqamah" },
];
const MEDAL = ["🥇", "🥈", "🥉"];

export default function Scoreboard() {
  const d = useDb();
  const [board, setBoard] = useState<Board>("keseluruhan");
  const [adding, setAdding] = useState(false);
  const [data, setData] = useState<{ rows: BoardRow[]; source: "tempatan" | "awan" } | null>(null);
  useEffect(() => { let live = true; (async () => { await pushScore(); const r = await fetchBoard(board); if (live) setData(r); })(); return () => { live = false; }; }, [board, d]);
  const rows = data?.rows ?? [];
  const top = rows.slice(0, 3);
  const podium = [top[1], top[0], top[2]];

  return (
    <div>
      <PageHeader title="Scoreboard" subtitle={data?.source === "awan" ? "Kedudukan dalam talian" : "Kedudukan profil pada peranti ini"} icon="🏆" />
      <div className={cx("mb-4 flex items-start gap-2 rounded-2xl p-3 text-xs", data?.source === "awan" ? "bg-biru-50 text-biru-900 dark:bg-biru-500/10 dark:text-biru-200" : "bg-emas-50 text-emas-900 dark:bg-emas-500/10 dark:text-emas-200")}>
        {data?.source === "awan" ? <Cloud size={16} className="shrink-0" /> : <Smartphone size={16} className="shrink-0" />}
        <div>{data?.source === "awan" ? "Skor anda disegerakkan ke papan skor dalam talian." : cloudEnabled ? "Tidak dapat menyambung ke pelayan — memaparkan kedudukan tempatan." : <>Mod <b>tempatan</b>: papan skor menyenaraikan semua profil pada peranti ini (sesuai untuk keluarga/kelas yang berkongsi telefon). Papan skor dalam talian boleh diaktifkan kemudian.</>}</div>
      </div>
      <Tabs tabs={BOARDS} value={board} onChange={setBoard} />

      {!rows.length ? <Empty title="Belum ada kedudukan" icon="🏁">Jawab beberapa soalan untuk muncul di papan skor.</Empty> : (
        <>
          {rows.length >= 2 && (
            <div className="mb-4 grid grid-cols-3 items-end gap-2">
              {podium.map((r, i) => r ? (
                <div key={r.id} className={cx("card flex flex-col items-center p-3 text-center", i === 1 ? "pb-6 pt-4 ring-2 ring-emas-300" : "")}>
                  <div className="text-2xl">{MEDAL[r.rank - 1]}</div>
                  <div className="mt-1 grid h-12 w-12 place-items-center rounded-full bg-zamrud-50 text-2xl dark:bg-white/10">{r.avatar}</div>
                  <div className="mt-1 w-full truncate text-sm font-bold">{r.name}</div>
                  <div className="text-[11px] text-slate-500">{r.label}</div>
                </div>
              ) : <div key={i} />)}
            </div>
          )}
          <Card className="divide-y divide-slate-100 overflow-hidden dark:divide-white/5">
            {rows.map((r) => (
              <div key={r.id} className={cx("flex items-center gap-3 px-4 py-3", r.me && "bg-zamrud-50 dark:bg-zamrud-500/10")}>
                <div className="w-7 text-center text-sm font-extrabold text-slate-500">{MEDAL[r.rank - 1] ?? r.rank}</div>
                <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-lg dark:bg-white/10">{r.avatar}</div>
                <div className="min-w-0 flex-1"><div className="truncate font-semibold">{r.name}{r.me && <span className="ml-1 text-xs text-zamrud-700 dark:text-zamrud-300">(anda)</span>}</div></div>
                <div className="text-right text-sm font-bold tabular-nums">{r.label}</div>
              </div>
            ))}
          </Card>
        </>
      )}
      {data?.source !== "awan" && <div className="mt-4 text-center"><button className="btn btn-outline" onClick={() => setAdding(true)}><UserPlus size={16} /> Tambah profil pada peranti ini</button></div>}
      <ProfileSheet open={adding} onClose={() => setAdding(false)} startAdding />
    </div>
  );
}
