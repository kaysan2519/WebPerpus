# PerpusKita — Modern Editorial Digital Library

> **"Temukan Dunia Baru di Setiap Buku."**  
> Perpustakaan digital terkurasi dengan konsep **Modern Editorial Library** yang memadukan kehangatan literatur fisik dengan keandalan produk digital modern, autentikasi **Clerk**, integrasi **Google Books API**, arsitektur database **Prisma ORM**, modul denda, direktori anggota, dan ekspor laporan sirkulasi.

---

## 🏛️ Konsep Desain: Modern Editorial Library

Website PerpusKita dirancang ulang secara menyeluruh dengan mengadopsi standar desain editorial internasional:
- **Identitas Visual Resmi**: Menggunakan logo resmi PerpusKita (simbol buku abstrak bernuansa Forest Green & Muted Sage dengan wordmark modern tegas) yang diekstrak secara presisi sebagai SVG & PNG transparan beresolusi tinggi di navbar, login/signup, dashboard, katalog, footer, dan favicon.
- **Swiss Typography & Editorial Rhythm**: Hirarki tipografi yang tegas, kontras yang bermakna, dan ritme baca yang nyaman menggunakan Inter, Manrope, dan DM Sans.
- **Natural & Human-Designed**: Menghindari tampilan template generik, warna neon, atau komponen yang saling bertabrakan.
- **Purposeful Whitespace**: Setiap bidang kosong memiliki tujuan memberi ruang napas bagi mata pembaca saat menjelajahi literatur.

---

## 🎨 Color System (Design Tokens)

| Token | Hex | Penggunaan |
| :--- | :--- | :--- |
| **Warm Ivory** | `#F7F6F2` | Background utama halaman & kehangatan editorial |
| **Pure White** | `#FFFFFF` | Background kartu, kontainer buku, & elevasi utama |
| **Forest Green** | `#174C3C` | Warna identitas perpustakaan, tombol utama, & header |
| **Deep Green** | `#12382F` | Sidebar admin panel, badge aksen, & hover state |
| **Muted Sage** | `#A8B9A4` | Garis aksen, ikon sekunder, & border lembut |
| **Soft Sage** | `#E7EDE5` | Badge status "Tersedia", pill kategori aktif |
| **Charcoal** | `#252925` | Teks judul utama & tipografi tubuh bacaan |
| **Muted Gray** | `#777D77` | Metadata, deskripsi sekunder, & sub-label |
| **Light Border** | `#E5E6DF` | Border pemisah antar elemen editorial |

---

## 🔐 Autentikasi Clerk & Kontrol Akses (RBAC)

PerpusKita terintegrasi dengan **Clerk Authentication** resmi:
- **Aplikasi Clerk**: `PerpusKita` terhubung melalui Clerk Provider.
- **Halaman Editorial Khusus**:
  - `/sign-in/[[...sign-in]]`: Tampilan split-screen bernuansa Warm Ivory & Forest Green dengan logo resmi dan kutipan editorial.
  - `/sign-up/[[...sign-up]]`: Registrasi keanggotaan terintegrasi.
- **Navigasi Autentik**:
  - Komponen `<SignedIn>`, `<SignedOut>`, dan `<UserButton>` terintegrasi di navbar.
  - Proteksi rute otomatis melalui `src/middleware.ts`.
- **Peran Pengguna (Role-Based Access Control)**:
  - **ADMIN**: Akses penuh ke dashboard admin, manajemen katalog fisik, sirkulasi peminjaman, direktori anggota, pemetaan rak, dan alat impor Google Books.
  - **LIBRARIAN (Pustakawan)**: Pengelolaan salinan buku, preservasi fisik, dan verifikasi meja sirkulasi.
  - **MEMBER (Anggota)**: Pencarian katalog, peminjaman fisik, perpanjangan mandiri, riwayat bacaan, kartu anggota digital printable, dan manajemen profil.

---

