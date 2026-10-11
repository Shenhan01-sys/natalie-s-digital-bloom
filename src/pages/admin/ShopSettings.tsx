import { Plus, Trash2 } from "lucide-react";
import { Field, ImageField, inputCls, PageHeader, Panel } from "@/components/admin/fields";
import ItemsEditor from "@/components/admin/ItemsEditor";
import SaveBar from "@/components/admin/SaveBar";
import { useSetting } from "@/components/admin/use-setting";
import { Skeleton } from "@/components/ui/skeleton";
import { shopSettings, type ShopSettings as Shop } from "@/data/content";

const ShopSettings = () => {
  const { draft, set, save, saving, dirty, loading, reset } = useSetting<Shop>("shop", shopSettings);

  return (
    <>
      <PageHeader
        title="Halaman Shop"
        description="Tampilan /shop seperti link-in-bio: profil, tombol link, lalu daftar produk."
        actions={
          <a href="/shop" target="_blank" rel="noreferrer" className="btn-soft !px-4 !py-2.5">
            Lihat /shop
          </a>
        }
      />

      {loading ? (
        <Skeleton className="h-96 rounded-2xl bg-blush/60" />
      ) : (
        <div className="grid gap-6">
          <Panel className="grid gap-5">
            <h2 className="font-display text-2xl text-foreground">Profil toko</h2>
            <div className="grid gap-5 md:grid-cols-[auto_minmax(0,1fr)]">
              <ImageField label="Foto profil" folder="shop" value={draft.avatar} onChange={(v) => set("avatar", v)} aspect="aspect-square rounded-full" />
              <div className="grid gap-4">
                <Field label="Nama toko">
                  <input value={draft.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
                </Field>
                <Field label="Bio singkat">
                  <textarea rows={2} value={draft.bio} onChange={(e) => set("bio", e.target.value)} className={inputCls} />
                </Field>
              </div>
            </div>
          </Panel>

          <Panel className="grid gap-5">
            <div>
              <h2 className="font-display text-2xl text-foreground">Pembayaran</h2>
              <p className="text-sm text-muted-foreground">Ditampilkan ke pembeli saat checkout.</p>
            </div>

            <div className="grid gap-3">
              <span className="text-sm font-semibold text-foreground">Rekening / e-wallet</span>
              {draft.banks.length === 0 && <p className="rounded-xl bg-milk p-4 text-sm text-muted-foreground">Belum ada rekening.</p>}
              {draft.banks.map((b, i) => (
                <div key={i} className="grid gap-2 rounded-xl bg-milk p-3 ring-1 ring-blush-2 sm:grid-cols-[1fr_1.3fr_1.5fr_auto] sm:items-center">
                  {(
                    [
                      ["bank", "Bank / e-wallet", "BCA, DANA, GoPay…"],
                      ["number", "Nomor", "1234567890"],
                      ["holder", "Atas nama", "Natalie Netania Sulistio"],
                    ] as const
                  ).map(([k, label, ph]) => (
                    <input
                      key={k}
                      aria-label={label}
                      placeholder={ph}
                      value={b[k]}
                      onChange={(e) => set("banks", draft.banks.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)))}
                      className={inputCls}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => set("banks", draft.banks.filter((_, j) => j !== i))}
                    className="grid h-9 w-9 place-items-center justify-self-end rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Hapus rekening"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => set("banks", [...draft.banks, { bank: "", number: "", holder: "" }])}
                className="btn-soft justify-self-start !px-4 !py-2 text-xs"
              >
                <Plus className="h-4 w-4" /> Tambah rekening
              </button>
            </div>

            <ImageField label="QRIS" folder="shop" value={draft.qris} onChange={(v) => set("qris", v)} hint="Opsional. Upload gambar QRIS kamu." />

            <Field label="Instruksi pembayaran">
              <textarea rows={3} value={draft.instructions} onChange={(e) => set("instructions", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Nomor WhatsApp untuk pembeli" hint="Format 62…, dipakai di tombol “Chat Natalie” halaman pesanan.">
              <input inputMode="tel" value={draft.whatsapp} onChange={(e) => set("whatsapp", e.target.value.replace(/[^\d]/g, ""))} className={inputCls} />
            </Field>
          </Panel>

          <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={reset} />

          <Panel>
            <h2 className="mb-1 font-display text-2xl text-foreground">Tombol link</h2>
            <ItemsEditor section="shop_link" />
          </Panel>
        </div>
      )}
    </>
  );
};

export default ShopSettings;
