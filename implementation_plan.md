# Implementation Plan: Bug Fixes, UI/UX Refinements, Package Integration, and Promo Logic

> [!CAUTION]
> **PENGINGAT ATURAN PENGEMBANGAN SEBELUM EKSEKUSI**
> 1. **Analisis Aturan Dasar**: Pahami dan terapkan `GEMINI.md` sepenuhnya untuk memastikan kode sesuai dengan pedoman dan style aplikasi yang ada.
> 2. **Sumber Kebenaran Integrasi (FE-First)**: Alur sebenarnya adalah kode FE. Lihat `report.md` dan `To Do.md` di root direktori KerjaPraktik (FE). Dokumen ini berisi parameter endpoint, payload, dan nama atribut baru yang diinginkan oleh Frontend. **Endpoint inilah yang harus ditambahkan/disesuaikan di Backend**.
> 3. **Referensi Alur Lama (BE)**: Lihat `README.md` di folder *Backend* (`backend-travel`) HANYA sebagai dokumentasi alur lama dan endpoint lama yang tidak lengkap. Jadikan ini sebatas pembanding, bukan acuan utama.
> 4. **Keselarasan Endpoint**: Backend WAJIB menyesuaikan diri terhadap kontrak request/response yang sudah ditetapkan di `report.md`/`To Do.md` Frontend. Pekerjaan Backend (update route, controller, dsb) harus murni dikerjakan di folder backend. *PENTING: Mengingat ada kemungkinan beberapa endpoint FE belum terdokumentasi, Backend juga WAJIB melakukan analisis mendalam pada keseluruhan kode FE di direktori `D:\ProjekKp\KerjaPraktik\src` saat membuat entitas, atribut, atau tabel baru, untuk memastikan keakuratan integrasi.*
> 5. **Pedoman UI/UX (DILARANG MERUBAH SEMBARANGAN)**: AI Agent tidak boleh merubah UI component dan layout component dengan sembarangan. Jika membutuhkan penambahan tempat untuk menampilkan suatu data, tata letak harus mengisi bagian yang kosong di UI atau mengikuti desain UI yang sudah ada. Jika ada komponen baru yang ditambahkan, desain UI HARUS diseragamkan atau disamakan dengan desain UI yang sudah eksis (cari komponen yang fungsinya sama atau hampir sama dan ikuti pola desain UI-nya secara persis).

---

## Goal Description
1. Perbaikan Alur Pembayaran QRIS User.
2. Perbaikan Tampilan Admin (JSON Alamat & Upload Bukti Bayar).
3. Evaluasi Integrasi Layanan Paket Ekspedisi & Keselarasan Antarmuka Admin (Tabs).
4. Penambahan Konfirmasi pada Kelola Pengguna.
5. Pemisahan Sidebar Data Pemesanan (Sub Route, Sub Charter) dan penyesuaian Data Paket.
6. Pemisahan Logika Promosi (Home & Services) dengan otomasi dan handling validasi form antar-kategori.
7. Pengecekan Integrasi dan Memastikan Fungsi POST & GET berjalan lancar sepenuhnya, baik dari sisi pengguna (User) maupun pengelola (Admin).

---

## User Review Required
> [!IMPORTANT]
> **Perubahan Database & Backend (Promo)**:  
> Kolom `promo_type` sudah ada di tabel `promotions`. Saya akan menggunakannya untuk memisahkan promosi `'home'` dan `'layanan'`.
> 
> **Status Pesanan (Bayar Tunai)**:  
> Jika User memilih Cash, status pesanan saya buat berubah menjadi `menunggu_penjemputan` sesuai instruksi Anda.
> 
> **Pemisahan Pekerjaan FE & BE**:  
> Seluruh pengerjaan UI dan pemanggilan API ada di folder `KerjaPraktik`. Seluruh modifikasi rute API, validasi, query DB (contohnya menambahkan `payment-proof` untuk package atau validasi promo bentrok) ada di folder `backend-travel`.

---

## Proposed Changes

### 1. Frontend: Analisis & Integrasi Paket Ekspedisi
Mengembangkan UI/UX Admin untuk Data Paket agar identik dengan Booking Charter & Route.
- **Analisis Payload Paket**: Form pengguna sudah men-POST data paket (melalui `PackageBookingForm.astro` -> `packageService.ts` -> `/api/packages/shipments`). Data ini akan divalidasi apakah backend sukses mem-parsing seluruh entitas (alamat, deskripsi paket).
- **Perbaikan UI Paket (Admin)**: File `src/pages/admin/packages.astro` akan diubah menggunakan UI "Tab Panel" persis seperti Booking/Rute. Terdapat 3 tab: Antrian Aktif, Antrian Selesai, Pesanan Dibatalkan.
- **Fix Error Package**: Di `src/components/features/admin/bookings/PackageRow.astro`, ubah `pkg.transaction_status.toUpperCase()` menjadi `(pkg.status || 'UNKNOWN').toUpperCase()`.

### 2. Frontend: User QRIS Payment Flow
- **File**: `src/components/features/user/OrderItem.astro`.
- **Implementasi**: Menambahkan Modal UI Pop-up di tengah (meniru Card Alert). Modal menampilkan QRIS statis, `input type="file"` untuk upload bukti pembayaran, dan Action Buttons (Konfirmasi, Cash). 
- **Logika Status**: Klik 'Konfirmasi Pembayaran' memanggil POST endpoint `/payment-proof` dan status Admin berubah jadi `menunggu_konfirmasi`. Klik 'Cash' mengubah status ke `menunggu_penjemputan`.

