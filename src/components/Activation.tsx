import { useEffect, useState, useSyncExternalStore } from "react";
import { Lock, KeyRound, CheckCircle2, ShoppingBag } from "lucide-react";
import { activate, useActivation, FREE_CHAPTERS } from "../lib/activation";
import { BUY_URL } from "./brand";
import { CHAPTERS } from "../data";
import { Modal, cx, toast } from "./ui";

// ---------- buka kotak pengaktifan dari mana-mana komponen ----------
let open = false; const ls = new Set<() => void>();
const setOpen = (v: boolean) => { open = v; ls.forEach((l) => l()); };
export const openActivation = () => setOpen(true);
const useOpen = () => useSyncExternalStore((l) => { ls.add(l); return () => { ls.delete(l); }; }, () => open);

const freeNames = CHAPTERS.filter((c) => FREE_CHAPTERS.includes(c.id)).map((c) => `Bab ${c.no}`).join(" & ");

export function ActivationModal() {
  const isOpen = useOpen(); const act = useActivation();
  const [code, setCode] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { if (isOpen) { setErr(""); setCode(""); } }, [isOpen]);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const r = await activate(code); setBusy(false);
    if (r) setErr(r); else { setOpen(false); toast("✅ Versi penuh diaktifkan. Selamat belajar!"); }
  }
  return (
    <Modal open={isOpen} onClose={() => setOpen(false)} title={act.active ? "Versi penuh aktif" : "Aktifkan versi penuh"}>
      {act.active ? (
        <div className="py-2 text-center">
          <CheckCircle2 className="mx-auto mb-2 text-emerald-500" size={48} />
          <p className="font-semibold">Semua 12 bab & soalan tauliah telah dibuka pada peranti ini.</p>
          <button className="btn btn-primary mt-4 w-full" onClick={() => setOpen(false)}>Teruskan belajar</button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="rounded-2xl bg-emas-50 p-3 text-sm text-hutan-900 dark:bg-emas-500/10 dark:text-emas-100">
            Versi demo membuka <b>{freeNames}</b>. Masukkan kod pengaktifan untuk membuka <b>kesemua 12 bab, 1,100+ soalan dan soalan tauliah lepas</b>.
          </div>
          <div>
            <label className="label" htmlFor="kod">Kod pengaktifan</label>
            <input id="kod" className="input text-center font-mono text-lg tracking-widest uppercase" placeholder="PT-XXXX-XXXX-XXXX" autoComplete="off" autoCapitalize="characters" spellCheck={false}
              value={code} onChange={(e) => { setCode(e.target.value); setErr(""); }} autoFocus />
            {err && <p className="mt-2 text-sm font-semibold text-rose-600">{err}</p>}
          </div>
          <button className="btn btn-primary w-full !py-3 text-base" disabled={busy || code.trim().length < 12}><KeyRound size={18} /> {busy ? "Menyemak…" : "Aktifkan"}</button>
          <a href={BUY_URL} className="btn btn-gold w-full"><ShoppingBag size={18} /> Belum ada kod? Dapatkan sekarang</a>
          <p className="text-center text-xs text-slate-500">Satu kod untuk satu peranti — semua profil pada peranti itu turut dibuka.</p>
        </form>
      )}
    </Modal>
  );
}

/** Jalur kecil "versi demo" untuk halaman utama. */
export function DemoBanner({ className }: { className?: string }) {
  const act = useActivation();
  if (act.active || !act.ready) return null;
  return (
    <button onClick={openActivation} className={cx("flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-100 to-amber-50 p-3 text-left ring-1 ring-amber-200 dark:from-amber-500/15 dark:to-amber-500/5 dark:ring-amber-500/20", className)}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-300 text-hutan-900"><Lock size={18} /></span>
      <span className="min-w-0 flex-1 text-sm"><b className="block text-hutan-900 dark:text-amber-100">Versi demo · {freeNames} dibuka</b><span className="text-slate-600 dark:text-amber-200/80">Masukkan kod untuk buka semua 12 bab</span></span>
      <span className="btn btn-gold !px-3 !py-2 text-xs">Aktifkan</span>
    </button>
  );
}

/** Kad kunci untuk kandungan yang memerlukan versi penuh. */
export function LockedCard({ title = "Kandungan versi penuh", children }: { title?: string; children?: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-2 p-6 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-700"><Lock size={26} /></div>
      <div className="text-lg font-extrabold">{title}</div>
      <p className="max-w-sm text-sm text-slate-500">{children ?? "Bahagian ini dibuka dalam versi penuh Pandai Tajwid."}</p>
      <div className="mt-2 grid w-full max-w-xs gap-2">
        <button className="btn btn-primary" onClick={openActivation}><KeyRound size={16} /> Masukkan kod</button>
        <a className="btn btn-gold" href={BUY_URL}><ShoppingBag size={16} /> Dapatkan versi penuh</a>
      </div>
    </div>
  );
}
