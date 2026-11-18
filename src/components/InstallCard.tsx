import { useState } from "react";
import { Download, Share, X } from "lucide-react";
import { isIOS, isStandalone, promptInstall, useCanPrompt } from "../lib/install";
import { toast } from "./ui";

const KEY = "pandai-tajwid:pasang-tutup";
const dismissedRecently = () => { try { return Date.now() - Number(localStorage.getItem(KEY) || 0) < 7 * 864e5; } catch { return false; } };

/** Kad "Pasang ke skrin utama" — hanya dipaparkan jika belum dipasang. Ditutup = sembunyi 7 hari. */
export default function InstallCard() {
  const canPrompt = useCanPrompt();
  const [hidden, setHidden] = useState(() => isStandalone() || dismissedRecently());
  const ios = isIOS();
  if (hidden || (!canPrompt && !ios)) return null;
  const close = () => { try { localStorage.setItem(KEY, String(Date.now())); } catch { /* abaikan */ } setHidden(true); };
  return (
    <div className="card relative flex items-start gap-3 p-4">
      <img src="./icon.svg" alt="" className="h-12 w-12 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1 pr-5">
        <div className="font-bold">Pasang di skrin utama</div>
        {ios ? (
          <p className="text-sm text-slate-500">Tekan <Share size={14} className="inline -mt-1" /> <b>Kongsi</b> di bawah Safari → <b>Add to Home Screen</b>. Buka seperti apl biasa & rekod anda lebih selamat.</p>
        ) : (
          <>
            <p className="text-sm text-slate-500">Buka seperti apl biasa, lebih pantas & rekod anda lebih selamat.</p>
            <button className="btn btn-primary mt-2 !py-2 text-sm" onClick={async () => { if (await promptInstall()) { toast("Alhamdulillah, Pandai Tajwid dipasang!"); setHidden(true); } }}><Download size={16} /> Pasang aplikasi</button>
          </>
        )}
      </div>
      <button className="absolute right-2 top-2 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10" onClick={close} aria-label="Tutup"><X size={16} /></button>
    </div>
  );
}
