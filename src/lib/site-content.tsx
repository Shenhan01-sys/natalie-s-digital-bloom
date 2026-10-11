import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  defaultContent,
  shopLinks as defaultShopLinks,
  shopSettings as defaultShopSettings,
  type CategoryItem,
  type ContactItem,
  type EducationItem,
  type ExperienceItem,
  type ShopLink,
  type ShopSettings,
  type SiteContent,
  type SoftwareItem,
  type Work,
} from "@/data/content";
import { supabase, supabaseReady } from "./supabase";

export interface SiteData extends SiteContent {
  shop: ShopSettings;
  shopLinks: ShopLink[];
}

const fallback: SiteData = { ...defaultContent, shop: defaultShopSettings, shopLinks: defaultShopLinks };
const CACHE_KEY = "site-content:v1";

type Row = { id: string; section: string; data: unknown };

export async function fetchSiteData(): Promise<SiteData> {
  const [settings, items] = await Promise.all([
    supabase.from("site_settings").select("key, value"),
    supabase
      .from("content_items")
      .select("id, section, data")
      .eq("visible", true)
      .order("sort")
      .order("created_at"),
  ]);
  if (settings.error) throw settings.error;
  if (items.error) throw items.error;

  const s = Object.fromEntries(settings.data.map((r) => [r.key, r.value as Record<string, unknown>]));
  const rows = items.data as Row[];
  const of = <T,>(section: string) => rows.filter((r) => r.section === section).map((r) => ({ id: r.id, ...(r.data as T) }));

  return {
    profile: { ...fallback.profile, ...(s.profile ?? {}) },
    shop: { ...fallback.shop, ...(s.shop ?? {}) },
    education: of<EducationItem>("education"),
    languages: of<{ name: string }>("language").map((l) => l.name),
    software: of<SoftwareItem>("software"),
    experience: of<ExperienceItem>("experience"),
    clients: of<{ name: string }>("client").map((c) => c.name),
    contacts: of<ContactItem>("contact"),
    categories: of<{ name: string; note: string }>("category").map((c): CategoryItem => ({ id: c.name, note: c.note ?? "" })),
    works: of<Omit<Work, "id">>("work").map((w) => ({ ...w, images: w.images ?? [], ratio: w.ratio || 1 })),
    shopLinks: of<ShopLink>("shop_link"),
  };
}

const readCache = (): SiteData | undefined => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? { ...fallback, ...JSON.parse(raw) } : undefined;
  } catch {
    return undefined;
  }
};

const SiteContext = createContext<SiteData>(fallback);

export const SiteContentProvider = ({ children }: { children: ReactNode }) => {
  const { data } = useQuery({
    queryKey: ["site-content"],
    queryFn: fetchSiteData,
    enabled: supabaseReady,
    staleTime: 60_000,
    retry: 1,
    placeholderData: () => readCache() ?? fallback,
  });

  useEffect(() => {
    if (!data || data === fallback) return;
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
      /* storage full or disabled */
    }
  }, [data]);

  return <SiteContext.Provider value={data ?? fallback}>{children}</SiteContext.Provider>;
};

export const useSite = () => useContext(SiteContext);
