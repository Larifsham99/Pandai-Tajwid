/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        zamrud: { 50:'#ecfdf5',100:'#d1fae5',200:'#a7f3d0',300:'#6ee7b7',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857',800:'#065f46',900:'#064e3b',950:'#022c22' },
        hutan: { 700:'#0f3d2e', 800:'#0b3024', 900:'#08241b', 950:'#051a13' },
        emas: { 50:'#fbf7ea',100:'#f5ecc8',200:'#ecd894',300:'#e0c063',400:'#d4a940',500:'#c1922c',600:'#a37523',700:'#83591f' },
        krim: { 50:'#fffdf7', 100:'#fbf6e9', 200:'#f4ead0' },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        arab: ['"Amiri Quran"', '"Amiri"', '"Scheherazade New"', 'serif'],
        jawi: ['"Amiri"', 'serif'],
      },
      boxShadow: { kad: '0 1px 2px rgba(6,78,59,.06), 0 4px 16px rgba(6,78,59,.06)' },
    },
  },
  plugins: [],
};
