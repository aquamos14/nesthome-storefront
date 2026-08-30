# 栖屋 NestHome · 家居生活用品独立站

基于 **Medusa（GitHub 星数最多的开源独立站引擎）** Next.js Starter 架构自建的简约清新风家居电商店面。

## 技术栈
- **Next.js 14**（App Router, TypeScript）
- 数据层默认本地 `lib/products.json`（零依赖、可静态部署）
- 可一键切换为 **Medusa 后端**（Headless 全栈，需 Postgres + Redis）

## 页面
首页 / 商品列表（分类筛选）/ 商品详情（规格选择·加购）/ 购物车 / 结算 / 用户中心 / 搜索

## 本地运行
```bash
npm install
npm run dev      # http://localhost:3000
```

## 部署（Vercel）
1. 推到 GitHub 后，在 Vercel 点 "Import Git Repository" 导入本仓库
2. 框架自动识别为 Next.js，直接 Deploy（无需改配置）
3. 部署后获得 `*.vercel.app` 永久地址，之后 `git push` 自动重新部署

> 部署配置见 `vercel.json`（香港节点 hkg1，国内访问快）。

## 切到 Medusa 全栈（可选）
1. 部署并运行 `backend/` 下的 Medusa v2 后端（见 `backend/README.md`）
2. 在 Vercel 项目设置里添加环境变量：
   `NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://你的-medusa域名`
3. 重新部署即可从本地 JSON 切换到后端实时数据

## 目录结构
```
storefront/
├─ app/            # 页面（App Router）
├─ components/     # 共用组件（Navbar/Footer/ProductCard/购物车…）
├─ lib/            # products.json 数据 + 数据访问 + 购物车 Context + Medusa 客户端
├─ vercel.json     # Vercel 部署配置
└─ next.config.mjs # Next 配置
```
