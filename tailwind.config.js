/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 冷调基底 + 青绿主色，与「孩子的游戏」的米白/陶土/衬线彻底区分
        ink: '#0F172A',
        paper: '#F8FAFC',
        accent: '#0D9488', // teal-600
        accentStrong: '#0F766E', // teal-700
        soft: '#CCFBF1', // teal-100
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
