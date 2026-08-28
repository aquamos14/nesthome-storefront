import data from "./products.json";

export type Variant = {
  id: string;
  title: string;
  price: number;
  options: Record<string, string>;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  category: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  color: string;
  accent: string;
  description: string;
  details: string[];
  tags: string[];
  featured: boolean;
  rating: number;
  sales: number;
  options: { name: string; values: string[] }[];
  variants: Variant[];
};

export type Category = {
  id: string;
  name: string;
  tagline: string;
  color: string;
};

const products = data.products as Product[];
const categories = data.categories as Category[];
export const CURRENCY = (data.currency as string) || "CNY";

export function getAllProducts(): Product[] {
  return products;
}

export function getProductByHandle(handle: string): Product | undefined {
  return products.find((p) => p.handle === handle);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}

export function getCategories(): Category[] {
  return categories;
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((p) => {
    const haystack = [
      p.title,
      p.subtitle,
      p.category,
      p.description,
      ...p.tags,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
