import type { Chapter } from "../types";
import { ref } from "./refs";

// BAB 5 – BAB 9
export const chaptersB: Chapter[] = [
  {
    id: "b5", no: 5, icon: "م",
    title: "Hukum Mim Sakinah", arabTitle: "أحكام الميم الساكنة",
    summary: "Ikhfa' syafawi, idgham mithlain saghir (idgham mimi) dan izhar syafawi.",
    sections: [
      {
        id: "b5-hukum", title: "Tiga Hukum Mim Sakinah",
        takrif: "Mim sakinah ialah mim yang tidak berbaris (sukun) tetap ketika wasal dan waqaf.",
        huraian: [
          "Al-Jamzuri: «وَالْمِيمُ إِنْ تَسْكُنْ تَجِي قَبْلَ الْهِجَا ۞ لَا أَلِفٍ لَيِّنَةٍ لِذِي الْحِجَا ۞ أَحْكَامُهَا ثَلَاثَةٌ لِمَنْ ضَبَطْ ۞ إِخْفَاءٌ ادْغَامٌ وَإِظْهَارٌ فَقَطْ».",
          "1) Ikhfa' syafawi: mim sakinah bertemu ب. Dibaca dengan menyembunyikan mim beserta ghunnah 2 harakat di bibir. Contoh: تَرْمِيهِم بِحِجَارَةٍ (al-Fil:4), وَهُم بِٱلْءَاخِرَةِ.",
          "2) Idgham mithlain saghir (idgham mimi): mim sakinah bertemu mim berbaris. Dibaca dengan memasukkan mim pertama ke dalam mim kedua beserta ghunnah 2 harakat (idgham wajib al-ghunnah). Contoh: لَهُم مَّا، أَم مَّنْ، فِى قُلُوبِهِم مَّرَضٌ.",
          "3) Izhar syafawi: mim sakinah bertemu selain ب dan م (26 huruf). Dibaca dengan jelas tanpa dengung. Lebih dijaga apabila bertemu و dan ف kerana dekat makhraj dan sama makhraj: عَلَيْهِمْ وَلَا، هُمْ فِيهَا.",
        ],
        jadual: { head: ["Hukum", "Huruf", "Ghunnah", "Contoh"], rows: [
          ["Ikhfa' syafawi", "ب", "Ada (2 harakat)", "تَرْمِيهِم بِحِجَارَةٍ"], ["Idgham mithlain saghir", "م", "Ada (2 harakat)", "لَهُم مَّا"], ["Izhar syafawi", "26 huruf lain", "Tiada", "أَلَمْ تَرَ، عَلَيْهِمْ وَلَا"],
        ] },
        kesalahan: ["Mendengungkan mim sebelum و atau ف (sepatutnya izhar syafawi yang dijaga).", "Menekan dua bibir dengan kuat ketika ikhfa' syafawi."],
        perbandingan: ["Ikhfa' syafawi vs iqlab: Persamaan – kedua-duanya berlaku sebelum ب dan berdengung 2 harakat di bibir. Perbezaan – (1) ikhfa' syafawi berasal daripada mim sakinah asli, iqlab daripada nun sakinah/tanwin yang ditukar; (2) iqlab ditandai mim kecil dalam mushaf, ikhfa' syafawi tidak; (3) iqlab boleh berlaku dalam satu kalimah (أَنۢبِئْهُم), ikhfa' syafawi hanya antara dua kalimah."],
        pengukuhan: ["Senaraikan tiga hukum mim sakinah beserta contoh.", "Nyatakan dua persamaan dan tiga perbezaan antara iqlab dan ikhfa' syafawi."],
        ringkas: "Mim sakinah: +ب ikhfa' syafawi; +م idgham mimi; selainnya izhar syafawi.",
      },
    ],
    refs: [ref("tuhfah", "Ahkam al-mim al-sakinah"), ref("hidayah", "Bab al-mim al-sakinah")],
    mindmap: { root: "Mim Sakinah", branches: [{ label: "Ikhfa' Syafawi", leaves: ["ب"] }, { label: "Idgham Mimi", leaves: ["م"] }, { label: "Izhar Syafawi", leaves: ["26 huruf", "jaga و ف"] }] },
    flashcards: [
      { front: "Mim sakinah bertemu ب?", back: "Ikhfa' syafawi – dengung 2 harakat." },
      { front: "Mim sakinah bertemu و atau ف?", back: "Izhar syafawi – lebih dijaga kejelasannya." },
    ],
  },

  {
    id: "b6", no: 6, icon: "نّ",
    title: "Mim dan Nun Musyaddadah", arabTitle: "الميم والنون المشددتان",
    summary: "Ghunnah wajib pada nun dan mim bertasydid, kadar dengung dan martabat ghunnah.",
    sections: [
      {
        id: "b6-ghunnah", title: "Ghunnah Musyaddadah",
        takrif: "Nun/mim musyaddadah ialah nun atau mim yang bertasydid. Hukumnya: wajib ghunnah (dengung) dengan kadar 2 harakat, disebut ghunnah musyaddadah atau wajib al-ghunnah.",
        huraian: [
          "Al-Jamzuri: «وَغُنَّ مِيمًا ثُمَّ نُونًا شُدِّدَا ۞ وَسَمِّ كُلًّا حَرْفَ غُنَّةٍ بَدَا».",
          "Ghunnah ialah suara sedap yang keluar dari pangkal hidung (khaisyum); ia sifat lazim bagi nun dan mim.",
          "Martabat ghunnah (dari paling sempurna): (1) nun/mim bertasydid dan idgham bi ghunnah kamil; (2) ikhfa' dan iqlab; (3) nun/mim sakinah yang diizharkan; (4) nun/mim berbaris (paling sedikit).",
          "Tafkhim dan tarqiq ghunnah: ghunnah IKHFA' mengikut huruf SELEPASNYA – ditebalkan (tafkhim) jika huruf selepasnya isti'la' (cth. مِن قَبْلُ، يَنطِقُ، مِن طِينٍ) dan dinipiskan (tarqiq) jika istifal (cth. أَنتُمْ، مِن تَحْتِهَا). Ghunnah nun/mim bertasydid dibaca dengan kadar sempurna tanpa ditebalkan secara berlebihan.",
        ],
        contoh: [
          { arab: "إِنَّ", huraian: "Nun bertasydid – dengung 2 harakat." }, { arab: "ثُمَّ", huraian: "Mim bertasydid." },
          { arab: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ", ref: "al-Nas:6", huraian: "Dua nun bertasydid." }, { arab: "عَمَّ يَتَسَآءَلُونَ", ref: "al-Naba':1", huraian: "Mim bertasydid." },
        ],
        jadual: { head: ["Contoh", "Huruf", "Kadar"], rows: [["إِنَّ، ٱلنَّاسِ", "Nun musyaddadah", "2 harakat"], ["ثُمَّ، عَمَّ", "Mim musyaddadah", "2 harakat"]] },
        kesalahan: ["Memendekkan dengung pada إِنَّ ketika bacaan hadr.", "Melebihkan dengung hingga melebihi 2 harakat secara ketara."],
        pengukuhan: ["Apakah maksud nun musyaddadah dan mim musyaddadah? Nyatakan hukum serta contoh."],
        ringkas: "ن/م bertasydid → wajib ghunnah 2 harakat.",
      },
    ],
    refs: [ref("tuhfah", "Hukm al-nun wa al-mim al-musyaddadatain"), ref("hidayah", "Bab al-ghunnah")],
    mindmap: { root: "Ghunnah", branches: [{ label: "Musyaddadah", leaves: ["نّ", "مّ", "2 harakat"] }, { label: "Martabat", leaves: ["Musyaddad", "Ikhfa'/Iqlab", "Sakinah izhar", "Berbaris"] }] },
    flashcards: [{ front: "Hukum nun bertasydid?", back: "Wajib ghunnah 2 harakat." }],
  },

  {
    id: "b7", no: 7, icon: "ل",
    title: "Hukum Lam", arabTitle: "أحكام اللامات",
    summary: "Lam ta'rif (syamsiyyah & qamariyyah), lam fi'il, lam huruf, lam pada lafaz al-Jalalah – tafkhim dan tarqiq.",
    sections: [
      {
        id: "b7-ta'rif", title: "Lam Ta'rif: Al-Qamariyyah dan Al-Syamsiyyah",
        takrif: "Lam ta'rif ialah lam sakinah tambahan pada (ال) di awal kata nama untuk makrifah.",
        huraian: [
          "Al-Qamariyyah (izhar qamari): lam dibaca jelas apabila bertemu salah satu 14 huruf: «اِبْغِ حَجَّكَ وَخَفْ عَقِيمَهُ». Dinamakan qamariyyah kerana seperti lam pada ٱلْقَمَر.",
          "Al-Syamsiyyah (idgham syamsi): lam tidak dibaca, dimasukkan ke huruf selepasnya yang bertasydid, apabila bertemu 14 huruf lagi: «طِبْ ثُمَّ صِلْ رَحْمًا تَفُزْ ضِفْ ذَا نِعَمْ ۞ دَعْ سُوءَ ظَنٍّ زُرْ شَرِيفًا لِلْكَرَمْ» (huruf pertama setiap kalimah). Dinamakan syamsiyyah kerana seperti ٱلشَّمْس.",
        ],
        dhobit: [{ arab: "اِبْغِ حَجَّكَ وَخَفْ عَقِيمَهُ", teks: "14 huruf qamariyyah: ا ب غ ح ج ك و خ ف ع ق ي م ه" }, { arab: "طِبْ ثُمَّ صِلْ رَحْمًا تَفُزْ ضِفْ ذَا نِعَمْ ۞ دَعْ سُوءَ ظَنٍّ زُرْ شَرِيفًا لِلْكَرَمْ", teks: "14 huruf syamsiyyah: ط ث ص ر ت ض ذ ن د س ظ ز ش ل" }],
        jadual: { head: ["Aspek", "Qamariyyah", "Syamsiyyah"], rows: [
          ["Sebutan lam", "Jelas (izhar)", "Tidak disebut (idgham)"], ["Tanda dalam mushaf", "Lam bersukun (ٱلْ)", "Huruf selepasnya bertasydid"], ["Contoh", "ٱلْقَمَرُ، ٱلْحَمْدُ، ٱلْكِتَٰبُ", "ٱلشَّمْسُ، ٱلرَّحْمَٰنِ، ٱلنَّاسِ"],
        ] },
        kesalahan: ["Membaca lam pada ٱلشَّمْسُ.", "Mengidghamkan lam pada ٱلْيَوْمَ."],
        pengukuhan: ["Jelaskan perbezaan al-syamsiyyah dan al-qamariyyah serta dua contoh setiap satu.", "Apakah maksud rangkai kata أَبْغِ حَجَّكَ وَخَفْ عَقِيمَهُ?"],
        ringkas: "Qamariyyah: jelas (ابغ حجك وخف عقيمه). Syamsiyyah: lam lebur (huruf bertasydid).",
      },
      {
        id: "b7-lainlam", title: "Lam Fi'il, Lam Huruf dan Lam Amr",
        huraian: [
          "Lam fi'il sakinah: wajib izhar kecuali bertemu ل dan ر, maka diidghamkan: قُل رَّبِّ (idgham mutaqaribain), قُل لَّهُمْ (idgham mithlain). Contoh izhar: أَلْتَقَمَهُ، قُلْنَا، ٱلْتَقَى.",
          "Lam huruf (هَلْ، بَلْ): izhar kecuali bertemu ل dan ر: بَل رَّفَعَهُ (idgham mutaqaribain saghir), هَل لَّكُمْ (idgham mithlain). Pengecualian Hafs: بَلْ ۜ رَانَ dibaca saktah, tidak diidghamkan.",
        ],
        contoh: [{ arab: "قُل رَّبِّ", huraian: "Lam fi'il + ra' → idgham." }, { arab: "بَل رَّفَعَهُ ٱللَّهُ", ref: "al-Nisa':158", huraian: "Lam huruf + ra' → idgham mutaqaribain saghir." }, { arab: "فَهَلْ وَجَدتُّم", ref: "al-A'raf:44", huraian: "Lam huruf + waw → izhar." }],
        ringkas: "Lam fi'il/huruf: izhar, kecuali bertemu ل ر → idgham.",
      },
      {
        id: "b7-jalalah", title: "Lam pada Lafaz al-Jalalah",
        huraian: [
          "Tafkhim (tebal / taghliz): apabila didahului fathah atau dhammah, atau dimulakan bacaan dengannya. Contoh: قَالَ ٱللَّهُ، رَسُولُ ٱللَّهِ، ٱللَّهُ لَآ إِلَٰهَ.",
          "Tarqiq (nipis): apabila didahului kasrah (asli atau mendatang). Contoh: بِسْمِ ٱللَّهِ، قُلِ ٱللَّهُمَّ (kasrah mendatang kerana iltiqa' sakinain), أَحَدٌ ٱللَّهُ (tanwin dikasrahkan).",
        ],
        jadual: { head: ["Huruf sebelum", "Hukum", "Contoh"], rows: [["Fathah", "Tafkhim", "شَهِدَ ٱللَّهُ"], ["Dhammah", "Tafkhim", "عَبْدُ ٱللَّهِ"], ["Kasrah", "Tarqiq", "بِسْمِ ٱللَّهِ"], ["Ibtida'", "Tafkhim", "ٱللَّهُ ٱلصَّمَدُ"]] },
        kesalahan: ["Menebalkan lam Allah selepas kasrah: بِسْمِ ٱللَّهِ.", "Menebalkan huruf lam selain lafaz al-Jalalah (cth. ٱلصَّلَوٰةَ – lam di sini nipis menurut riwayat Hafs)."],
        pengukuhan: ["Bilakah lam lafaz al-Jalalah dibaca tebal dan bilakah nipis? Berikan contoh."],
        ringkas: "Lam Allah: fathah/dhammah → tebal; kasrah → nipis.",
      },
    ],
    refs: [ref("tuhfah", "Ahkam lam al dan lam al-fi'l"), ref("jazariyyah", "Bab al-lamat"), ref("hidayah", "Bab al-lamat")],
    mindmap: { root: "Hukum Lam", branches: [{ label: "Lam Ta'rif", leaves: ["Qamariyyah 14", "Syamsiyyah 14"] }, { label: "Lam Fi'il/Huruf", leaves: ["Izhar", "Idgham ل ر"] }, { label: "Lafaz Allah", leaves: ["Tafkhim: fathah/dhammah", "Tarqiq: kasrah"] }] },
    flashcards: [
      { front: "ٱلرَّحْمَٰنِ – hukum lam?", back: "Al-syamsiyyah (idgham syamsi)." },
      { front: "Lam Allah selepas kasrah?", back: "Tarqiq (nipis)." },
    ],
  },

  {
    id: "b8", no: 8, icon: "ر",
    title: "Hukum Ra'", arabTitle: "أحكام الراء",
    summary: "Keadaan ra' dibaca tafkhim, tarqiq dan harus kedua-dua wajah.",
    sections: [
      {
        id: "b8-tafkhim", title: "Ra' Tafkhim (Tebal)",
        huraian: [
          "1. Ra' berbaris fathah atau dhammah: رَبِّ، رُزِقُوا۟، صِرَٰطَ.",
          "2. Ra' sakinah selepas fathah atau dhammah: مَرْيَمَ، ٱلْقُرْءَانَ (ق-ر), وَٱلْفَجْرِ (ketika wasal dibaca kasrah – lihat tarqiq).",
          "3. Ra' sakinah selepas kasrah mendatang ('aridh): ٱرْجِعِىٓ، ٱرْتَضَىٰ (hamzah wasal), أَمِ ٱرْتَابُوٓا۟.",
          "4. Ra' sakinah selepas kasrah asli tetapi diikuti huruf isti'la' yang berbaris fathah/dhammah dalam satu kalimah: قِرْطَاسٍ، مِرْصَادًا، فِرْقَةٍ، إِرْصَادًا.",
          "5. Ra' sakinah kerana waqaf, sebelumnya huruf berbaris fathah/dhammah, atau sebelumnya huruf sukun (bukan ya') yang didahului fathah/dhammah: ٱلْقَدْرِ (waqaf: ٱلْقَدْرْ), ٱلْعُسْرِ.",
          "6. Ra' sakinah kerana waqaf selepas alif atau waw mad: ٱلْأَبْرَارِ (waqaf), غَفُورٌ.",
        ],
        contoh: [{ arab: "صِرَٰطَ", ref: "al-Fatihah:7", huraian: "Ra' berbaris fathah – tafkhim." }, { arab: "فِرْعَوْنَ", ref: "al-Baqarah:49", huraian: "Ra' sakinah selepas kasrah asli, selepasnya huruf istifal (ع) → tarqiq." }, { arab: "مِرْصَادًا", ref: "al-Naba':21", huraian: "Ra' sakinah selepas kasrah, diikuti ص (isti'la') berbaris → tafkhim." }, { arab: "لِمَنِ ٱرْتَضَىٰ", ref: "al-Anbiya':28", huraian: "Kasrah mendatang (hamzah wasal) → tafkhim." }],
        ringkas: "Tebal: berbaris fathah/dhammah; sakinah selepas fathah/dhammah; selepas kasrah mendatang; selepas kasrah asli + isti'la'.",
      },
      {
        id: "b8-tarqiq", title: "Ra' Tarqiq (Nipis) dan Harus Dua Wajah",
        huraian: [
          "Tarqiq: (1) Ra' berbaris kasrah: رِجَالٌ، ٱلرِّقَابِ، شَرِّ (al-Falaq). (2) Ra' sakinah selepas kasrah asli dalam satu kalimah dan tiada huruf isti'la' selepasnya: فِرْعَوْنَ، مِرْيَةٍ، شِرْعَةً. (3) Ra' sakinah kerana waqaf selepas ya' sakinah (mad atau lin): خَبِيرٌ، خَيْرٌ (waqaf). (4) Ra' sakinah kerana waqaf selepas kasrah: مُنْهَمِرٍ (waqaf); atau sebelumnya huruf sukun bukan isti'la' didahului kasrah: ٱلذِّكْرِ، سِحْرٍ.",
          "Harus dua wajah (tafkhim & tarqiq): (1) فِرْقٍ (al-Syu'ara':63) – ra' sakinah selepas kasrah dan huruf isti'la' (ق) berbaris kasrah; tarqiq lebih utama di sisi ramai. (2) Waqaf pada مِصْرَ (tafkhim lebih utama), ٱلْقِطْرِ (tarqiq lebih utama) – ra' didahului huruf isti'la' sakinah selepas kasrah. (3) Waqaf pada يَسْرِ (al-Fajr:4), وَنُذُرِ (al-Qamar) – ada ya' yang dibuang; tarqiq lebih utama. (4) Ketika wasal pada ٱلْفَجْرِ dsb tiada masalah.",
          "Ra' dalam مَجْرٜىٰهَا dibaca dengan imalah (tarqiq), bukan tafkhim.",
        ],
        jadual: { head: ["Kalimah", "Hukum", "Sebab"], rows: [
          ["مَرْيَمَ", "Tafkhim", "Ra' sakinah selepas fathah"], ["خَيْرٌ (waqaf)", "Tarqiq", "Sakinah kerana waqaf selepas ya' sakinah"], ["مِصْرَ (waqaf)", "Harus dua wajah (tafkhim diutamakan)", "Huruf isti'la' sakinah sebelum ra'"], ["فِرْقٍ", "Harus dua wajah (tarqiq diutamakan)", "Huruf isti'la' selepas ra' berbaris kasrah"], ["فِرْعَوْنَ", "Tarqiq", "Sakinah selepas kasrah asli, tiada isti'la'"], ["قِرْطَاسٍ", "Tafkhim", "Selepasnya huruf isti'la' berbaris"], ["شِرْكٌ", "Tarqiq", "Sakinah selepas kasrah asli"], ["صَبَرُوا۟", "Tafkhim", "Ra' berbaris fathah"],
        ] },
        kesalahan: ["Menebalkan ra' pada فِرْعَوْنَ.", "Menipiskan ra' pada قِرْطَاسٍ."],
        pengukuhan: ["Huraikan tiga keadaan ra' dibaca tafkhim dan tiga keadaan tarqiq.", "Berikan dua contoh ra' yang harus dibaca dua wajah serta sebabnya."],
        ringkas: "Nipis: kasrah; sakinah selepas kasrah asli tanpa isti'la'; waqaf selepas ya'. Dua wajah: فرق، مصر، القطر، يسر.",
      },
    ],
    refs: [ref("jazariyyah", "Bab al-ra'at"), ref("hidayah", "Bab ahkam al-ra'"), ref("nihayah", "Bab al-ra'")],
    mindmap: { root: "Hukum Ra'", branches: [{ label: "Tafkhim", leaves: ["Fathah/dhammah", "Sakinah selepas fathah/dhammah", "Kasrah mendatang", "Isti'la' selepas"] }, { label: "Tarqiq", leaves: ["Kasrah", "Sakinah selepas kasrah asli", "Waqaf selepas ya'"] }, { label: "Dua wajah", leaves: ["فرق", "مصر", "القطر", "يسر/نذر"] }] },
    flashcards: [{ front: "قِرْطَاسٍ – hukum ra'?", back: "Tafkhim – ra' sakinah selepas kasrah asli tetapi diikuti ط (isti'la') berbaris." }, { front: "فِرْقٍ – hukum ra'?", back: "Harus tafkhim & tarqiq (tarqiq diutamakan)." }],
  },

  {
    id: "b9", no: 9, icon: "مد",
    title: "Hukum Mad", arabTitle: "أحكام المد",
    summary: "Mad asli dan mad far'i: wajib muttasil, jaiz munfasil, lazim, 'aridh lissukun, badal, lin, silah, tamkin, farq, 'iwadh, serta kadar harakat.",
    sections: [
      {
        id: "b9-asli", title: "Takrif Mad dan Mad Asli (Tabi'i)",
        takrif: "Mad pada bahasa: tambahan/panjang. Pada istilah: memanjangkan suara dengan huruf mad. Qasr: membaca huruf mad dengan kadar asli tanpa tambahan.",
        huraian: [
          "Huruf mad tiga: alif sakinah selepas fathah, waw sakinah selepas dhammah, ya' sakinah selepas kasrah – terkumpul dalam نُوحِيهَا.",
          "Mad asli/tabi'i: mad yang tidak bergantung kepada sebab hamzah atau sukun; dibaca 2 harakat. Satu harakat ialah kadar menyebut satu baris (kadar menggenggam/membuka satu jari secara sederhana).",
          "Mad asli kilmi (mutlaq): dalam kalimah – قَالَ، يَقُولُ، قِيلَ.",
          "Mad asli harfi (thuna'i): pada huruf muqatta'ah yang ejaannya dua huruf: حَيٌّ طَهُرَ (ح ي ط ه ر) – cth. طه، حمٓ (ha), يسٓ (ya), الٓر (ra).",
          "Mad yang termasuk kategori mad asli: mad 'iwadh, mad silah qasirah, mad tamkin, mad badal (menurut riwayat Hafs, 2 harakat).",
        ],
        dhobit: [{ arab: "نُوحِيهَا", teks: "Huruf mad: ا و ي" }, { arab: "حَيٌّ طَهُرَ", teks: "Mad asli harfi (2 harakat)" }],
        ringkas: "Mad asli 2 harakat; tiada sebab hamzah/sukun.",
      },
      {
        id: "b9-hamzah", title: "Mad Far'i kerana Hamzah",
        takrif: "Mad far'i ialah mad tambahan atas mad asli disebabkan hamzah atau sukun.",
        huraian: [
          "Mad wajib muttasil: huruf mad bertemu hamzah dalam satu kalimah. Kadar: 4 atau 5 harakat (Hafs, tariq al-Syatibiyyah); 6 harakat jika waqaf pada hamzah di hujung. Contoh: جَآءَ، ٱلسَّمَآءِ، سُوٓءَ.",
          "Mad jaiz munfasil: huruf mad di hujung kalimah, hamzah di awal kalimah berikut. Kadar: 4 atau 5 harakat (Hafs, Syatibiyyah; harus 2 melalui tariq lain). Contoh: بِمَآ أُنزِلَ، يَٰٓأَيُّهَا، قُوٓا۟ أَنفُسَكُمْ.",
          "Mad silah tawilah: ha' dhamir (ganti nama) yang berada antara dua huruf berbaris, dan selepasnya hamzah – dibaca 4/5 harakat seperti munfasil: مَالَهُۥٓ أَخْلَدَهُۥ (al-Humazah:3).",
          "Mad badal: hamzah mendahului huruf mad dalam satu kalimah. Kadar Hafs: 2 harakat. Contoh: ءَامَنُوا۟، إِيمَٰنًا، أُوتُوا۟.",
        ],
        jadual: { head: ["Mad", "Kedudukan", "Kadar (Hafs/Syatibi)", "Contoh"], rows: [
          ["Wajib muttasil", "Mad + hamzah satu kalimah", "4/5 (6 waqaf)", "جَآءَ"], ["Jaiz munfasil", "Mad + hamzah dua kalimah", "4/5", "إِنَّآ أَعْطَيْنَٰكَ"], ["Silah tawilah", "Ha' dhamir + hamzah", "4/5", "مَالَهُۥٓ أَخْلَدَهُۥ"], ["Badal", "Hamzah sebelum mad", "2", "ءَامَنُوا۟"],
        ] },
        kesalahan: ["Membaca muttasil 2 harakat (lahn).", "Memanjangkan badal lebih daripada 2 bagi riwayat Hafs."],
        pengukuhan: ["Bezakan mad wajib muttasil dan mad jaiz munfasil.", "Terangkan pengertian mad badal, hukum bacaannya dan contoh."],
        ringkas: "Muttasil (satu kalimah) & munfasil (dua kalimah): 4/5. Badal: 2.",
      },
      {
        id: "b9-sukun", title: "Mad Far'i kerana Sukun",
        huraian: [
          "Mad lazim: huruf mad bertemu sukun asli (tetap ketika wasal dan waqaf). Kadar: 6 harakat (lazim). Terbahagi empat:",
          "• Kilmi muthaqqal: dalam kalimah, sukun bertasydid: ٱلضَّآلِّينَ، ٱلطَّآمَّةُ، ٱلْحَآقَّةُ، دَآبَّةٍ، أَتُحَٰٓجُّوٓنِّى/أَتُحَآجُّونَنَا.",
          "• Kilmi mukhaffaf: dalam kalimah, sukun tanpa tasydid: ءَآلْـَٰٔنَ (Yunus:51 & 91) – dua tempat sahaja.",
          "• Harfi muthaqqal: huruf muqatta'ah tiga huruf yang tengahnya mad dan diidghamkan: لٓمٓ dalam الٓمٓ (lam-mim: lam diidghamkan ke mim), سٓمٓ dalam طسٓمٓ.",
          "• Harfi mukhaffaf: huruf muqatta'ah tiga huruf tanpa idgham: مٓ، صٓ، قٓ، نٓ، كٓ (كاف)، سٓ، عٓ (lin – 4 atau 6). Himpunan: نَقَصَ عَسَلُكُمْ (huruf yang dibaca 6 harakat; ع dibaca 4 atau 6).",
          "Mad 'aridh lissukun: huruf mad diikuti huruf yang disukunkan kerana waqaf. Kadar: 2, 4 atau 6 harakat. Contoh waqaf: نَسْتَعِينُ ← نَسْتَعِينْ، يُؤْمِنُونَ ← يُؤْمِنُونْ، ٱلْعَٰلَمِينَ.",
          "Mad lin: waw/ya' sakinah selepas fathah, diikuti huruf yang disukunkan kerana waqaf: خَوْفٍ (waqaf: خَوْفْ)، ٱلْبَيْتِ (waqaf: ٱلْبَيْتْ). Kadar: 2, 4 atau 6. Ketika wasal, huruf lin dibaca tanpa panjang.",
          "Mad farq: mad lazim kilmi muthaqqal yang berlaku kerana hamzah istifham bertemu hamzah wasal pada lam ta'rif, untuk membezakan antara pertanyaan dan berita: ءَآلذَّكَرَيْنِ (al-An'am:143, 144), ءَآللَّهُ (Yunus:59, al-Naml:59), ءَآلْـَٰٔنَ (Yunus:51, 91). Dibaca ibdal (6 harakat) – atau harus tashil (antara hamzah dan alif) tanpa mad.",
          "Mad 'iwadh: waqaf pada tanwin fathah – ditukar kepada alif 2 harakat: عَلِيمًا ← عَلِيمَا. (Kecuali ta' marbutah: waqaf dengan ha' sakinah.)",
          "Mad tamkin: dua ya' bertemu, pertama bertasydid berbaris kasrah dan kedua ya' sakinah (mad): حُيِّيتُم (al-Nisa':86)، ٱلنَّبِيِّـۧنَ، ٱلْأُمِّيِّـۧنَ – dibaca 2 harakat dengan jelas.",
          "Mad silah qasirah: ha' dhamir antara dua huruf berbaris, selepasnya bukan hamzah – 2 harakat: إِنَّهُۥ كَانَ. Pengecualian Hafs: يَرْضَهُ لَكُمْ (al-Zumar:7) tanpa silah; فِيهِۦ مُهَانًا (al-Furqan:69) dengan silah walaupun sebelumnya sukun.",
        ],
        jadual: { caption: "Ringkasan kadar mad (riwayat Hafs, tariq al-Syatibiyyah)", head: ["Mad", "Harakat"], rows: [
          ["Asli/tabi'i, badal, 'iwadh, tamkin, silah qasirah", "2"], ["Wajib muttasil", "4 / 5 (6 jika waqaf)"], ["Jaiz munfasil, silah tawilah", "4 / 5"], ["Lazim (semua jenis), farq", "6"], ["'Aridh lissukun", "2 / 4 / 6"], ["Lin (ketika waqaf)", "2 / 4 / 6"], ["'Ain dalam كهيعص / عسق", "4 / 6"],
        ] },
        kesalahan: ["Membaca mad lazim kurang daripada 6.", "Memanjangkan huruf lin ketika wasal."],
        perbandingan: ["Mad lazim vs mad 'aridh lissukun: lazim = sukun asli (wasal & waqaf), wajib 6; 'aridh = sukun kerana waqaf, harus 2/4/6.", "Huruf lin vs mad lin: huruf lin ialah waw/ya' sakinah selepas fathah (cth. خَوْف ketika wasal); mad lin berlaku apabila huruf selepasnya disukunkan kerana waqaf, maka harus dipanjangkan 2/4/6."],
        pengukuhan: ["Huraikan mad far'i yang disebabkan hamzah dan sukun.", "Berikan contoh mad lazim kilmi mukhaffaf dan mad farq."],
        ringkas: "Lazim 6; 'aridh & lin 2/4/6; farq 6 atau tashil.",
      },
      {
        id: "b9-muqattaah", title: "Huruf Muqatta'ah",
        huraian: [
          "Huruf muqatta'ah (fawatih al-suwar) 14 huruf, terbahagi kepada empat kategori bacaan:",
          "1) Tidak dipanjangkan langsung: alif (ا) – kerana ejaannya tiada huruf mad di tengah: أَلِف.",
          "2) Mad asli harfi (2 harakat): huruf حَيٌّ طَهُرَ – ح ي ط ه ر.",
          "3) Mad lazim harfi (6 harakat): huruf نَقَصَ عَسَلُكُمْ selain 'ain – ن ق ص س ل ك م.",
          "4) 'Ain (ع): dibaca 4 atau 6 harakat (mad lin lazim) dalam كٓهيعٓصٓ dan عٓسٓقٓ; 6 diutamakan.",
          "Contoh: الٓمٓ: alif (tiada mad), lam (6, muthaqqal – idgham ke mim), mim (6, mukhaffaf ketika waqaf). Ketika wasal الٓمٓ ۝ ٱللَّهُ (Ali 'Imran:1-2): mim dibaca fathah (kerana iltiqa' sakinain) – harus 6 (ikut asal) atau 2 (ikut baris mendatang).",
          "كٓهيعٓصٓ: kaf 6, ha 2, ya 2, 'ain 4/6, sad 6 (ikhfa' ke ذِكْرُ ketika wasal). طسٓمٓ: ta 2, sin 6 (idgham ke mim – muthaqqal), mim 6. يسٓ: ya 2, sin 6 (izhar dengan وَٱلْقُرْءَانِ). حمٓ ۝ عٓسٓقٓ: ha 2, mim 6, 'ain 4/6, sin 6 (ikhfa' ke qaf), qaf 6.",
        ],
        jadual: { head: ["Kategori", "Huruf", "Kadar"], rows: [["Tiada mad", "ا", "–"], ["Mad asli harfi", "ح ي ط ه ر", "2"], ["Mad lazim harfi", "ن ق ص س ل ك م", "6"], ["'Ain", "ع", "4 / 6"]] },
        ringkas: "Muqatta'ah: alif tiada mad; حي طهر 2; نقص عسلكم 6; ع 4/6.",
      },
    ],
    refs: [ref("tuhfah", "Aqsam al-mad & ahkam al-mad"), ref("jazariyyah", "Bab al-mad wa al-qasr"), ref("hidayah", "Bab al-mad")],
    mindmap: { root: "Mad", branches: [
      { label: "Asli", leaves: ["Kilmi", "Harfi حي طهر"] }, { label: "Sebab hamzah", leaves: ["Muttasil", "Munfasil", "Badal", "Silah tawilah"] },
      { label: "Sebab sukun", leaves: ["Lazim ×4", "'Aridh lissukun", "Lin", "Farq"] }, { label: "Lain", leaves: ["'Iwadh", "Tamkin", "Silah qasirah"] },
    ] },
    flashcards: [
      { front: "Mad lazim kilmi mukhaffaf?", back: "ءَآلْـَٰٔنَ (Yunus:51 & 91) – 6 harakat." },
      { front: "Mad farq?", back: "Hamzah istifham + hamzah wasal lam ta'rif: ءَآلذَّكَرَيْنِ، ءَآللَّهُ، ءَآلْـَٰٔنَ – 6 harakat atau tashil." },
      { front: "Kadar mad 'aridh lissukun?", back: "2, 4 atau 6 harakat." },
      { front: "Mad tamkin?", back: "Ya' bertasydid berbaris kasrah bertemu ya' mad: حُيِّيتُم، ٱلنَّبِيِّـۧنَ." },
    ],
  },
];
