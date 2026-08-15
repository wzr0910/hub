# Vercel 部署说明

## 1. 准备工作
- 确保你已经有一个 GitHub 账号。
- 将当前项目目录初始化为 Git 仓库（如果还没有）。
- 确保本地已安装 Node.js 18+。

## 2. 本地安装依赖
```bash
cd philintern-hub
npm install
```

## 3. 本地验证构建
```bash
npm run build
```

如果构建成功，说明项目适合部署到 Vercel。

## 4. 推送到 GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <你的 GitHub 仓库地址>
git push -u origin main
```

## 5. 在 Vercel 中部署
1. 打开 https://vercel.com
2. 登录 GitHub 账号。
3. 点击 “Add New Project”。
4. 导入你刚刚推送的仓库。
5. 若 Vercel 自动识别为其他类型项目，请手动设置：
   - Framework Preset: Vite
   - Build Command: npm run build
   - Output Directory: dist
6. 该项目应被当作纯静态 Vite 网站部署，无需任何服务端函数。
7. 点击 “Deploy”。

## 6. 部署完成后的访问地址
部署成功后，Vercel 会给你一个在线地址，例如：
```text
https://your-project-name.vercel.app
```

## 7. 需要注意的事项
- 本项目为纯静态网页，AI 功能使用前端模拟数据，不需要任何服务端接口。
- 无需配置任何环境变量，也不会暴露任何密钥。
