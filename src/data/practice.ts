import type { Question, PracticeKind, Explanation } from "../types";

// SOALAN LATIHAN (BUKAN soalan rasmi tauliah). Dibina berdasarkan nota aplikasi.
// Status: belum_disemak sehingga disahkan guru penyemak.

type Opt = [string, string?]; // [teks, sebab salah/betul]
const L = ["a", "b", "c", "d"];

function mcq(id: string, ch: string, kind: PracticeKind, d: 1 | 2 | 3, prompt: string, opts: Opt[], correct: number, ex: Explanation, arabic?: string, arabicRef?: string): Question {
  return {
    id: "L-" + id, source: "latihan", type: "mcq", kind, chapterId: ch, difficulty: d, marks: 1, prompt, arabic, arabicRef,
    options: opts.map(([text, why], i) => ({ id: L[i], text, why })), answer: L[correct], explanation: ex, status: "belum_disemak", demo: true,
  };
}
function tf(id: string, ch: string, d: 1 | 2 | 3, prompt: string, isTrue: boolean, ex: Explanation): Question {
  return { id: "L-" + id, source: "latihan", type: "tf", kind: "kefahaman", chapterId: ch, difficulty: d, marks: 1, prompt, answer: isTrue ? "B" : "S", explanation: ex, status: "belum_disemak", demo: true };
}
function fill(id: string, ch: string, d: 1 | 2 | 3, prompt: string, accepted: string[], ex: Explanation): Question {
  return { id: "L-" + id, source: "latihan", type: "fill", kind: "dhobit", chapterId: ch, difficulty: d, marks: 1, prompt, answer: accepted, explanation: ex, status: "belum_disemak", demo: true };
}
function match(id: string, ch: string, d: 1 | 2 | 3, prompt: string, pairs: [string, string][], ex: Explanation): Question {
  return { id: "L-" + id, source: "latihan", type: "match", kind: "perbandingan", chapterId: ch, difficulty: d, marks: pairs.length, prompt, pairs: pairs.map(([left, right]) => ({ left, right })), explanation: ex, status: "belum_disemak", demo: true };
}

