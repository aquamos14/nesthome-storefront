import Link from "next/link";
import {
  getFeaturedProducts,
  getCategories,
  getAllProducts,
} from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Newsletter from "@/components/Newsletter";

export default function HomePage() {
  const featured = getFeaturedProducts(8);
  const categories = getCategories();
  const total = getAllProducts().length;

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="eyebrow">栖屋 NestHome · 家居生活用品</span>
            <h1>
              把家，过成
              <br />
              想要的样子
            </h1>
            <p>
              从一床柔软的盖毯，到一只趁手的炒锅。我们替你淘选日常里真正好用的物件，
              让平凡的日子，也透着温柔的光。
            </p>
            <div className="hero-actions">
              <Link href="/products" className="btn btn-primary">
                逛逛全部好物
              </Link>
              <Link href="/products?category=textile" className="btn btn-ghost">
                从家纺开始
              </Link>
            </div>
          </div>
          <div className="hero-art" aria-hidden>
            <span
              className="hero-blob"
              style={{
                width: 220,
                height: 220,
                background: "#c9bba8",
                top: 30,
                left: 40,
              }}
            />
            <span
              className="hero-blob"
              style={{
                width: 140,
                height: 140,
                background: "#7c9885",
                bottom: 40,
                right: 50,
              }}
            />
            <svg width="180" height="180" viewBox="0 0 200 200" fill="none">
              <path
                d="M100 28 44 80v82h112V80L100 28Z"
                stroke="#5f7a68"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M100 162V92m0 0c-18 0-30-12-30-30 18 0 30 12 30 30Zm0 0c18 0 30-12 30-30-18 0-30 12-30 30Z"
                stroke="#5f7a68"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* 分类 */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">按空间挑选</span>
            <h2>六个角落，六种温柔</h2>
            <p>从卧室到餐桌，给家的每个区域都备好趁手好物。</p>
          </div>
          <div className="cat-grid">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/products?category=${c.id}`}
                className="cat-card"
                style={{ background: `linear-gradient(135deg, ${c.color}, #faf8f4)` }}
              >
                <span className="arrow">→</span>
                <h3>{c.name}</h3>
                <p>{c.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 精选商品 */}
      <section className="section section-tight">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">编辑精选</span>
            <h2>这一季，我们想推荐给你</h2>
            <p>共 {total} 件好物，每一件都经得起日常的使用。</p>
          </div>
          <div className="grid-products">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <Link href="/products" className="btn btn-ghost">
              查看全部商品
            </Link>
          </div>
        </div>
      </section>

      {/* 卖点 */}
      <section className="section-tight">
        <div className="container">
          <div className="benefits">
            <div className="benefit">
              <div className="ico">🌿</div>
              <h4>严选材质</h4>
              <p>天然棉麻、实木与陶瓷，亲肤安心</p>
            </div>
            <div className="benefit">
              <div className="ico">🚚</div>
              <h4>顺丰包邮</h4>
              <p>满 99 元全国大部分地区包邮</p>
            </div>
            <div className="benefit">
              <div className="ico">↩️</div>
              <h4>七天无忧</h4>
              <p>不满意可退换，售后不扯皮</p>
            </div>
            <div className="benefit">
              <div className="ico">💬</div>
              <h4>真人客服</h4>
              <p>工作日在线，帮你挑对那一件</p>
            </div>
          </div>
        </div>
      </section>

      {/* 订阅 */}
      <section className="section">
        <div className="container">
          <Newsletter />
        </div>
      </section>
    </>
  );
}
