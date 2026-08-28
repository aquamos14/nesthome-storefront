/**
 * Medusa 后端数据接入（可选 / 部署时启用）
 * ------------------------------------------------------------
 * 本店面默认使用本地 `lib/products.json`（零依赖、可静态部署、本机即可运行）。
 * 当你在 Vercel / Railway 部署了 Medusa v2 后端（PostgreSQL + Redis）后，
 * 设置环境变量 NEXT_PUBLIC_MEDUSA_BACKEND_URL，即可让店面改为读取 Medusa 商品。
 *
 * 用法示例（在页面中）：
 *   import { getProducts } from "@/lib/medusa";
 *   const products = await getProducts();
 *
 * 注意：本地 / 静态构建时无需任何后端即可工作。
 */
import {
  getAllProducts,
  getProductByHandle,
  getFeaturedProducts,
  searchProducts,
  type Product,
} from "./products";

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

async function fetchMedusa<T>(path: string): Promise<T | null> {
  if (!MEDUSA_URL) return null;
  try {
    const res = await fetch(`${MEDUSA_URL}/store/${path}`, {
      headers: { "x-publishable-key": process.env.NEXT_PUBLIC_MEDUSA_PK || "" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getProducts(): Promise<Product[]> {
  const remote = await fetchMedusa<{ products: Product[] }>("products?limit=50");
  return remote?.products ?? getAllProducts();
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  if (!MEDUSA_URL) return getProductByHandle(handle);
  const remote = await fetchMedusa<{ products: Product[] }>(
    `products?handle=${handle}`
  );
  return remote?.products?.[0] ?? getProductByHandle(handle);
}

export async function getFeatured(): Promise<Product[]> {
  if (!MEDUSA_URL) return getFeaturedProducts();
  const all = await getProducts();
  return all.filter((p) => p.featured).slice(0, 8);
}

export async function search(query: string): Promise<Product[]> {
  if (!MEDUSA_URL) return searchProducts(query);
  const remote = await fetchMedusa<{ products: Product[] }>(
    `products?q=${encodeURIComponent(query)}`
  );
  return remote?.products ?? searchProducts(query);
}
