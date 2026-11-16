import { useState } from "react";
import { KeyRound, ShoppingBag, PlayCircle } from "lucide-react";
import { activate } from "../lib/activation";
import { Logo, BUY_URL, DEMO_URL, CREDIT } from "./brand";

/**
 * Skrin kunci aplikasi: tanpa kod pengaktifan yang sah, aplikasi tidak boleh digunakan.
 * Demo untuk bakal pembeli tersedia di halaman jualan (/jualan/#demo).
 */
export function ActivationGate() {
  const [code, setCode] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const r = await activate(code); setBusy(false);
    if (r) setErr(r);
  }
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-8">
      <div className="mb-6 flex justify-center"><Logo className="scale-125" /></div>
      <div className="hero mb-5 rounded-3xl p-6 text-center text-white shadow-xl">
        <div className="font-arab text-4xl text-emas-200" dir="rtl">وَرَتِّلِ ٱلْقُرْءَانَ تَرْتِيلًا</div>
        <div className="mt-1 text-xs text-emerald-100">(al-Muzzammil:4)</div>
        <p className="mt-3 text-sm text-emerald-50">1,100+ soalan latih tubi · nota 12 bab · murajaah automatik · boleh guna tanpa internet</p>
      </div>
      <form onSubmit={submit} className="card space-y-4 p-5">
        <div>
          <h1 className="text-lg font-extrabold">Masukkan kod pengaktifan</h1>
          <p className="text-sm text-slate-500">Kod dihantar kepada anda selepas pembelian. Atau tekan sahaja pautan aktivasi yang diberikan.</p>
        </div>
        <input id="kod" aria-label="Kod pengaktifan" className="input text-center font-mono text-lg tracking-widest uppercase" placeholder="PT-XXXX-XXXX-XXXX" autoComplete="off" autoCapitalize="characters" spellCheck={false}
          value={code} onChange={(e) => { setCode(e.target.value); setErr(""); }} autoFocus />
        {err && <p className="text-sm font-semibold text-rose-600">{err}</p>}
        <button className="btn btn-primary w-full !py-3 text-base" disabled={busy || code.trim().length < 12}><KeyRound size={18} /> {busy ? "Menyemak…" : "Aktifkan"}</button>
        <div className="grid grid-cols-2 gap-2">
          <a href={BUY_URL} className="btn btn-gold !px-2"><ShoppingBag size={16} /> Dapatkan kod</a>
          <a href={DEMO_URL} className="btn btn-ghost !px-2"><PlayCircle size={16} /> Cuba demo</a>
        </div>
        <p className="text-center text-xs text-slate-500">Satu kod untuk satu peranti — semua profil pada peranti itu turut dibuka.</p>
      </form>
      <p className="mt-6 text-center text-xs text-slate-400">Aplikasi ini dibangunkan oleh <b>{CREDIT}</b></p>
    </div>
  );
}
