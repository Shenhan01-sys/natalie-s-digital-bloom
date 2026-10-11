import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { errorMessage, supabase, type ContentRow } from "@/lib/supabase";
import { useSite } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import { ConfirmDelete, Field, ImageField, ImageListField, inputCls, ToggleField } from "./fields";
import { sections, type FieldDef, type SectionKey } from "./sections";
import type { Json } from "@/lib/database.types";

type Data = Record<string, unknown>;
type WorkImage = { src: string; thumb: string; label?: string; ratio?: number };

export const useSectionRows = (section: SectionKey) =>
  useQuery({
    queryKey: ["admin-items", section],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_items")
        .select("*")
        .eq("section", section)
        .order("sort")
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });

const ItemsEditor = ({ section }: { section: SectionKey }) => {
  const def = sections[section];
  const qc = useQueryClient();
  const { data: rows, isLoading, isError } = useSectionRows(section);
  const [editing, setEditing] = useState<{ id?: string; data: Data } | null>(null);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-items", section] });
    qc.invalidateQueries({ queryKey: ["site-content"] });
  };

  const save = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: Data }) => {
      if (id) {
        const { error } = await supabase.from("content_items").update({ data: data as Json }).eq("id", id);
        if (error) throw error;
      } else {
        const sort = (rows ?? []).reduce((m, r) => Math.max(m, r.sort), -1) + 1;
        const { error } = await supabase.from("content_items").insert({ section, data: data as Json, sort });
        if (error) throw error;
      }
    },
    onSuccess: (_, v) => {
      toast.success(v.id ? "Perubahan disimpan" : `${capitalize(def.singular)} ditambahkan`);
      setEditing(null);
      refresh();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const patch = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<ContentRow> }) => {
      const { error } = await supabase.from("content_items").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
    onError: (e) => toast.error(errorMessage(e)),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("content_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`${capitalize(def.singular)} dihapus`);
      refresh();
    },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const move = useMutation({
    mutationFn: async ({ index, dir }: { index: number; dir: -1 | 1 }) => {
      const list = [...(rows ?? [])];
      const j = index + dir;
      if (j < 0 || j >= list.length) return;
      [list[index], list[j]] = [list[j], list[index]];
      const changed = list.map((r, i) => ({ r, i })).filter(({ r, i }) => r.sort !== i);
      const results = await Promise.all(
        changed.map(({ r, i }) => supabase.from("content_items").update({ sort: i }).eq("id", r.id)),
      );
      const err = results.find((x) => x.error)?.error;
      if (err) throw err;
    },
    onSuccess: refresh,
    onError: (e) => toast.error(errorMessage(e)),
  });

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm text-muted-foreground">{def.description}</p>
        <button type="button" onClick={() => setEditing({ data: { ...def.empty } })} className="btn-primary shrink-0 !px-4 !py-2.5">
          <Plus className="h-4 w-4" />
          Tambah {def.singular}
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 rounded-2xl bg-blush/60" />
          ))}
        </div>
      ) : isError ? (
        <p className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">Gagal memuat data.</p>
      ) : !rows?.length ? (
        <div className="rounded-2xl border-2 border-dashed border-blush-2 p-10 text-center">
          <p className="font-display text-xl text-foreground">Belum ada {def.singular}</p>
          <p className="mt-1 text-sm text-muted-foreground">Klik “Tambah {def.singular}” untuk mulai.</p>
        </div>
      ) : (
        <ul className="grid gap-2">
          {rows.map((row, i) => {
            const sum = def.summary(row.data as Data);
            return (
              <li
                key={row.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl bg-card p-2.5 pr-3 shadow-soft ring-1 ring-blush/60 transition-opacity",
                  !row.visible && "opacity-60",
                )}
              >
                <div className="flex flex-col">
                  <button
                    type="button"
                    disabled={i === 0 || move.isPending}
                    onClick={() => move.mutate({ index: i, dir: -1 })}
                    className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:bg-blush disabled:opacity-30"
                    aria-label="Naikkan"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={i === rows.length - 1 || move.isPending}
                    onClick={() => move.mutate({ index: i, dir: 1 })}
                    className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:bg-blush disabled:opacity-30"
                    aria-label="Turunkan"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                {sum.image !== undefined && (
                  <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-blush/60">
                    {sum.image && <img src={sum.image} alt="" className="h-full w-full object-cover" loading="lazy" />}
                  </span>
                )}
                <button type="button" onClick={() => setEditing({ id: row.id, data: row.data as Data })} className="min-w-0 flex-1 text-left">
                  <p className="truncate font-semibold text-foreground">{sum.title || <em className="text-muted-foreground">Tanpa judul</em>}</p>
                  {sum.subtitle && <p className="truncate text-xs text-muted-foreground">{sum.subtitle}</p>}
                </button>
                {!row.visible && <span className="hidden rounded-full bg-muted px-2 py-0.5 text-[0.7rem] font-semibold text-muted-foreground sm:inline">Disembunyikan</span>}
                <button
                  type="button"
                  onClick={() => patch.mutate({ id: row.id, values: { visible: !row.visible } })}
                  className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-blush hover:text-foreground"
                  aria-label={row.visible ? "Sembunyikan" : "Tampilkan"}
                  title={row.visible ? "Sembunyikan dari website" : "Tampilkan di website"}
                >
                  {row.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing({ id: row.id, data: row.data as Data })}
                  className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-blush hover:text-foreground"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <ConfirmDelete title={`Hapus ${def.singular} ini?`} description={`“${sum.title}” akan dihapus dari website.`} onConfirm={() => remove.mutate(row.id)} />
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={Boolean(editing)} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto rounded-2xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editing?.id ? `Edit ${def.singular}` : `Tambah ${def.singular}`}
            </DialogTitle>
            <DialogDescription>{def.label}</DialogDescription>
          </DialogHeader>
          {editing && (
            <ItemForm
              key={editing.id ?? "new"}
              fields={def.fields}
              initial={editing.data}
              saving={save.isPending}
              onCancel={() => setEditing(null)}
              onSave={(data) => save.mutate({ id: editing.id, data })}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const ItemForm = ({
  fields,
  initial,
  saving,
  onSave,
  onCancel,
}: {
  fields: FieldDef[];
  initial: Data;
  saving: boolean;
  onSave: (d: Data) => void;
  onCancel: () => void;
}) => {
  const site = useSite();
  const [data, setData] = useState<Data>(initial);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => setData(initial), [initial]);

  const set = (name: string, value: unknown) => setData((d) => ({ ...d, [name]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    for (const f of fields) {
      if ("required" in f && f.required && !String(data[f.name] ?? "").trim()) {
        setError(`${f.label} wajib diisi.`);
        return;
      }
      if (f.type === "work-images" && !((data[f.name] as unknown[]) ?? []).length) {
        setError("Tambahkan minimal satu gambar.");
        return;
      }
    }
    const out = { ...data };
    const imgs = out.images as WorkImage[] | undefined;
    if (imgs?.length) out.ratio = imgs[0].ratio ?? out.ratio ?? 1;
    // Drop empty optional strings so the site falls back cleanly.
    for (const k of Object.keys(out)) if (out[k] === "") delete out[k];
    onSave(out);
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      {fields.map((f) => {
        const v = data[f.name];
        switch (f.type) {
          case "text":
          case "url":
            return (
              <Field key={f.name} label={f.label} hint={f.hint}>
                <input
                  type="text"
                  inputMode={f.type === "url" ? "url" : undefined}
                  value={String(v ?? "")}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.name, e.target.value)}
                  className={inputCls}
                />
              </Field>
            );
          case "textarea":
            return (
              <Field key={f.name} label={f.label} hint={f.hint}>
                <textarea rows={4} value={String(v ?? "")} placeholder={f.placeholder} onChange={(e) => set(f.name, e.target.value)} className={inputCls} />
              </Field>
            );
          case "select": {
            const opts = f.options(site);
            const current = String(v ?? "");
            const withCurrent = current && !opts.some((o) => o.value === current) ? [...opts, { value: current, label: current }] : opts;
            return (
              <Field key={f.name} label={f.label} hint={f.hint}>
                <Select value={current || (f.allowEmpty ? "__none" : undefined)} onValueChange={(x) => set(f.name, x === "__none" ? "" : x)}>
                  <SelectTrigger className="h-auto rounded-xl border-blush-2 bg-card px-3.5 py-2.5 text-sm">
                    <SelectValue placeholder="Pilih…" />
                  </SelectTrigger>
                  <SelectContent>
                    {f.allowEmpty && <SelectItem value="__none">Tidak ada</SelectItem>}
                    {withCurrent.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            );
          }
          case "image":
            return <ImageField key={f.name} label={f.label} hint={f.hint} folder={f.folder} value={String(v ?? "")} onChange={(url) => set(f.name, url)} />;
          case "boolean":
            return <ToggleField key={f.name} label={f.label} hint={f.hint} checked={Boolean(v)} onChange={(x) => set(f.name, x)} />;
          case "work-images":
            return (
              <ImageListField<WorkImage>
                key={f.name}
                label={f.label}
                folder="works"
                items={(v as WorkImage[]) ?? []}
                onChange={(items) => set(f.name, items)}
                make={(up) => ({ src: up.src, thumb: up.thumb, ratio: up.ratio, label: "" })}
                hint="Gambar pertama jadi cover. Beri label kalau ada beberapa sisi/varian (misal Side A, Maroon)."
                renderExtra={(it, update) => (
                  <input
                    value={it.label ?? ""}
                    onChange={(e) => update({ label: e.target.value })}
                    placeholder="Label"
                    aria-label="Label gambar"
                    className={cn(inputCls, "mt-1.5 px-2 py-1.5 text-xs")}
                  />
                )}
              />
            );
        }
      })}

      {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">{error}</p>}

      <div className="mt-2 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn-soft !px-5 !py-2.5">
          Batal
        </button>
        <button type="submit" disabled={saving} className="btn-primary !px-5 !py-2.5">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Simpan
        </button>
      </div>
    </form>
  );
};

export default ItemsEditor;
