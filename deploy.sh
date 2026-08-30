#!/usr/bin/env bash
#
# NestHome 双通道部署脚本
#   - 海外：推送 GitHub -> Vercel 自动构建部署
#   - 国内：推送 out/ 到 Gitee Pages 仓库（免费版需在 Gitee 网页点「更新」）
#
# 用法（在 GitHub 仓库根目录执行）：
#   export GITHUB_TOKEN=ghp_xxx        # 有 repo 权限的 GitHub 令牌
#   export GITEE_TOKEN=yyy             # 有 projects+pages 权限的 Gitee 令牌
#   ./deploy.sh
#
set -euo pipefail

GITHUB_USER="${GITHUB_USER:-aquamos14}"
GITHUB_REPO="${GITHUB_REPO:-nesthome-storefront}"
GITEE_USER="${GITEE_USER:-aquamos}"
GITEE_REPO="${GITEE_REPO:-aquamos.gitee.io}"

: "${GITHUB_TOKEN:?请先设置环境变量 GITHUB_TOKEN}"
: "${GITEE_TOKEN:?请先设置环境变量 GITEE_TOKEN}"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"

echo "==> [1/3] 构建静态站 (next output:export)"
cd storefront
npm install
npm run build
cd ..

echo "==> [2/3] 推送源码到 GitHub（触发 Vercel 自动部署，海外通道）"
git add -A
git commit -m "deploy: $(date +%F_%T)" || echo "（无源码变更，跳过提交）"
git push "https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_REPO}.git" "${BRANCH}"

echo "==> [3/3] 推送 out/ 到 Gitee Pages（国内通道）"
rm -rf .gitee-deploy
git clone --depth 1 "https://${GITEE_USER}:${GITEE_TOKEN}@gitee.com/${GITEE_USER}/${GITEE_REPO}.git" .gitee-deploy
cp -R storefront/out/. .gitee-deploy/
cd .gitee-deploy
git add -A
git commit -m "deploy: $(date +%F_%T)" || echo "（无静态变更，跳过提交）"
git push origin HEAD
cd ..
rm -rf .gitee-deploy

echo ""
echo "==== 完成 ===="
echo "  海外: Vercel 自动部署中 -> https://${GITHUB_REPO}.vercel.app"
echo "  国内: 请在 Gitee 仓库「服务 -> Gitee Pages」点击「更新」刷新（免费版需手动）"
echo "       地址: https://${GITEE_USER}.gitee.io/"
