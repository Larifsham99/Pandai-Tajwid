/** @type {import('tailwindcss').Config} */
// TEMA PREMIUM — hijau zamrud gelap, emas champagne, gading, dan tona permata pudar.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Hijau zamrud gelap (warna utama)
        zamrud: { 50:'#f1f6f3',100:'#deebe4',200:'#bcd6c8',300:'#8fb9a3',400:'#5f977c',500:'#3a7a5e',600:'#24634a',700:'#1a503c',800:'#143f30',900:'#0f3126',950:'#081c15' },
        // Latar gelap
        hutan: { 700:'#11291f', 800:'#0c2018', 900:'#091912', 950:'#06110c' },
        // Emas champagne (aksen)
        emas: { 50:'#fbf8f0',100:'#f5edda',200:'#ead9b1',300:'#dcc083',400:'#c9a24b',500:'#b08939',600:'#8f6d2c',700:'#6f5323',800:'#56401c',900:'#3f2f15',950:'#2a1f0e' },
        // Gading
        krim: { 50:'#fdfbf6',100:'#f8f3e7',200:'#efe4cb' },
        // Tona permata pudar (pengganti merah jambu / biru / ungu terang)
        merah: { 50:'#fbf2f2',100:'#f4dfdf',200:'#e7bfbf',300:'#d39797',400:'#b96d6d',500:'#9c4d4d',600:'#843c3c',700:'#6b3030',800:'#532525',900:'#3d1b1b' },
        biru:  { 50:'#f1f5f8',100:'#e1e9f0',200:'#c4d4e1',300:'#9cb5c9',400:'#6f91ab',500:'#4f7490',600:'#3e5d75',700:'#324b5e',800:'#283c4b',900:'#1e2d38' },
        ungu:  { 50:'#f5f3f8',100:'#ebe6f2',200:'#d7cee6',300:'#b8a9d0',400:'#917eb2',500:'#705d95',600:'#5a4a7a',700:'#483b62',800:'#372d4b',900:'#272036' },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        arab: ['"Amiri Quran"', '"Amiri"', '"Scheherazade New"', 'serif'],
        jawi: ['"Amiri"', 'serif'],
      },
      boxShadow: {
        kad: '0 1px 2px rgba(15,49,38,.05), 0 8px 28px -12px rgba(15,49,38,.18)',
        emas: '0 10px 28px -12px rgba(176,137,57,.55)',
      },
    },
  },
  plugins: [],
};
