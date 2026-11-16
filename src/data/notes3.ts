import type { Chapter } from "../types";
import { ref } from "./refs";

// BAB 10 – BAB 12
export const chaptersC: Chapter[] = [
  {
    id: "b10", no: 10, icon: "⏸",
    title: "Waqaf dan Ibtida'", arabTitle: "الوقف والابتداء",
    summary: "Takrif waqaf, qat', saktah, ibtida'; jenis waqaf (ikhtiyari, idtirari, intizari, ikhtibari); waqaf tam, kafi, hasan, qabih; simbol waqaf; waqaf Jibril.",
    sections: [
      {
        id: "b10-takrif", title: "Waqaf, Qat', Saktah, Ibtida' dan Wasal",
        huraian: [
          "Waqaf (الوقف): memutuskan suara pada akhir kalimah seketika dengan mengambil nafas, dengan niat untuk menyambung bacaan.",
          "Qat' (القطع): memutuskan bacaan untuk berhenti terus (berpindah kepada perkara lain); disunatkan pada akhir ayat atau surah, dan isti'adhah dibaca semula apabila memulakan semula.",
          "Saktah (السكت): memutuskan suara seketika (kadar 2 harakat) TANPA mengambil nafas, dengan niat menyambung bacaan.",
          "Ibtida' (الابتداء): memulakan bacaan selepas berhenti atau di awal bacaan. Ibtida' mestilah pada tempat yang sempurna maknanya; tidak harus memulakan dengan perkataan yang merosakkan makna.",
          "Wasal (الوصل): menyambung bacaan tanpa berhenti.",
          "Sebab-sebab waqaf: kehabisan nafas (idtirari); untuk menguji/mengajar (ikhtibari); untuk menghimpunkan riwayat (intizari); dengan pilihan sendiri kerana makna (ikhtiyari).",
        ],
        jadual: { head: ["Aspek", "Waqaf", "Saktah", "Qat'"], rows: [
          ["Nafas", "Ambil nafas", "Tanpa nafas", "Ambil nafas"], ["Niat", "Sambung semula", "Sambung semula", "Berhenti terus"], ["Tempat", "Akhir kalimah", "Tempat tertentu (riwayat)", "Akhir ayat/surah"],
        ] },
        pengukuhan: ["Terangkan perbezaan waqaf dan saktah serta contoh.", "Huraikan maksud al-waqf, al-qat', al-saktah, al-ibtida' dan al-wasl."],
        ringkas: "Waqaf = henti + nafas; saktah = henti tanpa nafas; qat' = henti terus.",
      },
      {
        id: "b10-jenis", title: "Jenis Waqaf",
        huraian: [
          "Waqaf terbahagi kepada empat: (1) Ikhtibari – waqaf ujian/pengajaran pada kalimah yang biasanya tidak diwaqafkan; (2) Intizari – waqaf untuk menghimpun wajah-wajah qiraat; (3) Idtirari – waqaf terpaksa kerana putus nafas, batuk, lupa dsb (harus di mana-mana kalimah, kemudian mengulang dari tempat yang sesuai); (4) Ikhtiyari – waqaf dengan pilihan sendiri tanpa sebab terdesak.",
          "Waqaf ikhtiyari terbahagi kepada empat (atau lima):",
          "• Tam (التام): berhenti pada kalimah yang sempurna makna dan tiada kaitan lafaz atau makna dengan selepasnya. Biasanya pada akhir ayat/kisah. Contoh: مَٰلِكِ يَوْمِ ٱلدِّينِ ۝ (berhenti) إِيَّاكَ نَعْبُدُ; وَأُو۟لَٰٓئِكَ هُمُ ٱلْمُفْلِحُونَ (al-Baqarah:5).",
          "• Kafi (الكافي): sempurna makna, ada kaitan makna tetapi tiada kaitan lafaz (i'rab) dengan selepasnya. Berhenti baik dan memulakan dengan selepasnya juga baik. Contoh: لَا يُؤْمِنُونَ (al-Baqarah:6).",
          "• Hasan (الحسن): sempurna makna tetapi ada kaitan lafaz dan makna dengan selepasnya. Berhenti baik, tetapi ibtida' dengan selepasnya tidak baik kecuali di hujung ayat. Contoh: ٱلْحَمْدُ لِلَّهِ (berhenti di sini) kemudian ulang.",
          "• Qabih (القبيح): berhenti pada kalimah yang tidak sempurna makna atau merosakkan makna. Contoh: بِسْمِ (berhenti); إِنَّ ٱللَّهَ لَا يَسْتَحْيِۦٓ (berhenti); صِرَٰطَ ٱلَّذِينَ (berhenti). Tidak harus kecuali terpaksa, dan wajib diulang.",
          "• Sebahagian ulama menambah Jaiz (الجائز): harus berhenti dan harus menyambung.",
          "Dalam surah al-Fatihah: waqaf tam pada akhir ayat seperti ٱلدِّينِ، نَسْتَعِينُ، ٱلضَّآلِّينَ; ada yang mengira akhir setiap ayat (sunnah berhenti di hujung ayat). Waqaf hasan: ٱلْحَمْدُ لِلَّهِ، ٱلرَّحْمَٰنِ. Waqaf qabih: صِرَٰطَ ٱلَّذِينَ، غَيْرِ ٱلْمَغْضُوبِ.",
        ],
        jadual: { head: ["Jenis", "Kaitan lafaz", "Kaitan makna", "Ibtida' selepasnya"], rows: [
          ["Tam", "Tiada", "Tiada", "Baik"], ["Kafi", "Tiada", "Ada", "Baik"], ["Hasan", "Ada", "Ada", "Tidak baik (kecuali hujung ayat)"], ["Qabih", "–", "Makna tidak sempurna/rosak", "Wajib ulang"],
        ] },
        pengukuhan: ["Jelaskan waqaf tam dan waqaf qabih beserta contoh dalam surah al-Fatihah."],
        ringkas: "Tam (tiada kaitan) > Kafi (kaitan makna) > Hasan (kaitan lafaz & makna) > Qabih (rosak makna).",
      },
      {
        id: "b10-simbol", title: "Simbol Waqaf dalam Mushaf Rasm Uthmani",
        huraian: [
          "Simbol waqaf (cetakan mushaf Madinah/Malaysia):",
          "مـ (lazim) – wajib berhenti (sambung boleh mengubah makna). Contoh: فَلَا يَحْزُنكَ قَوْلُهُمْ ۘ إِنَّا نَعْلَمُ (Yasin:76); إِنَّمَا يَسْتَجِيبُ ٱلَّذِينَ يَسْمَعُونَ ۘ وَٱلْمَوْتَىٰ (al-An'am:36).",
          "قلى – berhenti lebih utama (al-waqf awla).",
          "صلى – menyambung lebih utama (al-wasl awla).",
          "ج – harus berhenti atau sambung (sama).",
          "لا – jangan berhenti (jika berhenti, ulang dari kalimah sebelumnya); di hujung ayat, harus berhenti.",
          "∴ ∴ (mu'anaqah / tanda tiga titik berpasangan) – berhenti pada salah satu sahaja, bukan kedua-duanya. Contoh: لَا رَيْبَ ۛ فِيهِ ۛ (al-Baqarah:2).",
          "قف – disuruh berhenti (lebih utama berhenti) menurut sesetengah mushaf. س / سكتة – saktah.",
        ],
        jadual: { head: ["Simbol", "Maksud"], rows: [["مـ", "Waqaf lazim – wajib/sangat dituntut berhenti"], ["قلى", "Waqaf lebih utama"], ["ج", "Harus waqaf atau wasal"], ["صلى", "Wasal lebih utama"], ["لا", "Tidak boleh waqaf (jika berhenti, ulang)"], ["∴ ∴", "Waqaf mu'anaqah – berhenti pada salah satu"], ["قف", "Disuruh berhenti"], ["س", "Saktah"]] },
        perbandingan: ["Tanda tanwin dalam mushaf: tanwin bersusun selari (ٌ) menandakan izhar; tanwin bersusun tidak selari/berselang (ٌ dengan baris kedua sedikit ke hadapan) menandakan idgham atau ikhfa' – cth. مَلَكٌ فَيَكُونَ (ikhfa') vs لَّمَسْجِدٌ أُسِّسَ (izhar).", "Mim kecil (ۢ) di atas nun/tanwin menandakan iqlab; mim kecil (مـ) di atas kalimah ialah simbol waqaf lazim."],
        pengukuhan: ["Jelaskan maksud simbol-simbol waqaf (قلى)، (صلى)، (لا)، (ج)، (م)."],
        ringkas: "مـ wajib henti; قلى henti lebih baik; ج sama; صلى sambung lebih baik; لا jangan henti; ∴ salah satu.",
      },
      {
        id: "b10-jibril", title: "Waqaf Jibril dan Kaedah Waqaf pada Hujung Kalimah",
        huraian: [
          "Waqaf Jibril (atau waqaf sunnah/ittiba'): tempat-tempat yang diriwayatkan Nabi SAW berhenti mengikut Jibril AS. Disebut sepuluh tempat yang masyhur (dinukil dalam kitab-kitab tajwid), antaranya:",
          "1. فَٱسْتَبِقُوا۟ ٱلْخَيْرَٰتِ (al-Baqarah:148) 2. فَٱسْتَبِقُوا۟ ٱلْخَيْرَٰتِ (al-Ma'idah:48) 3. مَا لَيْسَ لِى بِحَقٍّ (al-Ma'idah:116) 4. قُلْ هَٰذِهِۦ سَبِيلِىٓ (Yusuf:108) 5. كَذَٰلِكَ يَضْرِبُ ٱللَّهُ ٱلْأَمْثَالَ (al-Ra'd:17) 6. وَٱلْأَنْعَٰمَ خَلَقَهَا (al-Nahl:5) 7. أَفَمَن كَانَ مُؤْمِنًا كَمَن كَانَ فَاسِقًا (al-Sajdah:18) 8. ثُمَّ أَدْبَرَ يَسْعَىٰ (al-Nazi'at:22) 9. لَيْلَةُ ٱلْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ (al-Qadr:3) 10. فَسَبِّحْ بِحَمْدِ رَبِّكَ وَٱسْتَغْفِرْهُ (al-Nasr:3).",
          "Status: Senarai ini dinukil daripada amalan masyhur dalam kitab-kitab tajwid; sebahagian ulama mempertikaikan sanadnya. Perlu disemak guru.",
          "Kaedah waqaf pada hujung kalimah: (1) Huruf berbaris → disukunkan. (2) Tanwin fathah → alif (mad 'iwadh). (3) Ta' marbutah → ha' sakinah (ٱلشَّجَرَةَ ← ٱلشَّجَرَهْ). (4) Raum dan isymam harus pada keadaan tertentu.",
          "Waqaf pada alif yang ditulis tetapi tidak dibaca ketika wasal (ithbat/hazf): ٱلظُّنُونَا۟ (al-Ahzab:10), ٱلرَّسُولَا۟ (al-Ahzab:66), ٱلسَّبِيلَا۟ (al-Ahzab:67) dan أَنَا۠ – ketika waqaf alif dibaca (ithbat); ketika wasal dibuang (hazf). سَلَٰسِلَا۟ (al-Insan:4): ketika waqaf harus ithbat (dengan alif) atau hazf (sukun pada lam); ketika wasal dibuang. قَوَارِيرَا۟ pertama (al-Insan:15): waqaf dengan alif (ithbat); قَوَارِيرَا۟ kedua (al-Insan:16): waqaf tanpa alif (hazf, sukun pada ra'); wasal kedua-duanya tanpa alif.",
          "مِن نَّبَإِى۟ (al-An'am:34): ya' ditulis tetapi tidak dibaca – waqaf pada hamzah sakinah. فِى ٱلْقَتْلَى (al-Baqarah:178): alif maqsurah – waqaf dengan alif (mad tabi'i).",
        ],
        pengukuhan: ["Apakah yang dimaksudkan dengan waqaf Jibril? Senaraikan empat contoh.", "Jelaskan kaedah waqaf pada سَلَٰسِلَا۟ dan قَوَارِيرَا۟."],
        ringkas: "Waqaf Jibril: 10 tempat masyhur. Alif hazf/ithbat: الظنونا، الرسولا، السبيلا، سلاسلا، قواريرا.",
      },
    ],
    refs: [ref("hidayah", "Bab al-waqf wa al-ibtida'"), ref("nihayah", "Bab al-waqf"), ref("jazariyyah", "Bab ma'rifat al-wuquf")],
    mindmap: { root: "Waqaf & Ibtida'", branches: [
      { label: "Istilah", leaves: ["Waqaf", "Saktah", "Qat'", "Ibtida'"] }, { label: "Jenis", leaves: ["Ikhtibari", "Intizari", "Idtirari", "Ikhtiyari"] },
      { label: "Ikhtiyari", leaves: ["Tam", "Kafi", "Hasan", "Qabih"] }, { label: "Simbol", leaves: ["مـ", "قلى", "ج", "صلى", "لا", "∴"] },
    ] },
    flashcards: [
      { front: "Simbol ج?", back: "Harus waqaf atau wasal (sama)." }, { front: "Waqaf kafi?", back: "Sempurna makna, ada kaitan makna, tiada kaitan lafaz." },
      { front: "Waqaf mu'anaqah?", back: "Berhenti pada salah satu daripada dua tanda tiga titik." },
    ],
  },

  {
    id: "b11", no: 11, icon: "ء",
    title: "Hamzah Wasal dan Hamzah Qat'", arabTitle: "همزة الوصل وهمزة القطع",
    summary: "Takrif, perbezaan dan kaedah membaris hamzah wasal pada isim, fi'il dan huruf (al).",
    sections: [
      {
        id: "b11-takrif", title: "Takrif dan Perbezaan",
        huraian: [
          "Hamzah wasal (همزة الوصل): hamzah tambahan di awal kalimah yang dibaca ketika memulakan bacaan (ibtida') dan gugur ketika disambung (wasal). Dalam mushaf ditandakan dengan kepala sad kecil di atas alif (ٱ).",
          "Hamzah qat' (همزة القطع): hamzah asli yang tetap dibaca sama ada ketika ibtida' atau wasal; ditulis dengan tanda hamzah (أ / إ).",
        ],
        jadual: { head: ["Aspek", "Hamzah wasal", "Hamzah qat'"], rows: [
          ["Ketika wasal", "Gugur (tidak dibaca)", "Tetap dibaca"], ["Ketika ibtida'", "Dibaca", "Dibaca"], ["Tanda mushaf", "ٱ (kepala sad)", "أ / إ (tanda hamzah)"], ["Kedudukan", "Awal kalimah sahaja", "Awal, tengah, akhir"], ["Asal", "Tambahan (za'idah)", "Asli (atau tambahan pada sesetengah sighah)"], ["Contoh", "ٱلْحَمْدُ، ٱهْدِنَا", "أَنْعَمْتَ، إِيَّاكَ، سَأَلَ"],
        ] },
        pengukuhan: ["Senaraikan lima perbezaan antara hamzah wasal dan hamzah qat' beserta contoh."],
        ringkas: "Wasal: dibaca ketika mula, gugur ketika sambung. Qat': sentiasa dibaca.",
      },
      {
        id: "b11-kaedah", title: "Kaedah Membaris Hamzah Wasal ketika Ibtida'",
        huraian: [
          "1) Pada al ta'rif (ال): sentiasa FATHAH – ٱلْحَمْدُ ← أَلْحَمْدُ، ٱلْجَنَّةُ ← أَلْجَنَّةُ، ٱلْحُكْمُ ← أَلْحُكْمُ. Awas: ٱلْتَقَى، ٱلْتَقَطَهُ bukan al ta'rif tetapi fi'il.",
          "2) Pada fi'il (kata kerja): lihat huruf KETIGA kalimah: (a) jika berbaris dhammah asli (lazim) → hamzah DHAMMAH: ٱقْتُلُوا۟ ← اُقْتُلُوا، ٱدْخُلُوا۟ ← اُدْخُلُوا، ٱنظُرْ ← اُنظُرْ. (b) jika berbaris fathah atau kasrah → hamzah KASRAH: ٱذْهَبْ ← اِذْهَبْ، ٱرْجِعِىٓ ← اِرْجِعِي، ٱسْتَكْبَرُوا۟ ← اِسْتَكْبَرُوا، ٱتَّخَذَ ← اِتَّخَذَ، ٱقْتَرَبَ ← اِقْتَرَبَ.",
          "• Pengecualian dhammah mendatang ('aridhah): ٱمْشُوا۟ (asal ٱمْشِيُوا), ٱقْضُوٓا۟، ٱبْنُوا۟، ٱئْتُوا۟ – dibaca KASRAH kerana dhammah pada huruf ketiga bukan asli: اِمْشُوا، اِئْتُونِي (hamzah kedua ditukar ya': اِيتُونِي).",
          "3) Pada isim (kata nama) selain al: sentiasa KASRAH. Isim-isim samā'i: ٱبْنٌ، ٱبْنَتٌ، ٱمْرُؤٌ، ٱمْرَأَةٌ، ٱثْنَانِ، ٱثْنَتَانِ، ٱسْمٌ (dan masdar fi'il khumasi/sudasi: ٱسْتِكْبَار، ٱنْتِقَام). Contoh: ٱسْمُهُ ← اِسْمُهُ، ٱبْنُ مَرْيَمَ ← اِبْنُ، ٱثْنَيْنِ ← اِثْنَيْنِ، ٱمْرُؤٌا۟ ← اِمْرُؤٌا.",
          "4) بِئْسَ ٱلِٱسْمُ (al-Hujurat:11): ketika ibtida' pada ٱلِٱسْمُ harus dua wajah: (a) أَلِسْمُ – mula dengan hamzah wasal al (fathah), lam kasrah, gugurkan hamzah wasal kedua (lebih utama); (b) لِسْمُ – mula terus dengan lam berbaris kasrah. Ketika wasal: بِئْسَ لِسْمُ.",
        ],
        jadual: { caption: "Ringkasan", head: ["Jenis kalimah", "Baris hamzah ketika mula", "Contoh"], rows: [
          ["Al ta'rif", "Fathah", "ٱلرَّحْمَٰنِ → أَلرَّحْمَٰن"], ["Fi'il – huruf ke-3 dhammah asli", "Dhammah", "ٱقْتُلُوا۟ → اُقْتُلُوا"], ["Fi'il – huruf ke-3 fathah/kasrah", "Kasrah", "ٱسْتَغْفِرْ → اِسْتَغْفِرْ"], ["Fi'il – dhammah mendatang", "Kasrah", "ٱمْشُوا۟ → اِمْشُوا"], ["Isim (bukan al)", "Kasrah", "ٱسْمُهُ → اِسْمُهُ"],
        ] },
        contoh: [
          { arab: "ٱقْتُلُوا۟ يُوسُفَ", ref: "Yusuf:9", hukum: "Dhammah", huraian: "Fi'il amr; huruf ketiga (ت) dhammah asli." },
          { arab: "ٱسْمُهُ ٱلْمَسِيحُ", ref: "Ali 'Imran:45", hukum: "Kasrah", huraian: "Isim samā'i (ٱسْم)." },
          { arab: "ٱئْتُونِى بِهِۦٓ", ref: "Yusuf:54", hukum: "Kasrah (اِيتُونِي)", huraian: "Huruf ketiga dhammah mendatang; hamzah sakinah ditukar ya'." },
          { arab: "ٱسْتَغْفِرْ لَهُمْ", ref: "al-Taubah:80", hukum: "Kasrah", huraian: "Fi'il; huruf ketiga (ت) fathah." },
          { arab: "ٱلْتَقَى ٱلْجَمْعَانِ", ref: "Ali 'Imran:166", hukum: "Kasrah", huraian: "Fi'il madhi (ٱلْتَقَى), BUKAN al ta'rif; huruf ketiga (ت) fathah → اِلْتَقَى." },
        ],
        kesalahan: ["Membaca ٱلْتَقَى dengan fathah kerana menyangka al ta'rif.", "Membaca ٱمْشُوا۟ dengan dhammah."],
        pengukuhan: ["Bariskan permulaan hamzah wasal pada: ٱسْتَكْبَرُوا۟، ٱدْخُلُوا۟، ٱقْتَرَبَ، ٱمْرُؤٌا۟، ٱلرَّحْمَٰنُ."],
        ringkas: "Al → fathah. Fi'il: huruf ke-3 dhammah asli → dhammah; selainnya kasrah. Isim → kasrah.",
      },
    ],
    refs: [ref("hidayah", "Bab hamzah al-wasl"), ref("nihayah", "Bab hamzah al-wasl wa al-qat'")],
    mindmap: { root: "Hamzah", branches: [{ label: "Wasal", leaves: ["Al: fathah", "Fi'il: lihat huruf ke-3", "Isim: kasrah"] }, { label: "Qat'", leaves: ["Sentiasa dibaca"] }] },
    flashcards: [{ front: "ٱدْخُلُوا۟ – baris hamzah ketika mula?", back: "Dhammah (اُدْخُلُوا) – huruf ketiga خ dhammah asli." }, { front: "ٱمْشُوا۟?", back: "Kasrah – dhammah mendatang." }],
  },

  {
    id: "b12", no: 12, icon: "✦",
    title: "Bab-Bab Lanjutan & Bacaan Gharib Hafs", arabTitle: "مباحث متقدمة",
    summary: "Idgham mithlain/mutajanisain/mutaqaribain, qalqalah, saktah, isymam, imalah, tashil, naqal, ibdal, raum, iltiqa' sakinain, serta tanda-tanda khas rasm Uthmani.",
    sections: [
      {
        id: "b12-idgham", title: "Idgham Mithlain, Mutajanisain dan Mutaqaribain",
        huraian: [
          "Mithlain (المثلين): dua huruf sama makhraj dan sifat (huruf sama). Saghir: pertama sukun, kedua berbaris – wajib idgham: ٱضْرِب بِّعَصَاكَ، قَد دَّخَلُوا۟ (al-Ma'idah:61), يُدْرِككُّمُ. Pengecualian: ha' saktah مَالِيَهْ ۜ هَلَكَ (al-Haqqah:28-29) – Hafs membaca izhar dengan saktah (atau idgham), saktah diutamakan.",
          "Mutajanisain (المتجانسين): dua huruf sama makhraj, berbeza sifat. Saghir wajib idgham pada pasangan: ت–د (أَثْقَلَت دَّعَوَا), د–ت (قَد تَّبَيَّنَ), ت–ط (قَالَت طَّآئِفَةٌ), ط–ت (بَسَطتَ، أَحَطتُ – idgham naqis kerana sifat itbaq ط kekal), ذ–ظ (إِذ ظَّلَمُوٓا۟), ث–ذ (يَلْهَث ذَّٰلِكَ), ب–م (ٱرْكَب مَّعَنَا – Hud:42). Pasangan ب–م ini dinamakan idgham mutajanisain bi ghunnah kerana mim yang bertasydid dibaca berdengung.",
          "Mutaqaribain (المتقاربين): dua huruf hampir makhraj/sifat. Saghir wajib idgham: ل–ر (قُل رَّبِّ، بَل رَّفَعَهُ), ق–ك (أَلَمْ نَخْلُقكُّم – al-Mursalat:20; idgham kamil diutamakan, harus naqis). Juga nun sakinah bertemu ي و ل ر (idgham nun).",
          "Idgham kamil: huruf pertama lebur sepenuhnya (zat & sifat). Idgham naqis: zat hilang, sifat kekal (cth. أَحَطتُ – itbaq kekal; مَن يَقُولُ – ghunnah kekal).",
        ],
        jadual: { head: ["Jenis", "Syarat", "Contoh"], rows: [["Mithlain saghir", "Huruf sama", "قَد دَّخَلُوا۟، ٱضْرِب بِّعَصَاكَ"], ["Mutajanisain saghir", "Sama makhraj, beza sifat", "قَد تَّبَيَّنَ، بَسَطتَ، ٱرْكَب مَّعَنَا"], ["Mutaqaribain saghir", "Hampir makhraj/sifat", "قُل رَّبِّ، بَل رَّفَعَهُ، نَخْلُقكُّم"]] },
        ringkas: "Mithlain = sama; mutajanisain = sama makhraj; mutaqaribain = hampir.",
      },
      {
        id: "b12-qalqalah", title: "Qalqalah",
        takrif: "Qalqalah pada bahasa: gerakan/goncangan. Pada istilah: bunyi pantulan yang kuat pada huruf qalqalah ketika ia sukun.",
        huraian: [
          "Huruf: قُطْبُ جَدٍّ (ق ط ب ج د).",
          "Qalqalah sughra (kecil): huruf qalqalah sukun asli di tengah kalimah atau di hujung ketika wasal: يَقْطَعُونَ، يَبْتَغُونَ، يَجْعَلُونَ، وَٱقْتَرِبْ (wasal).",
          "Qalqalah kubra (besar): huruf qalqalah di hujung kalimah yang disukunkan kerana waqaf: ٱلْفَلَقِ ← ٱلْفَلَقْ، أَحَدٌ ← أَحَدْ. Lebih kuat jika bertasydid: وَتَبَّ (al-Masad:1), ٱلْحَقّ.",
          "Sebahagian ulama menyebut qalqalah akbar: huruf qalqalah bertasydid di hujung ketika waqaf (وَتَبّْ) – pantulan paling kuat.",
        ],
        jadual: { head: ["Jenis", "Keadaan", "Contoh"], rows: [["Sughra", "Sukun asli (tengah/akhir ketika wasal)", "يَدْخُلُونَ"], ["Kubra", "Sukun kerana waqaf", "ٱلْفَلَقْ"], ["Akbar (sebahagian ulama)", "Bertasydid ketika waqaf", "وَتَبّْ"]] },
        ringkas: "قطب جد. Sughra (sukun asli) < Kubra (waqaf) < Akbar (tasydid + waqaf).",
      },
      {
        id: "b12-gharib", title: "Bacaan Gharib (Khas) Riwayat Hafs",
        huraian: [
          "Saktah wajib (Hafs, tariq al-Syatibiyyah) di empat tempat: (1) عِوَجَا ۜ قَيِّمًا (al-Kahf:1-2); (2) مَنۢ بَعَثَنَا مِن مَّرْقَدِنَا ۜ ۗ هَٰذَا (Yasin:52); (3) وَقِيلَ مَنْ ۜ رَاقٍ (al-Qiyamah:27); (4) كَلَّا ۖ بَلْ ۜ رَانَ (al-Mutaffifin:14). Saktah harus (jaiz): مَالِيَهْ ۜ هَلَكَ (al-Haqqah:28-29) dan antara al-Anfal–al-Taubah.",
          "Imalah: memiringkan fathah ke arah kasrah dan alif ke arah ya'. Satu-satunya dalam Hafs: مَجْرٜىٰهَا (Hud:41) – dibaca 'majreeha'.",
          "Isymam: memuncungkan dua bibir selepas mensukunkan huruf, tanpa suara, sebagai isyarat dhammah. Contoh Hafs: لَا تَأْمَ۫نَّا (Yusuf:11) – isymam pada nun pertama (atau raum). Juga harus ketika waqaf pada huruf berbaris dhammah: نَسْتَعِينُ.",
          "Raum: membaca sebahagian (sepertiga) baris dengan suara perlahan ketika waqaf. Harus pada dhammah dan kasrah: نَسْتَعِينُ، ٱلرَّحِيمِ. Dalam تَأْمَ۫نَّا boleh raum ketika wasal.",
          "Tashil: menyebut hamzah antara hamzah dan alif (bain-bain). Dalam Hafs: ءَا۬عْجَمِىٌّ (Fussilat:44) – hamzah kedua ditashilkan (wajib). Harus tashil juga pada mad farq: ءَآلذَّكَرَيْنِ، ءَآللَّهُ، ءَآلْـَٰٔنَ.",
          "Ibdal: menukar hamzah kedua kepada huruf mad (alif) dengan panjang 6 harakat – pada mad farq (wajah pertama).",
          "Naqal: memindahkan baris hamzah kepada huruf sukun sebelumnya dan membuang hamzah. Dalam Hafs: بِئْسَ ٱلِٱسْمُ (al-Hujurat:11) dibaca بِئْسَ لِسْمُ – lam diberi kasrah (dari sudut amalan, ia termasuk bab naqal menurut sebahagian ulama).",
          "Sin kecil di atas/bawah: وَيَبْصُۜطُ (al-Baqarah:245) dan بَصْۜطَةً (al-A'raf:69) – sin kecil di atas: dibaca dengan SIN (lebih utama/ wajib bagi Hafs Syatibi). ٱلْمُصَۣيْطِرُونَ (al-Tur:37) – harus sin atau sad (sad diutamakan). بِمُصَيْطِرٍ (al-Ghasyiyah:22) – sad sahaja.",
          "ضَعْفٍ / ضَعْفًا (al-Rum:54): harus dibaca fathah (ضَعْف) atau dhammah (ضُعْف) pada dhad – kedua-duanya sahih bagi Hafs; fathah diutamakan.",
          "Silah ha' dhamir khas: فِيهِۦ مُهَانًا (al-Furqan:69) dibaca dengan silah (2 harakat) walaupun didahului ya' sakinah. يَرْضَهُ لَكُمْ (al-Zumar:7) tanpa silah. أَرْجِهْ (al-A'raf:111, al-Syu'ara':36) – ha' sukun.",
          "لَئِنۢ بَسَطتَ (al-Ma'idah:28): iqlab pada لَئِن (nun + ب), dan بَسَطتَ – idgham mutajanisain naqis ط ke ت (itbaq kekal).",
        ],
        jadual: { caption: "Kalimah gharib yang kerap disoal", head: ["Kalimah", "Nama bacaan"], rows: [
          ["مَجْرٜىٰهَا (Hud:41)", "Imalah"], ["لَا تَأْمَ۫نَّا (Yusuf:11)", "Isymam (atau raum)"], ["ءَا۬عْجَمِىٌّ (Fussilat:44)", "Tashil hamzah kedua"], ["مَنْ ۜ رَاقٍ (al-Qiyamah:27)", "Saktah"], ["بَلْ ۜ رَانَ (al-Mutaffifin:14)", "Saktah"], ["عِوَجَا ۜ قَيِّمًا (al-Kahf:1)", "Saktah"], ["مِن مَّرْقَدِنَا ۜ (Yasin:52)", "Saktah"], ["بِئْسَ ٱلِٱسْمُ (al-Hujurat:11)", "Naqal/ibtida' khas – dibaca لِسْمُ"], ["فِيهِۦ مُهَانًا (al-Furqan:69)", "Silah (mad silah)"], ["ءَآلذَّكَرَيْنِ، ءَآللَّهُ", "Mad farq (ibdal 6 / tashil)"], ["وَيَبْصُۜطُ", "Dibaca sin"], ["ٱلْمُصَۣيْطِرُونَ", "Harus sin/sad (sad diutamakan)"], ["ضَعْف (al-Rum:54)", "Harus fathah/dhammah dhad"],
        ] },
        pengukuhan: ["Nyatakan nama bacaan pada: مَجْرٜىٰهَا، تَأْمَ۫نَّا، ءَا۬عْجَمِىٌّ، مَنْ ۜ رَاقٍ، بِئْسَ ٱلِٱسْمُ.", "Senaraikan empat tempat saktah wajib menurut Hafs (Syatibi)."],
        ringkas: "Imalah: مجريها. Isymam: تأمنا. Tashil: ءاعجمي. Saktah ×4: عوجا، مرقدنا، من راق، بل ران.",
      },
      {
        id: "b12-rasm", title: "Iltiqa' al-Sakinain dan Tanda Khas Rasm Uthmani",
        huraian: [
          "Iltiqa' al-sakinain: bertemunya dua huruf sukun. Cara mengatasi: (1) membuang huruf mad pertama jika ia huruf mad (فِى ٱلْأَرْضِ dibaca fil-ardh); (2) memberi baris pada huruf sukun pertama – biasanya kasrah: قُلِ ٱللَّهُمَّ، أَحَدٌ ٱللَّهُ (tanwin + kasrah: aḥadunillāh); dhammah pada mim jamak: عَلَيْهِمُ ٱلْقِتَالُ; fathah pada مِنَ ٱللَّهِ dan mim الٓمٓ ۝ ٱللَّهُ.",
          "Tanda sifr mustadir (bulat) ۟ di atas huruf 'illah: huruf itu tambahan dan TIDAK dibaca langsung, sama ada ketika wasal atau waqaf. Contoh: قَالُوا۟ (alif selepas waw jamak), أُو۟لَٰٓئِكَ (waw), بِأَيْي۟دٍ (ya' kedua – al-Dhariyat:47), مَلَإِي۟هِۦ.",
          "Tanda sifr mustatil (segi empat tegak) ۠ di atas alif yang diikuti huruf berbaris: alif itu TIDAK dibaca ketika wasal tetapi DIBACA ketika waqaf. Contoh: أَنَا۠ خَيْرٌ، لَّٰكِنَّا۠ هُوَ ٱللَّهُ (al-Kahf:38), ٱلظُّنُونَا۠ (al-Ahzab:10), ٱلرَّسُولَا۠، ٱلسَّبِيلَا۠. (Nota: sesetengah fon/mushaf digital memaparkan kedua-dua tanda hampir serupa – rujuk mushaf cetak.)",
          "Huruf kecil (ۦ ۥ): huruf mad tambahan yang dibaca (cth. silah: إِنَّهُۥ، بِهِۦ) atau huruf yang dibuang dalam rasm: إِنَّ وَلِۦِّىَ ٱللَّهُ (al-A'raf:196) – ya' kecil dibaca.",
          "Nun kecil (ۨ): نُۨجِى ٱلْمُؤْمِنِينَ (al-Anbiya':88) – ditulis dengan satu nun tetapi dibaca dengan dua nun (nunjī) dengan ikhfa' pada nun kedua (sakinah) ke jim.",
          "Mim kecil (ۢ) atas nun/tanwin: iqlab – كِرَامٍۭ بَرَرَةٍ ('Abasa:16).",
          "Tanwin bersusun selari = izhar; tanwin berselang = idgham/ikhfa'/iqlab – جَزَآءً ٱلْحُسْنَىٰ (al-Kahf:88): tanwin selari dan bertemu hamzah wasal → nun dibaca dengan kasrah (jazā'anil-ḥusnā).",
          "Tanda madd (ٓ) di atas huruf: mad far'i melebihi 2 harakat. Alif dengan kepala sad (ٱ): hamzah wasal. أَ: hamzah qat' berbaris fathah. آ: hamzah diikuti alif mad (mad badal). Tanda ٜ (titik di bawah ra' مَجْرٜىٰهَا): imalah. Tanda ۫ (titik/belah ketupat di atas): isymam. Tanda ۬ (titik di bawah): tashil.",
        ],
        pengukuhan: ["Berikan maksud tanda pada: لَّٰكِنَّا۠ هُوَ، جَزَآءً ٱلْحُسْنَىٰ، وَلِۦِّىَ ٱللَّهُ، نُۨجِى، كِرَامٍۭ."],
        ringkas: "Sifr bulat = tidak dibaca langsung; sifr bujur = dibaca ketika waqaf sahaja.",
      },
      {
        id: "b12-isu", title: "Isu Semasa: Lagu, Maqamat, Rumi dan Sanad",
        huraian: [
          "Melagukan al-Quran (taghanni): hadith «لَيْسَ مِنَّا مَنْ لَمْ يَتَغَنَّ بِالْقُرْآنِ» (riwayat Abu Daud dan lain-lain). Ulama mentafsirkan taghanni sebagai memperelokkan suara, membaca dengan sedih dan khusyuk, atau merasa cukup dengan al-Quran. Lagu diharuskan selagi tidak melanggar hukum tajwid (tidak menambah/mengurang mad, huruf atau baris). Jika lagu menyebabkan pelanggaran qasr dan mad, hukumnya haram.",
          "Bacaan maqamat dalam solat: harus jika menjaga tajwid dan tidak menjejaskan kekhusyukan; makruh/haram jika menyebabkan kesalahan bacaan atau berlebih-lebihan.",
          "Menulis/membaca al-Quran dalam tulisan rumi: majoriti ulama dan fatwa semasa tidak mengharuskan menulis al-Quran sepenuhnya dalam huruf rumi sebagai ganti mushaf kerana tidak dapat menepati sebutan huruf Arab dan rasm Uthmani; keperluan terhad (transliterasi sementara untuk pembelajaran) dibincangkan oleh ulama dengan syarat-syarat. Rujuk keputusan fatwa negeri.",
          "Ijazah bersanad: bukan syarat sah mengajar asas al-Quran, tetapi sangat dituntut bagi menjaga ketepatan bacaan; guru hendaklah sekurang-kurangnya mempunyai bacaan yang betul dan tauliah daripada pihak berkuasa agama negeri.",
          "Membaca al-Quran tanpa wuduk (tanpa menyentuh mushaf) – harus. Menyentuh mushaf tanpa wuduk – haram menurut mazhab Syafi'i. Perempuan haid – haram membaca al-Quran dengan niat qiraah dan menetap di masjid menurut mazhab Syafi'i.",
        ],
        pengukuhan: ["Jelaskan pendapat anda tentang hadith «ليس منا من لم يتغن بالقرآن»."],
        ringkas: "Lagu harus selagi tajwid terpelihara. Rumi tidak menggantikan mushaf. Sanad sangat dituntut.",
      },
    ],
    refs: [ref("hidayah", "Bab al-idgham; bab al-qalqalah; bab gharib riwayat Hafs"), ref("nihayah", "Bab al-saktah, al-isymam, al-imalah"), ref("nasyr", "Bab al-idgham al-saghir"), ref("tibyan", "Fasal melagukan al-Quran")],
    mindmap: { root: "Lanjutan", branches: [
      { label: "Idgham", leaves: ["Mithlain", "Mutajanisain", "Mutaqaribain"] }, { label: "Qalqalah", leaves: ["Sughra", "Kubra"] },
      { label: "Gharib Hafs", leaves: ["Imalah", "Isymam", "Tashil", "Saktah ×4", "Naqal"] }, { label: "Rasm", leaves: ["Sifr bulat", "Sifr bujur", "Mim kecil", "Nun kecil"] },
    ] },
    flashcards: [
      { front: "مَجْرٜىٰهَا?", back: "Imalah – satu-satunya dalam riwayat Hafs." }, { front: "لَا تَأْمَ۫نَّا?", back: "Isymam (atau raum)." },
      { front: "ءَا۬عْجَمِىٌّ?", back: "Tashil hamzah kedua." }, { front: "Empat saktah wajib Hafs?", back: "عوجا (al-Kahf), مرقدنا (Yasin), من راق (al-Qiyamah), بل ران (al-Mutaffifin)." },
      { front: "قَد تَّبَيَّنَ?", back: "Idgham mutajanisain saghir (د→ت)." }, { front: "بَل رَّفَعَهُ?", back: "Idgham mutaqaribain saghir (ل→ر)." },
    ],
  },
];
