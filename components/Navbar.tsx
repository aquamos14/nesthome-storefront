"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";

const NAV = [
  { href: "/", label: "首页" },
  { href: "/products", label: "全部商品" },
  { href: "/products?category=textile", label: "家纺" },
  { href: "/products?category=kitchen", label: "餐厨" },
  { href: "/products?category=storage", label: "收纳" },
  { href: "/products?category=furniture", label: "家具" },
  { href: "/products?category=decor", label: "香氛" },
  { href: "/products?category=tableware", label: "餐瓷" },
];

export default function Navbar() {
  const { count } = useCart();
  const pathname = usePathname();

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand" aria-label="栖屋 NestHome 首页">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 3 4 13v16h24V13L16 3Z"
              stroke="#7c9885"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M16 27V15M16 15c-3 0-5-2-5-5 3 0 5 2 5 5Zm0 0c3 0 5-2 5-5-3 0-5 2-5 5Z"
              stroke="#7c9885"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          <span>
            栖屋 <em>NestHome</em>
          </span>
        </Link>

        <nav className="nav-links">
          {NAV.map((n) => {
            const active =
              n.href === "/"
                ? pathname === "/"
                : pathname === n.href.split("?")[0] &&
                  (n.href.includes("?")
                    ? false
                    : true);
            return (
              <Link
                key={n.label}
                href={n.href}
                className={active ? "nav-link active" : "nav-link"}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="nav-actions">
          <Link href="/search" className="icon-btn" aria-label="搜索">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#2e2e2b" strokeWidth="2" />
              <path d="m20 20-3-3" stroke="#2e2e2b" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
          <Link href="/cart" className="icon-btn cart-btn" aria-label="购物车">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 4h2l2.4 12.3a2 2 0 0 0 2 1.7h7.7a2 2 0 0 0 2-1.6L21 8H6"
                stroke="#2e2e2b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="21" r="1.4" fill="#2e2e2b" />
              <circle cx="18" cy="21" r="1.4" fill="#2e2e2b" />
            </svg>
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
