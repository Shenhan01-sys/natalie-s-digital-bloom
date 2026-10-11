import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Store } from "lucide-react";
import { useSite } from "@/lib/site-content";
import { supabaseReady } from "@/lib/supabase";
import { Flower } from "@/components/Ornaments";
import { cn } from "@/lib/utils";

interface ShopShellProps {
  children: ReactNode;
  /** Where the back arrow goes; omitted on the shop home. */
  back?: { to: string; label: string };
  width?: "narrow" | "wide";
}

/** Shared frame for every public shop page: soft blush backdrop, top bar, footer. */
const ShopShell = ({ children, back, width = "wide" }: ShopShellProps) => {
  const { profile } = useSite();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-blush/70 via-blush/30 to-transparent" />
      <Flower className="pointer-events-none absolute left-[6%] top-24 hidden h-10 w-10 md:block" color="#fff" />
      <Flower className="pointer-events-none absolute right-[8%] top-40 hidden h-8 w-8 md:block" color="hsl(var(--rose) / .55)" />

      <header className={cn("container relative flex items-center justify-between gap-3 pt-5", width === "narrow" && "max-w-2xl")}>
        {back ? (
          <Link to={back.to} className="inline-flex items-center gap-2 rounded-full bg-milk/80 px-4 py-2 text-sm font-semibold text-foreground shadow-soft transition-colors duration-fast hover:bg-card">
            <ArrowLeft className="h-4 w-4" />
            {back.label}
          </Link>
        ) : (
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-milk/80 px-4 py-2 text-sm font-semibold text-foreground shadow-soft transition-colors duration-fast hover:bg-card">
            <ArrowLeft className="h-4 w-4" />
            Portfolio
          </Link>
        )}
        <Link to="/shop" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-primary" aria-label="Shop home">
          <Store className="h-4 w-4" />
          <span className="font-script text-2xl leading-none">{profile.firstName}</span>
        </Link>
      </header>

      <main className={cn("container relative pb-16 pt-6", width === "narrow" && "max-w-2xl")}>
        {!supabaseReady && (
          <p className="mb-6 rounded-widget bg-blush px-5 py-4 text-sm font-semibold text-accent-foreground">
            Toko belum terhubung ke database. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY terlebih dahulu.
          </p>
        )}
        {children}
      </main>

      <footer className="container flex flex-col items-center gap-2 pb-10 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="inline-flex items-center gap-1.5">
          Made with <Heart className="h-4 w-4 fill-rose text-rose" aria-label="love" /> by Natalie &amp; Hans Gunawan
        </p>
      </footer>
    </div>
  );
};

export default ShopShell;
