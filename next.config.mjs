/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 允许从 Medusa 后端加载图片（部署时如启用 Medusa 可放开）
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.amazonaws.com" },
    ],
  },
};

export default nextConfig;
