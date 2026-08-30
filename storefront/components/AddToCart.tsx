"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product, Variant } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export default function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.options.map((o) => [o.name, o.values[0]]))
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant: Variant = useMemo(() => {
    const match = product.variants.find((v) =>
      product.options.every((o) => v.options[o.name] === selected[o.name])
    );
    return match ?? product.variants[0];
  }, [product, selected]);

  function handleAdd() {
    addItem(product, variant, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div>
      {product.options.map((opt) => (
        <div className="field" key={opt.name}>
          <span className="label">
            {opt.name}：<strong>{selected[opt.name]}</strong>
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {opt.values.map((v) => (
              <button
                key={v}
                type="button"
                className={
                  selected[opt.name] === v ? "pill active" : "pill"
                }
                onClick={() =>
                  setSelected((s) => ({ ...s, [opt.name]: v }))
                }
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="field">
        <span className="label">数量</span>
        <div className="qty">
          <button
            type="button"
            className="qty-btn"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="减少"
          >
            −
          </button>
          <span className="qty-num">{qty}</span>
          <button
            type="button"
            className="qty-btn"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            aria-label="增加"
          >
            +
          </button>
        </div>
      </div>

      <div className="price-row" style={{ margin: "8px 0 18px" }}>
        <span className="price" style={{ fontSize: 22 }}>
          {formatPrice(variant.price * qty)}
        </span>
        {variant.price !== product.price && (
          <span className="muted" style={{ fontSize: 13 }}>
            单价 {formatPrice(variant.price)}
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          type="button"
          className="btn btn-primary"
          style={{ flex: 1 }}
          onClick={handleAdd}
        >
          加入购物车
        </button>
        <Link href="/cart" className="btn btn-ghost" onClick={handleAdd}>
          立即购买
        </Link>
      </div>

      {added && (
        <div className="success-box" style={{ marginTop: 14 }}>
          已加入购物车 ·{" "}
          <Link href="/cart" style={{ textDecoration: "underline" }}>
            去结算
          </Link>
        </div>
      )}
    </div>
  );
}
