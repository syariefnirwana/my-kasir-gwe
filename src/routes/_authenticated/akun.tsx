import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Store, ShoppingBag, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth, roleLabel } from "@/hooks/useAuth";
import { formatPhone } from "@/lib/phone";

export const Route = createFileRoute("/_authenticated/akun")({
  head: () => ({
    meta: [
      { title: "Akun Saya — MyKasirGwe" },
      { name: "description", content: "Kelola akun, pesanan, dan toko kamu di MyKasirGwe." },
      { property: "og:title", content: "Akun Saya — MyKasirGwe" },
      { property: "og:description", content: "Kelola akun dan pesanan kamu." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { profile, primaryRole, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading || !primaryRole) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  const isSeller = primaryRole === "seller" || primaryRole === "superadmin";
  const isAdmin = primaryRole === "admin" || primaryRole === "superadmin";

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <section className="flex items-center justify-between gap-4 rounded-2xl border bg-card p-5 shadow-soft">
        <div>
          <p className="text-sm text-muted-foreground">Masuk sebagai</p>
          <p className="text-lg font-bold">{profile?.full_name || formatPhone(profile?.phone_number)}</p>
          <Badge variant="secondary" className="mt-2">
            {roleLabel[primaryRole]}
          </Badge>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            await signOut();
            navigate({ to: "/" });
          }}
        >
          <LogOut /> Keluar
        </Button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {isSeller && (
          <ComingSoon icon={Store} title="Toko Saya" desc="Buat etalase & link toko pribadi." />
        )}
        <ComingSoon icon={ShoppingBag} title="Riwayat Belanja" desc="Lihat status pesanan & beri ulasan." />
        {isAdmin && (
          <ComingSoon icon={ShieldCheck} title="Panel Admin" desc="Moderasi produk & pengumuman." />
        )}
      </section>
    </div>
  );
}

function ComingSoon({ icon: Icon, title, desc }: { icon: typeof Store; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 font-bold">{title}</p>
      <p className="text-sm text-muted-foreground">{desc}</p>
      <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
        <Clock className="h-3.5 w-3.5" /> Segera hadir
      </p>
    </div>
  );
}
