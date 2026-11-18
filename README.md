# Pandai Tajwid

Aplikasi latih tubi tajwid yang ringkas, ceria dan mesra telefon.
**Aplikasi ini dibangunkan oleh Mawar Ikhlas Brand.**

## Menu
| Menu | Kandungan |
|---|---|
| **Latih Tubi** (utama) | ~870 soalan objektif (ABCD, Benar/Salah, Padanan, Isi tempat kosong), pilih bab/jenis/sumber/bilangan, Cabaran Harian, Fokus Kelemahan, Maraton, **Murajaah automatik**, dan rujukan dari soalan tauliah 2014–2025 (semakan kendiri). |
| **Nota** | 12 bab sedia ada: nota mendalam, ringkas, kad imbas, jadual, peta minda, rujukan, carian & penanda. |
| **Scoreboard** | Keseluruhan, mingguan, ketepatan, istiqamah. |
| **Ujian Bertempoh** | Simulasi peperiksaan 20/40 soalan dengan pemasa; keputusan, pecahan ikut bab & semakan jawapan di akhir. |
| **Profil** | Tahap, XP, lencana, kemajuan bab, tetapan, beberapa profil pada satu peranti, sandaran JSON. |

Satu mod sahaja — tiada akaun guru/admin, tiada log masuk.

## Kandungan
- `src/data/` — nota 12 bab, 87 soalan latihan dan kertas tauliah (diguna semula daripada Mantap-Tajwid).
- `src/data/generated.ts` — menjana **~780 soalan objektif tambahan** daripada nota (jadual, takrif, nota ringkas, dhobit, contoh ayat, kad imbas). Peraturan:
  - jawapan betul diambil **verbatim** daripada nota (disahkan oleh ujian automatik);
  - pilihan salah ialah teks nota bagi baris/seksyen lain, dan penerangannya menyatakan asal teks itu;
  - item yang menyentuh **khilaf** (pendapat berbeza, dua wajah, "diutamakan", "rujuk guru" …) tidak dijadikan soalan;
  - semua berlabel **“Belum disemak”** dan boleh disembunyikan dalam Tetapan.
- Sistem penerangan jawapan, XP/tahap/lencana dan murajaah automatik (Leitner: soalan salah masuk barisan secara automatik) dikekalkan.

## Storan: tempatan sekarang, Supabase kemudian
Secara lalai semua data disimpan dalam pelayar (`localStorage`). Scoreboard menyenaraikan profil pada peranti tersebut.

Untuk naik taraf ke **scoreboard dalam talian (Supabase)** — tiada perubahan kod diperlukan:
1. Cipta projek Supabase, jalankan `supabase/schema.sql` dalam SQL Editor.
2. Authentication → aktifkan **Anonymous sign-ins**.
3. Tetapkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` (fail `.env` untuk tempatan, atau GitHub → Settings → Variables untuk GitHub Pages).

Aplikasi akan log masuk tanpa nama dan menghantar ringkasan skor sahaja; RLS memastikan setiap peranti hanya boleh mengubah baris sendiri. Rekod terperinci kekal tempatan.

## Pembangunan
```bash
npm install
npm run dev      # pelayan pembangunan
npm test         # ujian integriti kandungan, soalan dijana, pemarkahan, murajaah
npm run build    # binaan ke dist/
```
Penempatan: `.github/workflows/pages.yml` membina dan menerbitkan ke GitHub Pages apabila push ke `main`.

## Halaman jualan
`public/jualan/index.html` diterbitkan di `…/Pandai-Tajwid/jualan/` (sesuai untuk iklan media sosial; ada gambar kongsian `og.jpg`).
Ubah pautan bayaran, harga & maklumat penjual di `public/jualan/config.js`:
```js
// public/jualan/config.js (dikongsi oleh index.html, terima-kasih.html & terma.html)
window.SALES = { ctaUrl: "https://toyyibpay.com/…", price: "RM19", priceNext: "", seller: "Mawar Ikhlas Brand", ssm: "", email: "", whatsapp: "" };
```
- `ctaUrl` — pautan **bayaran** untuk butang dalam kotak tawaran (butang "Dapatkan" lain membawa ke kotak tawaran dahulu). Kosong = butang memaparkan "akan dibuka tidak lama lagi".
- `price` — harga sekarang; `priceNext` — harga biasa selepas promosi (makluman, bukan harga dipotong).
- `ssm`, `email`, `whatsapp` — maklumat hubungan penjual (dipaparkan di kaki halaman, halaman terima kasih & `terma.html`).

## Kod pengaktifan (versi penuh)
- **Aplikasi memerlukan kod** sebelum boleh digunakan. Demo untuk bakal pembeli ialah kuiz 10 soalan + tayangan skrin di halaman jualan (`/jualan/#demo`).
- **Jana kod baharu:** `node scripts/jana-kod.mjs 100`
  - Senarai kod sebenar → `kod-pengaktifan/kod-<masa>.csv` (**rahsia**, tidak di-commit; ada lajur pautan aktivasi, pembeli & tarikh).
  - Hash kod → `src/data/activation-hashes.json` (commit & terbitkan supaya kod baharu berfungsi).
- **Hantar kepada pembeli:** kod (cth. `PT-7K3M-Q9XA-2HDF`) atau pautan `https://…/Pandai-Tajwid/?kod=PT-…` — tekan sekali, terus aktif.
- Satu kod mengaktifkan satu peranti (semua profil). Semakan berlaku dalam peranti; untuk had kod yang ketat (satu kod satu peranti), naik taraf ke Supabase.
