import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** False until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set. */
export const supabaseReady = Boolean(url && key);

// Without credentials the site still renders its built-in content; every
// request simply fails and callers fall back.
export const supabase = createClient<Database>(url || "http://localhost:54321", key || "missing-key", {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type Product = Tables<"products">;
export type Order = Tables<"orders">;
export type ContentRow = Tables<"content_items">;

export const MEDIA_BUCKET = "media";
export const PROOF_BUCKET = "proofs";

export const formatIDR = (n: number) =>
  n === 0
    ? "Gratis"
    : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : typeof e === "object" && e && "message" in e ? String(e.message) : "Terjadi kesalahan, coba lagi";
