import { useEffect, useState, type ReactNode } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Dumbbell, BookOpen, Trophy, UserRound, Flame, Zap } from "lucide-react";
import { useDb, useMe } from "../lib/store";
import { summary } from "../lib/gamification";
import { BADGES } from "../lib/gamification";
import { onNewBadges } from "../lib/actions";
import { Modal, Toaster, cx } from "./ui";

export const APP_NAME = "Pandai Tajwid";
export const CREDIT = "Abdul Latif";

const NAV = [
  { to: "/", label: "Latih Tubi", icon: Dumbbell, end: true },
  { to: "/nota", label: "Nota", icon: BookOpen },
  { to: "/scoreboard", label: "Scoreboard", icon: Trophy },
  { to: "/profil", label: "Profil", icon: UserRound },
];

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cx("flex items-center gap-2", className)}>
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-zamrud-400 to-zamrud-700 font-arab text-lg text-white shadow-md shadow-zamrud-600/30 ring-2 ring-white/60">ت</div>
      <div className="leading-tight">
        <div className="text-[15px] font-extrabold tracking-tight text-hutan-900 dark:text-white">Pandai <span className="text-emas-500">Tajwid</span></div>
        <div className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">Latih • Faham • Kuasai</div>
      </div>
    </div>
  );
}

function useTheme() {
  const d = useDb();
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => document.documentElement.classList.toggle("dark", d.settings.theme === "dark" || (d.settings.theme === "system" && mq.matches));
    apply(); mq.addEventListener("change", apply);
    document.documentElement.style.setProperty("--arab-size", `${d.settings.arabicSize}px`);
    return () => mq.removeEventListener("change", apply);
  }, [d.settings.theme, d.settings.arabicSize]);
}

function BadgeCelebration() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => onNewBadges((n) => setIds((s) => [...s, ...n])), []);
  const b = BADGES.find((x) => x.id === ids[0]);
  return (
    <Modal open={!!b} onClose={() => setIds((s) => s.slice(1))} title="Lencana baharu! 🎉">
      {b && <div className="relative py-4 text-center">
        <div className="mx-auto mb-3 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-amber-200 to-emas-400 text-5xl shadow-lg shadow-amber-400/40 floaty">{b.icon}</div>
        <div className="text-lg font-extrabold">{b.name}</div>
        <p className="text-sm text-slate-500">{b.desc}</p>
        <button className="btn btn-primary mt-4" onClick={() => setIds((s) => s.slice(1))}>Alhamdulillah!</button>
      </div>}
    </Modal>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  useTheme();
  const me = useMe()!; const d = useDb(); const loc = useLocation();
  const s = summary(d, me.id);
  useEffect(() => { window.scrollTo(0, 0); }, [loc.pathname]);
  return (
    <div className="min-h-dvh pb-24 lg:pb-8">
      <header className="sticky top-0 z-40 border-b border-zamrud-900/5 bg-white/80 backdrop-blur-md dark:border-white/5 dark:bg-hutan-950/80 no-print" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <Link to="/" aria-label={APP_NAME}><Logo /></Link>
          <nav className="ml-6 hidden gap-1 lg:flex">
            {NAV.map((n) => <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => cx("flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition", isActive ? "bg-zamrud-600 text-white shadow" : "text-slate-600 hover:bg-zamrud-50 dark:text-slate-300 dark:hover:bg-white/5")}><n.icon size={16} />{n.label}</NavLink>)}
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="chip bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-200" title="Hari berturut-turut"><Flame size={13} />{s.streak}</span>
            <span className="chip bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200" title="Jumlah XP"><Zap size={13} />{s.xp}</span>
            <Link to="/profil" className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-zamrud-50 text-lg ring-2 ring-zamrud-200 dark:bg-white/10 dark:ring-white/10" aria-label="Profil">{me.avatar}</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-5">{children}</main>

      <footer className="mx-auto mt-10 max-w-5xl px-4 pb-6 text-center text-xs text-slate-400 no-print">
        <div>{APP_NAME} · Aplikasi ini dibangunkan oleh <b className="text-slate-500 dark:text-slate-300">{CREDIT}</b></div>
        <div className="mt-0.5">Kandungan latihan sebagai bantuan ulang kaji — sahkan bacaan bersama guru bertalaqqi.</div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zamrud-900/5 bg-white/95 backdrop-blur-md dark:border-white/5 dark:bg-hutan-950/95 lg:hidden no-print" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="mx-auto grid max-w-md grid-cols-4">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => cx("flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition", isActive ? "text-zamrud-700 dark:text-emas-300" : "text-slate-500 dark:text-slate-400")}>
              {({ isActive }) => <><span className={cx("grid h-8 w-14 place-items-center rounded-full transition", isActive && "bg-zamrud-100 dark:bg-white/10")}><n.icon size={20} /></span>{n.label}</>}
            </NavLink>
          ))}
        </div>
      </nav>
      <Toaster />
      <BadgeCelebration />
    </div>
  );
}
