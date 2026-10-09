import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      throw redirect({ to: "/masuk", search: { redirect: location.pathname } });
    }
    // Role onboarding: every account must pick buyer/seller first
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    const hasRole = (roles ?? []).length > 0;
    if (!hasRole && location.pathname !== "/pilih-peran") {
      throw redirect({ to: "/pilih-peran" });
    }
    return { userId: data.user.id, roles: (roles ?? []).map((r) => r.role) };
  },
  component: () => <Outlet />,
});
