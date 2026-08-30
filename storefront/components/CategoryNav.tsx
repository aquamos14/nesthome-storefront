"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getCategories } from "@/lib/products";

export default function CategoryNav() {
  const params = useSearchParams();
  const active = params.get("category");
  const cats = getCategories();

  return (
    <div className="cat-nav">
      <Link
        href="/products"
        className={!active ? "pill active" : "pill"}
      >
        全部
      </Link>
      {cats.map((c) => (
        <Link
          key={c.id}
          href={`/products?category=${c.id}`}
          className={active === c.id ? "pill active" : "pill"}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
