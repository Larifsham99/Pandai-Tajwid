# Pandai Tajwid — Konteks untuk AI / pembangun

> Tampal keseluruhan fail ini kepada AI lain (ChatGPT, Gemini, Claude, Copilot, dsb.) sebelum meminta bantuan,
> supaya ia faham apa aplikasi ini, bagaimana ia dibina, dan peraturan yang mesti dipatuhi.
> Dikemas kini: November 2026 · Versi aplikasi: 1.7

---

## 1. Ringkasan

**Pandai Tajwid** ialah aplikasi web (PWA) latih tubi ilmu tajwid dalam **Bahasa Melayu**, ringkas dan mesra telefon.
Dijual sebagai produk digital **RM19 sekali bayar** (bayaran melalui ToyyibPay). Jenama/penjual: **Mawar Ikhlas Brand**.
Kredit dalam aplikasi: *"Aplikasi ini dibangunkan oleh Mawar Ikhlas Brand"*.

- Pengguna sasaran: pemula, pelajar pondok & tahfiz, calon tauliah, guru, ibu bapa. Musim cuti persekolahan ialah sudut jualan utama.
- Satu mod sahaja: **tiada guru/admin, tiada log masuk/akaun**. Data kekal dalam peranti (localStorage).
- Berfungsi **tanpa internet** selepas dibuka sekali (service worker).
- URL terbitan: `https://larifsham99.github.io/Pandai-Tajwid/` · Halaman jualan: `…/jualan/`
- Repo: `Larifsham99/Pandai-Tajwid` (GitHub Pages, deploy automatik apabila push ke `main`).
- Kandungan asal diambil daripada repo `Larifsham99/Mantap-Tajwid` (data nota & soalan digunakan semula).

## 2. Menu & ciri aplikasi

Navigasi bawah: **Latih Tubi · Nota · Scoreboard · Profil** (+ halaman `/ujian`).

