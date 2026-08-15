/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 玻璃拟态唯一强调色：香槟金（仅用于主行动/高亮文字）
        gold: '#E4B863',
        goldLight: '#F3DCA8',
      },
      fontFamily: {
        // 不使用 Inter / Roboto / Geist 等过度通用字体
        sans: ['ui-sans-serif', 'system-ui', '"PingFang SC"', '"Microsoft YaHei"', '"Noto Sans SC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
