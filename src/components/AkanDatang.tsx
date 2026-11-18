import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Lock, Sparkles } from "lucide-react";
import { AKAN_DATANG, type Teaser } from "../data/akanDatang";
import { Modal } from "./ui";

/** Bahagian "Akan Datang" (trailer modul qiraat) untuk halaman Nota. */
export default function AkanDatang() {
  const [open, setOpen] = useState<Teaser | null>(null);
  const loc = useLocation(); const ref = useRef<HTMLElement>(null);
  useEffect(() => { if (loc.hash === "#akan-datang") setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120); }, [loc.hash]);
  return (
    <section id="akan-datang" ref={ref} className="mt-6 scroll-mt-20">
      <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 px-1">
        <Sparkles size={18} className="text-emas-500" />
        <h2 className="whitespace-nowrap text-base font-extrabold text-hutan-900 dark:text-krim-50">Akan Datang</h2>
        <span className="chip whitespace-nowrap bg-emas-50 text-emas-700 ring-1 ring-inset ring-emas-200">Modul Qiraat</span>
        <span className="chip whitespace-nowrap bg-zamrud-50 text-zamrud-700 ring-1 ring-inset ring-zamrud-200">🎁 Percuma untuk pembeli</span>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {AKAN_DATANG.map((t) => (
          <button key={t.id} onClick={() => setOpen(t)} className="hero relative overflow-hidden rounded-3xl p-4 text-left text-white transition active:scale-[.98]">
            <span className="absolute right-3 top-3 chip bg-emas-300/20 text-[10px] uppercase tracking-[.14em] text-emas-200 ring-1 ring-inset ring-emas-300/40"><Lock size={10} /> Akan datang</span>
            <div className="text-3xl">{t.icon}</div>
            <div className="mt-2 font-arab text-lg text-emas-200" dir="rtl">{t.arabTitle}</div>
            <div className="text-base font-extrabold">{t.title}</div>
            <p className="mt-1 text-xs leading-relaxed text-krim-100/80">{t.tagline}</p>
            <div className="mt-3 text-xs font-bold text-emas-200">Lihat pratonton →</div>
          </button>
        ))}
      </div>
      <p className="mt-2 px-1 text-[11px] text-slate-500">Insya-Allah dalam perancangan. <b className="text-zamrud-700 dark:text-zamrud-300">Percuma untuk pembeli sedia ada</b> — dikemas kini terus dalam aplikasi ini. Kandungan penuh akan ditulis & disemak guru sebelum diterbitkan.</p>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open ? `${open.icon} ${open.title}` : ""}>
        {open && (
          <div className="space-y-4">
            <div className="hero rounded-2xl p-4 text-center text-white">
              <div className="font-arab text-2xl text-emas-200" dir="rtl">{open.arabTitle}</div>
              <p className="mt-1 text-sm text-krim-100/85">{open.tagline}</p>
            </div>
            <div>
              <div className="label">Apa yang akan anda pelajari</div>
              <ul className="space-y-1.5 text-sm">{open.points.map((p) => <li key={p} className="flex gap-2"><span className="text-emas-500">✦</span>{p}</li>)}</ul>
            </div>
            {open.preview && (
              <div>
                <div className="label">{open.preview.caption}</div>
                <div className="overflow-hidden rounded-2xl ring-1 ring-emas-200/70 dark:ring-white/10">
                  <table className="tbl"><thead><tr><th>Imam</th><th>Perawi</th></tr></thead>
                    <tbody>{open.preview.rows.map(([a, b]) => <tr key={a}><td className="font-semibold">{a}</td><td>{b}</td></tr>)}</tbody></table>
                </div>
              </div>
            )}
            <div className="rounded-2xl bg-emas-50 p-3 text-xs text-hutan-900 ring-1 ring-inset ring-emas-200 dark:bg-emas-500/10 dark:text-emas-100">
              ✨ <b>Akan datang, insya-Allah.</b> Modul ini dalam perancangan; tarikh belum ditetapkan.<br />🎁 <b>Percuma untuk pembeli sedia ada</b> — ia akan muncul terus dalam aplikasi ini tanpa bayaran tambahan.<br /><span className="opacity-75">Pratonton ini belum disemak guru penyemak.</span>
            </div>
            <button className="btn btn-primary w-full" onClick={() => setOpen(null)}>Baik, saya tunggu!</button>
          </div>
        )}
      </Modal>
    </section>
  );
}
