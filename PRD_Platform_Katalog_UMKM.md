# Product Requirement Document (PRD)
## Platform Agregator & Katalog Digital UMKM Terintegrasi WhatsApp

---

| Metadata Dokumen | Deskripsi |
| :--- | :--- |
| **Nama Proyek** | Multi-Tenant Digital Catalog & Marketplace Directory for UMKM |
| **Versi Dokumen** | 2.1.0 (Final + Stack Arsitektur VS Code) |
| **Target Pengguna** | Konsumen (Pembeli), Pelaku Usaha (Penjual UMKM), Administrator Platform |
| **Super Admin Utama** | `syariefnirwana35@gmail.com` (Immutable / Role Terkunci Permanen) |
| **Model Transaksi** | Direct-to-WhatsApp Checkout dengan Verifikasi Rating Dua Arah |
| **Desain & Tema** | Modern Profesional, Dominan Soft Blue, Light/Dark/System Theme |

---

## 1. Visi Produk & Latar Belakang

Banyak pelaku UMKM di Indonesia kesulitan bersaing di marketplace besar karena potongan komisi tinggi dan kerumitan dashboard. Sementara itu, berjualan hanya lewat media sosial sering membuat produk tenggelam dan sulit dicari oleh calon pelanggan lokal.

Platform ini hadir sebagai **Katalog Agregator Cerdas & Toko Mandiri**:
1. **Untuk UMKM:** Memberikan etalase digital instan dengan link personal (`domain.com/slug-toko`), manajemen produk (CRUD) yang sangat mudah dari HP, kontrol varian & stok, serta transaksi yang diteruskan langsung ke WhatsApp tanpa potongan perantara.
2. **Untuk Pembeli:** Menyediakan direktori belanja pintar dengan fitur *Smart Budget Search* (misal: cari makanan di bawah Rp 50.000), filter lokasi terdekat (Kota & Kecamatan), kurasi Top 10 Bestseller, dan sistem ulasan kredibel yang hanya bisa diisi jika pesanan terbukti diselesaikan penjual.
3. **Untuk Administrator Platform:** Menyediakan panel kontrol terpusat untuk memoderasi produk dari konten terlarang, menyebarkan pengumuman publik, serta mengontrol fitur platform secara modular.

---

## 2. Desain, Tema & Prinsip Pengalaman Pengguna (UI/UX)

### 2.1. Arah Visual & Estetika
* **Nuansa (Vibe):** Modern Profesional & Seimbang (*clean & balanced*). Tidak terlalu ramai dengan animasi berlebih, namun tidak kaku atau terkesan hampa.
* **Palet Warna Utama:**
  - *Primary Color:* Soft Blue (contoh: Sky / Slate Blue `#3B82F6` / `#60A5FA` / `#0284C7`) yang ramah di mata, memberikan rasa aman, bersih, dan profesional.
  - *Accent & Feedback:* Emerald Green untuk status "Toko Buka" & WhatsApp action; Amber/Rose untuk promo & status penting.
* **Dukungan Tema Multi-Mode:**
  - **Light Mode:** Latar belakang cerah, kontras teks optimal untuk penggunaan luar ruangan.
  - **Dark Mode:** Latar belakang abu gelap/navy lembut yang nyaman di mata pada malam hari.
  - **System Default:** Otomatis menyesuaikan tema aktif di perangkat pengguna.

### 2.2. Responsivitas Perangkat (100% All-Device Responsive)
* **Mobile-First Priority:** Mengingat mayoritas pelaku UMKM dan pembeli bertransaksi via smartphone, tata letak dioptimalkan dengan navigasi bawah (*bottom bar*), area sentuh jari minimal 44x44px, dan formulir input yang fleksibel untuk keyboard HP.
* **Tablet & Desktop:** Tampilan adaptif dengan grid katalog yang rapi (2 kolom di mobile, 3–4 kolom di tablet, 4–5 kolom di layar lebar).

---

