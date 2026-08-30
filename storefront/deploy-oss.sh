#!/usr/bin/env bash
#
# 栖屋 NestHome 静态站 → 阿里云 OSS 上传脚本
# 前置：
#   1) 先构建静态产物：  npm run build   （生成 out/ 目录）
#   2) 配置以下环境变量（不要写进仓库，建议放入 .env.oss 并 source）
# 注：若系统未安装 ossutil，本脚本会自动下载安装到 ~/.local/bin（无需 sudo）。
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
#   OSSUTIL_BIN           可选，手动指定 ossutil 可执行文件路径

set -euo pipefail

# ---------- 自动安装 ossutil（缺失时）----------
ensure_ossutil() {
  if command -v ossutil >/dev/null 2>&1; then
    OSSUTIL_BIN="$(command -v ossutil)"
    return 0
  fi
  if [ -n "${OSSUTIL_BIN:-}" ] && [ -x "$OSSUTIL_BIN" ]; then
    return 0
  fi
  local TOOLS_DIR="$HOME/.local/bin"
  mkdir -p "$TOOLS_DIR"
  local URL
  case "$(uname -s)" in
    Darwin) URL="https://gosspublic.alicdn.com/ossutil/ossutilmac64" ;;
    Linux)  URL="https://gosspublic.alicdn.com/ossutil/ossutil64" ;;
    MINGW*|MSYS*|CYGWIN*) URL="https://gosspublic.alicdn.com/ossutil/ossutil64.exe" ;;
    *) echo "未知系统，请手动安装 ossutil：https://help.aliyun.com/zh/oss/developer-reference/ossutil-download" >&2; exit 1 ;;
  esac
  echo "==> 未检测到 ossutil，尝试自动下载到 $TOOLS_DIR/ossutil ..."
  if ! curl -sSL -o "$TOOLS_DIR/ossutil" "$URL"; then
    echo "自动下载失败（网络被拦截）。请手动安装 ossutil 后重试：" >&2
    echo "    macOS:   brew install ossutil" >&2
    echo "    其他:    https://help.aliyun.com/zh/oss/developer-reference/ossutil-download" >&2
    exit 1
  fi
  # 下载到的是 XML 错误页（网络拦截常见），兜底判断
  if head -c 5 "$TOOLS_DIR/ossutil" | grep -q '<?xml'; then
    echo "下载内容异常（疑似被网络拦截，返回了错误页）。请手动安装 ossutil 后重试。" >&2
    rm -f "$TOOLS_DIR/ossutil"
    exit 1
  fi
  chmod +x "$TOOLS_DIR/ossutil"
  export PATH="$TOOLS_DIR:$PATH"
  OSSUTIL_BIN="$TOOLS_DIR/ossutil"
  echo "==> ossutil 已安装：$OSSUTIL_BIN"
}
ensure_ossutil

# ---------- 参数校验 ----------
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
"$OSSUTIL_BIN" cp -r "$OUT_DIR/_next" "oss://${OSS_BUCKET}/${OSS_PREFIX}_next" \
  "${COMMON[@]}" --meta Cache-Control:max-age=31536000,immutable

# 2) HTML 页面缓存 5 分钟，便于改商品后快速生效
find "$OUT_DIR" -name '*.html' -print0 | while IFS= read -r -d '' f; do
  rel="${f#$OUT_DIR/}"
  "$OSSUTIL_BIN" cp "$f" "oss://${OSS_BUCKET}/${OSS_PREFIX}${rel}" \
    "${COMMON[@]}" --meta Cache-Control:max-age=300
done

echo "==> 上传完成。请在 OSS 控制台确认："
echo "    - 静态页面托管：默认首页 = index.html，404 页 = 404.html"
echo "    - 绑定 CDN（全站加速）后，用 CDN 域名访问以获得国内最优速度"
