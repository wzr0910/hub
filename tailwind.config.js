/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // 自然有机风：标题衬线、正文无衬线；不使用 Inter / Roboto / Geist 等过度通用字体
        serif: ['"Noto Serif SC"', '"Songti SC"', '"STSong"', 'Georgia', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', '"PingFang SC"', '"Microsoft YaHei"', '"Noto Sans SC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
