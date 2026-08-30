import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductByHandle,
  getRelatedProducts,
  getAllProducts,
} from "@/lib/products";
import { formatPrice } from "@/lib/format";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import AddToCart from "@/components/AddToCart";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ handle: p.handle }));
}

export default function ProductDetailPage({
  params,
}: {
  params: { handle: string };
}) {
  const product = getProductByHandle(params.handle);
  if (!product) notFound();

  const onSale =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const related = getRelatedProducts(product, 4);

  return (
    <section className="section">
      <div className="container">
        <div style={{ marginBottom: 20 }}>
          <Link href="/products" className="muted" style={{ fontSize: 13 }}>
            ← 返回全部商品
          </Link>
        </div>

        <div className="pdp-grid">
          {/* 画廊 */}
          <div className="pdp-gallery">
            <ProductImage
              id={product.id}
              color={product.color}
              accent={product.accent}
              title={product.title}
              category={product.category}
            />
          </div>

          {/* 信息 + 加购 */}
          <div className="pdp-info">
            <span className="cat">{product.category}</span>
            <h1>{product.title}</h1>
            <div className="sub">{product.subtitle}</div>

            <div className="pdp-meta">
              <span className="stars">
                {"★".repeat(Math.round(product.rating))}
                <span className="muted" style={{ color: "#b8924f" }}>
                  {"★".repeat(5 - Math.round(product.rating))}
                </span>
              </span>
              <span>{product.rating} 分</span>
              <span>已售 {product.sales}+</span>
            </div>

            <div className="price-row" style={{ marginBottom: 18 }}>
              <span className="price" style={{ fontSize: 26 }}>
                {formatPrice(product.price)}
              </span>
              {onSale && (
                <span className="price-compare">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>

            <p className="pdp-desc">{product.description}</p>

            <AddToCart product={product} />

            <ul className="pdp-details">
              {product.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>

            <div style={{ marginTop: 18, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {product.tags.map((t) => (
                <span key={t} className="tag">
                  # {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 相关推荐 */}
        {related.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <div className="section-head" style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 24 }}>同系列，也值得一看</h2>
            </div>
            <div className="grid-products">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
