#!/usr/bin/env bash
#
# 栖屋 NestHome 静态站 → 阿里云 OSS 上传脚本
# 前置：
#   1) 安装 ossutil：https://help.aliyun.com/zh/oss/developer-reference/ossutil-download
#   2) 先构建静态产物：  npm run build   （生成 out/ 目录）
#   3) 配置以下环境变量（不要写进仓库，建议放入 .env.oss 并 source）
#
# 用法：
#   source .env.oss && bash deploy-oss.sh
#   或： OSS_BUCKET=xxx OSS_ENDPOINT=oss-cn-hangzhou.aliyuncs.com \
#        OSS_ACCESS_KEY_ID=xxx OSS_ACCESS_KEY_SECRET=xxx bash deploy-oss.sh
#
# 变量说明：
#   OSS_BUCKET            存储桶名（已开启"静态页面托管"）
#   OSS_ENDPOINT          OSS 地域节点，如 oss-cn-hangzhou.aliyuncs.com
#   OSS_ACCESS_KEY_ID     RAM 子账号 AccessKey（仅赋 AliyunOSSFullAccess 或最小权限）
#   OSS_ACCESS_KEY_SECRET 对应 Secret
#   BUILD_FIRST           设为 1 时先跑 npm run build 再上传（默认 0）

set -euo pipefail

: "${OSS_BUCKET:?请设置 OSS_BUCKET（存储桶名）}"
: "${OSS_ENDPOINT:?请设置 OSS_ENDPOINT（如 oss-cn-hangzhou.aliyuncs.com）}"
: "${OSS_ACCESS_KEY_ID:?请设置 OSS_ACCESS_KEY_ID}"
: "${OSS_ACCESS_KEY_SECRET:?请设置 OSS_ACCESS_KEY_SECRET}"

OUT_DIR="${OUT_DIR:-out}"
OSS_PREFIX="${OSS_PREFIX:-}"

# 可选：先构建
if [ "${BUILD_FIRST:-0}" = "1" ]; then
  echo "==> 构建静态产物 (npm run build) ..."
  npm run build
fi

if [ ! -d "$OUT_DIR" ]; then
  echo "错误：未找到 $OUT_DIR 目录，请先运行 npm run build" >&2
  exit 1
fi

COMMON=(-e "$OSS_ENDPOINT" -i "$OSS_ACCESS_KEY_ID" -k "$OSS_ACCESS_KEY_SECRET" --update)

echo "==> 上传静态资源到 oss://${OSS_BUCKET}/${OSS_PREFIX}"

# 1) 带 hash 的静态资源（_next/static 等）缓存 1 年，内容变更即换名
ossutil cp -r "$OUT_DIR/_next" "oss://${OSS_BUCKET}/${OSS_PREFIX}_next" \
  "${COMMON[@]}" --meta Cache-Control:max-age=31536000,immutable

# 2) HTML 页面缓存 5 分钟，便于改商品后快速生效
find "$OUT_DIR" -name '*.html' -print0 | while IFS= read -r -d '' f; do
  rel="${f#$OUT_DIR/}"
  ossutil cp "$f" "oss://${OSS_BUCKET}/${OSS_PREFIX}${rel}" \
    "${COMMON[@]}" --meta Cache-Control:max-age=300
done

echo "==> 上传完成。请在 OSS 控制台确认："
echo "    - 静态页面托管：默认首页 = index.html，404 页 = 404.html"
echo "    - 绑定 CDN（全站加速）后，用 CDN 域名访问以获得国内最优速度"
