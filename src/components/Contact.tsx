import { ArrowUpRight, Heart } from "lucide-react";
import { useSite } from "@/lib/site-content";
import { contactIcon, contactTile, isExternal } from "@/lib/contact-icons";
import { useReveal } from "@/hooks/use-reveal";
import { Flower, Seal } from "./Ornaments";

const Contact = () => {
  const ref = useReveal<HTMLElement>();
  const { contacts, profile } = useSite();
  // Email gets a full-width tile; the rest pair up, and an odd one out spans the row.
  const rest = contacts.filter((c) => c.kind !== "email");
  const ordered = [...contacts.filter((c) => c.kind === "email"), ...rest];
  const wide = (c: (typeof contacts)[number]) =>
    c.kind === "email" || (rest.length % 2 === 1 && c === rest[rest.length - 1]);

  return (
    <section id="contact" ref={ref} className="relative overflow-hidden pt-4 md:pt-8">
      <div className="container">
        <div data-reveal className="relative overflow-hidden rounded-window bg-blush p-6 shadow-window sm:p-10 lg:p-14">
          <Flower className="absolute right-8 top-8 h-16 w-16 opacity-80" color="hsl(var(--petal))" />
          <Flower className="absolute bottom-8 right-[42%] hidden h-10 w-10 md:block" color="#fff" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <div>
              <p className="text-sm font-semibold text-accent-foreground">Contact</p>
              <h2 className="mt-2 text-display text-foreground">
                Let’s work <em className="text-primary">together</em>
              </h2>
              <div className="relative mt-8 flex items-end gap-4">
                <img
                  src="/deco/phone.webp"
                  alt=""
                  loading="lazy"
                  className="w-40 -rotate-6 drop-shadow-[0_18px_22px_rgba(184,54,90,.3)] sm:w-48"
                />
                <Seal className="mb-4 w-20 rotate-12" />
              </div>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {ordered.map((c) => {
                const tile = contactTile[c.kind];
                const Icon = contactIcon[c.kind] ?? contactIcon.link;
                return (
                <li key={`${c.kind}-${c.value}`} className={wide(c) ? "sm:col-span-2" : undefined}>
                  <a
                    href={c.href}
                    target={isExternal(c.href) ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="lift group flex h-full flex-col gap-5 rounded-card bg-card p-5 shadow-soft"
                  >
                    <span className="flex items-start justify-between">
                      {tile ? (
                        <img src={tile} alt="" loading="lazy" className="h-12 w-12 rounded-[0.9rem] object-contain" />
                      ) : (
                        <span className="grid h-12 w-12 place-items-center rounded-[0.9rem] bg-blush text-primary">
                          <Icon className="h-6 w-6" />
                        </span>
                      )}
                      <ArrowUpRight
                        aria-hidden
                        className="h-5 w-5 text-muted-foreground transition-[transform,color] duration-base ease-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                      />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-muted-foreground">{c.label}</span>
                      <span className={`mt-0.5 block font-semibold text-foreground ${c.kind === "email" ? "[overflow-wrap:anywhere]" : "whitespace-nowrap"}`}>{c.value}</span>
                    </span>
                  </a>
                </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <footer className="container flex flex-col items-center justify-between gap-3 py-10 text-center text-sm text-muted-foreground md:flex-row md:text-left">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="inline-flex items-center gap-1.5">
          Made with <Heart className="h-4 w-4 fill-rose text-rose" aria-label="love" /> by Natalie &amp; Hans Gunawan
        </p>
      </footer>
    </section>
  );
};

export default Contact;
