import { type ReactNode, useEffect, useState, Fragment } from "react";
import { X } from "lucide-react";
import { ARABIC_RE } from "../lib/util";
import type { ReviewStatus } from "../types";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export function Card({ children, className, ...p }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("card", className)} {...p}>{children}</div>;
}

export function PageHeader({ title, subtitle, icon, actions }: { title: string; subtitle?: string; icon?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 rise">
      <div className="flex items-center gap-3">
        {icon && <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-zamrud-400 to-zamrud-700 text-xl text-white shadow-lg shadow-zamrud-600/25 ring-2 ring-white/70">{icon}</div>}
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-hutan-900 dark:text-white sm:text-2xl">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2 no-print">{actions}</div>}
    </div>
  );
}

export function Progress({ value, className, tone = "zamrud" }: { value: number; className?: string; tone?: "zamrud" | "emas" | "rose" }) {
  const c = tone === "emas" ? "bg-emas-400" : tone === "rose" ? "bg-rose-500" : "bg-zamrud-600";
  return <div className={cx("h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10", className)}><div className={cx("h-full rounded-full transition-all duration-500", c)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}

export const TONES = {
  zamrud: { bubble: "bg-emerald-100 text-emerald-700", bar: "from-emerald-400 to-teal-500" },
  sky: { bubble: "bg-sky-100 text-sky-700", bar: "from-sky-400 to-blue-500" },
  emas: { bubble: "bg-amber-100 text-amber-700", bar: "from-amber-300 to-orange-400" },
  rose: { bubble: "bg-rose-100 text-rose-700", bar: "from-rose-400 to-pink-500" },
  violet: { bubble: "bg-violet-100 text-violet-700", bar: "from-violet-400 to-fuchsia-500" },
} as const;
export type Tone = keyof typeof TONES;
export const CHAPTER_TONES: Tone[] = ["zamrud", "sky", "emas", "violet", "rose", "zamrud", "sky", "emas", "violet", "rose", "zamrud", "sky"];

export function Stat({ label, value, icon, hint, tone = "zamrud" }: { label: string; value: ReactNode; icon?: ReactNode; hint?: string; tone?: Tone }) {
  const t = TONES[tone];
  return (
    <Card className="relative overflow-hidden p-4">
      <div className={cx("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", t.bar)} />
      <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:text-xs"><span className="min-w-0 truncate">{label}</span><span className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-xl text-base", t.bubble)}>{icon}</span></div>
      <div className="mt-2 text-2xl font-extrabold text-hutan-900 dark:text-white">{value}</div>
      {hint && <div className="text-xs text-slate-500">{hint}</div>}
    </Card>
  );
}

/** Sambutan ringan apabila jawapan betul (dimatikan jika pengguna memilih kurang gerakan). */
export function Celebrate() {
  const bits = ["🎉", "⭐", "✨", "🌟", "💚", "🌙"];
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-0" aria-hidden>
      {bits.map((b, i) => <span key={i} className="burst text-2xl" style={{ ["--dx" as string]: `${(i - 2.5) * 46}px`, ["--dy" as string]: `${-40 - (i % 3) * 26}px`, ["--r" as string]: `${(i - 3) * 25}deg`, animationDelay: `${i * 40}ms` }}>{b}</span>)}
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => { const h = (e: KeyboardEvent) => e.key === "Escape" && onClose(); if (open) window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div className={cx("pop max-h-[92vh] w-full overflow-auto rounded-t-3xl bg-white p-5 shadow-2xl dark:bg-hutan-900 sm:rounded-3xl", wide ? "sm:max-w-3xl" : "sm:max-w-lg")} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal>
        <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-bold">{title}</h2><button className="rounded-full p-1 hover:bg-slate-100 dark:hover:bg-white/10" onClick={onClose} aria-label="Tutup"><X size={18} /></button></div>
        {children}
      </div>
    </div>
  );
}

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: ReactNode }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="mb-4 flex gap-1 overflow-x-auto rounded-2xl bg-white/70 p-1 ring-1 ring-zamrud-900/5 no-print dark:bg-white/5">
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)} className={cx("whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition", value === t.id ? "bg-gradient-to-br from-zamrud-500 to-zamrud-700 text-white shadow-md" : "text-slate-600 hover:bg-zamrud-50 dark:text-slate-300 dark:hover:bg-white/5")}>{t.label}</button>
      ))}
    </div>
  );
}

export function Empty({ icon = "🕌", title, children }: { icon?: string; title: string; children?: ReactNode }) {
  return <div className="card motif flex flex-col items-center gap-2 p-8 text-center"><div className="text-4xl">{icon}</div><div className="font-bold">{title}</div><div className="text-sm text-slate-500">{children}</div></div>;
}

