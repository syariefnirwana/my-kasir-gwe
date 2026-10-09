# PROGRESS.md — Pelacak Progres Fitur & Panduan Eksekusi AI

> **PANDUAN WAJIB UNTUK AI & DEVELOPER:**
> 1. File ini adalah **Single Source of Truth** untuk progres implementasi proyek platform katalog UMKM.
> 2. Pengerjaan dibagi per **Batch** agar terfokus, hemat credit, dan mudah di-test.
> 3. **Aturan Status:**
>    - `[ ]` = Belum dikerjakan.
>    - `[-]` = Sedang dalam pengerjaan (In Progress).
>    - `[X]` = Selesai dikerjakan dan sudah diverifikasi.
> 4. **Prosedur Setiap Sesi:**
>    - Sebelum mulai: Baca file ini untuk mengetahui batch dan task mana yang berikutnya harus dikerjakan.
>    - Selama pengerjaan: Fokus hanya pada batch yang sedang aktif; jangan melompat ke batch lain.
>    - Setelah selesai: Wajib ubah tanda `[ ]` menjadi `[X]` pada task yang telah selesai dan perbarui catatan log di bagian akhir dokumen.

---

## Ringkasan Progres Keseluruhan

- [X] **Batch 1:** Fondasi Proyek, Desain Tema Soft Blue, & Autentikasi
- [ ] **Batch 2:** Profil Toko (Storefront Mandiri) & Routing Slug Unik
- [ ] **Batch 3:** Manajemen Produk UMKM (CRUD Mobile-First, Foto, Varian, Stok)
- [ ] **Batch 4:** Direktori Katalog Publik, Smart Budget Filter, & Leaderboard
- [ ] **Batch 5:** Keranjang Belanja & Checkout Direct-to-WhatsApp
- [ ] **Batch 6:** Verifikasi Pesanan Dua Arah & Sistem Rating Terverifikasi
- [ ] **Batch 7:** Filter Kata Terlarang & Panel Admin / Super Admin (Locked Role)
- [ ] **Batch 8:** Final Polish, SEO OpenGraph, & QA Responsivitas

---

## Rincian Fitur Per Batch

### Batch 1: Fondasi Proyek, Desain Tema Soft Blue & Autentikasi
*Tujuan: Membangun fondasi UI modern profesional, sistem tema (light/dark/system), serta alur login WhatsApp OTP.*
- [X] Setup dependensi UI (Tailwind CSS, shadcn/ui, icon Lucide).
- [X] Konfigurasi palet warna tema profesional dengan dominan **Soft Blue**.
- [X] Implementasi Theme Provider (`next-themes`) dengan dukungan **Light Mode**, **Dark Mode**, dan **System Default**.
- [X] Navbar & Footer global responsif dengan toggle penggantian tema.
- [X] Layout mobile-first dasar (touch-friendly navigation bar).
- [X] Halaman login/register dengan input Nomor WhatsApp.
- [X] Simulasi / integrasi pengiriman dan verifikasi kode OTP 4 digit.
- [X] Onboarding pemilihan peran setelah verifikasi OTP: **Pembeli (Buyer)** atau **Penjual (Seller/UMKM)**.
- [X] Penyimpanan data sesi pengguna dan proteksi rute berbasis peran.

---

### Batch 2: Profil Toko (Storefront Mandiri) & Routing Slug Unik
*Tujuan: Memberikan etalase mandiri bagi UMKM dengan link personal yang terisolasi.*
- [ ] Skema database tabel `stores` (user_id, name, slug, description, logo, banner, whatsapp_number, city, district, is_open).
- [ ] Form onboarding toko baru untuk peran Penjual (input nama toko, deskripsi, alamat kota & kecamatan, nomor WA).
- [ ] Generator dan validator slug unik (misal: `domain.com/[slug-toko]`, lowercase, anti-duplikat).
- [ ] Halaman Storefront publik khusus toko (`/[slug-toko]`) yang hanya menampilkan profil dan produk milik toko terkait.
- [ ] Toggle status operasional toko (**Buka** / **Tutup Sementara**) di dashboard penjual.
- [ ] Indikator visual status toko di halaman Storefront (jika tutup, nonaktifkan tombol pemesanan dengan pesan ramah).

