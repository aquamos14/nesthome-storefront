import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const onSale =
    product.compareAtPrice && product.compareAtPrice > product.price;
  return (
    <Link href={`/products/${product.handle}`} className="card product-card">
      <div className="thumb">
        {onSale && (
          <span className="badge-sale">
            省 ¥{product.compareAtPrice! - product.price}
          </span>
        )}
        {!onSale && product.featured && (
          <span className="badge-new">精选</span>
        )}
        <ProductImage
          id={product.id}
          color={product.color}
          accent={product.accent}
          title={product.title}
          category={product.category}
        />
      </div>
      <div className="body">
        <span className="cat">{product.category}</span>
        <div className="title">{product.title}</div>
        <div className="sub">{product.subtitle}</div>
        <div className="price-row">
          <span className="price">{formatPrice(product.price)}</span>
          {onSale && (
            <span className="price-compare">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
