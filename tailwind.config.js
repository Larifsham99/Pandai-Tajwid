/** @type {import('tailwindcss').Config} */
// TEMA CERIA — hijau zamrud segar, kuning emas cerah, krim, dan warna sokongan yang riang.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Hijau zamrud segar (warna utama)
        zamrud: { 50:'#ecfdf5',100:'#d1fae5',200:'#a7f3d0',300:'#6ee7b7',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857',800:'#065f46',900:'#064e3b',950:'#022c22' },
        // Latar gelap
        hutan: { 700:'#0f3d2e', 800:'#0b3024', 900:'#08241b', 950:'#051a13' },
        // Emas champagne (aksen)
        emas: { 50:'#fffaeb',100:'#fff0c2',200:'#ffe08a',300:'#fdd05a',400:'#f6bb2e',500:'#e09f12',600:'#b97d0c',700:'#8c5d0e',800:'#6b4710',900:'#4d330c',950:'#2e1e07' },
        // Gading
        krim: { 50:'#fffdf7',100:'#fff8ea',200:'#fbefd4' },
        // Warna sokongan yang riang
        merah: { 50:'#fff1f2',100:'#ffe4e6',200:'#fecdd3',300:'#fda4af',400:'#fb7185',500:'#f43f5e',600:'#e11d48',700:'#be123c',800:'#9f1239',900:'#881337' },
        biru:  { 50:'#f0f9ff',100:'#e0f2fe',200:'#bae6fd',300:'#7dd3fc',400:'#38bdf8',500:'#0ea5e9',600:'#0284c7',700:'#0369a1',800:'#075985',900:'#0c4a6e' },
        ungu:  { 50:'#f5f3ff',100:'#ede9fe',200:'#ddd6fe',300:'#c4b5fd',400:'#a78bfa',500:'#8b5cf6',600:'#7c3aed',700:'#6d28d9',800:'#5b21b6',900:'#4c1d95' },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        arab: ['"Amiri Quran"', '"Amiri"', '"Scheherazade New"', 'serif'],
        jawi: ['"Amiri"', 'serif'],
      },
      boxShadow: {
        kad: '0 1px 2px rgba(15,49,38,.05), 0 8px 28px -12px rgba(15,49,38,.18)',
        emas: '0 10px 28px -12px rgba(224,159,18,.55)',
      },
    },
  },
  plugins: [],
};
