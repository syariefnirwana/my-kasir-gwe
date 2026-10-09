import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Wallet, MapPin, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-umkm.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MyKasirGwe — Belanja Produk UMKM, Pesan Langsung via WhatsApp" },
      {
        name: "description",
        content: "Temukan produk UMKM sesuai budget dan lokasimu. Pesan langsung ke WhatsApp penjual tanpa potongan komisi.",
      },
      { property: "og:title", content: "MyKasirGwe — Katalog Digital UMKM" },
      { property: "og:description", content: "Belanja produk UMKM lokal, pesan langsung via WhatsApp." },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Wallet, title: "Sesuai Budget", desc: "Cari produk di bawah harga yang kamu tentukan." },
  { icon: MapPin, title: "Dekat Kamu", desc: "Filter toko per kota dan kecamatan." },
  { icon: MessageCircle, title: "Langsung ke WA", desc: "Checkout tanpa komisi, chat langsung penjual." },
  { icon: Star, title: "Ulasan Asli", desc: "Rating hanya dari pembeli yang benar-benar bertransaksi." },
];

function Index() {
  return (
    <>
      <section className="bg-hero">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
              <span className="h-2 w-2 rounded-full bg-success" /> 0% komisi untuk UMKM
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              Belanja produk lokal, <span className="text-primary">pesan langsung</span> ke WhatsApp.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Katalog digital UMKM Indonesia. Cari sesuai budget, temukan toko terdekat, dan dukung usaha di sekitarmu.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <a href="#jelajah">
                  Mulai Jelajah <ArrowRight />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/masuk">Buka Toko Gratis</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src={hero}
              alt="Penjual UMKM menunjukkan pesanan WhatsApp di ponselnya"
              width={1280}
              height={960}
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
            />
            <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-lift">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-success text-success-foreground">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div className="text-sm">
                <p className="font-bold">Pesanan baru masuk</p>
                <p className="text-muted-foreground">2x Keripik Pisang · Rp 36.000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="jelajah" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
        <h2 className="text-2xl font-bold sm:text-3xl">Kenapa MyKasirGwe?</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-5 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <p className="mt-4 font-bold">{f.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-dashed bg-muted/50 p-8 text-center text-muted-foreground">
          Katalog produk & toko akan tampil di sini.
        </div>
      </section>
    </>
  );
}
