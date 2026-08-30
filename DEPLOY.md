# NestHome 家居独立站 · 部署文档

## 双通道部署总览

| 通道 | 平台 | 访问范围 | 更新方式 |
|---|---|---|---|
| 海外 | **Vercel** | 海外（国内被墙） | 推送 GitHub → 自动构建部署 |
| 国内 | **Gitee Pages** | 国内免费直达 | 推送 out/ → 网页点「更新」 |

- 源码仓库：https://github.com/aquamos14/nesthome-storefront
- 应用代码位于 `storefront/`（Next.js 14，`output: 'export'` 静态导出）
- Vercel 项目 Root Directory = `storefront`

---

## 1. 海外通道：Vercel（自动）

- 已导入 GitHub 仓库，**推送即自动构建部署**。
- 默认域名（海外可访问）：https://nesthome-storefront.vercel.app
- 自定义域名：Vercel 项目 → Settings → Domains 添加（需自有域名 + 备案）。

---

## 2. 国内通道：Gitee Pages（免费）

- 仓库：https://gitee.com/aquamos/aquamos.gitee.io （个人页仓库，根托管）
- 站点地址：https://aquamos.gitee.io/
- **开启步骤（免费版仅需一次）**：
  1. 打开该仓库 → 顶部「服务」→ **Gitee Pages**
  2. 部署分支选 `master`，部署目录 `/`
  3. 点击「启动」
- **后续更新**：每次改完并推送 `out/` 后，回到 Gitee Pages 页面点「更新」即可刷新。
  > 说明：Gitee Pages **免费版不支持 API 自动部署**，只能网页手动「更新」；付费 Pro 版才支持自动部署。这是免费方案的已知限制。

---

## 3. 本地一键双推：`deploy.sh`

在 GitHub 仓库根目录执行，并设置环境变量（令牌不要写进文件）：

```bash
export GITHUB_TOKEN=你的GitHub令牌
export GITEE_TOKEN=你的Gitee令牌
./deploy.sh
```

脚本依次：构建 → 推送 GitHub（触发 Vercel）→ 推送 `out/` 到 Gitee（回 Gitee 点「更新」）。

---

## 4. 静态导出产物

- `storefront/out/`：22 个 HTML 页面 + 静态资源，**纯静态、无需后端**（购物车用 localStorage，商品用本地 JSON）。
- 本地预览：在 `storefront/out` 目录起任意静态服务器即可。

---

## 5. 备选：阿里云 OSS + CDN（付费，真 CDN 加速）

需自定义域名与备案时选用，见 `storefront/deploy-oss.sh` 与 `storefront/.env.oss.example`（需阿里云 AccessKey）。
