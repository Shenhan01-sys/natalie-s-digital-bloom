import { GraduationCap } from "lucide-react";
import { useSite } from "@/lib/site-content";
import { useReveal } from "@/hooks/use-reveal";
import { ClayStar, Seal } from "./Ornaments";

const About = () => {
  const ref = useReveal<HTMLElement>();
  const { education, languages, profile, software } = useSite();

  return (
    <section id="about" ref={ref} className="relative py-16 md:py-24">
      <div className="container">
        <div data-reveal className="mb-10 flex flex-col items-start gap-3 md:mb-14 md:flex-row md:items-end md:justify-between">
          <h2 className="section-title">
            About <em className="text-primary">me</em>
          </h2>
          <p className="max-w-sm text-muted-foreground">
            {profile.aboutLead}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-6 lg:grid-cols-12 lg:gap-5">
          {/* About text */}
          <article data-reveal className="widget relative overflow-hidden p-7 md:col-span-6 md:p-9 lg:col-span-7">
            <Seal className="absolute -right-3 -top-3 w-16 rotate-[18deg] opacity-90 sm:-right-4 sm:-top-4 sm:w-24 md:w-28" />
            <p className="label">About me</p>
            <p className="mt-5 max-w-[34ch] font-display text-[1.4rem] leading-[1.3] text-foreground sm:text-[1.7rem] md:text-[2rem] md:leading-[1.25]">
              {profile.about}
            </p>
          </article>

          {/* Photo */}
          <figure data-reveal className="relative min-h-[420px] overflow-hidden rounded-card bg-blush shadow-soft md:col-span-3 md:row-span-2 lg:col-span-5">
            <img
              src={profile.photoSecondary}
              alt={profile.photoSecondaryAlt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
            />
            <figcaption className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-widget bg-milk/95 px-4 py-3 shadow-soft">
              <span className="font-script text-3xl leading-none text-primary">{profile.firstName}</span>
              <span className="text-right text-xs font-semibold text-muted-foreground">{profile.lastName}</span>
            </figcaption>
          </figure>

          {/* Education */}
          <article data-reveal className="widget p-6 md:col-span-3 lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-blush text-accent-foreground">
                <GraduationCap className="h-5 w-5" />
              </span>
              <h3 className="text-2xl text-foreground">Education</h3>
            </div>
            <ol className="relative mt-6 space-y-6 border-l-2 border-dashed border-blush-2 pl-6">
              {education.map((e) => (
                <li key={`${e.school}-${e.years}`} className="relative">
                  <span aria-hidden className="absolute -left-[33px] top-1 h-4 w-4 rounded-full border-4 border-card bg-rose" />
                  <p className="text-xs font-semibold text-primary">{e.years}</p>
                  <p className="mt-1 font-semibold leading-snug text-foreground">{e.school}</p>
                  <p className="text-sm text-muted-foreground">{e.field}</p>
                </li>
              ))}
            </ol>
          </article>

          {/* Languages + Software */}
          <div className="grid gap-4 md:col-span-3 lg:col-span-3 lg:gap-5">
            <article data-reveal className="widget relative overflow-hidden p-6">
              <ClayStar className="absolute -bottom-5 -right-5 w-20 rotate-12 opacity-90" />
              <h3 className="text-2xl text-foreground">Languages</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {languages.map((l) => (
                  <li key={l} className="chip">
                    {l}
                  </li>
                ))}
              </ul>
            </article>
            <article data-reveal className="widget p-6">
              <h3 className="text-2xl text-foreground">Software</h3>
              <ul className="mt-4 flex gap-4">
                {software.map((s) => (
                  <li key={s.name} className="flex flex-col items-center gap-2">
                    <img src={s.icon} alt="" className="h-14 w-14 rounded-[1rem] object-contain" loading="lazy" />
                    <span className="text-xs font-semibold text-foreground">{s.name}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
