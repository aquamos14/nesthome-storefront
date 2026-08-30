# 栖屋 NestHome 独立站 · 部署文档

基于 **Medusa（GitHub 36k★，星数最多的开源独立站引擎）** 的架构，前端采用其官方
Next.js Starter 思路自建的 **Next.js (App Router) 店面**。数据层默认使用本地
`lib/products.json`，可一键切换为 Medusa 后端（部署后端后填环境变量即可）。

> ⚠️ **中国大陆访问注意**：`*.vercel.app` / `*.netlify.app` 等海外平台默认域名
> **在中国大陆被墙/不稳定**，国内浏览器通常直接打不开。因此本项目的**国内生产部署**
> 采用 **静态导出 → 阿里云 OSS + CDN** 方案（已配好脚本）。海外用户仍可走 Vercel/Netlify。

---

## 一、项目结构

```
.
├── storefront/            # Next.js 14 店面（核心交付，可独立运行/部署）
│   ├── app/               # 页面：首页 / 商品列表 / 详情 / 购物车 / 结算 / 账户 / 搜索
│   ├── components/        # 导航、商品卡、加购、分类筛选、订阅等
│   ├── lib/               # products.json 数据 + 购物车 Context + Medusa 客户端封装
│   ├── next.config.mjs    # 已开启 output:"export"（静态导出）
│   ├── deploy-oss.sh      # 上传 out/ 到阿里云 OSS 的脚本
│   └── .env.oss.example   # OSS 配置模板
└── backend/               # Medusa v2 后端（全栈模式可选，需 Postgres + Redis）
    ├── medusa-config.ts
    ├── docker-compose.yml # 本地 Postgres + Redis
    └── src/scripts/seed.ts# 家居种草数据导入
```

| 部署目标 | 推荐度 | 说明 |
|---|---|---|
| **阿里云 OSS + CDN** | ⭐ 国内最推荐 | 静态导出 `out/` 直接托管，国内访问快、成本低、域名合规 |
| **Vercel** | ⚠️ 海外可用 | `git push` 即上线；但 `*.vercel.app` 在**中国大陆被墙**，国内打不开 |
| **Netlify** | ⚠️ 海外可用 | 同上，`*.netlify.app` 国内访问也不稳定 |

---

## 二、本地运行（仅店面）

```bash
cd storefront
npm install
npm run dev          # 打开 http://localhost:3000
```

无需数据库，开箱即用。商品数据在 `storefront/lib/products.json` 中维护。

---

## 三、部署到阿里云 OSS + CDN（国内生产，当前采用）

静态导出已配置好（`next.config.mjs` 含 `output:"export"` + `trailingSlash`），
配套 `deploy-oss.sh` 与 `.env.oss.example`。

### 1) 准备 OSS 存储桶
- 在阿里云 OSS 控制台新建 Bucket（如 `nesthome-storefront`），地域选离用户近的
  （华东1 杭州 / 华北2 北京 / 华南1 深圳）。
- 开启 **「静态页面托管」**：默认首页 = `index.html`，404 页 = `404.html`。
- 创建 **RAM 子账号 AccessKey**，仅授予该 Bucket 的 OSS 读写权限（最小权限）。

### 2) 配置并上传
```bash
cd storefront
npm run build                              # 生成 out/ 静态产物（23 个页面）

cp .env.oss.example .env.oss               # 编辑填入你的 AK / Bucket / Endpoint
source .env.oss && bash deploy-oss.sh      # 上传 out/ 到 OSS
```
（脚本已对 `_next` 资源设 1 年缓存、HTML 设 5 分钟缓存，内容变更即换名。）

### 3) 绑定 CDN（全站加速）
在阿里云 **CDN 控制台** 为该 Bucket 添加加速域名（如 `www.你的域名.com`），
源站类型选「OSS 域名」，CNAME 解析到阿里云分配的 CDN 地址。
绑定成功后用 **CDN 域名** 访问即可获得国内最优速度（也可先直接用 OSS 提供的
`*.oss-cn-xxx.aliyuncs.com` 域名验证）。

