import { useEffect, useMemo, useRef, useState } from "react";
import { createTimeline, stagger } from "animejs";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Home,
  Images,
  Mail,
  Pause,
  Play,
  Search,
  UserRound,
} from "lucide-react";
import type { Work } from "@/data/content";
import { useSite } from "@/lib/site-content";
import { contactIcon, isExternal } from "@/lib/contact-icons";
import { motionOk } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/use-active-section";
import { ClayStar, CloudBand, Seal } from "./Ornaments";

const railLinks = [
  { href: "#home", label: "Home", icon: Home },
  { href: "#about", label: "About", icon: UserRound },
  { href: "#experience", label: "Experience", icon: Briefcase },
  { href: "#portfolio", label: "Portfolio", icon: Images },
  { href: "#contact", label: "Contact", icon: Mail },
];

/** "2023–Now" -> ["2023", "until now"] */
const splitYears = (years: string) => {
  const [start, end] = years.split(/\s*[–-]\s*/);
  if (!end) return [start, ""];
  return [start, /now|sekarang|present/i.test(end) ? "until now" : `until ${end}`];
};

interface HeroProps {
  onSearch: (q: string) => void;
  onOpenWork: (list: Work[], index: number) => void;
}

const Hero = ({ onSearch, onOpenWork }: HeroProps) => {
  const rootRef = useRef<HTMLElement>(null);
  const active = useActiveSection();
  const [draft, setDraft] = useState("");
  const { contacts, education, languages, profile, works } = useSite();
  const edu = education[0];
  const [eduStart, eduEnd] = edu ? splitYears(edu.years) : ["", ""];

  // Hero entrance
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !motionOk()) return;
    const q = (s: string) => Array.from(root.querySelectorAll<HTMLElement>(s));
    const all = q("[data-hero]");
    all.forEach((el) => {
      el.style.opacity = "0";
      el.setAttribute("data-revealed", "");
    });
    const tl = createTimeline({
      defaults: { ease: "outQuint" },
      onComplete: () =>
        all.forEach((el) => {
          el.style.removeProperty("opacity");
          el.style.removeProperty("transform");
        }),
    });
    tl.add(q('[data-hero="window"]'), { opacity: [0, 1], scale: [0.97, 1], duration: 800 })
      .add(q('[data-hero="photo"]'), { opacity: [0, 1], translateY: [24, 0], duration: 760 }, "-=560")
      .add(q('[data-hero="item"]'), { opacity: [0, 1], translateY: [22, 0], duration: 700, delay: stagger(80) }, "-=600")
      .add(q('[data-hero="name"]'), { opacity: [0, 1], translateY: [26, 0], duration: 900 }, "-=900")
      .add(q('[data-hero="deco"]'), { opacity: [0, 1], scale: [0.6, 1], rotate: [-18, 0], duration: 900, delay: stagger(120) }, "-=800");
    return () => {
      tl.revert();
    };
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(draft.trim());
  };

  return (
    <section id="home" ref={rootRef} className="relative overflow-hidden pb-28 pt-24 md:pb-36 md:pt-28">
      <CloudBand />

      <div className="container relative">
        <div data-hero="window" className="window p-3 sm:p-4 lg:p-5">
          {/* Ornaments */}
          <span data-hero="deco" className="absolute -right-5 bottom-32 z-10 hidden w-16 sm:block lg:-right-7 lg:w-20">
            <ClayStar className="w-full rotate-12" />
          </span>

          <div className="grid gap-4 lg:grid-cols-[64px_minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-5">
            {/* Icon rail */}
            <nav aria-label="Sections" className="hidden lg:block">
              <ul className="flex h-full flex-col items-center gap-2 rounded-full bg-ink px-2 py-4">
                {railLinks.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      aria-label={label}
                      title={label}
                      aria-current={active === href ? "true" : undefined}
                      className={cn(
                        "grid h-11 w-11 place-items-center rounded-full transition-[background-color,color,transform] duration-fast ease-soft",
                        active === href
                          ? "bg-rose text-ink"
                          : "text-white/75 hover:bg-white/10 hover:text-white active:scale-95",
                      )}
                    >
                      <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                    </a>
                  </li>
                ))}
                <li className="mt-auto">
                  <img src={profile.photo} alt="" className="h-11 w-11 rounded-full object-cover object-top ring-2 ring-rose" />
                </li>
              </ul>
            </nav>

            {/* Photo + script name */}
            <div data-hero="photo" className="relative">
              <span data-hero="deco" className="absolute -top-12 right-6 z-10 hidden w-24 sm:block">
                <Seal className="w-full rotate-12" />
              </span>
              <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-blush sm:aspect-[5/5] lg:aspect-auto lg:h-full lg:min-h-[560px]">
                <img
                  src={profile.photo}
                  alt={profile.photoAlt}
                  className="absolute inset-0 h-full w-full object-cover object-[50%_22%]"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/60 via-ink/15 to-transparent" />
                <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-milk/90 py-1.5 pl-1.5 pr-4 shadow-soft sm:left-4 sm:top-4">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-blush font-display text-lg italic text-accent-foreground">
                    {profile.firstName.charAt(0)}
                  </span>
                  <span className="text-xs font-semibold text-foreground">{profile.tagline}</span>
                </div>
                <p
                  data-hero="name"
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-3 text-center font-script text-name text-white [text-shadow:0_6px_30px_rgba(75,40,51,.45)] sm:bottom-5"
                >
                  {profile.firstName}
                </p>
              </div>
            </div>

            {/* Widgets */}
            <div className="flex flex-col gap-4">
              <form role="search" onSubmit={submit} data-hero="item" className="flex items-center gap-2 rounded-full bg-blush/60 p-1.5 pl-5">
                <label htmlFor="hero-search" className="sr-only">
                  Search Natalie’s works
                </label>
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                <input
                  id="hero-search"
                  type="search"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="search my works… banner, logo, leaflet"
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button type="submit" aria-label="Search portfolio" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft transition-[transform,background-color] duration-fast ease-soft hover:bg-accent-foreground active:scale-95">
                  <Search className="h-4 w-4" />
                </button>
              </form>

              <div data-hero="item" className="widget relative overflow-hidden p-6 sm:p-7">
                <p className="text-sm font-semibold text-primary">{profile.greeting}</p>
                <h1 className="mt-1 text-display text-foreground">{profile.title}</h1>
                <p className="mt-4 text-lg font-semibold text-foreground">{profile.name}</p>
                <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
                  {profile.intro}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#portfolio" className="btn-primary">
                    See my works
                  </a>
                  <a href="#contact" className="btn-soft">
                    Let’s work together
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {edu && (
                  <div data-hero="item" className="widget p-5">
                    <p className="label">Education</p>
                    <p className="mt-2 font-display text-[1.9rem] leading-none text-foreground">{eduStart}</p>
                    {eduEnd && <p className="mt-1 text-xs font-semibold text-primary">{eduEnd}</p>}
                    <p className="mt-3 text-sm leading-snug text-muted-foreground">
                      {edu.field}, {edu.school}
                    </p>
                  </div>
                )}
                <div data-hero="item" className="widget p-5">
                  <p className="label">Languages</p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {languages.map((l) => (
                      <li key={l} className="chip w-fit">
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <NowViewing works={works} onOpenWork={onOpenWork} />
            </div>
          </div>

          {/* Social pill */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <ul data-hero="item" className="flex items-center gap-1 rounded-full bg-ink p-1.5 shadow-lift">
            {contacts.map((c) => {
              const Icon = contactIcon[c.kind] ?? contactIcon.link;
              return (
                <li key={`${c.kind}-${c.value}`}>
                  <a
                    href={c.href}
                    target={isExternal(c.href) ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={c.label}
                    title={c.label}
                    className="grid h-11 w-11 place-items-center rounded-full text-white/85 transition-[background-color,color,transform] duration-fast ease-soft hover:bg-rose hover:text-ink active:scale-95"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                </li>
              );
            })}
          </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

/** Player-style widget that really cycles through featured works. */
const NowViewing = ({ works, onOpenWork }: { works: Work[]; onOpenWork: HeroProps["onOpenWork"] }) => {
  const list = useMemo(() => {
    const withImage = works.filter((w) => w.images[0]);
    const featured = withImage.filter((w) => w.featured);
    return (featured.length ? featured : withImage).slice(0, 8);
  }, [works]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(() => motionOk());
  const current = list[i] ?? list[0];
  useEffect(() => setI(0), [list]);

  useEffect(() => {
    if (!playing || list.length < 2) return;
    const t = window.setInterval(() => {
      if (!document.hidden) setI((n) => (n + 1) % list.length);
    }, 4200);
    return () => window.clearInterval(t);
  }, [playing, list.length]);

  const step = (d: number) => setI((n) => (n + d + list.length) % list.length);
  if (!current) return null;

  return (
    <div data-hero="item" className="widget flex items-center gap-4 p-3 pr-4">
      <button
        type="button"
        onClick={() => onOpenWork(list, i)}
        className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-img bg-blush sm:h-[6.5rem] sm:w-[6.5rem]"
        aria-label={`Open ${current.title}`}
      >
        {list.map((w, k) => (
          <img
            key={w.id}
            src={w.images[0].thumb}
            alt=""
            loading={k === 0 ? "eager" : "lazy"}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-slow ease-soft group-hover:scale-105",
              k === i ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </button>

      <div className="min-w-0 flex-1">
        <p className="label">Now viewing</p>
        <p className="mt-1 truncate font-display text-lg leading-tight text-foreground" aria-live="polite">
          {current.title}
        </p>
        <p className="truncate text-xs font-semibold text-primary">{current.category}</p>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex flex-1 gap-1" aria-hidden>
            {list.map((w, k) => (
              <span
                key={w.id}
                className={cn("h-1 flex-1 rounded-full transition-colors duration-base", k === i ? "bg-primary" : "bg-blush-2")}
              />
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => step(-1)} aria-label="Previous work" className="grid h-8 w-8 place-items-center rounded-full text-foreground transition-colors duration-fast hover:bg-blush active:scale-95">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              aria-pressed={playing}
              className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft transition-[background-color,transform] duration-fast hover:bg-accent-foreground active:scale-95"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next work" className="grid h-8 w-8 place-items-center rounded-full text-foreground transition-colors duration-fast hover:bg-blush active:scale-95">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