## 3. Arsitektur Akun & Hak Akses (RBAC)

### 3.1. Metode Registrasi & Autentikasi
* Menggunakan **Nomor WhatsApp + Kode OTP 4 Digit**.
* Saat registrasi awal, pengguna wajib memilih salah satu peran:
  - **Pembeli (Buyer)**
  - **Penjual (Seller/UMKM)**
* Prinsip akun: *1 Akun = 1 Peran Utama* (sederhana dan terisolasi pada fase ini; pembagian peran staf/karyawan dapat ditambahkan di rilis berikutnya).

### 3.2. Matriks Wewenang & Super Admin
| Aksi / Modul | Pembeli | Penjual (UMKM) | Admin Platform | Super Admin (`syariefnirwana35@gmail.com`) |
| :--- | :---: | :---: | :---: | :---: |
| Jelajah Katalog & Filter Budget | Ya | Ya | Ya | Ya |
| Keranjang & Checkout ke WA | Ya | Tidak (sebagai toko) | Ya | Ya |
| Beri Ulasan (Pasca Order Selesai) | Ya (Terverifikasi) | Tidak | Tidak | Ya (Jika beli) |
| Buat Etalase & Slug Toko Unik | Tidak | Ya | Tidak | Ya |
| Kelola Produk Sendiri (CRUD) | Tidak | Ya | Tidak | Ya |
| Konfirmasi "Pesanan Selesai" | Tidak | Ya | Tidak | Ya |
| Toggle Buka/Tutup Toko | Tidak | Ya | Tidak | Ya |
| Moderasi Produk (Approve/Reject) | Tidak | Tidak | Ya | Ya |
| Kelola Pengumuman Banner | Tidak | Tidak | Ya | Ya |
| Tambah / Cabut Akses Admin Lain | Tidak | Tidak | Tidak | **Ya (Hak Penuh)** |
| Saklar Fitur (Feature Flags) | Tidak | Tidak | Tidak | **Ya** |
| *Pencabutan Akun Super Admin* | - | - | - | **Terkunci / Tidak Bisa Dicabut** |

---

## 4. Kebutuhan Fungsional & Modul Sistem

### 4.1. Halaman Eksplorasi Publik (Katalog Agregator)
1. **Leaderboard & Peringkat:**
   - *Top 10 Bestseller:* Produk dengan volume penjualan terselesaikan terbanyak di platform.
   - *Toko Terpopuler:* Diurutkan berdasarkan rating ulasan bintang dan jumlah review pelanggan.
   - *Produk Termurah:* Opsi pengurutan harga terendah ke tertinggi.
2. **Smart Filter & Multi-Kriteria:**
   - **Kategori Fleksibel:** Makanan & Minuman, Pakaian/Fashion, Kerajinan, Jasa, dll.
   - **Batas Budget Maksimal:** Input/slider filter harga maksimal (contoh: cari kategori Makanan dengan budget maksimal Rp 50.000).
   - **Filter Lokasi Wilayah:** Pilihan Kota/Kabupaten dan Kecamatan toko untuk memastikan kemudahan jangkauan logistik.
   - **Status Operasional:** Menampilkan badge apakah toko sedang "Buka" atau "Tutup Sementara".

### 4.2. Dedicated Storefront (Etalase Mandiri UMKM)
1. **URL Slug Unik:** Format `domain.com/[slug-toko]` (misal: `domain.com/warung-mas-amba`). Validasi slug unik, tanpa spasi, lowercase.
2. **Halaman Khusus Toko:** Hanya menampilkan identitas, banner, deskripsi, alamat, kontak WhatsApp, dan daftar produk toko tersebut (tidak tercampur produk UMKM lain).
3. **Status Operasional Toko:**
   - Toggle "Buka / Tutup Sementara" yang dikendalikan oleh pemilik toko.
   - Jika toko berstatus tutup: Tombol keranjang/checkout otomatis nonaktif dengan keterangan ramah bahwa toko sedang beristirahat.

