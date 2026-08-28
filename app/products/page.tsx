"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  getAllProducts,
  getProductsByCategory,
  getCategories,
} from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import CategoryNav from "@/components/CategoryNav";

function ProductsInner() {
  const params = useSearchParams();
  const catId = params.get("category");
  const cat = getCategories().find((c) => c.id === catId);
  const list = catId ? getProductsByCategory(catId) : getAllProducts();

  return (
    <>
      <div className="section-head" style={{ marginBottom: 24 }}>
        <span className="eyebrow">{cat ? cat.name : "全部商品"}</span>
        <h2>{cat ? cat.tagline : "栖屋的全部好物"}</h2>
        <p>
          共 {list.length} 件
          {cat && (
            <>
              {" · "}
              <Link href="/products" className="muted" style={{ textDecoration: "underline" }}>
                查看全部
              </Link>
            </>
          )}
        </p>
      </div>

      <CategoryNav />

      {list.length === 0 ? (
        <div className="empty">该分类暂无商品，去看看其他角落吧。</div>
      ) : (
        <div className="grid-products">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}

export default function ProductsPage() {
  return (
    <section className="section">
      <div className="container">
        <Suspense fallback={<div className="muted">加载中…</div>}>
          <ProductsInner />
        </Suspense>
      </div>
    </section>
  );
}
