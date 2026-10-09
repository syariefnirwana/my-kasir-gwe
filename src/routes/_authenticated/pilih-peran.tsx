import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingBag, Store, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/pilih-peran")({
  beforeLoad: ({ context }) => {
    if (context.roles.length > 0) throw redirect({ to: "/akun" });
  },
  head: () => ({
    meta: [
      { title: "Pilih Peran — MyKasirGwe" },
      { name: "description", content: "Pilih apakah kamu bergabung sebagai pembeli atau penjual UMKM." },
      { property: "og:title", content: "Pilih Peran — MyKasirGwe" },
      { property: "og:description", content: "Gabung sebagai pembeli atau penjual UMKM." },
    ],
  }),
  component: ChooseRole,
});

const options = [
  {
    value: "buyer" as const,
    title: "Pembeli",
    desc: "Cari produk UMKM sesuai budget & lokasi, lalu pesan langsung via WhatsApp.",
    icon: ShoppingBag,
  },
  {
    value: "seller" as const,
    title: "Penjual UMKM",
    desc: "Buka etalase online dengan link pribadi, kelola produk dari HP, tanpa komisi.",
    icon: Store,
  },
];

function ChooseRole() {
  const [role, setRole] = useState<"buyer" | "seller" | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { refresh } = useAuth();

  async function submit() {
    if (!role) return;
    setBusy(true);
    const { error } = await supabase.rpc("choose_initial_role", { _role: role });
    setBusy(false);
    if (error) return toast.error("Gagal menyimpan peran. Coba lagi.");
    await refresh();
    toast.success("Selamat datang!");
    navigate({ to: "/akun" });
  }

  return (
    <div className="bg-hero">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold">Kamu bergabung sebagai?</h1>
        <p className="mt-2 text-muted-foreground">Pilih sekali saja. Satu akun untuk satu peran.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setRole(o.value)}
              className={cn(
                "relative rounded-2xl border-2 bg-card p-5 text-left shadow-soft transition-all hover:-translate-y-0.5",
                role === o.value ? "border-primary" : "border-transparent",
              )}
            >
              {role === o.value && (
                <span className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-4 w-4" />
                </span>
              )}
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary">
                <o.icon className="h-6 w-6" />
              </span>
              <p className="mt-4 text-lg font-bold">{o.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{o.desc}</p>
            </button>
          ))}
        </div>
        <Button size="lg" className="mt-8 w-full sm:w-auto" disabled={!role || busy} onClick={submit}>
          {busy && <Loader2 className="animate-spin" />} Lanjutkan
        </Button>
      </div>
    </div>
  );
}
