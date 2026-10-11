import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, Package, Plus, TrendingUp, Wallet } from "lucide-react";
import { PageHeader, Panel } from "@/components/admin/fields";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusPill } from "@/pages/shop/OrderPage";
import { formatIDR, supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

const Overview = () => {
  const { session } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const [orders, products] = await Promise.all([
        supabase.from("orders").select("id, code, buyer_name, product_title, amount, status, created_at").order("created_at", { ascending: false }),
        supabase.from("products").select("id, published"),
      ]);
      if (orders.error) throw orders.error;
      if (products.error) throw products.error;
      const paid = orders.data.filter((o) => o.status === "paid");
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      return {
        pending: orders.data.filter((o) => o.status === "pending").length,
        revenue: paid.reduce((s, o) => s + o.amount, 0),
        monthRevenue: paid.filter((o) => new Date(o.created_at) >= monthStart).reduce((s, o) => s + o.amount, 0),
        sold: paid.length,
        published: products.data.filter((p) => p.published).length,
        totalProducts: products.data.length,
        latest: orders.data.slice(0, 6),
      };
    },
  });

  const hour = new Date().getHours();
  const greet = hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 19 ? "Selamat sore" : "Selamat malam";

  const stats = [
    { label: "Menunggu konfirmasi", value: data?.pending ?? 0, icon: Clock, to: "/admin/orders?status=pending", accent: true },
    { label: "Pendapatan bulan ini", value: formatIDR(data?.monthRevenue ?? 0).replace("Gratis", "Rp 0"), icon: TrendingUp },
    { label: "Total pendapatan", value: formatIDR(data?.revenue ?? 0).replace("Gratis", "Rp 0"), icon: Wallet, sub: `${data?.sold ?? 0} pesanan lunas` },
    { label: "Produk aktif", value: `${data?.published ?? 0}/${data?.totalProducts ?? 0}`, icon: Package, to: "/admin/products" },
  ];

  return (
    <>
      <PageHeader
        title={`${greet}!`}
        description={`Masuk sebagai ${session?.user.email}. Ini ringkasan toko dan website kamu.`}
        actions={
          <Link to="/admin/products/new" className="btn-primary !px-4 !py-2.5">
            <Plus className="h-4 w-4" />
            Produk baru
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => {
          const body = (
            <>
              <span className={`grid h-9 w-9 place-items-center rounded-full ${s.accent ? "bg-primary text-primary-foreground" : "bg-blush text-primary"}`}>
                <s.icon className="h-4 w-4" />
              </span>
              <p className="mt-4 text-xs font-semibold text-muted-foreground">{s.label}</p>
              {isLoading ? <Skeleton className="mt-1 h-7 w-20 bg-blush/60" /> : <p className="mt-1 text-xl font-bold tabular-nums text-foreground sm:text-2xl">{s.value}</p>}
              {s.sub && <p className="text-xs text-muted-foreground">{s.sub}</p>}
            </>
          );
          return s.to ? (
            <Link key={s.label} to={s.to} className="lift rounded-2xl bg-card p-4 shadow-soft ring-1 ring-blush/60 sm:p-5">
              {body}
            </Link>
          ) : (
            <div key={s.label} className="rounded-2xl bg-card p-4 shadow-soft ring-1 ring-blush/60 sm:p-5">
              {body}
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Panel>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-foreground">Pesanan terbaru</h2>
            <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Semua <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {isLoading ? (
            <Skeleton className="mt-4 h-40 bg-blush/60" />
          ) : !data?.latest.length ? (
            <p className="mt-4 rounded-xl bg-milk p-6 text-center text-sm text-muted-foreground">Belum ada pesanan. Bagikan link /shop ke Instagram bio kamu!</p>
          ) : (
            <ul className="mt-3 divide-y divide-blush">
              {data.latest.map((o) => (
                <li key={o.id}>
                  <Link to={`/admin/orders?open=${o.id}`} className="flex items-center gap-3 py-3 hover:opacity-80">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-foreground">{o.buyer_name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {o.code} · {o.product_title}
                      </p>
                    </div>
                    <span className="hidden text-sm font-semibold text-foreground sm:block">{formatIDR(o.amount)}</span>
                    <StatusPill status={o.status as "pending"} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel className="bg-blush/50">
          <h2 className="font-display text-2xl text-foreground">Kelola cepat</h2>
          <ul className="mt-4 grid gap-2 text-sm">
            {[
              { to: "/admin/content?tab=work", label: "Tambah karya ke Portfolio" },
              { to: "/admin/content?tab=experience", label: "Update pengalaman" },
              { to: "/admin/content?tab=profile", label: "Edit profil & foto" },
              { to: "/admin/shop", label: "Atur rekening & QRIS" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="flex items-center justify-between rounded-xl bg-card px-4 py-3 font-semibold text-foreground shadow-soft transition-colors hover:bg-milk">
                  {l.label}
                  <ArrowRight className="h-4 w-4 text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
};

export default Overview;
