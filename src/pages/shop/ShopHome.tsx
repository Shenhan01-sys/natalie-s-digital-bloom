import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Receipt, Search } from "lucide-react";
import ShopShell from "@/components/shop/ShopShell";
import ProductCard from "@/components/shop/ProductCard";
import { Seal } from "@/components/Ornaments";
import { Skeleton } from "@/components/ui/skeleton";
import { useSite } from "@/lib/site-content";
import { myOrders, usePublishedProducts } from "@/lib/shop-api";
import { contactIcon, isExternal } from "@/lib/contact-icons";
import { cn } from "@/lib/utils";

const ShopHome = () => {
  const { profile, shop, shopLinks, contacts } = useSite();
  const { data: products, isLoading, isError } = usePublishedProducts();
  const [category, setCategory] = useState("Semua");
  const [query, setQuery] = useState("");
  const [hasOrders, setHasOrders] = useState(false);

  useEffect(() => {
    document.title = `${shop.title} · ${profile.name}`;
    setHasOrders(myOrders().length > 0);
  }, [shop.title, profile.name]);

  const categories = useMemo(
    () => ["Semua", ...new Set((products ?? []).map((p) => p.category).filter((c): c is string => Boolean(c)))],
    [products],
  );
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (products ?? []).filter(
      (p) =>
        (category === "Semua" || p.category === category) &&
        (!q || `${p.title} ${p.subtitle ?? ""} ${p.category ?? ""}`.toLowerCase().includes(q)),
    );
  }, [products, category, query]);

  return (
    <ShopShell>
      {/* Profile, link-in-bio style */}
      <section className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="relative">
          <img
            src={shop.avatar || profile.photo}
            alt={profile.name}
            className="h-28 w-28 rounded-full object-cover object-top shadow-lift ring-4 ring-milk sm:h-32 sm:w-32"
          />
          <Seal className="absolute -bottom-2 -right-4 w-12 rotate-12" letter={profile.firstName.charAt(0)} />
        </div>
        <p className="mt-5 font-script text-5xl leading-none text-primary">{profile.firstName}</p>
        <h1 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">{shop.title}</h1>
        {shop.bio && <p className="mt-3 max-w-md text-muted-foreground">{shop.bio}</p>}

        {contacts.length > 0 && (
          <ul className="mt-5 flex items-center gap-1 rounded-full bg-ink p-1.5 shadow-lift">
            {contacts.map((c) => {
              const Icon = contactIcon[c.kind] ?? contactIcon.link;
              return (
                <li key={`${c.kind}-${c.value}`}>
                  <a
                    href={c.href}
                    target={isExternal(c.href) ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={c.label}
                    title={c.label}
                    className="grid h-10 w-10 place-items-center rounded-full text-white/85 transition-[background-color,color] duration-fast hover:bg-rose hover:text-ink"
                  >
                    <Icon className="h-[17px] w-[17px]" />
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        {(shopLinks.length > 0 || hasOrders) && (
          <ul className="mt-8 grid w-full gap-3">
            {shopLinks.map((l) => {
              const Icon = contactIcon[l.kind ?? "link"] ?? contactIcon.link;
              const inner = (
                <>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blush text-primary">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block font-semibold text-foreground">{l.title}</span>
                    {l.description && <span className="block truncate text-sm text-muted-foreground">{l.description}</span>}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-base ease-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </>
              );
              const cls = "lift group flex items-center gap-3 rounded-full bg-card p-2 pr-5 shadow-soft";
              return (
                <li key={`${l.title}-${l.url}`}>
                  {isExternal(l.url) || l.url.startsWith("mailto:") ? (
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className={cls}>
                      {inner}
                    </a>
                  ) : (
                    <Link to={l.url} className={cls}>
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
            {hasOrders && (
              <li>
                <Link to="/order" className="lift group flex items-center gap-3 rounded-full bg-card p-2 pr-5 shadow-soft">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Receipt className="h-[18px] w-[18px]" />
                  </span>
                  <span className="flex-1 text-left font-semibold text-foreground">Pesanan saya</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            )}
          </ul>
        )}
      </section>

      {/* Products */}
      <section aria-labelledby="products-title" className="mt-14 md:mt-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label">Digital products</p>
            <h2 id="products-title" className="mt-1 font-display text-4xl text-foreground">
              Templates <em className="text-primary">&amp; more</em>
            </h2>
          </div>
          <label className="flex w-full items-center gap-2 rounded-full bg-card px-4 py-2.5 shadow-soft md:w-72">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
            <span className="sr-only">Cari produk</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari template…"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </label>
        </div>

        {categories.length > 2 && (
          <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-fast",
                  category === c ? "bg-primary text-primary-foreground shadow-soft" : "bg-card text-foreground ring-1 ring-blush-2 hover:bg-blush",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6">
          {isLoading ? (
            <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <li key={i}>
                  <Skeleton className="aspect-[4/5] w-full rounded-card bg-blush" />
                </li>
              ))}
            </ul>
          ) : isError ? (
            <p className="rounded-card bg-card p-8 text-center text-muted-foreground shadow-soft">Produk gagal dimuat. Coba muat ulang halaman.</p>
          ) : shown.length === 0 ? (
            <div className="rounded-card bg-card p-10 text-center shadow-soft">
              <p className="font-display text-2xl text-foreground">{products?.length ? "Tidak ada produk yang cocok." : "Produk segera hadir."}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {products?.length ? "Coba kata kunci atau kategori lain." : "Follow Instagram Natalie untuk info rilis template terbaru."}
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {shown.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </ShopShell>
  );
};

export default ShopHome;
