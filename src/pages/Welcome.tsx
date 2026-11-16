import { useState } from "react";
import { createProfile } from "../lib/store";
import { Logo, CREDIT } from "../components/Layout";
import { cx } from "../components/ui";
import { SEED_QUESTIONS } from "../data";

export const AVATARS = ["🧕", "🧑", "👦", "👧", "🧔", "👨", "👩", "🧒", "🌙", "⭐", "🌿", "📖", "🕌", "🦁", "🐪", "🌸"];

export function ProfileForm({ onDone, submitLabel = "Mula belajar" }: { onDone?: () => void; submitLabel?: string }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; createProfile(name, avatar); onDone?.(); }} className="space-y-4">
      <div>
        <label className="label" htmlFor="nama">Nama paparan</label>
        <input id="nama" className="input text-base" placeholder="cth: Ahmad" maxLength={40} value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      </div>
      <div>
        <div className="label">Pilih avatar</div>
        <div className="grid grid-cols-8 gap-2">{AVATARS.map((a) => <button type="button" key={a} onClick={() => setAvatar(a)} className={cx("grid aspect-square place-items-center rounded-xl text-2xl ring-1 transition", a === avatar ? "bg-zamrud-100 ring-2 ring-zamrud-600 dark:bg-zamrud-500/20" : "ring-slate-200 dark:ring-white/10")}>{a}</button>)}</div>
      </div>
      <button className="btn btn-primary w-full !py-3 text-base" disabled={!name.trim()}>{submitLabel}</button>
    </form>
  );
}

export default function Welcome() {
  const objective = SEED_QUESTIONS.filter((q) => q.type !== "subjective").length;
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-8">
      <div className="mb-6 flex justify-center"><Logo className="scale-125" /></div>
      <div className="hero mb-5 rounded-3xl p-6 text-center text-white shadow-xl">
        <div className="font-arab text-4xl text-emas-200" dir="rtl">وَرَتِّلِ ٱلْقُرْءَانَ تَرْتِيلًا</div>
        <div className="mt-1 text-xs text-emerald-100">(al-Muzzammil:4)</div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-white/10 p-2"><div className="text-xl font-extrabold">{objective}+</div><div className="text-[10px] text-emerald-100">soalan latih tubi</div></div>
          <div className="rounded-2xl bg-white/10 p-2"><div className="text-xl font-extrabold">12</div><div className="text-[10px] text-emerald-100">bab nota</div></div>
          <div className="rounded-2xl bg-white/10 p-2"><div className="text-xl font-extrabold">🔁</div><div className="text-[10px] text-emerald-100">murajaah automatik</div></div>
        </div>
      </div>
      <div className="card p-5">
        <h1 className="mb-1 text-lg font-extrabold">Ahlan wa sahlan! 👋</h1>
        <p className="mb-4 text-sm text-slate-500">Tiada pendaftaran diperlukan. Data anda disimpan dalam peranti ini.</p>
        <ProfileForm />
      </div>
      <p className="mt-6 text-center text-xs text-slate-400">Aplikasi ini dibangunkan oleh <b>{CREDIT}</b></p>
    </div>
  );
}
