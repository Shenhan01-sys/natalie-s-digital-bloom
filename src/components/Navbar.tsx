import { useEffect, useState } from "react";
import { navLinks, useActiveSection } from "@/hooks/use-active-section";
import { Link } from "react-router-dom";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useSite } from "@/lib/site-content";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const active = useActiveSection();
  const { profile } = useSite();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:pt-4">
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full border border-white/80 py-2 pl-2 pr-2 transition-[background-color,box-shadow] duration-base ease-soft",
          scrolled ? "bg-milk/85 shadow-soft backdrop-blur-md" : "bg-milk/60 backdrop-blur-sm",
        )}
      >
        <a href="#home" className="group flex items-center gap-2.5 rounded-full pr-2" aria-label="Back to top">
          <img
            src={profile.photo}
            alt=""
            className="h-10 w-10 rounded-full object-cover object-top ring-2 ring-white transition-transform duration-base ease-soft group-hover:scale-105"
          />
          <span className="font-script text-[1.7rem] leading-none text-primary">{profile.firstName}</span>
        </a>

        <ul className="hidden items-center gap-1 rounded-full bg-blush/50 p-1 md:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={active === l.href ? "true" : undefined}
                className={cn(
                  "block rounded-full px-4 py-2 text-sm font-semibold transition-[background-color,color,box-shadow] duration-fast ease-soft",
                  active === l.href
                    ? "bg-card text-primary shadow-soft"
                    : "text-muted-foreground hover:bg-card/70 hover:text-foreground",
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-primary transition-colors duration-fast hover:bg-blush/70"
          >
            <ShoppingBag className="h-4 w-4" />
            Shop
          </Link>
          <a href="#contact" className="btn-primary !px-5 !py-2.5">
            Let’s work together
          </a>
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full bg-blush text-foreground transition-colors duration-fast hover:bg-blush-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={cn(
          "mx-auto mt-2 max-w-5xl origin-top rounded-card border border-white bg-milk/95 p-3 shadow-lift backdrop-blur-md transition-[opacity,transform] duration-base ease-soft md:hidden",
          open ? "scale-100 opacity-100" : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0",
        )}
        aria-hidden={!open}
      >
        <ul className="grid gap-1">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-widget px-4 py-3 font-semibold transition-colors duration-fast",
                  active === l.href ? "bg-blush text-accent-foreground" : "text-foreground hover:bg-blush/60",
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/shop"
              tabIndex={open ? 0 : -1}
              className="flex items-center gap-2 rounded-widget px-4 py-3 font-semibold text-primary transition-colors duration-fast hover:bg-blush/60"
            >
              <ShoppingBag className="h-4 w-4" />
              Shop templates
            </Link>
          </li>
          <li className="pt-1">
            <a href="#contact" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="btn-primary w-full">
              Let’s work together
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