### 4) 更新商品后重新发布
编辑 `storefront/lib/products.json` → `npm run build` → `bash deploy-oss.sh` 即可。

---

## 四、部署到 Vercel（海外 / 预览）

1. 把本仓库推到 GitHub。
2. Vercel 导入该仓库，**根目录设为 `storefront`**（Framework 选 Next.js）。
3. Build Command：`npm run build`；Output：`next` 自动识别。
4. 点击 Deploy，几分钟后获得 `https://你的项目.vercel.app`（**海外可访问，国内被墙**）。
5.（可选全栈）设置环境变量 `NEXT_PUBLIC_MEDUSA_BACKEND_URL` 指向你的 Medusa 后端。

> 因 `output:"export"` 已开启，Vercel 会按静态站构建；若需 SSR 全栈，部署前
> 临时移除 `output:"export"` 并接入 Medusa 后端即可。

---

## 五、部署到 Netlify（海外 / 预览）

1. 推送到 GitHub 后，Netlify 导入仓库，**Base directory = `storefront`**。
2. Build command：`npm run build`；Publish directory：`out`（静态导出模式）。
3. Deploy 即可。

---

## 六、全栈模式：部署 Medusa 后端（可选）

当需要从后台管理商品/订单/库存时，单独部署 `backend/`：

1. **数据库 + 缓存**（二选一）
   - 本地：`cd backend && docker compose up -d`（Postgres + Redis）
   - 云端：Neon（Postgres）+ Upstash（Redis），复制连接串
2. 配置环境变量（参考 `backend/.env.example`）：
   ```
   DATABASE_URL=postgres://user:pass@host:5432/nesthome?sslmode=require
   REDIS_URL=redis://user:pass@host:6379
   STORE_CORS=https://你的店面域名
   JWT_SECRET=随机强串
   COOKIE_SECRET=随机强串
   ```
3. 安装依赖并初始化：
   ```bash
   cd backend
   npm install
   npx medusa db:migrate
   npm run seed        # 导入家居种草数据（src/scripts/seed.ts）
   npm run start       # 后端默认 9000 端口，附 Admin 后台
   ```
4. 在店面环境变量中加入：
   ```
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://你的-medusa-后端
   NEXT_PUBLIC_MEDUSA_PK=<admin 后台生成的可发布 Key>
   ```
   重新部署店面，即切换为全栈数据。

---

## 七、环境变量速查

| 变量 | 作用域 | 说明 |
|---|---|---|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | 店面 | 留空=本地 JSON；填入=Medusa 后端地址 |
| `NEXT_PUBLIC_MEDUSA_PK` | 店面 | Medusa 可发布 API Key |
| `OSS_BUCKET` / `OSS_ENDPOINT` / `OSS_ACCESS_KEY_ID` / `OSS_ACCESS_KEY_SECRET` | OSS 部署 | 见 `.env.oss.example` |
| `DATABASE_URL` | 后端 | Postgres 连接串 |
| `REDIS_URL` | 后端 | Redis 连接串 |
| `JWT_SECRET` / `COOKIE_SECRET` | 后端 | 生产环境务必替换为强随机值 |

---

## 八、维护建议

- **改商品**：直接编辑 `storefront/lib/products.json`（与 `backend/lib/products.json`
  同源，改动后两边同步即可），重新 `npm run build` + 上传 OSS。
- **换真实图片**：把 `components/ProductImage.tsx` 的 SVG 占位图替换为 `next/image`
  指向你的图床/CDN。
- **接支付**：在 `app/checkout/page.tsx` 的「提交订单」处对接微信支付/支付宝
  （可用云函数或 Medusa 的 Payment Module）。

---

## 九、代码仓库与状态

- **GitHub（永久托管 / 自动部署来源）**：https://github.com/aquamos14/nesthome-storefront
- **当前部署策略**：静态导出 → 阿里云 OSS + CDN（国内可访问）。
- Vercel 项目 `nesthome-storefront` 构建状态 READY，但因 `vercel.app` 国内被墙，
  仅作海外预览用途；境内生产以 OSS+CDN 为准。
- 详细状态见仓库根 `DEPLOYED_URL.txt`。
