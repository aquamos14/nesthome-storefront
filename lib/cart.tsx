"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import type { Product, Variant } from "./products";

export type CartItem = {
  id: string; // variant id
  productId: string;
  handle: string;
  title: string;
  variantTitle: string;
  price: number;
  color: string;
  accent: string;
  quantity: number;
  options: Record<string, string>;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: Product, variant: Variant, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "nesthome_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // 水合后从 localStorage 恢复
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  // 变更后写回
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const addItem = useCallback(
    (product: Product, variant: Variant, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === variant.id);
        if (existing) {
          return prev.map((i) =>
            i.id === variant.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        const item: CartItem = {
          id: variant.id,
          productId: product.id,
          handle: product.handle,
          title: product.title,
          variantTitle: variant.title,
          price: variant.price,
          color: product.color,
          accent: product.accent,
          quantity,
          options: variant.options,
        };
        return [...prev, item];
      });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.quantity, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart 必须在 CartProvider 内使用");
  return ctx;
}
