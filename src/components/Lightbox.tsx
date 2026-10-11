import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Work } from "@/data/content";
import { cn } from "@/lib/utils";

interface LightboxProps {
  state: { list: Work[]; index: number } | null;
  onChange: (index: number) => void;
  onClose: () => void;
}

const Lightbox = ({ state, onChange, onClose }: LightboxProps) => {
  const [side, setSide] = useState(0);
  // Keep the last work rendered while the dialog plays its exit animation.
  const [last, setLast] = useState(state);
  useEffect(() => {
    if (state) setLast(state);
  }, [state]);
  const view = state ?? last;
  const work = view ? view.list[view.index] : null;
  const total = view?.list.length ?? 0;

  useEffect(() => setSide(0), [work?.id]);

  const go = (d: number) => state && onChange((state.index + d + total) % total);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  return (
    <DialogPrimitive.Root open={!!state} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-ink/55 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          onKeyDown={onKeyDown}
          className="fixed left-1/2 top-1/2 z-[60] flex max-h-[94vh] w-[94vw] max-w-6xl -translate-x-1/2 -translate-y-1/2 flex-col gap-3 rounded-window border border-white bg-milk p-3 shadow-window duration-base focus:outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.97] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.97] md:p-4 lg:flex-row"
        >
          {work && (
            <>
              <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-card bg-blush/60 p-2 md:p-4">
                <img
                  key={work.images[side].src}
                  src={work.images[side].src}
                  alt={`${work.title}${work.images[side].label ? `, ${work.images[side].label}` : ""}`}
                  className="max-h-[62vh] w-auto max-w-full rounded-img object-contain shadow-soft animate-in fade-in-0 duration-base lg:max-h-[84vh]"
                />
              </div>

              <aside className="flex shrink-0 flex-col gap-4 p-2 lg:w-72 lg:p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="chip">{work.category}</span>
                  <DialogPrimitive.Close
                    aria-label="Close"
                    className="grid h-10 w-10 place-items-center rounded-full bg-blush text-foreground transition-[background-color,transform] duration-fast hover:bg-blush-2 active:scale-95"
                  >
                    <X className="h-4 w-4" />
                  </DialogPrimitive.Close>
                </div>
                <div>
                  <DialogPrimitive.Title className="font-display text-2xl leading-tight text-foreground md:text-[1.75rem]">
                    {work.title}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="mt-2 text-sm text-muted-foreground">
                    {work.client ? `Designed for ${work.client}` : `${work.category} by Natalie Netania Sulistio`}
                  </DialogPrimitive.Description>
                </div>

                {work.images.length > 1 && (
                  <div role="group" aria-label="Views" className="flex flex-wrap gap-2">
                    {work.images.map((im, k) => (
                      <button
                        key={im.src}
                        type="button"
                        onClick={() => setSide(k)}
                        aria-pressed={side === k}
                        className={cn(
                          "flex items-center gap-2 rounded-full p-1 pr-3 text-xs font-semibold transition-[background-color,color] duration-fast",
                          side === k ? "bg-primary text-primary-foreground" : "bg-blush text-accent-foreground hover:bg-blush-2",
                        )}
                      >
                        <img src={im.thumb} alt="" className="h-7 w-7 rounded-full object-cover" />
                        {im.label ?? `View ${k + 1}`}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {view!.index + 1} / {total}
                  </span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => go(-1)} aria-label="Previous work" className="grid h-11 w-11 place-items-center rounded-full bg-card text-foreground ring-1 ring-blush-2 transition-[background-color,transform] duration-fast hover:bg-blush active:scale-95">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={() => go(1)} aria-label="Next work" className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft transition-[background-color,transform] duration-fast hover:bg-accent-foreground active:scale-95">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </aside>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default Lightbox;
