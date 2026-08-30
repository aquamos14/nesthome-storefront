"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import ProductImage from "@/components/ProductImage";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <div className="empty">
            <div style={{ fontSize: 40, marginBottom: 12 }}>🛒</div>
            <h2 style={{ fontSize: 22, marginBottom: 12 }}>购物车还是空的</h2>
            <p style={{ marginBottom: 24 }}>去挑几件让家更舒服的好物吧。</p>
            <Link href="/products" className="btn btn-primary">
              去逛逛
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const shipping = subtotal >= 99 || subtotal === 0 ? 0 : 12;
  const total = subtotal + shipping;

  return (
    <section className="section">
      <div className="container">
        <h1 style={{ fontSize: 28, marginBottom: 28 }}>购物车</h1>
        <div className="cart-layout">
          <div>
            {items.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="ci-thumb">
                  <ProductImage
                    id={item.productId}
                    color={item.color}
                    accent={item.accent}
                    title={item.title}
                  />
                </div>
                <div>
                  <Link href={`/products/${item.handle}`} className="ci-title">
                    {item.title}
                  </Link>
                  <div className="ci-variant">
                    {Object.entries(item.options)
                      .map(([k, v]) => `${k}：${v}`)
                      .join(" / ")}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <div className="qty" style={{ transform: "scale(0.85)", transformOrigin: "left" }}>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="减少"
                      >
                        −
                      </button>
                      <span className="qty-num">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="增加"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                  <button
                    className="ci-actions"
                    onClick={() => removeItem(item.id)}
                    style={{
                      marginTop: 8,
                      background: "none",
                      border: 0,
                      color: "var(--muted)",
                      fontSize: 13,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    移除
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="summary">
            <h3>订单摘要</h3>
            <div className="summary-row">
              <span>商品小计</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>运费</span>
              <span>{shipping === 0 ? "包邮" : formatPrice(shipping)}</span>
            </div>
            <div className="summary-row total">
              <span>合计</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link href="/checkout" className="btn btn-primary btn-block" style={{ marginTop: 18 }}>
              去结算
            </Link>
            <Link
              href="/products"
              className="muted"
              style={{ display: "block", textAlign: "center", marginTop: 12, fontSize: 13 }}
            >
              继续购物
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