### 4.3. Manajemen Produk (CRUD Mobile-Friendly untuk UMKM)
1. **Foto Produk:**
   - Mendukung 3 hingga 5 foto per produk.
   - Kompresi gambar otomatis di browser agar upload cepat dan hemat kuota.
2. **Harga & Varian Kustom:**
   - Opsi *Harga Tunggal*: Satu harga pasti.
   - Opsi *Varian Kustom (Toggle On/Off)*: Penjual dapat menambahkan varian fleksibel (misal: Ukuran S/M/L, Level Kepedasan 1-5, Topping) dengan penyesuaian harga berbeda tiap variasi.
3. **Manajemen Stok:**
   - Input angka stok riil atau toggle status cepat (Tersedia / Stok Habis).
4. **Kebijakan & Sensor Konten Terlarang:**
   - Sistem memeriksa nama dan deskripsi produk terhadap daftar kata kunci terlarang (pornografi, unsur seksual, kekerasan, senjata tajam/api, narkoba/zat ilegal).
   - **Opsi Penanganan (Pending Review):** Produk yang terdeteksi kata terlarang tetap tersimpan ke database tetapi statusnya diset ke `PENDING_REVIEW` dan **tidak ditampilkan di publik** sampai diperiksa oleh Admin Platform.

### 4.4. Alur Transaksi & Sistem Rating Dua Arah
Alur dirancang untuk menghubungkan transaksi offline/WhatsApp dengan validasi rating digital yang otentik:

```
[1. Pembeli Memilih Produk di Toko Tertentu]
                    │
[2. Keranjang Toko & Klik "Checkout ke WhatsApp"]
                    │
[3. Sistem Mencatat Riwayat Pesanan (Status: Menunggu Konfirmasi)]
                    │
[4. Direct ke WhatsApp Penjual dengan Template Pesan Rinci]
                    │
[5. Pembeli & Penjual Deal Pembayaran & Ongkir via WhatsApp]
                    │
[6. Setelah Selesai, Penjual Klik Tombol "Pesanan Selesai" di Dashboard]
                    │
[7. Akses Rating Aktif di Halaman Riwayat Belanja Pembeli]
                    │
[8. Pembeli Memberikan Bintang (1-5) & Komentar Ulasan]
```

* **Format Pesan Otomatis WhatsApp:**
  ```text
  Halo [Nama Toko], saya ingin memesan dari etalase online Anda:
  
  Rincian Pesanan:
  - 2x Kopi Susu Aren [Less Sugar] @ Rp 18.000 = Rp 36.000
  - 1x Croissant Keju @ Rp 22.000 = Rp 22.000
  
  Total Estimasi: Rp 58.000
  Nama Pemesan: [Nama Pembeli]
  Opsi Pengiriman: (Diantar ke Alamat / Ambil Sendiri ke Toko)
  Alamat Tujuan (jika diantar): [Alamat Pembeli]
  
  Mohon info ketersediaan stok dan kelanjutan pembayarannya. Terima kasih!
  ```

### 4.5. Panel Admin & Super Admin Platform
Dashboard khusus yang aman untuk manajemen ekosistem:
1. **Antrean Moderasi Produk (*Moderation Queue*):**
   - Menampilkan semua produk berstatus `PENDING_REVIEW` yang tersaring oleh filter kata terlarang.
   - Admin dapat memilih **Approve** (produk langsung live) atau **Reject** (produk ditolak dengan catatan alasan perbaikan untuk UMKM).
2. **Manajemen Akun Admin (Khusus Super Admin `syariefnirwana35@gmail.com`):**
   - Dapat menambahkan akun pengguna lain menjadi Admin.
   - Dapat mencabut hak akses Admin dari pengguna lain.
   - Status Super Admin akun utama bersifat mutlak (*hardcoded immutable check*) sehingga tidak dapat dicabut atau diubah oleh admin mana pun.
