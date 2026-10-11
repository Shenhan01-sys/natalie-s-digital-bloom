import { useQuery } from "@tanstack/react-query";
import { supabase, supabaseReady, type Product } from "./supabase";

export const galleryOf = (p: Pick<Product, "cover_url" | "gallery">): string[] => {
  const extra = Array.isArray(p.gallery) ? (p.gallery as unknown[]).filter((x): x is string => typeof x === "string") : [];
  return [...new Set([p.cover_url, ...extra].filter((x): x is string => Boolean(x)))];
};

export const usePublishedProducts = () =>
  useQuery({
    queryKey: ["products", "published"],
    enabled: supabaseReady,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("published", true)
        .order("sort")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const useProduct = (slug: string | undefined) =>
  useQuery({
    queryKey: ["product", slug],
    enabled: supabaseReady && Boolean(slug),
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("slug", slug!).eq("published", true).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export interface PublicOrder {
  code: string;
  status: "pending" | "paid" | "rejected";
  product_title: string;
  product_slug: string | null;
  amount: number;
  buyer_name: string;
  created_at: string;
  admin_note: string | null;
  delivery_url: string | null;
  delivery_note: string | null;
}

export const useOrder = (id: string | undefined) =>
  useQuery({
    queryKey: ["order", id],
    enabled: supabaseReady && Boolean(id),
    refetchInterval: (q) => (q.state.data?.status === "pending" ? 20_000 : false),
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_order", { p_id: id! });
      if (error) throw error;
      return (data?.[0] ?? null) as PublicOrder | null;
    },
  });

/** Order ids this browser has placed, newest first, so buyers can find them again. */
const MY_ORDERS = "my-orders:v1";
export const rememberOrder = (id: string) => {
  try {
    const list: string[] = JSON.parse(localStorage.getItem(MY_ORDERS) ?? "[]");
    localStorage.setItem(MY_ORDERS, JSON.stringify([id, ...list.filter((x) => x !== id)].slice(0, 20)));
  } catch {
    /* ignore */
  }
};
export const myOrders = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(MY_ORDERS) ?? "[]");
  } catch {
    return [];
  }
};

export const waLink = (number: string, text: string) =>
  `https://wa.me/${number.replace(/\D/g, "").replace(/^0/, "62")}?text=${encodeURIComponent(text)}`;
