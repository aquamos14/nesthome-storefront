/**
 * 商品占位图（离线安全）。
 * 用商品主色生成柔和渐变 + 标题文字，无需任何外部图片资源。
 * 部署时可替换为真实商品图：把 <ProductImage> 换成 next/image 即可。
 */
export type ProductImageProps = {
  color: string;
  accent: string;
  title: string;
  category?: string;
  id?: string;
  className?: string;
};

export default function ProductImage({
  color,
  accent,
  title,
  category = "",
  id = "x",
  className,
}: ProductImageProps) {
  const gid = `g-${id}`;
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#fbfaf7" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#${gid})`} />
      <circle cx="200" cy="168" r="96" fill={accent} opacity="0.16" />
      <circle cx="200" cy="168" r="64" fill={accent} opacity="0.12" />
      <text
        x="200"
        y="300"
        textAnchor="middle"
        fontFamily="'Songti SC','Noto Serif SC',Georgia,serif"
        fontSize="30"
        fontWeight="600"
        fill="#2e2e2b"
      >
        {title.length > 9 ? title.slice(0, 9) + "…" : title}
      </text>
      {category && (
        <text
          x="200"
          y="332"
          textAnchor="middle"
          fontFamily="-apple-system,'PingFang SC',sans-serif"
          fontSize="14"
          fill="#8a8a82"
        >
          {category}
        </text>
      )}
    </svg>
  );
}
