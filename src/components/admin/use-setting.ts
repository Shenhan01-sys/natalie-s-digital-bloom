import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { errorMessage, supabase } from "@/lib/supabase";
import type { Json } from "@/lib/database.types";

/** Load + save one row of site_settings as a local draft. */
export function useSetting<T extends object>(key: string, defaults: T) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["admin-setting", key],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle();
      if (error) throw error;
      return { ...defaults, ...((data?.value as object) ?? {}) } as T;
    },
  });
  const [draft, setDraft] = useState<T>(defaults);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (query.data) setDraft(query.data);
  }, [query.data]);

  const dirty = query.data ? JSON.stringify(query.data) !== JSON.stringify(draft) : false;

  const save = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("site_settings").upsert({ key, value: draft as unknown as Json });
      if (error) throw error;
      toast.success("Perubahan disimpan");
      qc.invalidateQueries({ queryKey: ["admin-setting", key] });
      qc.invalidateQueries({ queryKey: ["site-content"] });
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const set = <K extends keyof T>(k: K, v: T[K]) => setDraft((d) => ({ ...d, [k]: v }));

  return { draft, set, setDraft, save, saving, dirty, loading: query.isLoading, reset: () => query.data && setDraft(query.data) };
}
