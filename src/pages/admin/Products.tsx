import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDelete, PageHeader } from "@/components/admin/fields";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { errorMessage, formatIDR, supabase } from "@/lib/supabase";

export const useAdminProducts = () =>
  useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("sort").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

const Products = () => {
  const qc = useQueryClient();
  const { data: products, isLoading } = useAdminProducts();

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["admin-overview"] });
  };

  const toggle = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("products").update({ published }).eq("id", id);
      if (error) throw error;
      return published;
    },
    onSuccess: (p) => {
      toast.success(p ? "Produk ditampilkan di shop" : "Produk disembunyikan");
      refresh();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Produk dihapus");
      refresh();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <>
      <PageHeader
        title="Produk"
        description="Template dan produk digital yang dijual di /shop. Matikan “Tampil” untuk menyembunyikan tanpa menghapus."
        actions={
          <Link to="/admin/products/new" className="btn-primary !px-4 !py-2.5">
            <Plus className="h-4 w-4" />
            Produk baru
          </Link>
        }
      />

      {isLoading ? (
        <div className="grid gap-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl bg-blush/60" />
          ))}
        </div>
      ) : !products?.length ? (
        <div className="rounded-2xl border-2 border-dashed border-blush-2 p-12 text-center">
          <p className="font-display text-2xl text-foreground">Belum ada produk</p>
          <p className="mt-1 text-sm text-muted-foreground">Mulai jual template Canva pertamamu.</p>
          <Link to="/admin/products/new" className="btn-primary mt-5">
            <Plus className="h-4 w-4" />
            Tambah produk
          </Link>
        </div>
      ) : (
        <ul className="grid gap-2">
          {products.map((p) => (
            <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft ring-1 ring-blush/60 sm:gap-4">
              <Link to={`/admin/products/${p.id}`} className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-blush/60">
                {p.cover_url && <img src={p.cover_url} alt="" className="h-full w-full object-cover" loading="lazy" />}
              </Link>
              <Link to={`/admin/products/${p.id}`} className="min-w-0 flex-1">
                <p className="truncate font-semibold text-foreground">{p.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {[p.category, p.badge].filter(Boolean).join(" · ") || "/shop/" + p.slug}
                </p>
                <p className="mt-1 text-sm font-semibold text-primary">{formatIDR(p.price)}</p>
              </Link>
              <label className="flex flex-col items-center gap-1 text-[0.7rem] font-semibold text-muted-foreground">
                <Switch checked={p.published} onCheckedChange={(v) => toggle.mutate({ id: p.id, published: v })} aria-label="Tampil di shop" />
                {p.published ? "Tampil" : "Draft"}
              </label>
              <div className="flex items-center">
                {p.published && (
                  <a
                    href={`/shop/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-blush hover:text-foreground sm:grid"
                    aria-label="Lihat di shop"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <Link to={`/admin/products/${p.id}`} className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-blush hover:text-foreground" aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </Link>
                <ConfirmDelete
                  title="Hapus produk ini?"
                  description={`“${p.title}” akan dihapus. Pesanan lama tetap tersimpan.`}
                  onConfirm={() => remove.mutate(p.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Products;