## 🌐 Integrasi Google Books API v1 & REST API Backend

PerpusKita terhubung secara langsung dengan **Google Books API** sebagai penyedia referensi data bibliografi global serta menyediakan REST API internal:

### Endpoint Internal Backend:
- `GET /api/books/search?q={terms}&maxResults={1-40}&startIndex={n}&orderBy={relevance|newest}&langRestrict={id|en}&printType={books|all}`
  - Pencarian Google Books API dengan validasi, sanitasi, dan fallback otomatis ke katalog terkurasi saat kuota publik tercapai.
- `GET /api/books/[id]`
  - Mengambil detail buku volume tunggal berdasarkan Google Volume ID.
- `GET /api/stats`
  - Mengambil ringkasan statistik sirkulasi (total buku, anggota, pinjaman aktif, denda, chart 30 hari).
- `GET /api/loans` & `POST /api/loans`
  - Mendapatkan riwayat peminjaman dengan filter status/user serta pemrosesan peminjaman baru.
- `GET /api/members` & `POST /api/members`
  - Direktori anggota perpustakaan dan pendaftaran anggota baru.
- `GET /api/categories`
  - Daftar kategori buku perpustakaan lengkap dengan alokasi prefix rak fisik.

---

## 📚 Fitur & Modul Utama Aplikasi

### 1. Landing Page (`/`)
- Editorial Hero dengan headline terarah dan tombol aksi utama.
- Kolom pencarian buku cepat dengan integrasi navigasi ke katalog perpustakaan dan Google Books.
- 4 Kartu Metrik Perpustakaan (12.500+ Buku, 3.200+ Anggota, 8 Kategori, 24/7 Akses).
- Rak interaktif **Koleksi Pilihan** dengan navigasi pill kategori dan filter kuratorial.

### 2. Katalog Buku & Eksplorasi Global (`/katalog`)
- **Mode Koleksi Perpustakaan**: Filter kategori radio, slider tahun (1970–2025), status ketersediaan, dan bahasa.
- **Mode Eksplorasi Google Books**: Pencarian real-time dengan debounce, filter bahasa (`id`, `en`), urutan (`relevance`, `newest`), skeleton loading, penanganan kuota, dan paginasi.

### 3. Detail Buku Bibliografi & Lokal (`/katalog/[slug]` & `/katalog/gbook/[id]`)
- Komposisi editorial split-screen dengan sampul beresolusi tinggi.
- Tab: **Deskripsi**, **Ulasan Pembaca**, dan **Buku Serupa**.
- Form pengiriman ulasan interaktif dengan rating bintang.
- Modal peminjaman langsung dengan kalkulasi tanggal jatuh tempo.

### 4. Dashboard Anggota Siswa (`/dashboard`)
- **Tab Beranda**: Sapaan personal, 4 kartu metrik anggota, peringatan denda keterlambatan, buku yang sedang dipinjam dengan aksi **Perpanjang** & **Kembalikan**.
- **Tab Koleksi Favorit**: Grid buku yang disimpan, aksi hapus favorit, dan tombol **Pinjam Sekarang**.
- **Tab Ulasan Saya**: Daftar ulasan yang pernah dikirimkan anggota beserta opsi hapus.
- **Tab Pengaturan Profil**: Form pembaharuan nama, email, nomor WhatsApp, alamat domisili, dan preferensi notifikasi email/WA.
- **Kartu Perpustakaan Digital Printable**: Modal pratinjau kartu anggota eksklusif dilengkapi foto profil, ID anggota unik, barcode, QR Code, dan tombol **Cetak Kartu** (`window.print()`).

### 5. Pusat Notifikasi Terintegrasi (Notification Center)
- Terhubung pada ikon lonceng di Navbar dan Sidebar Dashboard dengan badge counter pesan belum dibaca.
- Tipe notifikasi: Pengingat Jatuh Tempo (H-3), Keterlambatan Sirkulasi, Konfirmasi Perpanjangan, dan Pengumuman Koleksi Baru.
- Aksi: Filter belum dibaca, Tandai satu/semua dibaca, dan Bersihkan notifikasi.

