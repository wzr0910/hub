import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base 说明：
// - dev 时用 '/'，本地直接访问 http://localhost:3000 即可，不需要带子路径。
// - build 时用相对路径 './'，产物 index.html 引用 ./assets/xxx。
//   这样同一份 dist 既能部署在域名根目录（Vercel / Netlify），
//   也能部署在子路径（GitHub Pages 的 /hub/），无需为不同平台改配置。
//   之前硬编码 base: '/hub/' 会让根目录托管的站点去请求 /hub/assets/*，
//   资源 404 直接白屏，这正是云端部署打不开的原因。
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? './' : '/',
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
}));
