import { useSearchParams } from "react-router-dom";
import { Field, ImageField, inputCls, PageHeader, Panel } from "@/components/admin/fields";
import ItemsEditor from "@/components/admin/ItemsEditor";
import SaveBar from "@/components/admin/SaveBar";
import { landingSections, sections, type SectionKey } from "@/components/admin/sections";
import { useSetting } from "@/components/admin/use-setting";
import { Skeleton } from "@/components/ui/skeleton";
import { profile as defaultProfile, type Profile } from "@/data/content";
import { cn } from "@/lib/utils";

type Tab = "profile" | SectionKey;

const ContentPage = () => {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") as Tab) ?? "profile";
  const tabs: { id: Tab; label: string }[] = [{ id: "profile", label: "Profil" }, ...landingSections.map((k) => ({ id: k, label: sections[k].label }))];

  return (
    <>
      <PageHeader
        title="Konten Website"
        description="Semua isi halaman portfolio. Tambah, edit, sembunyikan atau hapus. Perubahan langsung tampil di website."
        actions={
          <a href="/" target="_blank" rel="noreferrer" className="btn-soft !px-4 !py-2.5">
            Lihat website
          </a>
        }
      />

      <div className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div role="tablist" className="flex w-max gap-1 rounded-full bg-blush/50 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              onClick={() => setParams({ tab: t.id }, { replace: true })}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                tab === t.id ? "bg-card text-primary shadow-soft" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "profile" ? (
        <ProfileForm />
      ) : (
        <Panel>
          <ItemsEditor key={tab} section={tab} />
        </Panel>
      )}
    </>
  );
};

const ProfileForm = () => {
  const { draft, set, save, saving, dirty, loading, reset } = useSetting<Profile>("profile", defaultProfile);
  if (loading) return <Skeleton className="h-[600px] rounded-2xl bg-blush/60" />;

  const text = (k: keyof Profile, label: string, hint?: string) => (
    <Field label={label} hint={hint}>
      <input value={draft[k]} onChange={(e) => set(k, e.target.value)} className={inputCls} />
    </Field>
  );
  const area = (k: keyof Profile, label: string, hint?: string, rows = 3) => (
    <Field label={label} hint={hint}>
      <textarea rows={rows} value={draft[k]} onChange={(e) => set(k, e.target.value)} className={inputCls} />
    </Field>
  );

  return (
    <div className="grid gap-6">
      <Panel className="grid gap-4">
        <h2 className="font-display text-2xl text-foreground">Nama</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {text("name", "Nama lengkap")}
          {text("firstName", "Nama panggilan", "Ditulis dengan huruf sambung di hero.")}
          {text("lastName", "Nama belakang", "Di bawah foto About.")}
        </div>
      </Panel>

      <Panel className="grid gap-4">
        <h2 className="font-display text-2xl text-foreground">Hero</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {text("greeting", "Sapaan", "Contoh: Hi, this is my")}
          {text("title", "Judul besar", "Contoh: Portofolio")}
        </div>
        {text("tagline", "Label di foto", "Contoh: Human Resources & Graphic Design")}
        {area("intro", "Paragraf singkat")}
      </Panel>

      <Panel className="grid gap-4">
        <h2 className="font-display text-2xl text-foreground">About & Experience</h2>
        {text("aboutLead", "Kalimat pembuka About")}
        {area("about", "Tentang saya", undefined, 5)}
        {text("experienceNote", "Keterangan Experience", "Contoh: Organisations · 2024–2025")}
      </Panel>

      <Panel className="grid gap-6">
        <h2 className="font-display text-2xl text-foreground">Foto</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-3">
            <ImageField label="Foto utama (hero)" folder="profile" value={draft.photo} onChange={(v) => set("photo", v)} aspect="aspect-[4/5]" />
            {text("photoAlt", "Deskripsi foto utama", "Untuk aksesibilitas & SEO.")}
          </div>
          <div className="grid gap-3">
            <ImageField label="Foto kedua (About)" folder="profile" value={draft.photoSecondary} onChange={(v) => set("photoSecondary", v)} aspect="aspect-[4/5]" />
            {text("photoSecondaryAlt", "Deskripsi foto kedua")}
          </div>
        </div>
      </Panel>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={reset} />
    </div>
  );
};

export default ContentPage;
