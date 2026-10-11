import { useRef, useState, type ReactNode } from "react";
import { ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { uploadImage, type UploadedImage } from "@/lib/upload";
import { errorMessage } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const inputCls =
  "w-full rounded-xl border border-blush-2 bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-[border-color,box-shadow] duration-fast focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60";

export const PageHeader = ({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="font-display text-3xl text-foreground sm:text-4xl">{title}</h1>
      {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

export const Panel = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("rounded-2xl bg-card p-5 shadow-soft ring-1 ring-blush/60 sm:p-6", className)}>{children}</div>
);

export const Field = ({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) => (
  <label className={cn("grid gap-1.5", className)}>
    <span className="text-sm font-semibold text-foreground">{label}</span>
    {children}
    {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
  </label>
);

export const ToggleField = ({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-start justify-between gap-4 rounded-xl bg-milk p-3.5 ring-1 ring-blush-2">
    <div>
      <p className="text-sm font-semibold text-foreground">{label}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
    <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
  </div>
);

/** Single image picker that uploads straight to Supabase Storage. */
export const ImageField = ({
  label,
  value,
  onChange,
  folder,
  hint,
  aspect = "aspect-square",
}: {
  label: string;
  value: string;
  onChange: (url: string, meta?: UploadedImage) => void;
  folder: string;
  hint?: string;
  aspect?: string;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      const up = await uploadImage(file, folder);
      onChange(up.src, up);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <div className="grid gap-1.5">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className={cn(
            "group relative w-28 shrink-0 overflow-hidden rounded-xl bg-blush/60 ring-1 ring-blush-2 transition-shadow hover:ring-primary",
            aspect,
          )}
          aria-label={value ? `Ganti ${label}` : `Upload ${label}`}
        >
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center text-primary">
              <ImagePlus className="h-6 w-6" />
            </span>
          )}
          {busy && (
            <span className="absolute inset-0 grid place-items-center bg-milk/80">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </span>
          )}
        </button>
        <div className="grid gap-2">
          <button type="button" onClick={() => ref.current?.click()} className="btn-soft !px-4 !py-2 text-xs">
            {value ? "Ganti gambar" : "Upload gambar"}
          </button>
          {value && (
            <button type="button" onClick={() => onChange("")} className="text-left text-xs font-semibold text-muted-foreground hover:text-destructive">
              Hapus gambar
            </button>
          )}
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        </div>
      </div>
      <input ref={ref} type="file" accept="image/*" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
    </div>
  );
};

/** Ordered list of images (portfolio work sides, product gallery). */
export function ImageListField<T extends { src: string }>({
  label,
  items,
  onChange,
  folder,
  make,
  renderExtra,
  hint,
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  folder: string;
  make: (up: UploadedImage) => T;
  renderExtra?: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
  hint?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);

  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files);
    setBusy(list.length);
    const added: T[] = [];
    for (const f of list) {
      try {
        added.push(make(await uploadImage(f, folder)));
      } catch (e) {
        toast.error(`${f.name}: ${errorMessage(e)}`);
      }
      setBusy((n) => n - 1);
    }
    onChange([...items, ...added]);
    if (ref.current) ref.current.value = "";
  };

  return (
    <div className="grid gap-1.5">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <ul className="flex flex-wrap gap-3">
        {items.map((it, i) => (
          <li key={`${it.src}-${i}`} className="w-28">
            <div className="group relative aspect-square overflow-hidden rounded-xl bg-blush/60 ring-1 ring-blush-2">
              <img src={(it as { thumb?: string }).thumb || it.src} alt="" className="h-full w-full object-cover" />
              {i === 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-2 py-0.5 text-[0.65rem] font-semibold text-primary-foreground">Utama</span>}
              <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between gap-1">
                {i > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...items];
                      [next[i - 1], next[i]] = [next[i], next[i - 1]];
                      onChange(next);
                    }}
                    className="rounded-full bg-milk/95 px-2 py-0.5 text-[0.65rem] font-semibold text-foreground shadow-soft"
                    aria-label="Geser ke kiri"
                  >
                    ←
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, k) => k !== i))}
                  className="grid h-6 w-6 place-items-center rounded-full bg-milk/95 text-destructive shadow-soft"
                  aria-label="Hapus gambar"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {renderExtra?.(it, (patch) => onChange(items.map((x, k) => (k === i ? { ...x, ...patch } : x))))}
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="grid aspect-square w-28 place-items-center rounded-xl border-2 border-dashed border-blush-2 bg-milk text-primary transition-colors hover:border-primary"
          >
            {busy > 0 ? (
              <span className="flex flex-col items-center gap-1 text-xs font-semibold">
                <Loader2 className="h-5 w-5 animate-spin" />
                {busy} lagi…
              </span>
            ) : (
              <span className="flex flex-col items-center gap-1 text-xs font-semibold">
                <ImagePlus className="h-5 w-5" />
                Tambah
              </span>
            )}
          </button>
        </li>
      </ul>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      <input ref={ref} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => add(e.target.files)} />
    </div>
  );
}

export const ConfirmDelete = ({
  title,
  description,
  onConfirm,
  trigger,
}: {
  title: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
  trigger?: ReactNode;
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      {trigger ?? (
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label="Hapus"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </AlertDialogTrigger>
    <AlertDialogContent className="rounded-2xl">
      <AlertDialogHeader>
        <AlertDialogTitle className="font-display text-2xl">{title}</AlertDialogTitle>
        <AlertDialogDescription>{description ?? "Data yang dihapus tidak bisa dikembalikan."}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="rounded-full">Batal</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
          Hapus
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
