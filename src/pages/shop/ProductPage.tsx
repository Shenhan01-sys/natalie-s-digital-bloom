import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BadgeCheck, Mail, ShoppingBag, Sparkles } from "lucide-react";
import ShopShell from "@/components/shop/ShopShell";
import { Price } from "@/components/shop/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { galleryOf, useProduct } from "@/lib/shop-api";
import { useSite } from "@/lib/site-content";
import { cn } from "@/lib/utils";

const ProductPage = () => {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { profile } = useSite();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (product) document.title = `${product.title} · ${profile.firstName}'s Shop`;
    setActive(0);
  }, [product, profile.firstName]);

  if (isLoading) {
    return (
      <ShopShell back={{ to: "/shop", label: "Shop" }}>
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-[4/5] rounded-card bg-blush" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4 bg-blush" />
            <Skeleton className="h-6 w-1/3 bg-blush" />
            <Skeleton className="h-32 w-full bg-blush" />
          </div>
        </div>
      </ShopShell>
    );
  }

  if (!product) {
    return (
      <ShopShell back={{ to: "/shop", label: "Shop" }} width="narrow">
        <div className="rounded-card bg-card p-10 text-center shadow-soft">
          <p className="font-display text-3xl text-foreground">Produk tidak ditemukan</p>
          <p className="mt-2 text-muted-foreground">Mungkin sudah tidak dijual atau link-nya salah.</p>
          <Link to="/shop" className="btn-primary mt-6">
            Lihat semua produk
          </Link>
        </div>
      </ShopShell>
    );
  }

  const images = galleryOf(product);
  const free = product.price === 0;

  return (
    <ShopShell back={{ to: "/shop", label: "Shop" }}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-card bg-blush shadow-soft">
            {images[active] ? (
              <img src={images[active]} alt={product.title} className="aspect-[4/5] w-full object-contain" />
            ) : (
              <div className="aspect-[4/5]" />
            )}
          </div>
          {images.length > 1 && (
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((src, i) => (
                <li key={src}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Gambar ${i + 1}`}
                    aria-pressed={i === active}
                    className={cn(
                      "block h-20 w-16 overflow-hidden rounded-img bg-blush ring-2 transition-[box-shadow,opacity] duration-fast",
                      i === active ? "ring-primary" : "opacity-70 ring-transparent hover:opacity-100",
                    )}
                  >
                    <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Details */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="widget p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
              {product.category && <span className="chip">{product.category}</span>}
              {product.badge && <span className="chip bg-primary text-primary-foreground">{product.badge}</span>}
            </div>
            <h1 className="mt-4 font-display text-4xl leading-tight text-foreground">{product.title}</h1>
            {product.subtitle && <p className="mt-2 text-muted-foreground">{product.subtitle}</p>}
            <Price price={product.price} compare={product.compare_at_price} className="mt-5 text-2xl" />

            <Link to={`/shop/${product.slug}/checkout`} className="btn-primary mt-6 w-full !py-3.5 text-base">
              <ShoppingBag className="h-4 w-4" />
              {free ? "Ambil gratis" : "Beli sekarang"}
            </Link>

            <ul className="mt-6 space-y-3 border-t border-dashed border-blush-2 pt-5 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                Produk digital, tidak ada pengiriman fisik.
              </li>
              <li className="flex gap-3">
                <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
                {free
                  ? "Link langsung muncul setelah kamu mengisi nama dan email."
                  : "Link template muncul di halaman pesanan setelah pembayaran dikonfirmasi."}
              </li>
              <li className="flex gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                Ada pertanyaan? Hubungi Natalie lewat WhatsApp atau Instagram.
              </li>
            </ul>
          </div>

          {product.description && (
            <div className="mt-5 rounded-card bg-milk p-6 sm:p-8">
              <h2 className="label">Deskripsi</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-foreground">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </ShopShell>
  );
};

export default ProductPage;
