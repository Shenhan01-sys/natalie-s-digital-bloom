import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Sticky bar that appears while a settings form has unsaved changes. */
const SaveBar = ({ dirty, saving, onSave, onReset }: { dirty: boolean; saving: boolean; onSave: () => void; onReset: () => void }) => (
  <div
    className={cn(
      "sticky bottom-4 z-20 mt-6 flex items-center justify-between gap-3 rounded-full bg-ink py-2 pl-5 pr-2 text-sm text-white shadow-lift transition-[opacity,transform] duration-base ease-soft",
      dirty ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
    )}
    aria-hidden={!dirty}
  >
    <span className="font-semibold">Ada perubahan yang belum disimpan</span>
    <span className="flex gap-2">
      <button type="button" onClick={onReset} tabIndex={dirty ? 0 : -1} className="rounded-full px-4 py-2 font-semibold text-white/80 hover:bg-white/10">
        Batal
      </button>
      <button type="button" onClick={onSave} disabled={saving} tabIndex={dirty ? 0 : -1} className="inline-flex items-center gap-2 rounded-full bg-rose px-5 py-2 font-semibold text-ink hover:bg-petal">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Simpan
      </button>
    </span>
  </div>
);

export default SaveBar;