### 6. Dashboard Admin Enterprise (`/dashboard/admin`)
- **Tab Dashboard**: Metrik agregat, diagram batang sirkulasi harian interaktif 30 hari, daftar buku terpopuler, dan audit feed realtime.
- **Tab Manajemen Buku**: Tabel inventaris lengkap dengan pencarian cepat, filter kategori, **Tambah Buku Manual**, **Edit Data Buku**, dan **Hapus Buku**.
- **Tab Sirkulasi & Peminjaman**: Meja sirkulasi terpusat untuk memproses pengembalian, status keterlambatan, penagihan denda, serta pembebasan denda (*waive fine*).
- **Tab Direktori Anggota**: Tabel data anggota dengan peran (ADMIN, LIBRARIAN, MEMBER), status (Aktif, Nonaktif), dan modal **Registrasi Anggota Baru**.
- **Tab Kategori & Rak**: Pemetaan kode rak fisik (Rak T-01, Rak A-12, Rak S-03) dan modal **Tambah Kategori Baru**.
- **Tab Laporan & Ekspor**: Rekapitulasi sirkulasi bulanan, indikator mutu, dan fitur **Ekspor CSV / Excel** instan yang mengunduh file `.csv` transaksi secara otomatis.
- **Tab Pengaturan Sistem**: Konfigurasi parameter perpustakaan (Durasi Pinjam, Denda Keterlambatan per Hari, Maksimal Perpanjangan, Jam Operasional, Kontak).

### 7. Riwayat Peminjaman (`/peminjaman`)
- Filter status riwayat: *Semua, Dipinjam, Dikembalikan, Terlambat*.
- Bar pencarian spesifik judul dan pengarang dalam riwayat.
- Indikator denda keterlambatan dengan tombol **Bayar Denda**.

---

## 🗄️ Database & Prisma Schema

Arsitektur database dirancang menggunakan **Prisma ORM** dengan dukungan MySQL/MariaDB:
- **Models**:
  - `User`: Akun anggota dan staf dengan relasi ke Clerk (`clerkId`), peran (`Role`), nomor keanggotaan (`memberId`).
  - `Category`, `Author`, `Publisher`: Entitas relasional bibliografi perpustakaan.
  - `Book`: Data buku utama terhubung dengan Google Volume ID, ISBN, dan relasi katalog.
  - `BookCopy`: Salinan fisik buku dengan barcode unik (`BC-XXXX-01`) dan status ketersediaan.
  - `Loan` & `LoanItem`: Sirkulasi peminjaman lengkap dengan tanggal jatuh tempo dan batas perpanjangan.
  - `Review`, `Favorite`, `Notification`, `Fine`, `ActivityLog`: Ekosistem pelengkap interaksi perpustakaan.

### Perintah Database:
```bash
# Generate Prisma Client
npm run db:generate

# Sinkronisasi schema ke database
npm run db:push

# Isi database dengan data awal terkurasi
npm run db:seed

# Buka antarmuka Prisma Studio
npm run db:studio
```

---

## 🛠️ Arsitektur Teknologi

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk (`@clerk/nextjs` v5)
- **Database & ORM**: Prisma 5.22.0 (MySQL)
- **External Integration**: Google Books API v1
- **Icons**: Lucide React
- **State Management**: React Context (`LibraryContext`) dengan sinkronisasi instan data peminjaman, ulasan, bookmark, notifikasi, denda, direktori anggota, dan ekspor koleksi.

---

## 🚀 Panduan Memulai Cepat

### 1. Salin Environment
Salin file `.env.example` ke `.env.local` dan isi kredensial yang dibutuhkan:
```bash
cp .env.example .env.local
```

### 2. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

### 3. Build untuk Produksi
```bash
npm run build
npm start
```
