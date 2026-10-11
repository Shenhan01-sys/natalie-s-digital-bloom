import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, Copy, FileUp, Loader2, Lock, X } from "lucide-react";
import { toast } from "sonner";
import ShopShell from "@/components/shop/ShopShell";
import { Price } from "@/components/shop/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { rememberOrder, useProduct } from "@/lib/shop-api";
import { useSite } from "@/lib/site-content";
import { errorMessage, formatIDR, supabase } from "@/lib/supabase";
import { uploadProof } from "@/lib/upload";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-widget border border-blush-2 bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground/70 transition-[border-color,box-shadow] duration-fast focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const translate = (msg: string) =>
  ({
    "Product is not available": "Produk ini sudah tidak tersedia.",
    "Payment proof is required": "Upload bukti pembayaran dulu ya.",
    "Invalid payment proof": "Bukti pembayaran tidak valid, coba upload ulang.",
  })[msg] ?? (/buyer_email/.test(msg) ? "Format email belum benar." : msg);

const CopyButton = ({ value }: { value: string }) => {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 rounded-full bg-blush px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-colors duration-fast hover:bg-blush-2"
    >
      {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? "Tersalin" : "Salin"}
    </button>
  );
};

const CheckoutPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(slug);
  const { shop } = useSite();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", note: "" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (isLoading) {
    return (
      <ShopShell back={{ to: `/shop/${slug}`, label: "Kembali" }} width="narrow">
        <Skeleton className="h-96 rounded-card bg-blush" />
      </ShopShell>
    );
  }
  if (!product) {
    return (
      <ShopShell back={{ to: "/shop", label: "Shop" }} width="narrow">
        <div className="rounded-card bg-card p-10 text-center shadow-soft">
          <p className="font-display text-3xl text-foreground">Produk tidak ditemukan</p>
          <Link to="/shop" className="btn-primary mt-6">
            Lihat semua produk
          </Link>
        </div>
      </ShopShell>
    );
  }

  const free = product.price === 0;
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!free && !file) {
      setError("Upload bukti pembayaran dulu ya.");
      return;
    }
    setBusy(true);
    try {
      const proof = file ? await uploadProof(file) : null;
      const { data, error } = await supabase.rpc("create_order", {
        p_product_id: product.id,
        p_name: form.name,
        p_email: form.email,
        p_whatsapp: form.whatsapp || undefined,
        p_note: form.note || undefined,
        p_proof_path: proof ?? undefined,
      });
      if (error) throw error;
      const order = data?.[0];
      if (!order) throw new Error("Pesanan gagal dibuat");
      rememberOrder(order.id);
      toast.success(free ? "Berhasil! Link template sudah siap." : "Pesanan terkirim! Natalie akan segera mengecek pembayaranmu.");
      navigate(`/order/${order.id}`, { replace: true });
    } catch (err) {
      setError(translate(errorMessage(err)));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ShopShell back={{ to: `/shop/${product.slug}`, label: "Kembali" }} width="narrow">
      <h1 className="font-display text-4xl text-foreground">{free ? "Ambil template" : "Checkout"}</h1>

      {/* Summary */}
      <div className="mt-6 flex items-center gap-4 rounded-card bg-card p-3 pr-5 shadow-soft">
        {product.cover_url && <img src={product.cover_url} alt="" className="h-20 w-16 shrink-0 rounded-img object-cover" />}
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xl text-foreground">{product.title}</p>
          {product.subtitle && <p className="truncate text-sm text-muted-foreground">{product.subtitle}</p>}
        </div>
        <Price price={product.price} compare={product.compare_at_price} className="shrink-0 text-right" />
      </div>

      <form onSubmit={submit} className="mt-6 space-y-6">
        {/* Payment */}
        {!free && (
          <section className="widget p-6">
            <h2 className="flex items-center gap-2 font-display text-2xl text-foreground">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary font-sans text-sm text-primary-foreground">1</span>
              Bayar {formatIDR(product.price)}
            </h2>
            {shop.instructions && <p className="mt-2 text-sm text-muted-foreground">{shop.instructions}</p>}

            {shop.banks.length > 0 && (
              <ul className="mt-5 grid gap-3">
                {shop.banks.map((b) => (
                  <li key={`${b.bank}-${b.number}`} className="flex items-center justify-between gap-3 rounded-widget bg-milk p-4 ring-1 ring-blush-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{b.bank}</p>
                      <p className="mt-0.5 font-mono text-lg font-semibold tracking-wide text-foreground">{b.number}</p>
                      <p className="text-sm text-muted-foreground">a.n. {b.holder}</p>
                    </div>
                    <CopyButton value={b.number.replace(/\s/g, "")} />
                  </li>
                ))}
              </ul>
            )}

            {shop.qris && (
              <figure className="mt-5 rounded-widget bg-milk p-4 text-center ring-1 ring-blush-2">
                <img src={shop.qris} alt="QRIS" className="mx-auto w-full max-w-[260px] rounded-img bg-white" />
                <figcaption className="mt-2 text-sm text-muted-foreground">Scan QRIS dengan aplikasi bank atau e-wallet</figcaption>
              </figure>
            )}

            {shop.banks.length === 0 && !shop.qris && (
              <p className="mt-4 rounded-widget bg-blush px-4 py-3 text-sm text-accent-foreground">
                Info rekening belum diisi. Hubungi Natalie lewat WhatsApp untuk detail pembayaran.
              </p>
            )}
          </section>
        )}

        {/* Buyer details */}
        <section className="widget p-6">
          <h2 className="flex items-center gap-2 font-display text-2xl text-foreground">
            {!free && <span className="grid h-7 w-7 place-items-center rounded-full bg-primary font-sans text-sm text-primary-foreground">2</span>}
            Data kamu
          </h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold text-foreground">Nama</span>
              <input required maxLength={100} autoComplete="name" value={form.name} onChange={set("name")} className={field} />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold text-foreground">Email</span>
              <input required type="email" autoComplete="email" value={form.email} onChange={set("email")} className={field} placeholder="kamu@email.com" />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold text-foreground">
                WhatsApp <span className="font-normal text-muted-foreground">(opsional)</span>
              </span>
              <input type="tel" maxLength={30} autoComplete="tel" value={form.whatsapp} onChange={set("whatsapp")} className={field} placeholder="08xxxxxxxxxx" />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold text-foreground">
                Catatan <span className="font-normal text-muted-foreground">(opsional)</span>
              </span>
              <textarea maxLength={1000} rows={3} value={form.note} onChange={set("note")} className={field} />
            </label>
          </div>
        </section>

        {/* Proof */}
        {!free && (
          <section className="widget p-6">
            <h2 className="flex items-center gap-2 font-display text-2xl text-foreground">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary font-sans text-sm text-primary-foreground">3</span>
              Bukti pembayaran
            </h2>
            <input
              ref={fileRef}
              id="proof"
              type="file"
              accept="image/png,image/jpeg,image/webp,application/pdf"
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            {file ? (
              <div className="mt-4 flex items-center gap-4 rounded-widget bg-milk p-3 ring-1 ring-blush-2">
                {preview ? (
                  <img src={preview} alt="" className="h-20 w-16 rounded-img object-cover" />
                ) : (
                  <span className="grid h-20 w-16 place-items-center rounded-img bg-blush text-xs font-semibold text-accent-foreground">PDF</span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  aria-label="Hapus file"
                  className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-blush"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="proof"
                className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-widget border-2 border-dashed border-blush-2 bg-milk px-4 py-8 text-center transition-colors duration-fast hover:border-primary hover:bg-blush/40"
              >
                <FileUp className="h-7 w-7 text-primary" />
                <span className="font-semibold text-foreground">Pilih screenshot / foto bukti transfer</span>
                <span className="text-sm text-muted-foreground">JPG, PNG, WebP atau PDF · maks. 5 MB</span>
              </label>
            )}
          </section>
        )}

        {error && (
          <p role="alert" className="rounded-widget bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
            {error}
          </p>
        )}

        <button type="submit" disabled={busy} className={cn("btn-primary w-full !py-4 text-base", busy && "pointer-events-none opacity-70")}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          {busy ? "Mengirim…" : free ? "Dapatkan link template" : "Kirim pesanan"}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          Data kamu hanya dipakai untuk memproses pesanan ini.
        </p>
      </form>
    </ShopShell>
  );
};

export default CheckoutPage;
