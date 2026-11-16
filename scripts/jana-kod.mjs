#!/usr/bin/env node
// Jana kod pengaktifan Pandai Tajwid.
//   node scripts/jana-kod.mjs 100            → 100 kod baharu
//   node scripts/jana-kod.mjs 100 https://contoh.github.io/Pandai-Tajwid/   (URL aplikasi untuk pautan aktivasi)
// Hasil:
//   • kod-pengaktifan/kod-<masa>.csv  → SENARAI KOD SEBENAR (RAHSIA — fail ini tidak di-commit, simpan baik-baik)
//   • src/data/activation-hashes.json → hash kod (selamat di-commit; perlu di-commit & diterbitkan supaya kod berfungsi)
import { randomInt, createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const n = Number(process.argv[2] || 100);
const appUrl = process.argv[3] || "https://larifsham99.github.io/Pandai-Tajwid/";
const ALPHA = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const SALT = "pandai-tajwid|v1|";
const HASH_FILE = "src/data/activation-hashes.json";

const hashes = new Set(JSON.parse(readFileSync(HASH_FILE, "utf8")));
const rows = [["no", "kod", "pautan_aktivasi", "pembeli", "tarikh_hantar"]];
for (let i = 0; i < n; ) {
  const raw = Array.from({ length: 12 }, () => ALPHA[randomInt(ALPHA.length)]).join("");
  const h = createHash("sha256").update(SALT + raw).digest("hex").slice(0, 24);
  if (hashes.has(h)) continue;
  hashes.add(h); i++;
  const code = `PT-${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8)}`;
  rows.push([String(i), code, `${appUrl}?kod=${code}`, "", ""]);
}
writeFileSync(HASH_FILE, JSON.stringify([...hashes]) + "\n");
mkdirSync("kod-pengaktifan", { recursive: true });
const file = `kod-pengaktifan/kod-${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.csv`;
writeFileSync(file, "﻿" + rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n") + "\n");
console.log(`✓ ${n} kod baharu → ${file}`);
console.log(`✓ Jumlah hash dalam ${HASH_FILE}: ${hashes.size}`);
console.log("Ingat: commit & terbitkan activation-hashes.json supaya kod baharu berfungsi. JANGAN commit folder kod-pengaktifan/.");