const STATUS: Record<ReviewStatus, [string, string]> = {
  draf: ["Draf", "bg-slate-200 text-slate-700"],
  belum_disemak: ["Belum disemak", "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200"],
  disemak: ["Disemak guru", "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200"],
  diterbitkan: ["Disahkan & diterbitkan", "bg-zamrud-100 text-zamrud-800 dark:bg-zamrud-500/20 dark:text-zamrud-200"],
};
export const StatusBadge = ({ s }: { s: ReviewStatus }) => <span className={cx("chip", STATUS[s][1])}>{STATUS[s][0]}</span>;
export const statusLabel = (s: ReviewStatus) => STATUS[s][0];

/** Paparan teks bercampur Rumi + Arab. Baris yang dominan Arab dipaparkan sebagai blok RTL. */
export function RichText({ text, className }: { text: string; className?: string }) {
  const lines = text.split("\n");
  return (
    <div className={cx("space-y-1", className)}>
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        const arabChars = (line.match(new RegExp(ARABIC_RE.source, "g")) || []).length;
        const latin = (line.match(/[A-Za-z]/g) || []).length;
        if (arabChars > 6 && latin < 4) return <div key={i} className="arab-block">{line}</div>;
        const bold = line.match(/^#{1,3}\s+(.*)/);
        if (bold) return <div key={i} className="pt-2 font-bold text-hutan-900 dark:text-emas-200">{renderInline(bold[1])}</div>;
        return <div key={i} className="rich-line leading-relaxed">{renderInline(line)}</div>;
      })}
    </div>
  );
}
function renderInline(line: string) {
  // pisahkan larian Arab supaya guna fon Arab; sokong **tebal** dan _condong_
  const parts = line.split(/([؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿](?:[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿\s۞ـ،؛]*[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿])?)/);
  return parts.map((p, i) => {
    if (!p) return null;
    if (ARABIC_RE.test(p)) return <span key={i} dir="rtl" className="arab-inline">{p}</span>;
    const segs = p.split(/(\*\*[^*]+\*\*|_[^_]+_)/);
    return <Fragment key={i}>{segs.map((s, j) => s.startsWith("**") ? <strong key={j}>{s.slice(2, -2)}</strong> : s.startsWith("_") && s.endsWith("_") && s.length > 2 ? <em key={j}>{s.slice(1, -1)}</em> : s)}</Fragment>;
  });
}

export function Arabic({ children, refText, className }: { children: string; refText?: string; className?: string }) {
  return <div className={cx("rounded-2xl bg-krim-50 px-4 py-3 ring-1 ring-emas-200 dark:bg-white/5 dark:ring-emas-500/20", className)}><div className="arab-block text-hutan-900 dark:text-krim-100">{children}</div>{refText && <div className="mt-1 text-right text-xs text-emas-700 dark:text-emas-300">({refText})</div>}</div>;
}

// ---------- Toast ----------
type Toast = { id: number; text: string; tone: "ok" | "err" | "info" };
let pushToast: (t: Omit<Toast, "id">) => void = () => {};
export const toast = (text: string, tone: Toast["tone"] = "ok") => pushToast({ text, tone });
export function Toaster() {
  const [items, set] = useState<Toast[]>([]);
  useEffect(() => { pushToast = (t) => { const id = Date.now() + Math.random(); set((s) => [...s, { ...t, id }]); setTimeout(() => set((s) => s.filter((x) => x.id !== id)), 3200); }; }, []);
  return <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6">{items.map((t) => <div key={t.id} className={cx("pop pointer-events-auto rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-xl", t.tone === "ok" ? "bg-zamrud-800 text-white" : t.tone === "err" ? "bg-rose-600 text-white" : "bg-hutan-900 text-emas-200")}>{t.text}</div>)}</div>;
}

export function BarChart({ data, max = 100, suffix = "%" }: { data: { label: string; value: number; tone?: string }[]; max?: number; suffix?: string }) {
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="grid grid-cols-[minmax(0,9rem)_1fr_3rem] items-center gap-2 text-xs">
          <div className="truncate text-slate-600 dark:text-slate-300" title={d.label}>{d.label}</div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className={cx("h-full rounded-full", d.tone || (d.value >= 80 ? "bg-zamrud-600" : d.value >= 60 ? "bg-emas-400" : "bg-rose-400"))} style={{ width: `${Math.min(100, (d.value / max) * 100)}%` }} /></div>
          <div className="text-right font-semibold tabular-nums">{d.value}{suffix}</div>
        </div>
      ))}
    </div>
  );
}