export const practiceQuestions: Question[] = [
  // ---------- BAB 1 ----------
  mcq("b1-1", "b1", "kefahaman", 1, "Apakah takrif tajwid pada istilah?", [
    ["Memperelokkan suara ketika membaca", "Ini lebih hampir kepada maksud bahasa/taghanni, bukan takrif istilah."],
    ["Mengeluarkan setiap huruf dari makhrajnya serta memberi hak dan mustahaknya", "Betul – takrif istilah yang masyhur."],
    ["Membaca al-Quran dengan cepat", "Ini maksud hadr, salah satu martabat bacaan."],
    ["Menghafal al-Quran dengan sanad", "Bukan takrif tajwid."],
  ], 1, { why: "Tajwid pada istilah ialah إخراج كل حرف من مخرجه مع إعطائه حقه ومستحقه.", concept: "Haq = sifat lazim; mustahaq = sifat mendatang.", confusion: "Ramai mengelirukan takrif bahasa (memperelokkan) dengan takrif istilah.", refs: ["Al-Muqaddimah al-Jazariyyah – Ibn al-Jazari"] }),
  mcq("b1-2", "b1", "kefahaman", 1, "Hukum BERAMAL dengan tajwid ketika membaca al-Quran ialah…", [["Sunat"], ["Fardu kifayah", "Ini hukum mempelajari teorinya."], ["Fardu 'ain", "Betul."], ["Harus"]], 2, { why: "Beramal (membaca dengan bertajwid) ialah fardu 'ain bagi setiap pembaca; mempelajari teori ialah fardu kifayah.", dhobit: "Ilmu = kifayah; amal = 'ain.", compare: "Bezakan antara hukum ilmu dan hukum amal." }),
  mcq("b1-3", "b1", "kefahaman", 2, "Kesalahan membaca أَنْعَمْتُ bagi أَنْعَمْتَ dalam al-Fatihah termasuk…", [["Lahn khafi", "Lahn khafi tidak mengubah makna."], ["Lahn jali", "Betul – mengubah baris dan makna."], ["Waqaf qabih"], ["Bukan kesalahan"]], 1, { why: "Menukar baris yang mengubah makna ialah lahn jali, hukumnya haram.", confusion: "Lahn khafi hanya melibatkan kesempurnaan sifat/hukum seperti ghunnah dan mad far'i." }, "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ", "al-Fatihah:7"),
  mcq("b1-4", "b1", "kefahaman", 1, "Martabat bacaan yang paling cepat dengan tetap menjaga hukum tajwid ialah…", [["Tahqiq"], ["Tartil"], ["Tadwir", "Tadwir ialah pertengahan."], ["Hadr", "Betul."]], 3, { why: "Hadr = bacaan cepat dengan memelihara hukum." }),
  mcq("b1-5", "b1", "kefahaman", 2, "Wajah manakah yang TIDAK harus antara dua surah?", [["Putus semua"], ["Sambung semua"], ["Putus akhir surah, sambung basmalah dengan awal surah"], ["Sambung akhir surah dengan basmalah, kemudian putus", "Betul – tidak harus kerana menimbulkan sangkaan basmalah sebahagian surah sebelumnya."]], 3, { why: "Menyambung akhir surah dengan basmalah lalu berhenti memberi gambaran basmalah termasuk dalam surah sebelumnya." }),
  mcq("b1-6", "b1", "kefahaman", 1, "Tafsiran Sayyidina Ali RA bagi 'tartil' ialah…", [["Membaca dengan suara merdu"], ["تجويد الحروف ومعرفة الوقوف", "Betul."], ["Membaca dengan cepat"], ["Menghafal ayat"]], 1, { why: "Tartil = mentajwidkan huruf dan mengetahui tempat-tempat waqaf." }),
  tf("b1-t1", "b1", 1, "Isti'adhah disunatkan dibaca secara perlahan ketika seseorang membaca al-Quran secara bersendirian.", true, { why: "Sirr: bersendirian, membaca perlahan, dalam solat, atau bukan pembaca pertama dalam majlis bergilir." }),
  tf("b1-t2", "b1", 1, "Basmalah wajib dibaca di awal surah al-Taubah.", false, { why: "Surah al-Taubah tidak dimulakan dengan basmalah; terdapat tiga wajah menyambung al-Anfal dengan al-Taubah: waqaf, saktah, wasal." }),
  tf("b1-t3", "b1", 2, "Sujud syukur boleh dilakukan di dalam solat.", false, { why: "Sujud syukur dilakukan di luar solat; yang boleh di dalam solat ialah sujud tilawah." }),

  // ---------- BAB 2 ----------
  mcq("b2-1", "b2", "dhobit", 1, "Berapakah bilangan makhraj khas menurut pendapat jumhur (Ibn al-Jazari)?", [["14", "Pendapat al-Farra'."], ["16", "Pendapat Sibawaih & al-Syatibi."], ["17", "Betul."], ["29"]], 2, { why: "مخارج الحروف سبعة عشر على الذي يختاره من اختبر." }),
  mcq("b2-2", "b2", "dhobit", 1, "Huruf manakah keluar dari wasat al-halq (tengah kerongkong)?", [["ء ه"], ["ع ح", "Betul."], ["غ خ"], ["ق ك"]], 1, { why: "Aqsa: ء ه, wasat: ع ح, adna: غ خ." }),
  mcq("b2-3", "b2", "kefahaman", 2, "Makhraj huruf ض ialah…", [["Hujung lidah dan gusi atas"], ["Tepi lidah bersama gigi geraham atas", "Betul."], ["Tengah lidah dan lelangit"], ["Pangkal lidah"]], 1, { why: "Dhad keluar dari salah satu atau kedua-dua tepi lidah bersama gigi geraham atas; bersifat istitalah." }),
  mcq("b2-4", "b2", "dhobit", 1, "Makhraj umum (‘am) menurut jumhur berjumlah…", [["3"], ["5", "Betul: jauf, halq, lisan, syafatain, khaisyum."], ["7"], ["17", "Itu makhraj khas."]], 1, { why: "Lima makhraj umum." }),
  match("b2-m1", "b2", 2, "Padankan huruf dengan makhrajnya.", [["ف", "Perut bibir bawah + hujung gigi atas"], ["ق", "Pangkal lidah"], ["ش", "Tengah lidah"], ["غ", "Adna al-halq"]], { why: "Rujuk jadual makharij." }),
  tf("b2-t1", "b2", 1, "Huruf mad keluar dari makhraj al-Jauf.", true, { why: "Al-Jauf = rongga mulut dan kerongkong; tempat huruf mad." }),

  // ---------- BAB 3 ----------
  mcq("b3-1", "b3", "dhobit", 1, "فَحَثَّهُ شَخْصٌ سَكَتَ ialah himpunan huruf bagi sifat…", [["Jahr"], ["Hams", "Betul."], ["Syiddah"], ["Isti'la'"]], 1, { why: "Hams – 10 huruf; nafas mengalir." }),
  mcq("b3-2", "b3", "dhobit", 1, "أَجِدْ قَطٍّ بَكَتْ ialah huruf sifat…", [["Syiddah", "Betul."], ["Rakhawah"], ["Qalqalah", "Huruf qalqalah ialah قطب جد."], ["Idhlaq"]], 0, { why: "Syiddah – suara tertahan.", confusion: "Jangan keliru dengan قطب جد (qalqalah)." }),
  mcq("b3-3", "b3", "dhobit", 1, "Huruf isti'la' terkumpul dalam…", [["قطب جد"], ["خص ضغط قظ", "Betul – 7 huruf."], ["لن عمر"], ["فر من لب"]], 1, { why: "Isti'la' – pangkal lidah terangkat; huruf dibaca tebal." }),
  mcq("b3-4", "b3", "kefahaman", 2, "Sifat tafasysyi ialah sifat bagi huruf…", [["ض", "Ini istitalah."], ["ر", "Ini takrir."], ["ش", "Betul."], ["ص", "Ini safir."]], 2, { why: "Tafasysyi = angin tersebar dalam mulut – ش." }),
  mcq("b3-5", "b3", "kefahaman", 2, "Apakah perbezaan utama makhraj dan sifat?", [["Makhraj = tempat keluar; sifat = cara/keadaan sebutan", "Betul."], ["Kedua-duanya sama"], ["Makhraj untuk huruf mad sahaja"], ["Sifat ialah panjang pendek bacaan"]], 0, { why: "Huruf yang sama makhraj dibezakan oleh sifat (cth. ت د ط)." }),
  mcq("b3-6", "b3", "dhobit", 2, "Huruf sifat itbaq ialah…", [["ص ض ط ظ", "Betul."], ["خ ص ض غ ط ق ظ", "Ini isti'la'."], ["ص ز س", "Ini safir."], ["ل ر"]], 0, { why: "Itbaq = lidah melekap ke lelangit; 4 huruf." }),
  fill("b3-f1", "b3", 2, "Lengkapkan: Huruf qalqalah terhimpun dalam rangkai kata «قُطْبُ ____».", ["جد", "جَدٍّ", "جَد", "jad"], { why: "قُطْبُ جَدٍّ – ق ط ب ج د." }),
  fill("b3-f2", "b3", 2, "Lengkapkan dhobit huruf tawassut: «لِنْ ____».", ["عمر", "عُمَرْ", "عُمَر", "umar"], { why: "لِنْ عُمَرْ – ل ن ع م ر." }),
  match("b3-m1", "b3", 2, "Padankan sifat dengan hurufnya.", [["Safir", "ص ز س"], ["Inhiraf", "ل ر"], ["Istitalah", "ض"], ["Takrir", "ر"]], { why: "Sifat tunggal." }),

  // ---------- BAB 4 ----------
  mcq("b4-1", "b4", "kenal_hukum", 1, "Apakah hukum nun sakinah dalam مِنْ خَوْفٍ?", [["Ikhfa' haqiqi", "خ ialah huruf halq, bukan ikhfa'."], ["Izhar halqi", "Betul."], ["Idgham"], ["Iqlab"]], 1, { why: "Nun sakinah bertemu خ (huruf halq) → izhar halqi.", identify: "Lihat huruf selepas nun: jika ء ه ع ح غ خ → izhar.", dhobit: "همز فهاء ثم عين حاء مهملتان ثم غين خاء" }, "ٱلَّذِىٓ أَطْعَمَهُم مِّن جُوعٍ وَءَامَنَهُم مِّنْ خَوْفٍۭ", "Quraisy:4"),
  mcq("b4-2", "b4", "kenal_hukum", 1, "Hukum tanwin dalam هُدًى لِّلْمُتَّقِينَ?", [["Idgham bi ghunnah"], ["Idgham bila ghunnah", "Betul – tanwin bertemu lam."], ["Ikhfa'"], ["Izhar"]], 1, { why: "Lam dan ra' → idgham tanpa dengung (kamil)." }, "ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ", "al-Baqarah:2"),
  mcq("b4-3", "b4", "kenal_hukum", 2, "Hukum nun sakinah dalam صِنْوَانٌ?", [["Idgham bi ghunnah", "Idgham hanya berlaku antara dua kalimah."], ["Izhar mutlaq", "Betul – nun dan waw dalam satu kalimah."], ["Ikhfa'"], ["Iqlab"]], 1, { why: "Nun sakinah bertemu huruf idgham dalam satu kalimah → izhar mutlaq (kilmi). Empat contoh: دنيا، بنيان، قنوان، صنوان.", confusion: "Pelajar sering mendengungkannya kerana melihat waw." }, "صِنْوَانٌ وَغَيْرُ صِنْوَانٍ", "al-Ra'd:4"),
  mcq("b4-4", "b4", "kenal_hukum", 1, "Hukum dalam مِنۢ بَعْدِ?", [["Ikhfa' syafawi", "Itu untuk mim sakinah asli."], ["Iqlab", "Betul."], ["Izhar"], ["Idgham mimi"]], 1, { why: "Nun sakinah bertemu ب → iqlab; ditandai mim kecil.", compare: "Iqlab vs ikhfa' syafawi: bunyi sama, asal berbeza." }),
  mcq("b4-5", "b4", "kenal_hukum", 2, "Hukum nun sakinah dalam مِن قَبْلُ dan sifat ghunnahnya?", [["Ikhfa' – ghunnah nipis"], ["Ikhfa' – ghunnah tebal", "Betul – ق huruf isti'la'."], ["Izhar"], ["Idgham bila ghunnah"]], 1, { why: "ق antara 15 huruf ikhfa'; kerana isti'la', ghunnah ditebalkan." }),
  mcq("b4-6", "b4", "dhobit", 1, "Huruf idgham bi ghunnah terhimpun dalam…", [["يرملون", "Itu keseluruhan huruf idgham."], ["ينمو", "Betul."], ["لر"], ["قطب جد"]], 1, { why: "ي ن م و." }),
  mcq("b4-7", "b4", "perbandingan", 3, "Mengapakah idgham pada مَن يَقُولُ dinamakan idgham naqis?", [["Kerana nun hilang sepenuhnya"], ["Kerana zat nun hilang tetapi sifat ghunnahnya kekal", "Betul."], ["Kerana tiada dengung"], ["Kerana dalam satu kalimah"]], 1, { why: "Idgham naqis: zat huruf masuk tetapi sifat kekal. Pada ي و, ghunnah nun kekal." }),
  tf("b4-t1", "b4", 1, "Tanwin hanya terdapat pada kata nama (isim).", true, { why: "Antara perbezaan tanwin dan nun sakinah." }),
  tf("b4-t2", "b4", 2, "Nun sakinah dalam يٓسٓ ۚ وَٱلْقُرْءَانِ dibaca idgham menurut riwayat Hafs.", false, { why: "Hafs membaca izhar (izhar mutlaq harfi) pada يس والقرآن dan ن والقلم." }),
  fill("b4-f1", "b4", 1, "Iqlab berlaku apabila nun sakinah atau tanwin bertemu huruf ____.", ["ب", "ba", "ba'", "baa"], { why: "Satu huruf sahaja: ب." }),
  match("b4-m1", "b4", 2, "Padankan contoh dengan hukumnya.", [["مَنْ ءَامَنَ", "Izhar halqi"], ["مِن رَّبِّهِمْ", "Idgham bila ghunnah"], ["سَمِيعٌۢ بَصِيرٌ", "Iqlab"], ["أَنتُمْ", "Ikhfa' haqiqi"]], { why: "Lihat huruf selepas nun/tanwin." }),

  // ---------- BAB 5 ----------
  mcq("b5-1", "b5", "kenal_hukum", 1, "Hukum mim sakinah dalam تَرْمِيهِم بِحِجَارَةٍ?", [["Izhar syafawi"], ["Ikhfa' syafawi", "Betul."], ["Idgham mimi"], ["Iqlab"]], 1, { why: "Mim sakinah bertemu ب → ikhfa' syafawi, dengung 2 harakat." }, "تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ", "al-Fil:4"),
  mcq("b5-2", "b5", "kenal_hukum", 2, "Mim sakinah bertemu huruf و seperti عَلَيْهِمْ وَلَا dibaca…", [["Ikhfa' syafawi"], ["Izhar syafawi dengan lebih dijaga", "Betul."], ["Idgham"], ["Iqlab"]], 1, { why: "Izhar syafawi; lebih ditekankan pada و dan ف kerana hampir/sama makhraj." }),
  mcq("b5-3", "b5", "perbandingan", 3, "Antara berikut, yang manakah PERBEZAAN iqlab dan ikhfa' syafawi?", [["Kedua-duanya berdengung 2 harakat"], ["Kedua-duanya sebelum ب"], ["Iqlab ditandai mim kecil dalam mushaf, ikhfa' syafawi tidak", "Betul."], ["Kedua-duanya di bibir"]], 2, { why: "Tiga pilihan lain ialah persamaan." }),
  tf("b5-t1", "b5", 1, "Idgham mithlain saghir pada لَهُم مَّا dibaca berdengung.", true, { why: "Idgham mimi – ghunnah 2 harakat." }),

  // ---------- BAB 6 ----------
  mcq("b6-1", "b6", "kenal_hukum", 1, "Hukum nun dalam إِنَّ ٱللَّهَ?", [["Izhar"], ["Ghunnah musyaddadah (wajib ghunnah)", "Betul."], ["Ikhfa'"], ["Qalqalah"]], 1, { why: "Nun bertasydid → wajib dengung 2 harakat." }),
  tf("b6-t1", "b6", 1, "Kadar dengung nun dan mim musyaddadah ialah 2 harakat.", true, { why: "Ghunnah sempurna 2 harakat." }),

  // ---------- BAB 7 ----------
  mcq("b7-1", "b7", "kenal_hukum", 1, "Lam pada ٱلرَّحْمَٰنِ dibaca…", [["Izhar qamari"], ["Idgham syamsi", "Betul – ر huruf syamsiyyah."], ["Tafkhim"], ["Qalqalah"]], 1, { why: "Lam ta'rif bertemu huruf syamsiyyah → lam tidak dibaca, huruf selepasnya bertasydid." }),
  mcq("b7-2", "b7", "dhobit", 1, "اِبْغِ حَجَّكَ وَخَفْ عَقِيمَهُ ialah huruf bagi…", [["Al-syamsiyyah"], ["Al-qamariyyah", "Betul."], ["Qalqalah"], ["Ikhfa'"]], 1, { why: "14 huruf qamariyyah." }),
  mcq("b7-3", "b7", "kenal_hukum", 2, "Lam lafaz Allah dalam بِسْمِ ٱللَّهِ dibaca…", [["Tafkhim"], ["Tarqiq", "Betul – didahului kasrah."], ["Harus dua wajah"], ["Idgham"]], 1, { why: "Lam Allah nipis selepas kasrah; tebal selepas fathah/dhammah." }),
  mcq("b7-4", "b7", "kenal_hukum", 2, "Lam dalam بَل رَّفَعَهُ dibaca…", [["Izhar"], ["Idgham mutaqaribain saghir", "Betul."], ["Saktah", "Saktah hanya pada بَلْ ۜ رَانَ."], ["Ikhfa'"]], 1, { why: "Lam huruf bertemu ra' → idgham. Pengecualian saktah hanya pada بل ران." }, "بَل رَّفَعَهُ ٱللَّهُ إِلَيْهِ", "al-Nisa':158"),
  tf("b7-t1", "b7", 1, "Lam lafaz al-Jalalah dibaca tebal apabila memulakan bacaan dengannya.", true, { why: "Ibtida' dengan hamzah wasal berbaris fathah → tafkhim." }),

  // ---------- BAB 8 ----------
  mcq("b8-1", "b8", "kenal_hukum", 2, "Hukum ra' dalam قِرْطَاسٍ?", [["Tarqiq kerana selepas kasrah"], ["Tafkhim kerana diikuti huruf isti'la' berbaris dalam satu kalimah", "Betul."], ["Harus dua wajah"], ["Imalah"]], 1, { why: "Ra' sakinah selepas kasrah asli biasanya nipis, tetapi jika diikuti huruf isti'la' berbaris fathah/dhammah dalam satu kalimah → tebal.", examples: ["مِرْصَادًا", "فِرْقَةٍ", "إِرْصَادًا"] }, "فِى قِرْطَاسٍ", "al-An'am:7"),
  mcq("b8-2", "b8", "kenal_hukum", 2, "Hukum ra' dalam فِرْعَوْنَ?", [["Tafkhim"], ["Tarqiq", "Betul."], ["Harus dua wajah"], ["Ikhfa'"]], 1, { why: "Ra' sakinah selepas kasrah asli, tiada huruf isti'la' selepasnya → tarqiq." }),
  mcq("b8-3", "b8", "kenal_hukum", 3, "Hukum ra' pada فِرْقٍ (al-Syu'ara':63)?", [["Tafkhim sahaja"], ["Tarqiq sahaja"], ["Harus tafkhim dan tarqiq", "Betul (tarqiq diutamakan di sisi ramai)."], ["Imalah"]], 2, { why: "Huruf isti'la' (ق) selepas ra' berbaris kasrah – melemahkan isti'la', maka harus dua wajah." }),
  mcq("b8-4", "b8", "kenal_hukum", 2, "Hukum ra' dalam مَرْيَمَ?", [["Tafkhim", "Betul – ra' sakinah selepas fathah."], ["Tarqiq"], ["Dua wajah"], ["Qalqalah"]], 0, { why: "Ra' sakinah selepas fathah → tafkhim." }),
  mcq("b8-5", "b8", "kenal_hukum", 2, "Hukum ra' pada خَيْرٌ ketika waqaf?", [["Tafkhim"], ["Tarqiq", "Betul – sebelumnya ya' sakinah."], ["Dua wajah"], ["Imalah"]], 1, { why: "Ra' sukun kerana waqaf selepas ya' sakinah (lin/mad) → tarqiq." }),
  tf("b8-t1", "b8", 2, "Ra' dalam ٱرْجِعِىٓ dibaca tafkhim walaupun sebelumnya hamzah wasal berbaris kasrah.", true, { why: "Kasrah hamzah wasal ialah kasrah mendatang – ra' sakinah selepasnya tetap tafkhim." }),

  // ---------- BAB 9 ----------
  mcq("b9-1", "b9", "kenal_hukum", 1, "Mad dalam جَآءَ ialah…", [["Mad jaiz munfasil"], ["Mad wajib muttasil", "Betul – huruf mad dan hamzah dalam satu kalimah."], ["Mad badal"], ["Mad lazim"]], 1, { why: "Muttasil = satu kalimah, 4/5 harakat." }),
  mcq("b9-2", "b9", "kenal_hukum", 1, "Mad dalam ءَامَنُوا۟ (pada alif selepas hamzah) ialah…", [["Mad badal", "Betul."], ["Mad muttasil"], ["Mad lin"], ["Mad farq"]], 0, { why: "Hamzah mendahului huruf mad → badal; Hafs 2 harakat." }),
  mcq("b9-3", "b9", "kenal_hukum", 2, "ءَآلْـَٰٔنَ (Yunus:51) mengandungi mad…", [["Lazim kilmi muthaqqal"], ["Lazim kilmi mukhaffaf", "Betul (juga dikategorikan sebagai mad farq)."], ["Lazim harfi"], ["'Aridh lissukun"]], 1, { why: "Sukun asli tanpa tasydid dalam kalimah. Hanya dua tempat: Yunus:51 dan 91." }),
  mcq("b9-4", "b9", "kenal_hukum", 2, "Ketika waqaf pada نَسْتَعِينُ, mad yang berlaku ialah…", [["Mad lazim"], ["Mad 'aridh lissukun", "Betul."], ["Mad lin"], ["Mad asli sahaja"]], 1, { why: "Huruf mad diikuti huruf yang disukunkan kerana waqaf → 2/4/6." }),
  mcq("b9-5", "b9", "kenal_hukum", 2, "Ketika waqaf pada خَوْفٍ, berlaku mad…", [["Lin", "Betul."], ["'Aridh lissukun"], ["Badal"], ["Tamkin"]], 0, { why: "Waw sakinah selepas fathah + huruf disukunkan kerana waqaf → mad lin (2/4/6)." }),
  mcq("b9-6", "b9", "dhobit", 2, "Huruf muqatta'ah yang dibaca 6 harakat terkumpul dalam…", [["حي طهر", "Itu 2 harakat."], ["نقص عسلكم", "Betul (kecuali ع: 4/6)."], ["قطب جد"], ["ينمو"]], 1, { why: "Mad lazim harfi." }),
  mcq("b9-7", "b9", "kenal_hukum", 3, "Mad pada حُيِّيتُم (al-Nisa':86) dinamakan…", [["Mad tamkin", "Betul."], ["Mad badal"], ["Mad lin"], ["Mad 'iwadh"]], 0, { why: "Ya' bertasydid berkasrah bertemu ya' mad → tamkin, 2 harakat." }),
  mcq("b9-8", "b9", "kenal_hukum", 2, "مَالَهُۥٓ أَخْلَدَهُۥ – mad pada ha' dhamir pertama ialah…", [["Silah qasirah"], ["Silah tawilah", "Betul – ha' dhamir diikuti hamzah."], ["Muttasil"], ["Badal"]], 1, { why: "Silah tawilah: 4/5 harakat (seperti munfasil)." }, "يَحْسَبُ أَنَّ مَالَهُۥٓ أَخْلَدَهُۥ", "al-Humazah:3"),
  mcq("b9-9", "b9", "kenal_hukum", 2, "Mad pada ٱلضَّآلِّينَ ialah…", [["Lazim kilmi muthaqqal", "Betul."], ["Lazim harfi"], ["Muttasil"], ["'Aridh"]], 0, { why: "Huruf mad bertemu huruf bertasydid dalam satu kalimah → 6 harakat." }),
  tf("b9-t1", "b9", 1, "Mad 'aridh lissukun boleh dibaca 2, 4 atau 6 harakat.", true, { why: "Tiga wajah." }),
  tf("b9-t2", "b9", 2, "Mad badal riwayat Hafs dibaca 4 harakat.", false, { why: "Hafs: 2 harakat sahaja." }),
  fill("b9-f1", "b9", 1, "Huruf mad asli harfi (2 harakat) terhimpun dalam: «حَيٌّ ____».", ["طهر", "طَهُرَ", "طهرا"], { why: "حي طهر." }),
  match("b9-m1", "b9", 2, "Padankan mad dengan kadar harakatnya (Hafs).", [["Mad asli", "2"], ["Mad lazim", "6"], ["Mad 'aridh lissukun", "2 / 4 / 6"], ["Mad wajib muttasil", "4 / 5"]], { why: "Rujuk jadual kadar mad." }),

  // ---------- BAB 10 ----------
  mcq("b10-1", "b10", "kefahaman", 1, "Simbol ج dalam mushaf bermaksud…", [["Wajib berhenti"], ["Harus berhenti atau sambung", "Betul."], ["Jangan berhenti"], ["Saktah"]], 1, { why: "Jaiz – sama." }),
  mcq("b10-2", "b10", "kefahaman", 1, "Simbol صلى bermaksud…", [["Berhenti lebih utama", "Itu قلى."], ["Sambung lebih utama", "Betul."], ["Wajib berhenti"], ["Mu'anaqah"]], 1, { why: "Al-wasl awla." }),
  mcq("b10-3", "b10", "kefahaman", 2, "Waqaf pada kalimah yang sempurna makna dan tiada kaitan lafaz serta makna dengan selepasnya dinamakan…", [["Tam", "Betul."], ["Kafi"], ["Hasan"], ["Qabih"]], 0, { why: "Tam: tiada kaitan lafaz dan makna." }),
  mcq("b10-4", "b10", "perbandingan", 2, "Perbezaan utama waqaf dan saktah ialah…", [["Saktah mengambil nafas"], ["Waqaf mengambil nafas, saktah tidak", "Betul."], ["Waqaf hanya di hujung surah"], ["Tiada perbezaan"]], 1, { why: "Saktah = henti sejenak tanpa nafas (2 harakat)." }),
  mcq("b10-5", "b10", "kefahaman", 2, "Tanda ∴ ∴ pada لَا رَيْبَ ۛ فِيهِ ۛ bermaksud…", [["Berhenti pada kedua-duanya"], ["Berhenti pada salah satu sahaja", "Betul – waqaf mu'anaqah."], ["Jangan berhenti"], ["Saktah"]], 1, { why: "Mu'anaqah." }),
  tf("b10-t1", "b10", 1, "Waqaf qabih ialah berhenti pada kalimah yang merosakkan makna.", true, { why: "Wajib ulang dari tempat yang sesuai." }),
  match("b10-m1", "b10", 2, "Padankan simbol waqaf dengan maksudnya.", [["مـ", "Waqaf lazim"], ["قلى", "Waqaf lebih utama"], ["لا", "Jangan berhenti"], ["ج", "Harus kedua-dua"]], { why: "Simbol waqaf mushaf Uthmani." }),

  // ---------- BAB 11 ----------
  mcq("b11-1", "b11", "kenal_hukum", 2, "Ketika memulakan bacaan dengan ٱدْخُلُوا۟, hamzah wasal dibaca…", [["Fathah"], ["Kasrah"], ["Dhammah", "Betul – huruf ketiga (خ) berbaris dhammah asli."], ["Sukun"]], 2, { why: "Fi'il: huruf ketiga dhammah asli → hamzah dhammah." }),
  mcq("b11-2", "b11", "kenal_hukum", 2, "Hamzah wasal pada ٱسْمُهُ ketika ibtida' dibaca…", [["Kasrah", "Betul – isim samā'i."], ["Fathah"], ["Dhammah"], ["Tidak dibaca"]], 0, { why: "Isim (selain al) sentiasa kasrah." }),
  mcq("b11-3", "b11", "kenal_hukum", 3, "ٱمْشُوا۟ dimulakan dengan hamzah…", [["Dhammah kerana huruf ketiga dhammah"], ["Kasrah kerana dhammah huruf ketiga mendatang", "Betul."], ["Fathah"], ["Sukun"]], 1, { why: "Asal: ٱمْشِيُوا – dhammah 'aridhah, maka kasrah.", confusion: "Kesilapan biasa: melihat dhammah tanpa menyemak asalnya." }),
  mcq("b11-4", "b11", "kenal_hukum", 3, "ٱلْتَقَى ٱلْجَمْعَانِ – hamzah wasal pada ٱلْتَقَى dibaca…", [["Fathah kerana al ta'rif"], ["Kasrah kerana ia fi'il dan huruf ketiganya fathah", "Betul."], ["Dhammah"], ["Gugur"]], 1, { why: "ٱلْتَقَى ialah fi'il madhi wazan افتعل, bukan al ta'rif." }),
  tf("b11-t1", "b11", 1, "Hamzah wasal gugur ketika bacaan disambung (wasal).", true, { why: "Takrif hamzah wasal." }),

  // ---------- BAB 12 ----------
  mcq("b12-1", "b12", "kenal_hukum", 1, "Bacaan khas pada مَجْرٜىٰهَا (Hud:41) dinamakan…", [["Isymam"], ["Imalah", "Betul."], ["Tashil"], ["Saktah"]], 1, { why: "Satu-satunya imalah dalam riwayat Hafs." }),
  mcq("b12-2", "b12", "kenal_hukum", 1, "Bacaan pada لَا تَأْمَ۫نَّا ialah…", [["Isymam (atau raum)", "Betul."], ["Imalah"], ["Tashil"], ["Naqal"]], 0, { why: "Memuncungkan bibir sebagai isyarat dhammah nun yang diidghamkan." }),
  mcq("b12-3", "b12", "kenal_hukum", 1, "Bacaan pada ءَا۬عْجَمِىٌّ ialah…", [["Ibdal"], ["Tashil hamzah kedua", "Betul."], ["Saktah"], ["Imalah"]], 1, { why: "Hamzah kedua disebut antara hamzah dan alif." }),
  mcq("b12-4", "b12", "kenal_hukum", 2, "Manakah BUKAN tempat saktah wajib riwayat Hafs (Syatibi)?", [["عِوَجَا ۜ قَيِّمًا"], ["مَنْ ۜ رَاقٍ"], ["بَلْ ۜ رَانَ"], ["مَالِيَهْ ۜ هَلَكَ", "Betul – saktah di sini harus (jaiz), bukan wajib."]], 3, { why: "Empat wajib: عوجا، مرقدنا، من راق، بل ران." }),
  mcq("b12-5", "b12", "kenal_hukum", 2, "قَد تَّبَيَّنَ – hukum idgham?", [["Mithlain"], ["Mutajanisain saghir", "Betul – د dan ت sama makhraj."], ["Mutaqaribain"], ["Idgham bi ghunnah"]], 1, { why: "Sama makhraj, berbeza sifat." }),
  mcq("b12-6", "b12", "kenal_hukum", 2, "بَسَطتَ – jenis idgham?", [["Kamil"], ["Naqis (sifat itbaq ط kekal)", "Betul."], ["Mithlain"], ["Bi ghunnah"]], 1, { why: "Idgham mutajanisain naqis." }),
  mcq("b12-7", "b12", "kenal_hukum", 2, "Qalqalah pada ٱلْفَلَقِ ketika waqaf ialah…", [["Sughra"], ["Kubra", "Betul – sukun kerana waqaf."], ["Tiada qalqalah"], ["Ikhfa'"]], 1, { why: "Sukun 'aridh di hujung → kubra." }),
  mcq("b12-8", "b12", "kenal_hukum", 3, "ٱلْمُصَۣيْطِرُونَ (al-Tur:37) – sin kecil di bawah bermaksud…", [["Wajib dibaca sin"], ["Harus sin atau sad; sad diutamakan", "Betul."], ["Wajib sad"], ["Isymam"]], 1, { why: "Berbeza dengan وَيَبْصُۜطُ (sin kecil di atas) yang dibaca sin." }),
  tf("b12-t1", "b12", 2, "ضَعْفٍ dalam surah al-Rum:54 harus dibaca dengan fathah atau dhammah pada dhad bagi riwayat Hafs.", true, { why: "Dua wajah sahih bagi Hafs; fathah diutamakan." }),
  match("b12-m1", "b12", 3, "Padankan kalimah gharib dengan nama bacaannya.", [["مَجْرٜىٰهَا", "Imalah"], ["تَأْمَ۫نَّا", "Isymam"], ["ءَا۬عْجَمِىٌّ", "Tashil"], ["مَنْ ۜ رَاقٍ", "Saktah"]], { why: "Bacaan gharib Hafs." }),
];
