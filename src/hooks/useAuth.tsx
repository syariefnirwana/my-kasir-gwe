import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: AppRole[];
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (r: AppRole) => boolean;
  primaryRole: AppRole | null;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (s: Session | null) => {
    if (!s) {
      setProfile(null);
      setRoles([]);
      return;
    }
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", s.user.id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", s.user.id),
    ]);
    setProfile(p ?? null);
    setRoles((r ?? []).map((x) => x.role));
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setTimeout(() => void load(s), 0);
    });
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      await load(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [load]);

  const hasRole = (r: AppRole) => roles.includes(r);
  const primaryRole: AppRole | null = roles.includes("superadmin")
    ? "superadmin"
    : roles.includes("admin")
      ? "admin"
      : roles.includes("seller")
        ? "seller"
        : roles.includes("buyer")
          ? "buyer"
          : null;

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        roles,
        loading,
        refresh: () => load(session),
        signOut: async () => {
          await supabase.auth.signOut();
        },
        hasRole,
        primaryRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export const roleLabel: Record<AppRole, string> = {
  buyer: "Pembeli",
  seller: "Penjual UMKM",
  admin: "Admin Platform",
  superadmin: "Super Admin",
};
