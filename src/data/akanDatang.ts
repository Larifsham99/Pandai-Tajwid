/**
 * MODUL "AKAN DATANG" (trailer) — dipaparkan di halaman Nota.
 * Hanya maklumat asas yang mantap & masyhur (nama imam qurra' & perawi). Tiada hukum/huraian baharu.
 * Kandungan penuh akan ditulis & disemak guru sebelum diterbitkan. Tiada tarikh dijanjikan.
 */
export interface Teaser {
  id: string;
  icon: string;
  title: string;
  arabTitle: string;
  tagline: string;
  points: string[]; // apa yang akan dipelajari
  preview?: { caption: string; rows: [string, string][] }; // pratonton jadual ringkas
}

export const AKAN_DATANG: Teaser[] = [
  {
    id: "qiraat-pengenalan",
    icon: "📜",
    title: "Pengenalan Ilmu Qiraat",
    arabTitle: "مقدمة علم القراءات",
    tagline: "Apa itu qiraat, sejarah ringkas & bagaimana ia sampai kepada kita melalui sanad.",
    points: ["Takrif qiraat, riwayat & thariq", "Sejarah penulisan & pembukuan ilmu qiraat", "Syarat bacaan qiraat diterima", "Kedudukan riwayat Hafs 'an 'Asim yang kita baca"],
  },
  {
    id: "qiraat-imam",
    icon: "👥",
    title: "Qiraat Sab'ah & 'Asyarah",
    arabTitle: "القراءات السبع والعشر",
    tagline: "Mengenali 10 imam qurra' dan dua perawi masyhur bagi setiap imam.",
    points: ["Biodata ringkas 10 imam qurra'", "Perawi utama setiap imam", "Matan rujukan: al-Syatibiyyah & al-Durrah"],
    preview: {
      caption: "Pratonton: 10 imam qurra' & perawi",
      rows: [
        ["Nafi'", "Qalun · Warsy"],
        ["Ibn Kathir", "al-Bazzi · Qunbul"],
        ["Abu 'Amr", "al-Duri · al-Susi"],
        ["Ibn 'Amir", "Hisyam · Ibn Dzakwan"],
        ["'Asim", "Syu'bah · Hafs"],
        ["Hamzah", "Khalaf · Khallad"],
        ["al-Kisa'i", "Abu al-Harith · al-Duri"],
        ["Abu Ja'far", "Ibn Wardan · Ibn Jammaz"],
        ["Ya'qub", "Ruwais · Rauh"],
        ["Khalaf al-'Asyir", "Ishaq · Idris"],
      ],
    },
  },
  {
    id: "qiraat-perbandingan",
    icon: "🔀",
    title: "Perbandingan Riwayat",
    arabTitle: "الفرق بين الروايات",
    tagline: "Melihat contoh perbezaan bacaan antara riwayat — bermula dengan Hafs & Syu'bah daripada 'Asim.",
    points: ["Contoh kalimah yang dibaca berbeza", "Kaedah usul vs farsy al-huruf", "Latih tubi kenal riwayat"],
  },
];