### 3. Frontend: Admin Booking Layout & JSON Parsing
- **File**: `src/services/adminBookingService.ts` & `src/components/features/admin/bookings/BookingRow.astro` (serta `PackageRow.astro`).
- **Implementasi Alamat**: Menambahkan *parser* di mapper untuk mengubah JSON string `address_detail` menjadi objek nyata. Di `BookingRow` dan `PackageRow`, data Alamat Penjemputan di atas, Alamat Penurunan di bawah.
- **Bukti Pembayaran**: Menampilkan *thumbnail* gambar yang bisa di-klik untuk membuka *pop-up modal* ukuran penuh.
- **Badge Admin**: Badge `isNew` menampilkan "TENTUKAN HARGA" (`bg-slate-900 text-white`). Kategori menunggu pembayaran: Emas (`bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]`). Batal: Merah.

### 4. Frontend: Admin Sub-menus (Route & Charter)
- **File**: `src/components/features/admin/shared/AdminSidebar.astro`
- **Implementasi**: "Data Pemesanan" pada Sidebar dibuat tak bisa diklik (sebagai parent group). Membuat 2 anak menu: Data Perjalanan Rute (`/admin/bookings/route`) & Data Sewa Charter (`/admin/bookings/charter`).
- Menggunakan skema UI Tab (Aktif, Selesai, Batal) di halaman-halaman tersebut.

### 5. Frontend: Admin Users Management Alert
- **File**: `src/pages/admin/users.astro` (dan script dependensinya).
- **Implementasi**: Menambahkan alert card "Apakah anda yakin?" via `showFeedbackModal()` sebelum menjalankan *action* "Simpan" modifikasi (role/password) dan memastikan BE menerima parameter updatenya.

### 6. Frontend & Backend: Logika Promosi Berbasis Otomasi
- **Konsep Promo**: Promosi otomatis aktif ke semua user (tanpa klaim). UI `OrderItem.astro` menampilkan Harga Final yang telah dipotong promo dari proses BE.
- **Admin Setup**: Terdapat Checkbox layanan saat submit promo (Rute, Booking, Paket).
- **Validasi Frontend & Backend (Bentrok Promo)**: Jika Promo di Home diset *20%*, lalu admin membuat promo Rute baru senilai *10%* (berbeda dari Home), *alert* memblokirnya ("Promo tidak dapat ditambahkan karena promo home berjumlah berbeda").
- **Tampilan User (Home & Services)**: 
  - `src/pages/index.astro`: Jika promo non-aktif, tagline -> `"KEMUDAHAN DALAM PERJALANAN"`, deskripsi -> `"Dengan hadirnya PT. RINI TRANS PUTRI akan membuat perjalanan anda menjadi jauh lebih mudah dan aman"`, besaran -> `"AMAN dan MUDAH"`.
  - `src/pages/services.astro`: Jika promo non-aktif, *banner hidden* sepenuhnya.
- **Backend API**: Backend (`content.controller.js`) akan dimodifikasi agar menyimpan pilihan layanan (rute/booking/paket) ke tabel, dan memproses validasi kalkulasi harga tiket akhir.

---

## Verification Plan
1. Pengecekan Integrasi Paket (POST User -> GET Admin).
2. Verifikasi Upload Bukti QRIS (Klik gambar modal di sisi User & Admin).
3. Testing Validasi Bentrok Diskon Promo.
4. Verifikasi Navigasi Tab Data Pemesanan, Charter, dan Paket di Admin Sidebar.
5. **Automated E2E Admin & User Flow**: Setelah kode selesai, saya akan mengeksekusi testing E2E melalui *browser subagent* untuk mencoba POST data rute, mengubah metode pembayaran ke Cash, lalu login sebagai admin (username diambil dari file seed BE, sandi `admin123`) untuk memverifikasi GET history dan pengecekan tab.
   - *Catatan E2E Browser 1*: Jika saat pengujian otomatis browser menjumpai *alert* seperti "kursi sudah di kunci" atau peringatan redundansi data lainnya, agen browser **jangan mencoba dari awal**. Agen harus melakukan penghapusan pada data pemesanan terkait saja (bisa dari antarmuka Admin/User atau via endpoint) untuk membersihkan *state*, lalu melanjutkan pengujian.
   - *Catatan E2E Browser 2*: Agar bisa login/register user baru, alamat email harus berformat `@gmail.com` dan password minimal 6 karakter (contoh: `cececep@gmail.com` dan password: `123456`). Akun ini mungkin belum terdaftar, jadi harus mendaftar dulu sebelum login.
   - *Catatan E2E Browser 3*: Untuk masuk ke admin, pada input field alamat email lakukan `Ctrl+A` dan `Backspace` lalu paste `admin@rinitransputri.com`. Kemudian untuk input field kata sandi lakukan `Ctrl+A` dan `Backspace` lalu paste `admin123`, dan tekan tombol masuk. (Akun ini HANYA untuk akses ke admin, jangan paste berulang-ulang karena pasti akan ditolak validasi `@gmail.com` untuk user baru).
   - *Catatan E2E Browser 4*: SAAT MENGISI FORMULIR APAPUN, pastikan untuk menekan `Ctrl+A` lalu `Backspace` sebelum mengetik/paste ke dalam input field tersebut (BERLAKU UNTUK SEMUA INPUT FIELD).
   - *Catatan E2E Browser 5*: Untuk input nomor telepon, maksimal panjangnya adalah 12 karakter (selalu pastekan `081313131313`). Untuk input field tanggal, pastekan `20/11/2026`.
6. **Uji UI Sidebar & Tab**: Verifikasi perpindahan Sub-menu Rute dan Charter serta navigasi Tab-nya tanpa crash.
7. **Pengecekan Konsol**: Memastikan pesan error `Cannot read properties of undefined (reading 'toUpperCase')` di package hilang seutuhnya.
