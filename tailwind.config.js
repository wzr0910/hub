/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 冷调基底 + 灰蓝(雾霾蓝)主色，与「孩子的游戏」的米白/陶土/衬线彻底区分
        ink: '#0F172A',
        paper: '#F8FAFC',
        accent: '#3B5B7A', // 灰蓝（与 brand-500 一致，便于兼容旧 class）
        accentStrong: '#2C4A63',
        soft: '#DCE4EC',
        // 灰蓝色阶（雾霾蓝）
        brand: {
          50: '#EEF1F4',
          100: '#DCE4EC',
          200: '#C3D0DC',
          300: '#93A8BD',
          400: '#5E7C9A',
          500: '#3B5B7A',
          600: '#33506B',
          700: '#2C4A63',
          800: '#243B4F',
          900: '#1B2C3B',
          950: '#111D27',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
