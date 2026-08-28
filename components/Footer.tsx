import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand" style={{ marginBottom: 12 }}>
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 3 4 13v16h24V13L16 3Z"
                  stroke="#7c9885"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 27V15M16 15c-3 0-5-2-5-5 3 0 5 2 5 5Zm0 0c3 0 5-2 5-5-3 0-5 2-5 5Z"
                  stroke="#7c9885"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
              <span>
                栖屋 <em>NestHome</em>
              </span>
            </div>
            <p>
              为日常挑选温柔好物。我们相信，好用的家居用品，能让平凡的日子也发光。
            </p>
          </div>

          <div>
            <h4>选购</h4>
            <Link href="/products?category=textile">家纺布艺</Link>
            <Link href="/products?category=kitchen">厨房餐厨</Link>
            <Link href="/products?category=storage">收纳整理</Link>
            <Link href="/products?category=furniture">家具单品</Link>
            <Link href="/products?category=decor">香氛装饰</Link>
            <Link href="/products?category=tableware">餐瓷杯具</Link>
          </div>

          <div>
            <h4>关于</h4>
            <Link href="/">品牌故事</Link>
            <Link href="/products">全部商品</Link>
            <Link href="/account">我的账户</Link>
            <Link href="/cart">购物车</Link>
          </div>

          <div>
            <h4>帮助</h4>
            <Link href="/">配送说明</Link>
            <Link href="/">退换政策</Link>
            <Link href="/">联系我们</Link>
            <Link href="/">常见问题</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} 栖屋 NestHome · 家居生活用品独立站</span>
          <span>用 Next.js 构建 · 基于 Medusa 独立站架构</span>
        </div>
      </div>
    </footer>
  );
}
