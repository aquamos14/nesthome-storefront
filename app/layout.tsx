import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "栖屋 NestHome · 家居生活用品独立站",
  description:
    "栖屋 NestHome —— 为日常挑选温柔好物。家纺、餐厨、收纳、家具、香氛与餐瓷，简约清新，把家过成想要的样子。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <CartProvider>
          <Navbar />
          <main className="site-main">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
