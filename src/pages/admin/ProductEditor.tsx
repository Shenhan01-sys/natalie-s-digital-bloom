import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Field, ImageListField, inputCls, PageHeader, Panel, ToggleField } from "@/components/admin/fields";
import { Skeleton } from "@/components/ui/skeleton";
import { errorMessage, formatIDR, supabase } from "@/lib/supabase";
import { galleryOf } from "@/lib/shop-api";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

interface FormState {
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  price: string;
  compare_at_price: string;
  category: string;
  badge: string;
  published: boolean;
  images: { src: string }[];
  delivery_url: string;
  delivery_note: string;
}

const empty: FormState = {
  title: "",
  slug: "",
  subtitle: "",
  description: "",
  price: "",
  compare_at_price: "",
  category: "",
  badge: "",
  published: true,
  images: [],
  delivery_url: "",
  delivery_note: "Klik “Use template” di Canva untuk menyalin desain ke akunmu.",
};

const digits = (s: string) => s.replace(/\D/g, "");

const ProductEditor = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState>(empty);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-product", id],
    enabled: !isNew,
    queryFn: async () => {
      const [p, s] = await Promise.all([
        supabase.from("products").select("*").eq("id", id!).single(),
        supabase.from("product_secrets").select("*").eq("product_id", id!).maybeSingle(),
      ]);
      if (p.error) throw p.error;
      return { product: p.data, secret: s.data };
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-product-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("category");
      return [...new Set((data ?? []).map((r) => r.category).filter((c): c is string => Boolean(c)))];
    },
  });

  useEffect(() => {
    if (!data) return;
    const { product: p, secret } = data;
    setForm({
      title: p.title,
      slug: p.slug,
      subtitle: p.subtitle ?? "",
      description: p.description ?? "",
      price: String(p.price),
      compare_at_price: p.compare_at_price != null ? String(p.compare_at_price) : "",
      category: p.category ?? "",
      badge: p.badge ?? "",
      published: p.published,
      images: galleryOf(p).map((src) => ({ src })),
      delivery_url: secret?.delivery_url ?? "",
      delivery_note: secret?.delivery_note ?? "",
    });
    setSlugTouched(true);
  }, [data]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const slug = slugify(form.slug || form.title);
    if (!form.title.trim()) return setError("Judul wajib diisi.");
    if (!slug) return setError("Slug tidak valid.");
    if (form.price === "") return setError("Harga wajib diisi (isi 0 untuk produk gratis).");
    if (!form.delivery_url.trim()) return setError("Link produk (yang diterima pembeli) wajib diisi.");

    const price = Number(digits(form.price));
    const compare = form.compare_at_price ? Number(digits(form.compare_at_price)) : null;
    const gallery = form.images.map((i) => i.src);
    const row = {
      title: form.title.trim(),
      slug,
      subtitle: form.subtitle.trim() || null,
      description: form.description.trim() || null,
      price,
      compare_at_price: compare,
      category: form.category.trim() || null,
      badge: form.badge.trim() || null,
      published: form.published,
      cover_url: gallery[0] ?? null,
      gallery,
    };

    setSaving(true);
    try {
      let productId = id!;
      if (isNew) {
        const { data, error } = await supabase.from("products").insert(row).select("id").single();
        if (error) throw error;
        productId = data.id;
      } else {
        const { error } = await supabase.from("products").update(row).eq("id", productId);
        if (error) throw error;
      }
      const { error: sErr } = await supabase.from("product_secrets").upsert({
        product_id: productId,
        delivery_url: form.delivery_url.trim(),
        delivery_note: form.delivery_note.trim() || null,
      });
      if (sErr) throw sErr;

      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["admin-product", productId] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product"] });
      toast.success(isNew ? "Produk ditambahkan" : "Produk disimpan");
      navigate("/admin/products");
    } catch (err) {
      const msg = errorMessage(err);
      setError(/duplicate key.*slug/i.test(msg) ? "Slug sudah dipakai produk lain, ganti slug-nya." : msg);
    } finally {
      setSaving(false);
    }
  };

  if (!isNew && isLoading) return <Skeleton className="h-[600px] rounded-2xl bg-blush/60" />;

  return (
    <form onSubmit={save}>
      <Link to="/admin/products" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Semua produk
      </Link>
      <PageHeader
        title={isNew ? "Produk baru" : "Edit produk"}
        actions={
          !isNew && data?.product.published ? (
            <a href={`/shop/${data.product.slug}`} target="_blank" rel="noreferrer" className="btn-soft !px-4 !py-2.5">
              <ExternalLink className="h-4 w-4" />
              Lihat di shop
            </a>
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="grid gap-6">
          <Panel className="grid gap-4">
            <Field label="Judul">
              <input
                value={form.title}
                onChange={(e) => {
                  set("title", e.target.value);
                  if (!slugTouched) set("slug", slugify(e.target.value));
                }}
                className={inputCls}
                placeholder="Template Feed Instagram Aesthetic"
              />
            </Field>
            <Field label="Subjudul" hint="Ringkas, misal: Canva template · 10 slide · 1080×1350">
              <input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Deskripsi" hint="Isi template, ukuran, cara pakai. Baris baru akan dipertahankan.">
              <textarea rows={7} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputCls} />
            </Field>
          </Panel>

          <Panel>
            <ImageListField
              label="Gambar produk"
              folder="products"
              items={form.images}
              onChange={(items) => set("images", items)}
              make={(up) => ({ src: up.src })}
              hint="Gambar pertama jadi cover di shop. Rasio 4:5 terlihat paling rapi."
            />
          </Panel>

          <Panel className="grid gap-4 bg-blush/40">
            <div>
              <h2 className="font-display text-xl text-foreground">Yang diterima pembeli</h2>
              <p className="text-xs text-muted-foreground">Rahasia. Hanya tampil di halaman pesanan setelah pesanan ditandai lunas.</p>
            </div>
            <Field label="Link template / file" hint="Contoh: link Canva “Template link”, Google Drive, dsb.">
              <input
                value={form.delivery_url}
                onChange={(e) => set("delivery_url", e.target.value)}
                inputMode="url"
                className={inputCls}
                placeholder="https://www.canva.com/design/…/view?mode=preview"
              />
            </Field>
            <Field label="Catatan untuk pembeli">
              <textarea rows={3} value={form.delivery_note} onChange={(e) => set("delivery_note", e.target.value)} className={inputCls} />
            </Field>
          </Panel>
        </div>

        <div className="grid content-start gap-6">
          <Panel className="grid gap-4">
            <ToggleField label="Tampil di shop" hint="Matikan untuk menyimpan sebagai draft." checked={form.published} onChange={(v) => set("published", v)} />
            <Field label="Harga (Rp)" hint={form.price ? formatIDR(Number(digits(form.price))) : "Isi 0 untuk produk gratis."}>
              <input inputMode="numeric" value={form.price} onChange={(e) => set("price", digits(e.target.value))} className={inputCls} placeholder="35000" />
            </Field>
            <Field label="Harga coret (Rp)" hint="Opsional, untuk menampilkan diskon.">
              <input inputMode="numeric" value={form.compare_at_price} onChange={(e) => set("compare_at_price", digits(e.target.value))} className={inputCls} placeholder="50000" />
            </Field>
          </Panel>
          <Panel className="grid gap-4">
            <Field label="Kategori">
              <input list="product-categories" value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls} placeholder="Instagram, CV, Presentasi…" />
              <datalist id="product-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            <Field label="Badge" hint="Label kecil di cover, misal: Best seller, New, Free.">
              <input value={form.badge} onChange={(e) => set("badge", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Slug (alamat link)" hint={`/shop/${slugify(form.slug || form.title) || "…"}`}>
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"));
                }}
                className={inputCls}
              />
            </Field>
          </Panel>
        </div>
      </div>

      {error && <p className="mt-6 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">{error}</p>}

      <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex justify-end gap-2 border-t border-blush bg-background/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <Link to="/admin/products" className="btn-soft !px-5 !py-2.5">
          Batal
        </Link>
        <button type="submit" disabled={saving} className="btn-primary !px-6 !py-2.5">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Simpan produk
        </button>
      </div>
    </form>
  );
};

export default ProductEditor;