---

### Batch 3: Manajemen Produk UMKM (CRUD Mobile-First)
*Tujuan: Memudahkan UMKM mengelola etalase produk langsung dari smartphone.*
- [ ] Skema database tabel `products`, `product_images`, dan `product_variants`.
- [ ] Halaman daftar produk penjual dengan filter status dan pencarian internal.
- [ ] Form Tambah & Edit Produk yang ramah layar smartphone:
  - [ ] Upload 3 hingga 5 foto produk (kompresi otomatis sebelum upload).
  - [ ] Input nama produk, deskripsi, dan harga dasar.
  - [ ] Input manajemen stok (angka kuantitas pasti atau toggle status Tersedia / Habis).
  - [ ] Toggle Varian Kustom (penjual dapat menambah varian seperti Ukuran, Rasa, Level Pedas dengan penyesuaian harga).
  - [ ] Pemilihan kategori produk (Makanan, Minuman, Pakaian, Kerajinan, Jasa, dll.).
- [ ] Fitur hapus produk (*soft delete* atau konfirmasi modal dialog).

---

### Batch 4: Direktori Katalog Publik, Smart Budget Filter, & Leaderboard
*Tujuan: Memudahkan calon pembeli menemukan produk dan toko terbaik sesuai budget dan lokasi.*
- [ ] Halaman utama eksplorasi katalog agregator multi-tenant.
- [ ] Section Leaderboard:
  - [ ] Tab **Top 10 Bestseller** (produk terlaris berdasarkan pesanan terselesaikan).
  - [ ] Tab **Toko Terpopuler** (berdasarkan rating bintang dan ulasan terbanyak).
  - [ ] Tab **Produk Termurah** (sortir harga terendah ke tertinggi).
- [ ] Bar pencarian global (nama produk, nama toko, atau deskripsi).
- [ ] Filter Multi-Kriteria Interaktif:
  - [ ] Filter Kategori dinamis.
  - [ ] **Smart Budget Filter** (slider / input harga maksimal, misal: kuliner ≤ Rp 50.000).
  - [ ] Filter Lokasi (dropdown Kota/Kabupaten dan Kecamatan).
- [ ] Card produk responsif dengan badge harga, rating, badge status toko buka/tutup, dan nama UMKM.

---

### Batch 5: Keranjang Belanja & Checkout Direct-to-WhatsApp
*Tujuan: Alur pemesanan mudah tanpa biaya potongan transaksi perantara.*
- [ ] State management keranjang belanja per-toko (*single-store cart isolation*).
- [ ] Notifikasi jika pembeli mencoba menambahkan barang dari dua toko yang berbeda dalam 1 keranjang.
- [ ] Drawer / halaman ringkasan keranjang:
  - [ ] Pengaturan jumlah item (tambah / kurang kuantiti).
  - [ ] Rincian varian yang dipilih dan kalkulasi subtotal.
  - [ ] Form identitas pembeli: Nama, pilihan metode (Diantar / Ambil Sendiri), alamat tujuan pengiriman (jika diantar).
- [ ] Generator template pesan otomatis WhatsApp yang rapi dan terstruktur.
- [ ] Tombol "Checkout ke WhatsApp" yang mencatat rekod transaksi ke database (status: `Menunggu Konfirmasi Penjual`) lalu otomatis membuka tautan `wa.me/[nomor_toko]?text=...`.

---