3. **Pusat Pengumuman Global (*Broadcast Banner*):**
   - Admin dapat membuat pengumuman (teks banner di atas halaman atau modal popup) untuk memberi tahu event bazar, pembaruan sistem, atau promo bersama.
4. **Saklar Fitur (*Feature Flags*):**
   - Mengaktifkan atau menonaktifkan fitur secara modular langsung dari dashboard (contoh: toggle pendaftaran UMKM baru, toggle sistem review, mode maintenance).

---

## 5. Spesifikasi Teknis & Data

### 5.1. Tech Stack Rekomendasi & Standar Arsitektur (VS Code Ready)
* **Bahasa Pemrograman:** TypeScript (Strict Type Safety untuk presisi AI agent).
* **Framework:** Next.js 14/15 (App Router dengan Server-Side Rendering untuk dynamic SEO & slug routing).
* **Styling & UI Library:** Tailwind CSS + shadcn/ui (Accessible, modular, mobile-friendly).
* **Theming System:** `next-themes` (Light Mode, Dark Mode, System Default) dengan palet tema *Soft Blue*.
* **Database Engine:** PostgreSQL (Didukung JSONB untuk varian kustom, serta Row Level Security).
* **BaaS / Platform Data:** Supabase (Database hosting, Storage bucket untuk 3-5 foto produk, Auth).
* **ORM / Database Layer:** Drizzle ORM (Ringan, type-safe, dan sangat ramah otomatisasi AI).
* **SEO & Sharing Preview:** Next.js Metadata API + Dynamic OpenGraph (`opengraph-image.tsx`) per toko dan per produk.

### 5.2. Skema Entitas Database Kunci
1. `profiles`: `id`, `phone_number`, `email`, `role ('buyer' | 'seller' | 'admin' | 'superadmin')`, `is_superadmin_locked (boolean)`
2. `stores`: `id`, `user_id`, `name`, `slug (unique)`, `description`, `logo_url`, `banner_url`, `whatsapp_number`, `city`, `district`, `is_open (boolean)`, `rating_avg`, `rating_count`, `total_sales`
3. `products`: `id`, `store_id`, `name`, `description`, `base_price`, `stock`, `has_variants (boolean)`, `status ('active' | 'pending_review' | 'rejected')`, `moderation_note`, `sales_count`, `rating_avg`
4. `product_variants`: `id`, `product_id`, `name`, `additional_price`, `stock`
5. `product_images`: `id`, `product_id`, `image_url`, `order_index`
6. `orders`: `id`, `buyer_id`, `store_id`, `order_items (jsonb)`, `total_estimated_price`, `status ('pending' | 'completed' | 'cancelled')`, `whatsapp_redirected_at`, `completed_at`
7. `reviews`: `id`, `order_id`, `store_id`, `product_id`, `buyer_id`, `rating (1-5)`, `comment`, `created_at`
8. `prohibited_keywords`: `id`, `keyword`, `category`, `created_at`
9. `announcements`: `id`, `title`, `message`, `is_active`, `start_date`, `end_date`
10. `feature_flags`: `id`, `feature_key`, `is_enabled`, `description`

---

## 6. Kriteria Keberhasilan & Roadmap Rilis

| Tahap | Milestone Utama | Hasil yang Diharapkan |
| :--- | :--- | :--- |
| **Milestone 1** | Autentikasi & Storefront | Login WA OTP, onboarding role, setup toko dengan slug unik, tema soft blue (light/dark/system). |
| **Milestone 2** | Katalog & CRUD Produk | Input produk (3-5 foto, varian kustom, stok), filter kata terlarang, katalog publik dengan filter budget & lokasi. |
| **Milestone 3** | Transaksi & Rating Dua Arah | Keranjang belanja, format pesan WA otomatis, tombol "Pesanan Selesai" penjual, form rating pembeli terverifikasi. |
| **Milestone 4** | Panel Admin & Keamanan | Dashboard moderasi produk tertahan, Super Admin locked untuk `syariefnirwana35@gmail.com`, banner pengumuman, dan feature toggles. |