| Ciri | Butiran |
|---|---|
| **Latih Tubi** (utama) | Soalan objektif (ABCD, Benar/Salah, Padanan, Isi tempat kosong). Mula 10 soalan, Cabaran Harian, Fokus Kelemahan, Maraton, Latihan Pilihan (bab/jenis/sumber/bilangan), **Murajaah automatik**. |
| **Penerangan jawapan** | Setiap soalan ada penerangan: kenapa betul, kenapa pilihan pengguna salah, dhobit, contoh. |
| **Murajaah automatik** | Soalan salah masuk barisan Leitner (selang 0,1,2,4,7,15,30 hari; salah → 10 minit). |
| **Ujian Bertempoh** | 20 soalan/15 min atau 40 soalan/30 min; pemasa; hantar automatik; keputusan ikut bab. |
| **Rujukan dari soalan tauliah** | 250 soalan subjektif (10 set, 2014–2025), jawapan cadangan + penilaian kendiri. *Jangan* sebut nama negeri/jabatan di mana-mana paparan. |
| **Nota** | 12 bab, 42 topik: nota mendalam/ringkas, kad imbas, jadual, peta minda, rujukan, carian, penanda. |
| **Gamifikasi** | XP, 5 tahap (Mubtadi' → Penguasaan Tajwid), 14 lencana, streak, sasaran harian. Bab "dikuasai" = semua seksyen dibaca + ≥8 cubaan + ≥80% (20 cubaan terkini). |
| **Scoreboard** | Keseluruhan/mingguan/ketepatan/istiqamah. Tempatan (semua profil pada peranti); mod awan (Supabase) aktif jika env diisi. |
| **Profil** | Banyak profil tanpa had pada satu peranti (tekan avatar untuk tukar), tetapan, eksport/import sandaran JSON. |
| **Bunyi** | Web Audio (tiada fail audio): ketik, betul, salah, lencana, tamat sesi. Suis di Profil → Tetapan. |
| **Pasang & kongsi** | Kad "Pasang di skrin utama" (Android prompt / arahan iPhone), kongsi keputusan (Web Share → WhatsApp). |

## 3. Stack & struktur

React 18 + TypeScript + Vite + Tailwind 3, `react-router-dom` (HashRouter), `lucide-react`. `@supabase/supabase-js` dimuat secara dinamik (pilihan).
Ujian: Vitest (24 ujian dalam `tests/core.test.ts`).

```
src/
  App.tsx                 laluan + pintu pengaktifan (ActivationGate) + Welcome (cipta profil)
  types.ts                jenis data (Chapter, Question, DB, Settings…)
  data/                   notes1-3.ts (12 bab), practice.ts (87 soalan), generated.ts (penjana soalan),
                          tauliah/ (250 soalan subjektif), refs.ts, activation-hashes.json
  lib/
    store.ts              localStorage DB (kunci "pandai-tajwid:db:v1"), profil, useDb()
    actions.ts            grade(), recordAnswer(), srsUpdate() (murajaah), awardBadges()
    gamification.ts       XP_RULES, LEVELS, BADGES, chapterStats(), summary() (dicache)
    practice.ts           buildSet() — pembina set soalan & mod
    activation.ts         semakan kod pengaktifan (hash SHA-256)
    scoreboard.ts         scoreboard tempatan + Supabase (pilihan)
    sound.ts · install.ts util.ts
  components/             Layout, QuestionPlayer, Activation (gate), InstallCard, ui, brand
  pages/                  LatihTubi, Sesi, Ujian, Nota, NotaBab, Scoreboard, Profil, Welcome
public/                   manifest, sw.js, ikon (svg + png), jualan/ (halaman jualan)
scripts/jana-kod.mjs      jana kod pengaktifan
supabase/schema.sql       jadual scoreboard (pilihan)
docs/emel/                templat e-mel ToyyibPay
```

Perintah: `npm install` · `npm run dev` · `npm test` · `npm run build` (output `dist/`).

## 4. Peraturan kandungan (WAJIB dipatuhi)

Ini produk ilmu agama — ketepatan lebih penting daripada kuantiti.

1. **Jangan mereka-reka hukum tajwid, kitab, halaman atau dalil.** Rujukan kitab dalam data ialah `belum_disahkan`; nombor halaman sengaja tiada.
2. **Soalan dijana (`src/data/generated.ts`)** (~770 soalan): jawapan betul diambil *verbatim* daripada nota; pilihan salah diambil daripada teks nota bahagian lain dan penerangannya menyatakan asalnya. Semua berstatus `belum_disemak` dan dilabel "Belum disemak" dalam UI.
3. **Perkara khilaf tidak dijadikan soalan** (regex `KHILAF`: khilaf, pendapat, jumhur ulama, dua wajah, diutamakan, rujuk guru…). Kenyataan Benar/Salah tidak boleh mengelirukan: `overlaps()` menolak nilai yang bertindih (cth. "4/5" vs "4/5 (6 waqaf)"), dan `AMBIGUOUS_TF` menyenaraikan pengecualian manual.
4. Setiap perubahan pada penjana mesti lulus ujian: ID unik, jawapan MCQ wujud dalam nota, tiada khilaf, deterministik.
5. Dakwaan "tanpa internet", "1,100+ soalan", "12 bab" dsb. mesti benar dan sepadan dengan data. Jangan tambah testimoni, pemasa palsu atau harga "asal" yang tidak pernah wujud.
6. Aplikasi ialah **alat bantu ulang kaji**, bukan pengganti talaqqi dengan guru; tiada jaminan keputusan peperiksaan.

## 5. Model perniagaan & pengaktifan

- Harga & pautan bayaran: `public/jualan/config.js` (`window.SALES`: `ctaUrl`, `price`, `priceNext`, `seller`, `ssm`, `email`, `whatsapp`). `email`/`whatsapp`/`ssm` belum diisi (TODO pemilik).
- Aliran: pengunjung → `…/jualan/` (kuiz demo 10 soalan + tayangan skrin) → ToyyibPay → *Return URL* `…/jualan/terima-kasih.html` → e-mel ToyyibPay mengandungi **pautan aktivasi** `…/?kod=PT-XXXX-XXXX-XXXX`.
- **Aplikasi dikunci sepenuhnya tanpa kod.** Demo hanya di halaman jualan. `?kod=` mengaktifkan terus; kod disimpan di localStorage (`pandai-tajwid:aktif`) dan disahkan semula setiap kali dibuka.
- Kod: 12 aksara (abjad tanpa 0/O/1/I), format `PT-XXXX-XXXX-XXXX`. Repo hanya menyimpan **hash** (SHA-256 bergaram, 24 hex) dalam `src/data/activation-hashes.json`. Jana kod: `node scripts/jana-kod.mjs <bilangan>` → CSV rahsia di `kod-pengaktifan/` (**gitignored — jangan commit, jangan tampal kod sebenar dalam sembang/isu/PR**).
- Had yang diketahui: semakan dalam peranti (boleh dipintas/dikongsi). Naik taraf ke kod unik per pembeli + pengesahan Supabase jika perlu.
- Jangan tukar/buang kod yang sudah dihantar kepada pembeli (mereka akan terkunci semula).

## 6. Reka bentuk & gaya

- **Tema premium**: hijau zamrud gelap, emas champagne, gading. Kelas Tailwind tersuai dalam `tailwind.config.js`: `zamrud`, `hutan` (latar gelap), `emas`, `krim`, `merah`, `biru`, `ungu` (tona pudar). Jangan guna warna Tailwind terang lalai (emerald/rose/amber/sky/violet).
- **Fon**: Plus Jakarta Sans (UI) + Amiri / Amiri Quran (Arab). Pengguna menolak fon serif (Playfair) — jangan perkenalkan semula.
- Mesra telefon dahulu (lebar 390px), bar tindakan melekat di bawah ketika menjawab, tiada skrol mendatar.
- Semua teks UI dalam **Bahasa Melayu**; istilah: *latih tubi, murajaah, dhobit, nota, bab*.
- **Prestasi (diukur dengan CPU diperlahankan 4×):** JANGAN guna `background-attachment: fixed` pada body (skrol 217 ms/bingkai → 17 ms selepas dibuang; latar kini lapisan `body::before` `position:fixed`). Elak `backdrop-blur` pada kad/bar. Kelas kelegapan Tailwind mesti dalam skala (…90, 95, 100) atau guna `bg-x/[.97]`, jika tidak latar tidak dijana. Simpan localStorage ketika terluang (bukan serta-merta). Fungsi tulen yang dipanggil berulang (cth. `norm` dalam penjana soalan) perlu dimemo.
- Ikon: mushaf terbuka + bintang lapan emas (`public/icon.svg`; PNG dijana daripadanya).

## 7. Aliran kerja pembangunan

- Cawangan kerja: `ccr-08f86380-fcr2ml`; **buka PR ke `main` hanya apabila pemilik meminta**. Gabungan ke `main` → GitHub Actions membina & menerbitkan ke Pages.
- Mesej commit dalam Bahasa Melayu; tamat dengan baris atribusi yang dikehendaki sesi.
- Sebelum push: `npx tsc -b --noEmit`, `npm test`, `npm run build`. Uji UI dalam pelayar (Playwright, viewport iPhone) dan semak tiada ralat konsol / skrol mendatar.
- Naikkan `VERSION` dalam `src/components/brand.tsx` bagi setiap pelepasan; service worker (`public/sw.js`) menyimpan cache dengan nama berversi (HTML tidak dicache; `/jualan/` dikecualikan).
- Gambar halaman jualan (`public/jualan/img/`) ialah tangkapan skrin data contoh — jana semula selepas perubahan rupa.

## 8. Perkara belum selesai (TODO pemilik)

- Tukar harga bil ToyyibPay kepada RM19 dan kemas kini tandatangan e-mel kepada "Mawar Ikhlas Brand".
- Isi `email` / `whatsapp` / `ssm` dalam `public/jualan/config.js`.
- Tetapan *Return URL* ToyyibPay ke `…/jualan/terima-kasih.html` (sebelum ini pembeli tidak dibawa balik).
- Pertimbangkan kebenaran penggunaan transkripsi soalan tauliah; kaji semula soalan "belum disemak" bersama guru penyemak.
- Pilihan masa depan: kod unik per pembeli melalui Supabase.

---

## Cadangan arahan pembuka kepada AI lain

```
Anda membantu saya membangunkan "Pandai Tajwid", aplikasi web latih tubi tajwid (React + TypeScript + Vite + Tailwind),
Bahasa Melayu, data dalam localStorage, dijual RM19 sekali bayar dengan kod pengaktifan, diterbitkan di GitHub Pages.
Baca konteks penuh di bawah. Peraturan utama: (1) jangan reka hukum tajwid/dalil/kitab, (2) jangan jadikan perkara khilaf
sebagai soalan, (3) semua teks UI dalam Bahasa Melayu, (4) kekalkan tema premium (zamrud gelap/emas/gading, fon Plus
Jakarta Sans), (5) jangan dedahkan kod pengaktifan sebenar, (6) jangan buka PR atau push kecuali saya minta.
Tugas saya: <TULIS TUGAS DI SINI>
--- KONTEKS ---
<tampal isi fail ini>
```
