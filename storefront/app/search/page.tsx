"use client";

import { useState } from "react";
import { searchProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const results = q.trim() ? searchProducts(q) : [];

  return (
    <section className="section">
      <div className="container">
        <h1 style={{ fontSize: 28, marginBottom: 20 }}>搜索</h1>
        <input
          className="input"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索商品，如「盖毯」「炒锅」「收纳」…"
          style={{ maxWidth: 520, marginBottom: 28 }}
        />

        {q.trim() === "" ? (
          <div className="empty">输入关键词，开始寻找让家更舒服的那一件。</div>
        ) : results.length === 0 ? (
          <div className="empty">
            没有找到与「{q}」相关的商品，换个词试试？
          </div>
        ) : (
          <>
            <p className="muted" style={{ marginBottom: 20 }}>
              找到 {results.length} 件相关商品
            </p>
            <div className="grid-products">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
