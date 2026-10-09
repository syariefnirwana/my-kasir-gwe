import { Link } from "@tanstack/react-router";
import { Home, Search, ShoppingBag, UserRound, Store } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <Store className="h-5 w-5" />
      </span>
      <span>
        MyKasir<span className="text-primary">Gwe</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" asChild>
            <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }}>
              Beranda
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/akun" activeProps={{ className: "text-primary" }}>
              Akun Saya
            </Link>
          </Button>
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {user ? (
            <Button variant="soft" asChild className="hidden md:inline-flex">
              <Link to="/akun">
                <UserRound /> Akun
              </Link>
            </Button>
          ) : (
            <Button asChild className="hidden md:inline-flex">
              <Link to="/masuk">Masuk / Daftar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

const navItems = [
  { to: "/", label: "Beranda", icon: Home, exact: true },
  { to: "/", label: "Cari", icon: Search, exact: false, hash: "jelajah" },
  { to: "/akun", label: "Pesanan", icon: ShoppingBag, exact: false },
  { to: "/akun", label: "Akun", icon: UserRound, exact: false },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden">
      <ul className="grid grid-cols-4">
        {navItems.map((item) => (
          <li key={item.label}>
            <Link
              to={item.to}
              hash={"hash" in item ? item.hash : undefined}
              activeOptions={{ exact: item.exact, includeHash: false }}
              className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-muted-foreground"
              activeProps={{ className: "text-primary" }}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Etalase digital UMKM Indonesia. Pesan langsung ke WhatsApp penjual, tanpa potongan komisi.
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold">Untuk Pembeli</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>Cari sesuai budget</li>
            <li>Filter lokasi terdekat</li>
            <li>Ulasan terverifikasi</li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold">Untuk UMKM</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>Link toko pribadi</li>
            <li>Kelola produk dari HP</li>
            <li>Tanpa komisi</li>
          </ul>
        </div>
      </div>
      <p className="border-t py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} MyKasirGwe
      </p>
    </footer>
  );
}
