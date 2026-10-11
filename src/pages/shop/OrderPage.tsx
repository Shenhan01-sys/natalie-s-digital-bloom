import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { Check, CircleAlert, Clock, Copy, ExternalLink, MessageCircle } from "lucide-react";
import ShopShell from "@/components/shop/ShopShell";
import { Skeleton } from "@/components/ui/skeleton";
import { myOrders, useOrder, waLink, type PublicOrder } from "@/lib/shop-api";
import { useSite } from "@/lib/site-content";
import { formatIDR, supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const statusMeta = {
  pending: { label: "Menunggu konfirmasi", icon: Clock, tone: "bg-blush text-accent-foreground" },
  paid: { label: "Lunas", icon: Check, tone: "bg-emerald-100 text-emerald-800" },
  rejected: { label: "Ditolak", icon: CircleAlert, tone: "bg-destructive/10 text-destructive" },
} as const;

export const StatusPill = ({ status }: { status: PublicOrder["status"] }) => {
  const m = statusMeta[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", m.tone)}>
      <m.icon className="h-3.5 w-3.5" />
      {m.label}
    </span>
  );
};

const dateFmt = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export const OrderPage = () => {
  const { id } = useParams();
  const { data: order, isLoading } = useOrder(id);
  const { shop } = useSite();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = order ? `Pesanan ${order.code}` : "Pesanan";
  }, [order]);

  if (isLoading) {
    return (
      <ShopShell back={{ to: "/shop", label: "Shop" }} width="narrow">
        <Skeleton className="h-80 rounded-card bg-blush" />
      </ShopShell>
    );
  }
  if (!order) {
    return (
      <ShopShell back={{ to: "/shop", label: "Shop" }} width="narrow">
        <div className="rounded-card bg-card p-10 text-center shadow-soft">
          <p className="font-display text-3xl text-foreground">Pesanan tidak ditemukan</p>
          <p className="mt-2 text-muted-foreground">Pastikan link pesananmu lengkap.</p>
        </div>
      </ShopShell>
    );
  }

  const url = window.location.href;
  const message = `Halo Natalie, saya ${order.buyer_name}. Mau konfirmasi pesanan ${order.code} (${order.product_title}). ${url}`;

  return (
    <ShopShell back={{ to: "/shop", label: "Shop" }} width="narrow">
      <div className="widget overflow-hidden">
        <div className="bg-blush px-6 py-6 sm:px-8">
          <p className="label">Kode pesanan</p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-mono text-3xl font-semibold tracking-wider text-foreground">{order.code}</h1>
            <StatusPill status={order.status} />
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div className="col-span-2">
              <dt className="text-muted-foreground">Produk</dt>
              <dd className="font-display text-xl text-foreground">
                {order.product_slug ? (
                  <Link to={`/shop/${order.product_slug}`} className="hover:text-primary">
                    {order.product_title}
                  </Link>
                ) : (
                  order.product_title
                )}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Total</dt>
              <dd className="font-semibold text-foreground">{formatIDR(order.amount)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Tanggal</dt>
              <dd className="font-semibold text-foreground">{dateFmt(order.created_at)}</dd>
            </div>
          </dl>

          {order.status === "paid" && (
            <div className="rounded-card bg-milk p-5 ring-1 ring-blush-2">
              <p className="font-display text-2xl text-foreground">Terima kasih, {order.buyer_name.split(" ")[0]}!</p>
              {order.delivery_note && <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{order.delivery_note}</p>}
              {order.delivery_url ? (
                <a href={order.delivery_url} target="_blank" rel="noopener noreferrer" className="btn-primary mt-4 w-full">
                  <ExternalLink className="h-4 w-4" />
                  Buka template
                </a>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">Link akan dikirim Natalie lewat email/WhatsApp.</p>
              )}
            </div>
          )}

          {order.status === "pending" && (
            <p className="rounded-card bg-milk p-5 text-sm leading-relaxed text-muted-foreground ring-1 ring-blush-2">
              Pembayaranmu sedang dicek. Halaman ini akan otomatis menampilkan link template setelah dikonfirmasi, jadi simpan link halaman ini ya.
            </p>
          )}

          {order.status === "rejected" && (
            <div className="rounded-card bg-destructive/10 p-5 text-sm text-destructive">
              <p className="font-semibold">Pesanan tidak dapat dikonfirmasi.</p>
              {order.admin_note && <p className="mt-1">{order.admin_note}</p>}
            </div>
          )}

          {order.status === "pending" && order.admin_note && (
            <p className="text-sm text-muted-foreground">Catatan dari Natalie: {order.admin_note}</p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="btn-soft"
              onClick={async () => {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Link tersalin" : "Salin link pesanan"}
            </button>
            {shop.whatsapp && (
              <a href={waLink(shop.whatsapp, message)} target="_blank" rel="noopener noreferrer" className="btn-soft">
                <MessageCircle className="h-4 w-4" />
                Chat Natalie
              </a>
            )}
          </div>
        </div>
      </div>
    </ShopShell>
  );
};

/** Orders placed from this browser. */
export const MyOrdersPage = () => {
  const ids = myOrders();
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["order", id],
      queryFn: async () => {
        const { data, error } = await supabase.rpc("get_order", { p_id: id });
        if (error) throw error;
        return (data?.[0] ?? null) as PublicOrder | null;
      },
    })),
  });

  return (
    <ShopShell back={{ to: "/shop", label: "Shop" }} width="narrow">
      <h1 className="font-display text-4xl text-foreground">Pesanan saya</h1>
      <p className="mt-2 text-muted-foreground">Pesanan yang dibuat dari browser ini.</p>
      {ids.length === 0 ? (
        <p className="mt-6 rounded-card bg-card p-8 text-center text-muted-foreground shadow-soft">Belum ada pesanan.</p>
      ) : (
        <ul className="mt-6 grid gap-3">
          {ids.map((id, i) => {
            const o = results[i]?.data;
            if (results[i]?.isLoading) return <Skeleton key={id} className="h-20 rounded-card bg-blush" />;
            if (!o) return null;
            return (
              <li key={id}>
                <Link to={`/order/${id}`} className="lift flex items-center justify-between gap-4 rounded-card bg-card p-4 shadow-soft">
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg text-foreground">{o.product_title}</p>
                    <p className="font-mono text-sm text-muted-foreground">
                      {o.code} · {formatIDR(o.amount)}
                    </p>
                  </div>
                  <StatusPill status={o.status} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </ShopShell>
  );
};
