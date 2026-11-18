import { cx } from "./ui";

export const APP_NAME = "Pandai Tajwid";
export const CREDIT = "Mawar Ikhlas Brand";
export const VERSION = "1.9";
/** Pautan beli kod pengaktifan (halaman jualan → bahagian tawaran). */
export const BUY_URL = "./jualan/#dapatkan";
/** Demo untuk bakal pembeli (kuiz & tayangan skrin di halaman jualan). */
export const DEMO_URL = "./jualan/#demo";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cx("flex items-center gap-2", className)}>
      <img src="./icon.svg" alt="" width={36} height={36} className="h-9 w-9 rounded-xl shadow-md shadow-zamrud-600/30" />
      <div className="leading-tight">
        <div className="text-[15px] font-extrabold tracking-tight text-hutan-900 dark:text-krim-50">Pandai <span className="text-emas-500">Tajwid</span></div>
        <div className="hidden text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400 sm:block">Latih • Faham • Kuasai</div>
      </div>
    </div>
  );
}

