import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Copy, ExternalLink, Loader2, Mail, MessageCircle, Search, X } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDelete, inputCls, PageHeader } from "@/components/admin/fields";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusPill } from "@/pages/shop/OrderPage";
import { errorMessage, formatIDR, supabase, type Order } from "@/lib/supabase";
import { proofUrl } from "@/lib/upload";
import { waLink } from "@/lib/shop-api";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "all", label: "Semua" },
  { id: "pending", label: "Menunggu" },
  { id: "paid", label: "Lunas" },
  { id: "rejected", label: "Ditolak" },
] as const;

const dateFmt = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const Orders = () => {
  const [params, setParams] = useSearchParams();
  const status = params.get("status") ?? "all";
  const openId = params.get("open");
  const [q, setQ] = useState("");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders?.length ?? 0, pending: 0, paid: 0, rejected: 0 };
    orders?.forEach((o) => (c[o.status] = (c[o.status] ?? 0) + 1));
    return c;
  }, [orders]);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (orders ?? []).filter(
      (o) =>
        (status === "all" || o.status === status) &&
        (!t || `${o.code} ${o.buyer_name} ${o.buyer_email} ${o.product_title}`.toLowerCase().includes(t)),
    );
  }, [orders, status, q]);

  const setParam = (k: string, v: string | null) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };

  const open = orders?.find((o) => o.id === openId) ?? null;

  return (
    <>
      <PageHeader title="Pesanan" description="Cek bukti transfer, lalu tandai Lunas. Pembeli langsung bisa membuka link template di halaman pesanannya." />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-full bg-blush/50 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setParam("status", t.id === "all" ? null : t.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                status === t.id ? "bg-card text-primary shadow-soft" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              <span className="ml-1.5 text-xs opacity-70">{counts[t.id] ?? 0}</span>
            </button>
          ))}
        </div>
        <label className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <span className="sr-only">Cari pesanan</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari kode, nama, email…" className={cn(inputCls, "pl-9")} />
        </label>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <Skeleton className="h-60 rounded-2xl bg-blush/60" />
        ) : !shown.length ? (
          <p className="rounded-2xl border-2 border-dashed border-blush-2 p-10 text-center text-sm text-muted-foreground">Tidak ada pesanan.</p>
        ) : (
          <ul className="grid gap-2">
            {shown.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  onClick={() => setParam("open", o.id)}
                  className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-soft ring-1 ring-blush/60 transition-colors hover:bg-milk"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2">
                      <p className="truncate font-semibold text-foreground">{o.buyer_name}</p>
                      <span className="font-mono text-xs text-muted-foreground">{o.code}</span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{o.product_title}</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="font-semibold text-foreground">{formatIDR(o.amount)}</p>
                    <p className="text-xs text-muted-foreground">{dateFmt(o.created_at)}</p>
                  </div>
                  <StatusPill status={o.status as Order["status"] & "pending"} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={Boolean(open)} onOpenChange={(o) => !o && setParam("open", null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto rounded-2xl sm:max-w-2xl">
          {open && <OrderDetail order={open} onClose={() => setParam("open", null)} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

const OrderDetail = ({ order, onClose }: { order: Order; onClose: () => void }) => {
  const qc = useQueryClient();
  const [note, setNote] = useState(order.admin_note ?? "");
  const [proof, setProof] = useState<string | null>(null);
  const [proofError, setProofError] = useState(false);
  const link = `${window.location.origin}/order/${order.id}`;

  useEffect(() => {
    setProof(null);
    setProofError(false);
    if (order.proof_path) proofUrl(order.proof_path).then(setProof, () => setProofError(true));
  }, [order.proof_path]);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
    qc.invalidateQueries({ queryKey: ["admin-overview"] });
    qc.invalidateQueries({ queryKey: ["admin-pending-count"] });
  };

  const update = useMutation({
    mutationFn: async (values: Partial<Order>) => {
      const { error } = await supabase.from("orders").update(values).eq("id", order.id);
      if (error) throw error;
      return values;
    },
    onSuccess: (v) => {
      toast.success(v.status === "paid" ? "Ditandai lunas" : v.status === "rejected" ? "Pesanan ditolak" : "Disimpan");
      refresh();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const remove = useMutation({
    mutationFn: async () => {
      if (order.proof_path) await supabase.storage.from("proofs").remove([order.proof_path]);
      const { error } = await supabase.from("orders").delete().eq("id", order.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Pesanan dihapus");
      onClose();
      refresh();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const first = order.buyer_name.split(" ")[0];
  const message =
    order.status === "paid"
      ? `Halo ${first}, pembayaran pesanan ${order.code} (${order.product_title}) sudah dikonfirmasi. Link template bisa dibuka di sini: ${link}\n\nTerima kasih! 💗`
      : `Halo ${first}, terima kasih sudah order ${order.product_title} (${order.code}). Status pesanan bisa dicek di: ${link}`;

  const isPdf = order.proof_path?.endsWith(".pdf");

  return (
    <>
      <DialogHeader>
        <div className="flex flex-wrap items-center gap-3 pr-6">
          <DialogTitle className="font-mono text-2xl tracking-wider">{order.code}</DialogTitle>
          <StatusPill status={order.status as "pending"} />
        </div>
        <DialogDescription>{new Date(order.created_at).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" })}</DialogDescription>
      </DialogHeader>

      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_200px]">
        <dl className="grid gap-3 text-sm">
          {[
            ["Produk", order.product_title],
            ["Total", formatIDR(order.amount)],
            ["Nama", order.buyer_name],
            ["Email", order.buyer_email],
            ["WhatsApp", order.buyer_whatsapp ?? "-"],
            ["Catatan pembeli", order.note ?? "-"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k}</dt>
              <dd className="whitespace-pre-line font-semibold text-foreground [overflow-wrap:anywhere]">{v}</dd>
            </div>
          ))}
        </dl>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bukti pembayaran</p>
          {!order.proof_path ? (
            <p className="mt-2 rounded-xl bg-milk p-4 text-sm text-muted-foreground">{order.amount === 0 ? "Produk gratis" : "Tidak ada"}</p>
          ) : proofError ? (
            <p className="mt-2 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">Gagal memuat bukti</p>
          ) : !proof ? (
            <Skeleton className="mt-2 aspect-[3/4] rounded-xl bg-blush/60" />
          ) : isPdf ? (
            <a href={proof} target="_blank" rel="noreferrer" className="btn-soft mt-2 w-full">
              <ExternalLink className="h-4 w-4" /> Buka PDF
            </a>
          ) : (
            <a href={proof} target="_blank" rel="noreferrer" className="mt-2 block overflow-hidden rounded-xl ring-1 ring-blush-2">
              <img src={proof} alt="Bukti pembayaran" className="max-h-80 w-full object-contain bg-milk" />
            </a>
          )}
        </div>
      </div>

      <label className="grid gap-1.5">
        <span className="text-sm font-semibold text-foreground">Catatan untuk pembeli</span>
        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Misal: nominal kurang Rp5.000 / terima kasih!"
          className={inputCls}
        />
        <span className="text-xs text-muted-foreground">Tampil di halaman pesanan pembeli.</span>
      </label>

      <div className="flex flex-wrap gap-2">
        {order.status !== "paid" && (
          <button type="button" disabled={update.isPending} onClick={() => update.mutate({ status: "paid", admin_note: note || null })} className="btn-primary !px-4 !py-2.5">
            {update.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Tandai lunas
          </button>
        )}
        {order.status !== "rejected" && (
          <button type="button" disabled={update.isPending} onClick={() => update.mutate({ status: "rejected", admin_note: note || null })} className="btn-soft !px-4 !py-2.5">
            <X className="h-4 w-4" />
            Tolak
          </button>
        )}
        {order.status !== "pending" && (
          <button type="button" disabled={update.isPending} onClick={() => update.mutate({ status: "pending", admin_note: note || null })} className="btn-soft !px-4 !py-2.5">
            Kembalikan ke menunggu
          </button>
        )}
        {note !== (order.admin_note ?? "") && (
          <button type="button" onClick={() => update.mutate({ admin_note: note || null })} className="btn-soft !px-4 !py-2.5">
            Simpan catatan
          </button>
        )}
      </div>

      <div className="rounded-xl bg-milk p-4 ring-1 ring-blush-2">
        <p className="text-sm font-semibold text-foreground">Kabari pembeli</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {order.buyer_whatsapp && (
            <a href={waLink(order.buyer_whatsapp, message)} target="_blank" rel="noreferrer" className="btn-soft !px-4 !py-2 text-xs">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          )}
          <a
            href={`mailto:${order.buyer_email}?subject=${encodeURIComponent(`Pesanan ${order.code}`)}&body=${encodeURIComponent(message)}`}
            className="btn-soft !px-4 !py-2 text-xs"
          >
            <Mail className="h-4 w-4" /> Email
          </a>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(link);
              toast.success("Link pesanan disalin");
            }}
            className="btn-soft !px-4 !py-2 text-xs"
          >
            <Copy className="h-4 w-4" /> Salin link pesanan
          </button>
        </div>
      </div>

      <div className="flex justify-end border-t border-dashed border-blush-2 pt-4">
        <ConfirmDelete
          title="Hapus pesanan ini?"
          description="Pesanan dan bukti pembayarannya akan dihapus permanen."
          onConfirm={() => remove.mutate()}
          trigger={
            <button type="button" className="text-sm font-semibold text-muted-foreground hover:text-destructive">
              Hapus pesanan
            </button>
          }
        />
      </div>
    </>
  );
};

export default Orders;
