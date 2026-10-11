import { Link } from "react-router-dom";
import { formatIDR, type Product } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Price = ({ price, compare, className }: { price: number; compare?: number | null; className?: string }) => (
  <span className={cn("inline-flex flex-wrap items-baseline gap-x-2", className)}>
    <span className="font-semibold text-primary">{formatIDR(price)}</span>
    {compare != null && compare > price && (
      <span className="text-[0.8em] text-muted-foreground line-through">{formatIDR(compare)}</span>
    )}
  </span>
);

const ProductCard = ({ product }: { product: Product }) => {
  const off =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round((1 - product.price / product.compare_at_price) * 100)
      : 0;

  return (
    <Link
      to={`/shop/${product.slug}`}
      className="lift group flex h-full flex-col overflow-hidden rounded-card bg-card shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-blush">
        {product.cover_url && (
          <img
            src={product.cover_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-slow ease-soft group-hover:scale-[1.04]"
          />
        )}
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          {product.badge && <span className="rounded-full bg-milk px-2.5 py-1 text-[0.7rem] font-semibold text-primary shadow-soft">{product.badge}</span>}
          {off > 0 && <span className="rounded-full bg-primary px-2.5 py-1 text-[0.7rem] font-semibold text-primary-foreground">-{off}%</span>}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5 sm:p-4">
        {product.category && <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{product.category}</p>}
        <h3 className="font-display text-lg leading-snug text-foreground">{product.title}</h3>
        <Price price={product.price} compare={product.compare_at_price} className="mt-auto pt-2 text-sm" />
      </div>
    </Link>
  );
};

export default ProductCard;
