import { useSyncExternalStore } from "react";

/**
 * PASANG KE SKRIN UTAMA + STORAN KEKAL
 * • Android/Chrome: tangkap peristiwa `beforeinstallprompt` supaya butang "Pasang" boleh memaparkan dialog pasang.
 * • iPhone/iPad: tiada dialog automatik — paparkan arahan (Kongsi → Add to Home Screen).
 * • Minta storan kekal (navigator.storage.persist) supaya pelayar kurang cenderung memadam rekod pengguna.
 */
type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };
let deferred: BIPEvent | null = null;
const ls = new Set<() => void>();
const emit = () => ls.forEach((l) => l());

export function initInstall() {
  if (typeof window === "undefined") return;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e as BIPEvent; emit(); });
  window.addEventListener("appinstalled", () => { deferred = null; emit(); });
  navigator.storage?.persist?.().catch(() => {});
}

export const isStandalone = () =>
  typeof window !== "undefined" && (window.matchMedia?.("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true);
export const isIOS = () => typeof navigator !== "undefined" && (/iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

export function useCanPrompt() { return useSyncExternalStore((l) => { ls.add(l); return () => { ls.delete(l); }; }, () => !!deferred); }
export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  await deferred.prompt();
  const r = await deferred.userChoice.catch(() => ({ outcome: "dismissed" as const }));
  deferred = null; emit();
  return r.outcome === "accepted";
}

/** Pautan halaman jualan (untuk dikongsi), dikira daripada alamat aplikasi sekarang. */
export const salesUrl = () => (typeof location !== "undefined" ? new URL("./jualan/", location.origin + location.pathname).href : "");

/** Kongsi teks (Web Share API) → jatuh balik ke WhatsApp. */
export async function shareText(text: string) {
  const url = salesUrl();
  try {
    if (navigator.share) { await navigator.share({ title: "Pandai Tajwid", text, url }); return "shared"; }
  } catch (e) { if ((e as DOMException)?.name === "AbortError") return "cancelled"; }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, "_blank", "noopener");
  return "whatsapp";
}
