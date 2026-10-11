import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, supabaseReady } from "./supabase";

/** RLS only lets a user see their own row in `admins`, so a hit means "is admin". */
export async function checkAdmin(userId: string) {
  const { data, error } = await supabase.from("admins").select("user_id").eq("user_id", userId).maybeSingle();
  return !error && Boolean(data);
}

interface AuthState {
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  /** True after the user arrived through a password-reset email. */
  recovering: boolean;
  clearRecovering: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(supabaseReady);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    if (!supabaseReady) return;
    let alive = true;

    const check = async (s: Session | null) => {
      setSession(s);
      if (!s) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      const admin = await checkAdmin(s.user.id);
      if (!alive) return;
      setIsAdmin(admin);
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => check(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "PASSWORD_RECOVERY") setRecovering(true);
      // Defer so we never call Supabase from inside its own callback.
      setTimeout(() => check(s), 0);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value: AuthState = {
    session,
    isAdmin,
    loading,
    recovering,
    clearRecovering: () => setRecovering(false),
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