### Batch 6: Verifikasi Pesanan Dua Arah & Sistem Rating Terverifikasi
*Tujuan: Menjamin ulasan dan rating produk benar-benar berasal dari pembeli yang bertransaksi.*
- [ ] Dashboard manajemen pesanan masuk untuk Penjual UMKM:
  - [ ] Daftar transaksi yang masuk dari klik checkout WhatsApp.
  - [ ] Tombol aksi **"Pesanan Selesai"** (ditekan jika pembeli sudah deal dan transaksi beres).
  - [ ] Tombol aksi "Batalkan Pesanan".
- [ ] Halaman Riwayat Belanja di akun Pembeli:
  - [ ] Status pesanan (Menunggu Konfirmasi / Selesai / Dibatalkan).
  - [ ] Tombol **"Beri Ulasan & Rating"** yang **hanya aktif** jika status pesanan sudah ditandai "Pesanan Selesai" oleh penjual.
- [ ] Modal input ulasan (bintang 1-5, komentar teks).
- [ ] Algoritma kalkulasi otomatis untuk memperbarui rata-rata rating toko dan rating produk.

---

### Batch 7: Filter Kata Terlarang & Panel Admin / Super Admin (Locked Role)
*Tujuan: Menjaga keamanan konten platform dan kontrol terpusat bagi Super Admin.*
- [ ] Modul deteksi kata terlarang (kamus kata: pornografi, seksual, kekerasan, senjata tajam/api, zat ilegal).
- [ ] Otomasi penahanan status produk:
  - [ ] Jika terdeteksi kata terlarang, produk diberi status `PENDING_REVIEW` dan disembunyikan dari katalog publik.
- [ ] Proteksi hak akses Super Admin:
  - [ ] Akun `syariefnirwana35@gmail.com` dikunci permanen (*immutable superadmin role*).
  - [ ] Super Admin dapat mengangkat atau mencabut role Admin pengguna lain.
  - [ ] Akun Super Admin tidak bisa dicabut oleh admin mana pun.
- [ ] Panel Admin Operasional:
  - [ ] **Antrean Moderasi Produk:** Tinjau produk `PENDING_REVIEW`, aksi *Approve* (publikasikan) atau *Reject* (dengan catatan alasan).
  - [ ] **Pusat Pengumuman:** Buat banner broadcast pengumuman global di atas situs.
  - [ ] **Saklar Fitur (Feature Flags):** Toggle on/off modul pendaftaran baru, sistem ulasan, atau mode pemeliharaan.

---

### Batch 8: Final Polish, SEO OpenGraph & QA Responsivitas
*Tujuan: Optimalisasi performa, tampilan sharing media sosial, dan uji kelayakan menyeluruh.*
- [ ] Implementasi metadata OpenGraph dinamis (judul, deskripsi, thumbnail) untuk preview rapi saat link toko atau produk dibagikan ke WhatsApp dan sosmed.
- [ ] Uji responsivitas menyeluruh di breakpoint Mobile (360px - 414px), Tablet (768px), dan Desktop (1024px+).
- [ ] Pengecekan kontras warna tema Soft Blue pada mode Light dan Dark untuk memenuhi standar aksesibilitas.
- [ ] Uji batas input (empty states, loading skeleton, error boundary, feedback toast yang jelas).

---

## Log Riwayat Perubahan (Change Log)

Setiap kali ada task yang diselesaikan atau diubah oleh AI/Developer, catat tanggal dan rinciannya di tabel ini:

| Tanggal | Batch / Task | Deskripsi Perubahan | Dikerjakan Oleh |
| :--- | :--- | :--- | :--- |
| *Contoh: 2026-10-09* | Inisialisasi | Pembuatan file PROGRESS.md dan pemecahan batch | Lovable |
| 2026-10-09 | Batch 1 | Tema Soft Blue (light/dark/system), header/footer/bottom nav, login WhatsApp OTP (simulasi), onboarding peran, proteksi rute, tabel profiles/user_roles + Super Admin terkunci. Stack: TanStack Start + Lovable Cloud (pengganti Next.js/Drizzle). | Lovable |

