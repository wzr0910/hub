# PhilIntern 哲学实习助手

这是一个基于 React + TypeScript + Tailwind CSS + Vite 的单页应用，面向哲学系学生提供实习求职辅助。

## 功能模块
- 潜力挖掘器：帮助挖掘简历素材
- 多岗位简历生成器：针对不同岗位生成不同版本简历
- HR 沟通助手：生成打招呼话术与 HR 回答参考
- 岗位匹配度分析：提供投递可行性和差距分析
- 能力速成与行动清单：生成 14 天 / 30 天提升计划

## 本地运行
1. 安装依赖：`npm install`
2. 启动开发服务器：`npm run dev`
3. 在浏览器中打开 http://localhost:3000

其他命令：
- `npm run typecheck` — TypeScript 类型检查
- `npm run build` — 生产构建，产物在 `dist/`
- `npm run preview` — 本地预览构建产物

## 使用说明
- 本项目为纯静态网页，内置**规则分析引擎**：从你粘贴的 JD 中提取技能要求、识别岗位类型、把你的技能与要求做交集计算匹配度，并生成简历 / HR 话术 / 提升计划。
- 所有计算都在浏览器本地完成，**无需任何密钥、服务端接口或付费**，可离线使用。

## 部署
构建使用**相对路径**（`base: './'`），因此同一份 `dist/` 可以直接部署到：
- 域名根目录：Vercel / Netlify（仓库已带 `vercel.json`）
- 子路径：GitHub Pages（如 `https://<用户名>.github.io/hub/`）

不需要为不同平台修改配置。

> 注意：不要把 `vite.config.ts` 里的 `base` 改回 `/hub/` 之类的硬编码绝对路径。
> 那样构建产物会去请求 `/hub/assets/*`，在根目录托管的平台上资源全部 404，页面直接白屏。

GitHub Pages 已配置自动部署：推送到 `main` 后，`.github/workflows/deploy.yml` 会自动构建并更新 `gh-pages` 分支。

Vercel 详细步骤请查看 [deploy-vercel.md](deploy-vercel.md)。
