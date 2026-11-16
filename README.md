# Pandai Tajwid

Aplikasi latih tubi tajwid yang ringkas, ceria dan mesra telefon.
**Aplikasi ini dibangunkan oleh Abdul Latif.**

## Menu
| Menu | Kandungan |
|---|---|
| **Latih Tubi** (utama) | ~870 soalan objektif (ABCD, Benar/Salah, Padanan, Isi tempat kosong), pilih bab/jenis/sumber/bilangan, Cabaran Harian, Fokus Kelemahan, Maraton, **Murajaah automatik**, dan soalan tauliah lepas Kedah 2014–2025 (semakan kendiri). |
| **Nota** | 12 bab sedia ada: nota mendalam, ringkas, kad imbas, jadual, peta minda, rujukan, carian & penanda. |
| **Scoreboard** | Keseluruhan, mingguan, ketepatan, istiqamah. |
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
