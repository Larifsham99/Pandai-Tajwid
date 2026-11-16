import type { Reference } from '../types';

// Senarai kitab rujukan asas. Nombor halaman TIDAK dimasukkan kerana belum disahkan
// oleh guru penyemak. Status semua rujukan: belum_disahkan sehingga disemak.
export const KITAB = {
  tuhfah: { kitab: 'Tuhfat al-Atfal wa al-Ghilman fi Tajwid al-Quran', pengarang: 'Sulaiman bin Husain al-Jamzuri' },
  jazariyyah: { kitab: 'Al-Muqaddimah al-Jazariyyah (Al-Muqaddimah fima Yajibu ʿala al-Qari an Yaʿlamahu)', pengarang: 'Imam Muhammad bin Muhammad Ibn al-Jazari' },
  hidayah: { kitab: 'Hidayah al-Qari ila Tajwid Kalam al-Bari', pengarang: "Syeikh 'Abd al-Fattah al-Sayyid 'Ajami al-Marsafi" },
  nihayah: { kitab: 'Nihayah al-Qawl al-Mufid fi ʿIlm al-Tajwid', pengarang: 'Syeikh Muhammad Makki Nasr al-Juraisi' },
  nasyr: { kitab: 'Al-Nasyr fi al-Qiraat al-ʿAsyr', pengarang: 'Imam Ibn al-Jazari' },
  tibyan: { kitab: 'Al-Tibyan fi Adab Hamalat al-Quran', pengarang: 'Imam al-Nawawi' },
} as const;

export function ref(k: keyof typeof KITAB, bab?: string): Reference {
  return { ...KITAB[k], bab, status: 'belum_disahkan' };
}

export function refLabel(r: Reference) {
  return `${r.kitab} — ${r.pengarang}${r.bab ? `, bab ${r.bab}` : ''}${r.halaman ? `, hlm. ${r.halaman}` : ''}`;
}
