import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import type { CategoryItem, Category, Work } from "@/data/content";
import { useSite } from "@/lib/site-content";
import { staggerIn, useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export type Filter = Category | "All";

interface PortfolioProps {
  query: string;
  onQueryChange: (q: string) => void;
  category: Filter;
  onCategoryChange: (c: Filter) => void;
  onOpenWork: (list: Work[], index: number) => void;
}

const matches = (w: Work, q: string) => {
  if (!q) return true;
  const hay = `${w.title} ${w.category} ${w.client ?? ""}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((t) => hay.includes(t));
};

/** Round-robin across categories so "All" mixes formats instead of stacking them. */
const PREVIEW = 9;

const interleave = (list: Work[], categories: CategoryItem[]) => {
  const known = new Set(categories.map((c) => c.id));
  const groups = [
    ...categories.map((c) => list.filter((w) => w.category === c.id)),
    list.filter((w) => !known.has(w.category)),
  ];
  const longest = Math.max(0, ...groups.map((g) => g.length));
  const out: Work[] = [];
  for (let i = 0; i < longest; i++) groups.forEach((g) => g[i] && out.push(g[i]));
  return out;
};

const Portfolio = ({ query, onQueryChange, category, onCategoryChange, onOpenWork }: PortfolioProps) => {
  const ref = useReveal<HTMLElement>();
  const gridRef = useRef<HTMLUListElement>(null);
  const first = useRef(true);
  const { categories, works } = useSite();

  const searched = useMemo(() => works.filter((w) => matches(w, query)), [works, query]);
  const visible = useMemo(
    () => (category === "All" ? interleave(searched, categories) : searched.filter((w) => w.category === category)),
    [searched, category, categories],
  );
  const [expanded, setExpanded] = useState(false);
  useEffect(() => setExpanded(false), [category, query]);
  const collapsible = category === "All" && !query && visible.length > PREVIEW;
  const shown = collapsible && !expanded ? visible.slice(0, PREVIEW) : visible;

  const note = categories.find((c) => c.id === category)?.note ?? "Commissioned projects & personal project";

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const cards = Array.from(gridRef.current?.querySelectorAll<HTMLElement>("[data-card]") ?? []);
    staggerIn(cards.slice(0, 12));
  }, [category, query]);

  const filters: { id: Filter; count: number }[] = [
    { id: "All", count: searched.length },
    ...categories.map((c) => ({ id: c.id as Filter, count: searched.filter((w) => w.category === c.id).length })),
  ];

  return (
    <section id="portfolio" ref={ref} className="relative py-16 md:py-24">
      <div className="container">
        <div data-reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="section-title">Portfolio</h2>
            <p className="mt-3 text-muted-foreground" aria-live="polite">
              {note}
            </p>
          </div>

          <div className="flex w-full items-center gap-2 rounded-full bg-card p-1.5 pl-5 shadow-soft ring-1 ring-blush-2 lg:w-80">
            <label htmlFor="portfolio-search" className="sr-only">
              Search works
            </label>
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              id="portfolio-search"
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="search works…"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                aria-label="Clear search"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blush text-foreground transition-colors duration-fast hover:bg-blush-2 active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div data-reveal role="group" aria-label="Filter by category" className="-mx-5 mt-8 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
          <ul className="flex w-max gap-1 rounded-full bg-blush/60 p-1.5">
            {filters.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => onCategoryChange(f.id)}
                  aria-pressed={category === f.id}
                  disabled={f.count === 0 && category !== f.id}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-[background-color,color,box-shadow] duration-fast ease-soft disabled:cursor-not-allowed disabled:opacity-40",
                    category === f.id
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-foreground hover:bg-card/80",
                  )}
                >
                  {f.id}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[0.7rem] leading-5",
                      category === f.id ? "bg-white/20" : "bg-card text-muted-foreground",
                    )}
                  >
                    {f.count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal>
        {visible.length > 0 ? (
          <ul id="portfolio-grid" ref={gridRef} className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {shown.map((w, i) => (
              <li key={w.id} data-card className="mb-5 break-inside-avoid">
                <button
                  type="button"
                  onClick={() => onOpenWork(visible, i)}
                  className="lift group block w-full rounded-card bg-card p-2 text-left shadow-soft"
                >
                  <span className="block overflow-hidden rounded-img bg-blush" style={{ aspectRatio: Math.max(w.ratio, 0.7) }}>
                    <img
                      src={w.images[0].thumb}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top transition-transform duration-slow ease-soft group-hover:scale-[1.03]"
                    />
                  </span>
                  <span className="flex items-start justify-between gap-3 px-3 pb-2 pt-3">
                    <span className="min-w-0">
                      <span className="block font-display text-lg leading-snug text-foreground">{w.title}</span>
                      <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">{w.client ?? w.category}</span>
                    </span>
                    {w.images.length > 1 && (
                      <span className="chip shrink-0">{w.category === "Leaflet" ? "2 sides" : `${w.images.length} views`}</span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 flex flex-col items-center gap-4 rounded-card bg-card px-6 py-16 text-center shadow-soft">
            <p className="font-display text-2xl text-foreground">No works match “{query}”.</p>
            <p className="text-sm text-muted-foreground">Try banner, logo, leaflet, t-shirt or infographic.</p>
            <button
              type="button"
              onClick={() => {
                onQueryChange("");
                onCategoryChange("All");
              }}
              className="btn-primary"
            >
              Show all works
            </button>
          </div>
        )}
        {collapsible && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => {
                if (expanded) document.getElementById("portfolio")?.scrollIntoView({ block: "start" });
                setExpanded((e) => !e);
              }}
              aria-expanded={expanded}
              aria-controls="portfolio-grid"
              className="btn-soft"
            >
              {expanded ? "Show fewer works" : `Show all ${visible.length} works`}
              <ChevronDown className={cn("h-4 w-4 transition-transform duration-base ease-soft", expanded && "rotate-180")} />
            </button>
          </div>
        )}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
