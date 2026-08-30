/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出：构建产物输出到 out/，可直接托管到任意静态服务器
  // （阿里云 OSS / 腾讯云 COS / Nginx / GitHub Pages 等），无需 Node 运行时。
  output: "export",

  // 站内商品图当前为内联 SVG（离线安全）。若日后换成 next/image 真实图，
  // unoptimized 可避免静态导出下图片优化器不可用的问题。
  images: { unoptimized: true },

  // 静态托管兼容：生成 /x/index.html 目录结构，OSS/COS 默认首页 index.html 可直接命中。
  trailingSlash: true,
};

export default nextConfig;
