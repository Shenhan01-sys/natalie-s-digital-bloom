import { ArrowUpRight } from "lucide-react";
import type { Category, ExperienceItem, Work } from "@/data/content";
import { useSite } from "@/lib/site-content";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";
import { ClayStar } from "./Ornaments";

interface ExperienceProps {
  onBrowse: (category: Category) => void;
}

const Experience = ({ onBrowse }: ExperienceProps) => {
  const ref = useReveal<HTMLElement>();
  const { experience, clients, works, profile } = useSite();

  if (!experience.length && !clients.length) return null;

  return (
    <section id="experience" ref={ref} className="relative py-16 md:py-24">
      <div className="container">
        <div className="window p-5 sm:p-8 lg:p-12">
          <div data-reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="section-title">Experience</h2>
            {profile.experienceNote && <p className="label">{profile.experienceNote}</p>}
          </div>

          {experience.length > 0 && (
            <div
              className={cn(
                "mt-10 grid gap-5",
                experience.length > 1 && "lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]",
              )}
            >
              {experience.map((e, i) => (
                <ExperienceCard
                  key={`${e.org}-${i}`}
                  item={e}
                  tone={i % 2 === 0 ? "blush" : "widget"}
                  previews={e.category ? works.filter((w) => w.category === e.category && w.images[0]).slice(0, 3) : []}
                  onBrowse={onBrowse}
                />
              ))}
            </div>
          )}

          {clients.length > 0 && (
          <div data-reveal className="mt-10 border-t border-dashed border-blush-2 pt-8">
            <p className="label">Designed for</p>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {clients.map((w) => (
                <li key={w} className="rounded-full bg-card px-4 py-2 text-sm font-semibold text-foreground ring-1 ring-blush-2">
                  {w}
                </li>
              ))}
            </ul>
          </div>
          )}
        </div>
      </div>
    </section>
  );
};

interface CardProps {
  item: ExperienceItem;
  tone: "blush" | "widget";
  previews: Work[];
  onBrowse: (category: Category) => void;
}

const ExperienceCard = ({ item, tone, previews, onBrowse }: CardProps) => (
  <article
    data-reveal
    className={cn(
      "flex flex-col p-7 md:p-8",
      tone === "blush" ? "justify-between rounded-card bg-blush" : "widget",
    )}
  >
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className={cn("text-sm font-semibold", tone === "blush" ? "text-accent-foreground" : "text-primary")}>{item.years}</p>
        <h3 className="mt-3 text-[1.85rem] leading-tight text-foreground">{item.org}</h3>
      </div>
      {tone === "widget" && <span className="chip">{item.role}</span>}
    </div>

    {item.description && <p className="mt-4 max-w-prose text-muted-foreground">{item.description}</p>}

    {previews.length > 0 && (
      <ul className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        {previews.map((b) => (
          <li key={b.id} className="overflow-hidden rounded-img bg-blush">
            <img src={b.images[0].thumb} alt={b.title} loading="lazy" className="aspect-[3/2] h-full w-full object-cover" />
          </li>
        ))}
      </ul>
    )}

    {tone === "blush" ? (
      <div className="mt-10 flex items-center justify-between gap-4">
        <span className="rounded-full bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-soft">{item.role}</span>
        {item.category ? (
          <button type="button" onClick={() => onBrowse(item.category!)} className="btn-soft">
            See {item.category.toLowerCase()}
            <ArrowUpRight className="h-4 w-4" />
          </button>
        ) : (
          <ClayStar className="w-14 shrink-0 rotate-6" />
        )}
      </div>
    ) : (
      item.category && (
        <button type="button" onClick={() => onBrowse(item.category!)} className="btn-soft mt-6 self-start">
          See the {item.category.toLowerCase()}
          {item.category.endsWith("s") ? "" : "s"}
          <ArrowUpRight className="h-4 w-4" />
        </button>
      )
    )}
  </article>
);

export default Experience;
