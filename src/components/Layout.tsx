import { useEffect, useState, type ReactNode } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { Dumbbell, BookOpen, Trophy, UserRound, Flame, Zap, Plus, Check, Settings } from "lucide-react";
import { useDb, useMe, switchProfile } from "../lib/store";
import { ProfileForm } from "../pages/Welcome";
import { sfx } from "../lib/sound";
import { summary } from "../lib/gamification";
import { BADGES } from "../lib/gamification";
import { onNewBadges } from "../lib/actions";
import { Modal, Toaster, cx, toast } from "./ui";
import { Logo, APP_NAME, CREDIT, VERSION } from "./brand";

const NAV = [
  { to: "/", label: "Latih Tubi", icon: Dumbbell, end: true },
  { to: "/nota", label: "Nota", icon: BookOpen },
  { to: "/scoreboard", label: "Scoreboard", icon: Trophy },
  { to: "/profil", label: "Profil", icon: UserRound },
];

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

/** Lencana baharu dimaklumkan melalui notifikasi kecil — tidak menghalang sesi menjawab. */
function BadgeCelebration() {
  useEffect(() => onNewBadges((ids) => ids.forEach((id, i) => { const b = BADGES.find((x) => x.id === id); if (b) setTimeout(() => { toast(`🏅 Lencana baharu: ${b.name} ${b.icon}`, "info"); sfx.badge(); }, 600 + i * 700); })), []);
  return null;
}

/** Lembaran profil: tukar antara profil atau tambah profil baharu (tiada had bilangan). */
export function ProfileSheet({ open, onClose, startAdding = false }: { open: boolean; onClose: () => void; startAdding?: boolean }) {
  const d = useDb(); const nav = useNavigate();
  const [adding, setAdding] = useState(false);
  useEffect(() => { setAdding(open && startAdding); }, [open, startAdding]);
  return (
    <Modal open={open} onClose={onClose} title={adding ? "Profil baharu" : "Tukar profil"}>
      {adding ? <ProfileForm submitLabel="Cipta & guna profil" onDone={() => { onClose(); toast("Profil baharu dicipta"); }} /> : (
        <div className="space-y-2">
          <div className="max-h-[50vh] space-y-2 overflow-y-auto">
            {d.profiles.map((p) => {
              const active = p.id === d.activeProfileId;
              const xp = d.xp.reduce((s, x) => (x.userId === p.id ? s + x.amount : s), 0);
              return (
                <button key={p.id} onClick={() => { if (!active) { switchProfile(p.id); toast(`Bertukar ke ${p.name}`); } onClose(); }}
                  className={cx("flex w-full items-center gap-3 rounded-2xl p-3 text-left ring-1 transition", active ? "bg-zamrud-50 ring-2 ring-zamrud-500 dark:bg-zamrud-500/10" : "ring-slate-200 hover:bg-slate-50 dark:ring-white/10 dark:hover:bg-white/5")}>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-2xl shadow-sm dark:bg-white/10">{p.avatar}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate font-bold">{p.name}</span><span className="text-xs text-slate-500">{xp} XP</span></span>
                  {active && <Check className="text-zamrud-600" size={20} />}
                </button>
              );
            })}
          </div>
          <button className="btn btn-primary w-full !py-3" onClick={() => setAdding(true)}><Plus size={18} /> Tambah profil</button>
          <button className="btn btn-ghost w-full" onClick={() => { onClose(); nav("/profil"); }}><Settings size={16} /> Urus profil & tetapan</button>
        </div>
      )}
    </Modal>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  useTheme();
  const me = useMe()!; const d = useDb(); const loc = useLocation();
  const s = summary(d, me.id);
  const [sheet, setSheet] = useState(false);
  const focus = loc.pathname.startsWith("/latih/sesi") || loc.pathname.startsWith("/ujian"); // mod fokus semasa menjawab
  useEffect(() => { window.scrollTo(0, 0); }, [loc.pathname]);
  // Ketikan lembut bagi butang & pautan (kecuali pilihan jawapan yang ada bunyi keputusan sendiri)
  useEffect(() => {
    const h = (e: MouseEvent) => { const el = (e.target as HTMLElement).closest("button, a, select, [role=tab]"); if (el && !el.closest("[data-nosound]") && !(el as HTMLButtonElement).disabled) sfx.tap(); };
    document.addEventListener("click", h, true); return () => document.removeEventListener("click", h, true);
  }, []);
  return (
    <div className={cx("min-h-dvh", focus ? "pb-4" : "pb-24 lg:pb-8")}>
      <header className="sticky top-0 z-40 border-b border-emas-200/60 bg-krim-50/85 backdrop-blur-md dark:border-white/5 dark:bg-hutan-950/80 no-print" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <Link to="/" aria-label={APP_NAME}><Logo /></Link>
          <nav className="ml-6 hidden gap-1 lg:flex">
            {NAV.map((n) => <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => cx("flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition", isActive ? "bg-zamrud-800 text-krim-50 shadow ring-1 ring-emas-300/40" : "text-slate-600 hover:bg-zamrud-50 dark:text-slate-300 dark:hover:bg-white/5")}><n.icon size={16} />{n.label}</NavLink>)}
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="chip bg-merah-50 text-merah-700 ring-1 ring-inset ring-merah-200 dark:bg-merah-500/20 dark:text-merah-200" title="Hari berturut-turut"><Flame size={13} />{s.streak}</span>
            <span className="chip bg-emas-50 text-emas-700 ring-1 ring-inset ring-emas-200 dark:bg-emas-500/20 dark:text-emas-200" title="Jumlah XP"><Zap size={13} />{s.xp}</span>
            <button onClick={() => setSheet(true)} className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-zamrud-50 text-lg ring-2 ring-zamrud-200 transition active:scale-95 dark:bg-white/10 dark:ring-white/10" aria-label={`Profil: ${me.name}. Tukar profil`}>{me.avatar}</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-5">{children}</main>

      {!focus && <footer className="mx-auto mt-10 max-w-5xl px-4 pb-6 text-center text-xs text-slate-400 no-print">
        <div>{APP_NAME} v{VERSION} · Aplikasi ini dibangunkan oleh <b className="text-slate-500 dark:text-slate-300">{CREDIT}</b></div>
        <div className="mt-0.5">Kandungan latihan sebagai bantuan ulang kaji — sahkan bacaan bersama guru bertalaqqi.</div>
      </footer>}

      {!focus && <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-emas-200/60 bg-krim-50/95 backdrop-blur-md dark:border-white/5 dark:bg-hutan-950/95 lg:hidden no-print" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="mx-auto grid max-w-md grid-cols-4">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => cx("flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition", isActive ? "text-zamrud-700 dark:text-emas-300" : "text-slate-500 dark:text-slate-400")}>
              {({ isActive }) => <><span className={cx("grid h-8 w-14 place-items-center rounded-full transition", isActive && "bg-zamrud-800 text-emas-200 dark:bg-white/10")}><n.icon size={20} /></span>{n.label}</>}
            </NavLink>
          ))}
        </div>
      </nav>}
      <Toaster />
      <ProfileSheet open={sheet} onClose={() => setSheet(false)} />
      <BadgeCelebration />
    </div>
  );
}
