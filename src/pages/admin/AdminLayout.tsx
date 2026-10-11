import { Suspense, useEffect, useState } from "react";
import { Link, Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, LayoutDashboard, LayoutTemplate, Loader2, LogOut, Menu, Package, Receipt, Store, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useSite } from "@/lib/site-content";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin", label: "Ringkasan", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Pesanan", icon: Receipt, badge: true },
  { to: "/admin/products", label: "Produk", icon: Package },
  { to: "/admin/shop", label: "Halaman Shop", icon: Store },
  { to: "/admin/content", label: "Konten Website", icon: LayoutTemplate },
];

export const usePendingCount = () =>
  useQuery({
    queryKey: ["admin-pending-count"],
    refetchInterval: 60_000,
    queryFn: async () => {
      const { count, error } = await supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending");
      if (error) throw error;
      return count ?? 0;
    },
  });

const AdminLayout = () => {
  const { session, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();
  const { profile } = useSite();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    document.title = "Dashboard · " + profile.firstName;
  }, [profile.firstName]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4">
        <div className="max-w-sm rounded-2xl bg-card p-8 text-center shadow-soft">
          <p className="font-display text-2xl text-foreground">Tidak punya akses</p>
          <p className="mt-2 text-sm text-muted-foreground">Akun {session.user.email} bukan admin website ini.</p>
          <button type="button" onClick={signOut} className="btn-primary mt-6">
            Keluar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-blush bg-milk/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link to="/admin" className="flex items-center gap-2">
          <span className="font-script text-3xl leading-none text-primary">{profile.firstName}</span>
          <span className="rounded-full bg-blush px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-accent-foreground">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className="grid h-10 w-10 place-items-center rounded-full bg-blush text-foreground"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <aside
        className={cn(
          "fixed inset-x-0 top-[61px] z-30 border-b border-blush bg-milk p-4 shadow-lift lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r lg:p-5 lg:shadow-none",
          open ? "block" : "hidden lg:flex",
        )}
      >
        <Link to="/admin" className="hidden items-center gap-3 px-2 lg:flex">
          <img src={profile.photo} alt="" className="h-11 w-11 rounded-full object-cover object-top ring-2 ring-blush" />
          <span>
            <span className="block font-script text-3xl leading-none text-primary">{profile.firstName}</span>
            <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">Dashboard</span>
          </span>
        </Link>

        <SidebarNav />

        <div className="mt-4 grid gap-1 border-t border-dashed border-blush-2 pt-4 lg:mt-auto">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-blush/60 hover:text-foreground">
            <ExternalLink className="h-4 w-4" />
            Lihat website
          </a>
          <a href="/shop" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-blush/60 hover:text-foreground">
            <ExternalLink className="h-4 w-4" />
            Lihat shop
          </a>
          <button type="button" onClick={signOut} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
          <p className="truncate px-3 pt-1 text-xs text-muted-foreground">{session.user.email}</p>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-5xl">
          <Suspense
            fallback={
              <div className="grid h-64 place-items-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

const SidebarNav = () => {
  const { data: pending = 0 } = usePendingCount();
  return (
    <nav aria-label="Dashboard" className="grid gap-1 lg:mt-8">
      {nav.map(({ to, label, icon: Icon, end, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors duration-fast",
              isActive ? "bg-primary text-primary-foreground shadow-soft" : "text-foreground hover:bg-blush/60",
            )
          }
        >
          <Icon className="h-4 w-4" />
          <span className="flex-1">{label}</span>
          {badge && pending > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-rose px-1.5 text-[0.7rem] font-bold text-ink">{pending}</span>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default AdminLayout;
