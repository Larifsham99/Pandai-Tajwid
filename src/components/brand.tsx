import { cx } from "./ui";

export const APP_NAME = "Pandai Tajwid";
export const CREDIT = "Abdul Latif";
export const VERSION = "1.4";
/** Pautan beli kod pengaktifan (halaman jualan → bahagian tawaran). */
export const BUY_URL = "./jualan/#dapatkan";
/** Demo untuk bakal pembeli (kuiz & tayangan skrin di halaman jualan). */
export const DEMO_URL = "./jualan/#demo";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cx("flex items-center gap-2", className)}>
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-zamrud-400 to-zamrud-700 font-arab text-lg text-white shadow-md shadow-zamrud-600/30 ring-2 ring-white/60">ت</div>
      <div className="leading-tight">
        <div className="text-[15px] font-extrabold tracking-tight text-hutan-900 dark:text-white">Pandai <span className="text-emas-500">Tajwid</span></div>
        <div className="hidden text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400 sm:block">Latih • Faham • Kuasai</div>
      </div>
    </div>
  );
}

